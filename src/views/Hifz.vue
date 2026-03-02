<script setup>
import { onMounted, onUnmounted, computed, ref } from "vue";
import { useReferenceStore } from "../stores/reference.store";
import { useHifzStore } from "../stores/hifz.store";
import HifzModal from "../components/HifzModal.vue";
import HifzHistoryModal from "../components/HifzHistoryModal.vue";

const referenceStore = useReferenceStore();
const hifzStore = useHifzStore();

const showModal = ref(false);
const showHistoryModal = ref(false);
const selectedSurah = ref(null);
const searchQuery = ref("");
const isSearching = ref(false);

// Track which surah is currently slid open
const activeActionId = ref(null);

const isHeaderVisible = ref(true);
const lastScrollPosition = ref(0);

const handleScroll = () => {
  const currentScrollPosition = window.scrollY || document.documentElement.scrollTop;
  if (currentScrollPosition < 60) {
    isHeaderVisible.value = true;
    lastScrollPosition.value = currentScrollPosition;
    return;
  }
  if (currentScrollPosition > lastScrollPosition.value + 5) {
    isHeaderVisible.value = false;
  } else if (currentScrollPosition < lastScrollPosition.value - 10) {
    isHeaderVisible.value = true;
  }
  lastScrollPosition.value = currentScrollPosition;
};

onMounted(() => {
  referenceStore.fetchSurahList();
  hifzStore.fetchBlocks();
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

// Helper to toggle slide
function toggleSlide(surahId) {
  if (activeActionId.value === surahId) {
    activeActionId.value = null;
  } else {
    activeActionId.value = surahId;
  }
}

const rawSurahList = computed(() => {
  if (!Array.isArray(referenceStore.surahList)) return [];
  return referenceStore.surahList.map((surah) => {
    const blocks = (hifzStore.blocks || []).filter(
      (b) => Number(b.surah_no) === Number(surah.surah_no)
    );
    const memorizedAyah = blocks.reduce((total, b) => {
      return total + (Number(b.end_ayah) - Number(b.start_ayah) + 1);
    }, 0);
    const percentage = surah.total_ayah > 0 ? (memorizedAyah / surah.total_ayah) * 100 : 0;
    return {
      surahNumber: surah.surah_no,
      surahName: surah.surah_name,
      totalAyah: surah.total_ayah,
      memorizedAyah,
      percentage,
    };
  });
});

const surahList = computed(() => {
  if (!searchQuery.value) return rawSurahList.value;
  const query = searchQuery.value.toLowerCase();
  return rawSurahList.value.filter(s => 
    s.surahName.toLowerCase().includes(query) || 
    s.surahNumber.toString().includes(query)
  );
});

// Open Add Modal
function openAddModal(surah) {
  activeActionId.value = null; // reset slide
  selectedSurah.value = surah;
  showModal.value = true;
}

// Open History Modal
function openHistory(surah) {
  activeActionId.value = null; // reset slide
  selectedSurah.value = surah;
  showHistoryModal.value = true;
}

async function handleSave(payload) {
  await hifzStore.addBlock(payload);
  showModal.value = false;
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors pb-24">
    
    <Transition name="fade">
      <div 
        v-if="isSearching" 
        class="fixed inset-0 bg-slate-950/40 backdrop-blur-[2px] z-20 pointer-events-none"
      ></div>
    </Transition>

    <div 
      class="sticky top-0 z-30 px-4 pt-4 pb-3 transition-all duration-300"
      :class="isSearching ? 'bg-slate-50 dark:bg-slate-950' : 'bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md'"
    >
      <div class="relative group max-w-md mx-auto">
        <div class="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <svg class="w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Search Surah..." 
          class="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-sm font-bold text-slate-800 dark:text-slate-100 outline-none focus:border-emerald-500/50 transition-all shadow-sm"
        />
      </div>
    </div>

    <div class="space-y-4 px-4 mt-2">
      <div v-if="hifzStore.loading" class="space-y-4 animate-pulse">
        <div v-for="n in 3" :key="n" class="h-24 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
      </div>

      <div
        v-else
        v-for="surah in surahList"
        :key="surah.surahNumber"
        :class="[
  'relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border shadow-sm h-24 mb-3 transition-all duration-300',
  surah.percentage === 100
    ? 'border-emerald-400 dark:border-emerald-500 bg-emerald-50/40 dark:bg-emerald-500/5'
    : 'border-slate-200 dark:border-white/10'
]"
      >
        <div class="absolute inset-y-0 right-0 z-10 flex">
          <button 
            @click="openHistory(surah)"
            class="w-24 bg-emerald-500 text-white flex flex-col items-center justify-center gap-1 active:bg-emerald-600 transition-colors"
          >
            <span class="text-xl">📜</span>
            <span class="text-[9px] font-black uppercase tracking-tighter">History</span>
          </button>
        </div>

        <div 
          class="absolute inset-0 z-20 bg-white dark:bg-slate-900 p-3 flex items-center gap-4 transition-transform duration-300 ease-in-out"
          :class="activeActionId === surah.surahNumber ? '-translate-x-24' : 'translate-x-0'"
        >
          <div class="flex-shrink-0 w-11 h-11 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center border border-slate-200 dark:border-white/10">
            <span class="text-[10px] font-black text-slate-400 dark:text-emerald-500/50 uppercase">
              {{ surah.surahNumber }}
            </span>
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-baseline">
              <h2 class="text-sm font-extrabold text-slate-800 dark:text-slate-100 truncate tracking-tight">
                {{ surah.surahName }}
              </h2>
              <span class="text-[11px] font-black text-emerald-600 dark:text-emerald-400">
                {{ Math.round(surah.percentage || 0) }}%
              </span>
            </div>

            <div class="w-full bg-slate-100 dark:bg-slate-800/50 rounded-full h-1.5 overflow-hidden mt-1.5 mb-1">
              <div
                class="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full rounded-full transition-all duration-700"
                :style="{ width: (surah.percentage || 0) + '%' }"
              ></div>
            </div>
            
            <p class="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              {{ surah.memorizedAyah }} / {{ surah.totalAyah }} ayah
            </p>
          </div>

          <div class="flex items-center gap-2">
            <button
              v-if="Math.round(surah.percentage || 0) < 100"
              @click.stop="openAddModal(surah)"
              class="w-10 h-10 flex items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-500/10 active:scale-90 transition-all group/btn"
            >
              <img 
                src="../assets/hifz-book.svg" 
                class="w-6 h-6"
                style="filter: invert(56%) sepia(58%) saturate(3054%) hue-rotate(130deg) brightness(97%) contrast(102%);" 
              />
            </button>

            <div v-else class="text-emerald-500 dark:text-emerald-400 w-10 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <button 
              v-if="surah.memorizedAyah > 0"
              @click.stop="toggleSlide(surah.surahNumber)"
              class="w-8 h-10 flex items-center justify-center text-slate-300 dark:text-slate-600 transition-transform duration-300"
              :class="{ 'rotate-180': activeActionId === surah.surahNumber }"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <HifzModal
    :show="showModal"
    :surah="selectedSurah"
    @close="showModal = false"
    @save="handleSave"
  />

  <HifzHistoryModal 
    :show="showHistoryModal" 
    :surah="selectedSurah" 
    @close="showHistoryModal = false" 
  />
</template>

<style scoped>
/* Disable scrolling text selection when sliding */
.relative {
  user-select: none;
}
</style>