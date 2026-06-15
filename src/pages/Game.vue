<template>
  <main class="page">
    <div class="game-header">
      <GameTimer />
    </div>
    <div class="grid">
      <GameCanvas />
      <div class="grid">
        <LeaderboardPanel :rows="game.state?.leaderboards || []" />
        <CombatLog />
        <GameButton @click="game.toggleObserver">
          {{ game.observer ? '退出观战' : '观战切换' }}
        </GameButton>
      </div>
    </div>
    <GameResultModal
      :visible="game.isEnded"
      @close="handleModalClose"
      @restart="handleRestart"
    />
  </main>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { useGameStore } from '../stores/gameStore';
import GameCanvas from '../components/common/GameCanvas.vue';
import LeaderboardPanel from '../components/common/LeaderboardPanel.vue';
import CombatLog from '../components/common/CombatLog.vue';
import GameButton from '../components/common/GameButton.vue';
import GameTimer from '../components/common/GameTimer.vue';
import GameResultModal from '../components/common/GameResultModal.vue';

const route = useRoute();
const router = useRouter();
const game = useGameStore();

if (!game.state) {
  game.start(String(route.params.id));
}

const handleModalClose = () => {
};

const handleRestart = () => {
  game.start(String(route.params.id));
};
</script>

<style scoped>
.game-header {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}
</style>
