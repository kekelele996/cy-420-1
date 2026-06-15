<template>
  <section class="panel">
    <h3>实时排行榜</h3>
    <div v-for="(row, index) in rows" :key="row.player_id" class="leaderboard-row">
      <span class="rank">{{ index + 1 }}</span>
      <span class="name">{{ row.nickname || row.player_id }}</span>
      <span class="score">{{ scoreText(row.score) }}</span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { scoreText } from '../../utils/formatters';

defineProps<{
  rows: { player_id: string; nickname?: string; score: number }[];
}>();
</script>

<style scoped>
.leaderboard-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid #e6f0f7;
}

.leaderboard-row:last-child {
  border-bottom: none;
}

.rank {
  width: 24px;
  font-weight: 600;
  color: #6b7c93;
  font-size: 14px;
}

.name {
  flex: 1;
  font-size: 14px;
  color: #152331;
}

.score {
  font-size: 14px;
  font-weight: 600;
  color: #2f80ed;
}
</style>
