import { defineStore } from 'pinia';                                                                                                       
import { ref, computed } from 'vue';
import type { GameState } from '../models/gameState';
import { websocketService } from '../services/websocketService';
import { fillTerritory } from '../utils/floodFill';
import { logGame } from '../utils/gameLogger';
import { GAME_CONFIG, MAP_CONFIG } from '../constants/map';
import { CellType } from '../constants/cell';

export const useGameStore = defineStore('game', () => {
  const state = ref<GameState | undefined>(undefined);
  const observer = ref(false);

  const isEnded = computed(() => state.value?.is_ended ?? false);

  const sortedPlayers = computed(() => {
    if (!state.value) return [];
    return state.value.players
      .map((p) => {
        let territoryCount = 0;
        for (const row of state.value!.map) {
          for (const cell of row) {
            if (cell.type === CellType.TERRITORY && cell.owner_id === p.id) {
              territoryCount++;
            }
          }
        }
        return {
          player_id: p.id,
          nickname: p.nickname,
          score: p.score,
          territory_count: territoryCount,
          color: p.color,
        };
      })
      .sort((a, b) => b.score - a.score);
  });

  function playerRank(playerId: string): number {
    const idx = sortedPlayers.value.findIndex((p) => p.player_id === playerId);
    return idx >= 0 ? idx + 1 : 0;
  }

  function territoryPercent(playerId: string): number {
    const totalCells = MAP_CONFIG.width * MAP_CONFIG.height;
    const player = sortedPlayers.value.find((p) => p.player_id === playerId);
    if (!player) return 0;
    return Math.round((player.territory_count / totalCells) * 100);
  }

  function start(roomId: string) {
    state.value = websocketService.makeState(roomId);
    logGame('GAME_START', { id: roomId });
  }

  function move(dx: number, dy: number) {
    if (!state.value || state.value.is_ended) return;
    const p = state.value.players[0];
    p.position.x = Math.max(0, Math.min(MAP_CONFIG.width - 1, p.position.x + dx));
    p.position.y = Math.max(0, Math.min(MAP_CONFIG.height - 1, p.position.y + dy));
    p.trail.push({ x: p.position.x, y: p.position.y, type: 'trail' as any, owner_id: p.id });
    state.value.tick++;
    logGame('PLAYER_MOVE', { id: p.id, x: p.position.x, y: p.position.y });
    if (p.trail.length > 4) {
      const cells = fillTerritory(state.value.map, p.id);
      p.score += cells.length;
      updateLeaderboards();
      logGame('TERRITORY_CAPTURE', { id: p.id, count: cells.length });
    }
  }

  function tickTime() {
    if (!state.value || state.value.is_ended) return;
    if (state.value.remaining_seconds > 0) {
      state.value.remaining_seconds--;
      if (state.value.remaining_seconds === 0) {
        endGame();
      }
    }
  }

  function updateLeaderboards() {
    if (!state.value) return;
    state.value.leaderboards = state.value.players
      .map((p) => ({ player_id: p.id, score: p.score }))
      .sort((a, b) => b.score - a.score);
  }

  function endGame() {
    if (!state.value) return;
    state.value.is_ended = true;
    state.value.end_time = new Date().toISOString();
    updateLeaderboards();
    saveBestScore();
    logGame('GAME_END', { score: state.value.players[0]?.score ?? 0 });
  }

  function saveBestScore() {
    if (!state.value) return;
    const localPlayer = state.value.players[0];
    if (!localPlayer) return;
    try {
      const raw = localStorage.getItem(GAME_CONFIG.leaderboardKey);
      const leaderboard: { player_id: string; nickname: string; score: number }[] = raw
        ? JSON.parse(raw)
        : [];
      const existingIndex = leaderboard.findIndex((r) => r.player_id === localPlayer.id);
      if (existingIndex >= 0) {
        if (localPlayer.score > leaderboard[existingIndex].score) {
          leaderboard[existingIndex].score = localPlayer.score;
          leaderboard[existingIndex].nickname = localPlayer.nickname;
        }
      } else {
        leaderboard.push({
          player_id: localPlayer.id,
          nickname: localPlayer.nickname,
          score: localPlayer.score,
        });
      }
      leaderboard.sort((a, b) => b.score - a.score);
      localStorage.setItem(GAME_CONFIG.leaderboardKey, JSON.stringify(leaderboard));
      logGame('BEST_SCORE_SAVE', { score: localPlayer.score });
    } catch (e) {
      console.error('Failed to save leaderboard', e);
    }
  }

  function toggleObserver() {
    observer.value = !observer.value;
    logGame('OBSERVER_SWITCH');
  }

  return {
    state,
    observer,
    isEnded,
    sortedPlayers,
    playerRank,
    territoryPercent,
    start,
    move,
    tickTime,
    updateLeaderboards,
    endGame,
    saveBestScore,
    toggleObserver,
  };
});
