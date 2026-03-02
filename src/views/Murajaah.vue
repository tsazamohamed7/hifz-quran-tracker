<script setup>
import { ref, computed, onMounted } from "vue";
import { useMurajaahStore } from "../stores/murajaah.store";
import MurajaahMergeModal from "../components/MurajaahMergeModal.vue";

const murajaahStore = useMurajaahStore();

const activeTab = ref("TODAY");
const expandedSurah = ref(null);
const slideSurah = ref(null);
const mergeData = ref(null);

onMounted(() => {
  murajaahStore.fetchAll(); // store now self-controls caching
});

const grouped = computed(() => {
  const today = new Date();
  today.setHours(23, 59, 59, 999); // Include everything until end of today

  let blocks = (murajaahStore.activeBlocks || []).map(b => ({
    ...b,
    isToday: new Date(b.next_due) <= today
  }));

  // Filter based on Tab
  const filtered = activeTab.value === "TODAY"
    ? blocks.filter(b => b.isToday)
    : blocks.filter(b => !b.isToday);

  // Group by Surah Number
  const map = {};
  filtered.forEach(b => {
    if (!map[b.surah_no]) map[b.surah_no] = [];
    map[b.surah_no].push(b);
  });

  return map;
});

function toggleExpand(surahNo) {
  if (slideSurah.value === surahNo) {
    slideSurah.value = null;
    return;
  }
  expandedSurah.value = expandedSurah.value === surahNo ? null : surahNo;
}

function openMerge(surahNo, blocks) {
  slideSurah.value = null;
  mergeData.value = {
    surahNo: Number(surahNo),
    surahName: blocks[0].surah_name,
    blocks
  };
}

async function handleReview(block) {
  await murajaahStore.submitReview({
    block_id: block.id,
    quality: 5
  });
}

async function handleMerge(payload) {
  await murajaahStore.mergeBlocks(payload);
  mergeData.value = null;
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors pb-32">
    
    <div class="sticky top-0 z-30 px-6 pt-8 pb-4 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md">
      <div class="flex justify-between items-end mb-6">
        <div>
          <span class="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400 mb-1 block">
            Revision System
          </span>
          <h1 class="text-3xl font-black text-slate-800 dark:text-white tracking-tighter">Murajaah</h1>
        </div>

        <div class="flex bg-slate-200/50 dark:bg-white/5 p-1 rounded-2xl border border-slate-200 dark:border-white/10">
          <button
            v-for="tab in ['TODAY', 'ONGOING']"
            :key="tab"
            @click="activeTab = tab"
            class="px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
            :class="activeTab === tab 
              ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm' 
              : 'text-slate-400 hover:text-slate-600'"
          >
            {{ tab }}
          </button>
        </div>
      </div>
    </div>

    <div class="px-6 space-y-4">
      
      <div v-if="Object.keys(grouped).length === 0" class="py-20 text-center">
        <div class="text-4xl mb-4">✅</div>
        <p class="text-slate-400 text-xs font-black uppercase tracking-widest">All caught up for {{ activeTab.toLowerCase() }}</p>
      </div>

      <div
        v-for="(blocks, surahNo) in grouped"
        :key="surahNo"
        class="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm transition-all"
      >
        <div class="absolute inset-y-0 right-0 z-10 flex">
          <button
            @click.stop="openMerge(surahNo, blocks)"
            class="w-24 bg-amber-500 text-white flex flex-col items-center justify-center gap-1 active:bg-amber-600 transition-colors"
          >
            <span class="text-xl">🔗</span>
            <span class="text-[9px] font-black uppercase tracking-tighter">Merge</span>
          </button>
        </div>

        <div 
          class="relative z-20 bg-white dark:bg-slate-900 transition-transform duration-300 ease-in-out"
          :class="slideSurah === surahNo ? '-translate-x-24' : 'translate-x-0'"
        >
          <div 
            @click="toggleExpand(surahNo)"
            class="p-5 flex items-center justify-between cursor-pointer"
          >
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 font-black text-xs">
                {{ surahNo }}
              </div>
              <div>
                <h3 class="font-black text-slate-800 dark:text-slate-100 tracking-tight">{{ blocks[0].surah_name }}</h3>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{{ blocks.length }} active segments</p>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <button 
                @click.stop="slideSurah = slideSurah === surahNo ? null : surahNo"
                class="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 active:scale-90 transition-all duration-300"
                :class="slideSurah === surahNo ? 'bg-amber-50 dark:bg-amber-500/10' : ''"
              >
                <div 
                  class="transition-all duration-300" 
                  :class="slideSurah === surahNo ? 'rotate-180 text-amber-500' : 'text-slate-300 dark:text-slate-600'"
                >
                  <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M15 19l-7-7 7-7" />
                  </svg>
                </div>
              </button>
            </div>
          </div>

          <Transition name="expand">
            <div v-if="expandedSurah === surahNo" class="px-5 pb-5 space-y-2 border-t border-slate-50 dark:border-white/5 pt-4">
              <div
                v-for="block in blocks"
                :key="block.id"
                class="flex items-center justify-between bg-slate-50 dark:bg-slate-950/50 p-4 rounded-2xl border border-slate-100 dark:border-white/5"
              >
                <div>
                  <div class="text-sm font-black text-slate-700 dark:text-slate-200">
                    Ayah {{ block.start_ayah }} — {{ block.end_ayah }}
                  </div>
                  <div class="flex items-center gap-2 mt-0.5">
                    <span class="text-[9px] font-black px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 uppercase">
                      Lvl {{ block.strength_level }}
                    </span>
                    <span class="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                      Due: {{ new Date(block.next_due).toLocaleDateString() }}
                    </span>
                  </div>
                </div>

                <button
                  @click.stop="handleReview(block)"
                  class="h-10 px-4 rounded-xl bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 active:scale-90 transition-all"
                >
                  Done
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>

    <MurajaahMergeModal
      v-if="mergeData"
      :surahNo="mergeData.surahNo"
      :surahName="mergeData.surahName"
      :blocks="mergeData.blocks"
      @close="mergeData = null"
      @merge="handleMerge"
    />
  </div>
</template>

<style scoped>
.expand-enter-active, .expand-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  max-height: 500px;
}
.expand-enter-from, .expand-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-10px);
}
</style>