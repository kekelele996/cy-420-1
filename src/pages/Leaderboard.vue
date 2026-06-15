<template>
  <main class="page">
    <h1 style="text-align:center; margin-bottom:24px;">排行榜</h1>
    <LeaderboardPanel :rows="rows" />
    <div style="display:flex; justify-content:center; margin-top:24px;">
      <GameButton @click="$router.push('/home')">返回首页</GameButton>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import LeaderboardPanel from '../components/common/LeaderboardPanel.vue';
import GameButton from '../components/common/GameButton.vue';
import { GAME_CONFIG } from '../constants/map';

const rows = computed(() => {
  try {
    const raw = localStorage.getItem(GAME_CONFIG.leaderboardKey);
    if (raw) {
      const data = JSON.parse(raw);
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (e) {
    console.error('Failed to read leaderboard', e);
  }
  return [{ player_id: 'p-local', nickname: 'Rush 玩家', score: 1200 }];
});
</script>
