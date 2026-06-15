<template>
  <div v-if="visible" class="modal-overlay" @click.self="handleClose">
    <div class="modal-content">
      <h2 class="modal-title">游戏结束</h2>
      <div class="result-summary">
        <div class="result-item">
          <span class="result-label">本场排名</span>
          <span class="result-value rank">第 {{ playerRank }} 名</span>
        </div>
        <div class="result-item">
          <span class="result-label">领地占比</span>
          <span class="result-value">{{ territoryPercent }}%</span>
        </div>
        <div class="result-item">
          <span class="result-label">本场得分</span>
          <span class="result-value score">{{ scoreText(playerScore) }}</span>
        </div>
      </div>
      <div class="ranking-section">
        <h3>排名榜</h3>
        <div class="ranking-list">
          <div
            v-for="(player, index) in sortedPlayers"
            :key="player.player_id"
            class="ranking-item"
            :class="{ 'is-self': player.player_id === 'p-local' }"
          >
            <span class="rank-num" :class="'rank-' + (index + 1)">{{ index + 1 }}</span>
            <span class="player-color" :style="{ backgroundColor: player.color }"></span>
            <span class="player-name">{{ player.nickname }}</span>
            <span class="player-score">{{ scoreText(player.score) }}</span>
            <span class="player-territory">{{ player.territory_count }}格</span>
          </div>
        </div>
      </div>
      <div class="modal-actions">
        <van-button type="default" round @click="handleRestart">再玩一局</van-button>
        <van-button type="primary" round @click="handleBackHome">返回首页</van-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useGameStore } from '../../stores/gameStore';
import { scoreText } from '../../utils/formatters';
import { useRouter } from 'vue-router';

const props = defineProps<{
  visible: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'restart'): void;
}>();

const store = useGameStore();
const router = useRouter();

const sortedPlayers = computed(() => store.sortedPlayers);
const playerRank = computed(() => store.playerRank('p-local'));
const territoryPercent = computed(() => store.territoryPercent('p-local'));
const playerScore = computed(() => {
  const player = store.state?.players.find(p => p.id === 'p-local');
  return player?.score ?? 0;
});

const handleClose = () => {
  emit('close');
};

const handleRestart = () => {
  emit('restart');
};

const handleBackHome = () => {
  router.push('/home');
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 16px;
  padding: 28px 24px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
}

.modal-title {
  text-align: center;
  font-size: 24px;
  font-weight: 600;
  color: #152331;
  margin: 0 0 20px 0;
}

.result-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 24px;
  padding: 16px;
  background: #f7fbff;
  border-radius: 12px;
}

.result-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.result-label {
  font-size: 12px;
  color: #6b7c93;
}

.result-value {
  font-size: 20px;
  font-weight: 600;
  color: #152331;
}

.result-value.rank {
  color: #2f80ed;
}

.result-value.score {
  color: #f2994a;
}

.ranking-section {
  margin-bottom: 24px;
}

.ranking-section h3 {
  font-size: 16px;
  font-weight: 600;
  color: #152331;
  margin: 0 0 12px 0;
}

.ranking-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ranking-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  background: #f7fbff;
  transition: background 0.2s;
}

.ranking-item.is-self {
  background: #e6f2ff;
  border: 1px solid #2f80ed;
}

.rank-num {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 600;
  background: #d5e8f5;
  color: #152331;
}

.rank-1 {
  background: #f2c94c;
  color: white;
}

.rank-2 {
  background: #bdbdbd;
  color: white;
}

.rank-3 {
  background: #e0a96d;
  color: white;
}

.player-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.player-name {
  flex: 1;
  font-size: 14px;
  color: #152331;
}

.player-score {
  font-size: 14px;
  font-weight: 600;
  color: #2f80ed;
}

.player-territory {
  font-size: 12px;
  color: #6b7c93;
  min-width: 50px;
  text-align: right;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.modal-actions :deep(.van-button) {
  flex: 1;
}
</style>
