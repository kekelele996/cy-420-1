<template>
  <div class="game-timer" :class="{ warning: isWarning, danger: isDanger }">
    <span class="timer-icon">⏱</span>
    <span class="timer-text">{{ formattedTime }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useGameStore } from '../../stores/gameStore';

const store = useGameStore();

const remainingSeconds = computed(() => store.state?.remaining_seconds ?? 0);

const isWarning = computed(() => remainingSeconds.value <= 60 && remainingSeconds.value > 30);
const isDanger = computed(() => remainingSeconds.value <= 30);

const formattedTime = computed(() => {
  const total = remainingSeconds.value;
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});
</script>

<style scoped>
.game-timer {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #f7fbff;
  border: 1px solid #b8d7e8;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #2f80ed;
  transition: all 0.3s ease;
}

.timer-icon {
  font-size: 20px;
}

.timer-text {
  font-variant-numeric: tabular-nums;
  min-width: 60px;
  text-align: center;
}

.game-timer.warning {
  background: #fff8e6;
  border-color: #f2c94c;
  color: #b8860b;
}

.game-timer.danger {
  background: #ffe6e6;
  border-color: #eb5757;
  color: #eb5757;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}
</style>
