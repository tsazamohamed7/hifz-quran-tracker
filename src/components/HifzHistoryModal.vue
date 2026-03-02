<script setup>
import { computed } from 'vue';
import { useHifzStore } from '../stores/hifz.store';

const props = defineProps({
  show: Boolean,
  surah: Object
});

const emit = defineEmits(['close']);
const hifzStore = useHifzStore();

const history = computed(() => {
  if (!props.surah) return [];
  return hifzStore.blocks
    .filter((b) => Number(b.surah_no) === Number(props.surah.surahNumber))
    .sort((a, b) => new Date(b.memorized_date) - new Date(a.memorized_date));
});

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};
</script>

<template>
  <Transition name="fade">
    <div v-if="show" class="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div 
        class="relative overflow-hidden bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 p-7 rounded-[2.5rem] w-full max-w-[360px] shadow-2xl animate-in zoom-in-95 duration-200"
      >
        <div class="absolute -top-12 -left-12 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl"></div>

        <div class="relative z-10">
          <header class="mb-6">
            <span class="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400 mb-1 block">
              Memorization History
            </span>
            <h3 class="text-xl font-black text-slate-800 dark:text-white tracking-tight">
              {{ surah?.surahName }}
            </h3>
          </header>

          <div class="space-y-3 max-h-[350px] overflow-y-auto pr-1 custom-scrollbar">
            <div 
              v-for="item in history" 
              :key="item.id"
              class="group relative p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-white/5 transition-all hover:border-emerald-500/30"
            >
              <div class="flex justify-between items-start">
                <div>
                  <div class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
                    {{ formatDate(item.memorized_date) }}
                  </div>
                  <div class="text-sm font-black text-slate-700 dark:text-slate-200">
                    Ayah {{ item.start_ayah }} — {{ item.end_ayah }}
                  </div>
                </div>
              </div>
            </div>

            <div v-if="history.length === 0" class="py-10 text-center">
              <p class="text-slate-400 text-[10px] font-bold uppercase tracking-widest">No records found</p>
            </div>
          </div>

          <div class="mt-8">
            <button 
              @click="emit('close')" 
              class="w-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95"
            >
              Close History
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(16, 185, 129, 0.1);
  border-radius: 20px;
}
</style>