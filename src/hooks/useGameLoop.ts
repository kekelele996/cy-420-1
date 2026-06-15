import { onMounted, onUnmounted } from 'vue';
import { useGameStore } from '../stores/gameStore';
import { MAP_CONFIG } from '../constants/map';

declare global {
  interface Window {
    advanceTime?: (ms: number) => void;
    render_game_to_text?: () => string;
    __territoryrush_snapshot?: string;
  }
}

window.__territoryrush_snapshot ||= JSON.stringify({ origin: 'top-left x-right y-down', mode: 'booting' });
window.render_game_to_text = () => window.__territoryrush_snapshot || '{}';

export function useGameLoop() {
  const store = useGameStore();
  let tickTimer = 0;
  let secondTimer = 0;

  onMounted(() => {
    tickTimer = window.setInterval(() => {
      if (store.state) store.state.tick++;
    }, MAP_CONFIG.tickMs);

    secondTimer = window.setInterval(() => {
      store.tickTime();
    }, 1000);

    window.advanceTime = (ms: number) => {
      const steps = Math.max(1, Math.round(ms / MAP_CONFIG.tickMs));
      for (let i = 0; i < steps; i++) if (store.state) store.state.tick++;
    };
  });

  onUnmounted(() => {
    clearInterval(tickTimer);
    clearInterval(secondTimer);
  });
}
