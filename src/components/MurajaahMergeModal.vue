<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  surahNo: Number,
  surahName: String,
  blocks: Array
});

const emit = defineEmits(["close", "merge"]);

const selected = ref([]);

const isValidMerge = computed(() => {
  if (selected.value.length < 2) return false;

  // Sort by start ayah to check for continuity
  const sorted = [...selected.value].sort(
    (a, b) => a.start_ayah - b.start_ayah
  );

  for (let i = 0; i < sorted.length - 1; i++) {
    if (sorted[i].end_ayah + 1 !== sorted[i + 1].start_ayah) {
      return false;
    }
  }

  return true;
});

function confirmMerge() {
  emit("merge", {
    surah_no: props.surahNo,
    block_ids: selected.value.map(b => b.id)
  });
}
</script>

<template>
  <Transition name="fade">
    <div class="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div 
        class="relative overflow-hidden bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 p-7 rounded-[2.5rem] w-full max-w-[360px] shadow-2xl animate-in zoom-in-95 duration-200"
      >
        <div class="absolute -top-12 -right-12 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl dark:block hidden"></div>

        <div class="relative z-10">
          <header class="mb-6">
            <span class="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400 mb-1 block">
              Consolidate Progress
            </span>
            <h3 class="text-xl font-black text-slate-800 dark:text-white tracking-tight leading-tight">
              Merge Surah {{ surahName }}
            </h3>
          </header>

          <div class="space-y-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
            <label
              v-for="block in blocks"
              :key="block.id"
              class="group flex items-center gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer select-none"
              :class="selected.some(s => s.id === block.id) 
                ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30' 
                : 'bg-slate-50 dark:bg-slate-950/50 border-transparent border-slate-100 dark:border-white/5'"
            >
              <div class="relative flex items-center justify-center">
                <input
                  type="checkbox"
                  :value="block"
                  v-model="selected"
                  class="peer appearance-none w-5 h-5 rounded-lg border-2 border-slate-300 dark:border-white/10 checked:bg-amber-500 checked:border-amber-500 transition-all cursor-pointer"
                />
                <svg class="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <div class="flex-1">
                <div class="text-sm font-black text-slate-700 dark:text-slate-200">
                  Ayah {{ block.start_ayah }} — {{ block.end_ayah }}
                </div>
                <div class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  Strength Level {{ block.strength_level }}
                </div>
              </div>
            </label>
          </div>

          <Transition name="slide-up">
            <div v-if="selected.length >= 2 && !isValidMerge" class="mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 flex items-center gap-2">
              <span class="text-xs">⚠️</span>
              <p class="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-tight">
                Blocks must be continuous with no gaps.
              </p>
            </div>
          </Transition>

          <div class="flex flex-col gap-3 mt-8">
            <button
              :disabled="!isValidMerge"
              @click="confirmMerge"
              class="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-[0.15em] shadow-lg shadow-amber-900/10 active:scale-[0.97] transition-all"
            >
              Confirm Merge
            </button>

            <button 
              @click="$emit('close')" 
              class="w-full py-2 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest hover:text-slate-600 transition-colors"
            >
              Cancel
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

.slide-up-enter-active { transition: all 0.3s ease-out; }
.slide-up-enter-from { transform: translateY(10px); opacity: 0; }

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(245, 158, 11, 0.2);
  border-radius: 20px;
}

input:checked + div { transform: scale(1.05); }
</style>