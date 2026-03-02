<script setup>
import { onMounted, computed } from "vue";
import { useDashboardStore } from "../stores/dashboard.store";
import cardBg from "../assets/card-bg.jpg"; 

const dashboardStore = useDashboardStore();

onMounted(() => {
  dashboardStore.fetchSummary();
});

// 🔥 Progress Safety
const progressPercent = computed(() => {
  // Use default 0 if summary hasn't loaded yet
  const summary = dashboardStore.summary;
  if (!summary) return 0;

  const value = Number(summary.percentage || 0);
  if (isNaN(value)) return 0;
  return Math.min(Math.max(value, 0), 100);
});

// Helper to provide default values while loading
const displayData = computed(() => ({
  memorized: dashboardStore.summary?.memorizedAyah ?? 0,
  total: dashboardStore.summary?.totalQuranAyah ?? 6236,
  streak: dashboardStore.summary?.streak ?? 0,
  juz: dashboardStore.summary?.juzCompleted ?? 0,
  dua: dashboardStore.summary?.dailyDua ?? {
    arabic: "...",
    translation: "Loading daily inspiration...",
    reference: "Please wait"
  }
}));
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 transition-colors duration-300 font-sans">
    <div class="p-4 space-y-5">
      
      <div class="flex flex-col gap-5" :class="{ 'animate-pulse opacity-70': dashboardStore.loading }">

        <div class="relative p-5 rounded-[2rem] shadow-lg overflow-hidden bg-cover bg-center text-white min-h-[160px] flex flex-col justify-center"
             :style="{ backgroundImage: `url(${cardBg})` }">
          <div class="absolute inset-0 bg-emerald-950/75 z-0"></div>

          <div class="relative z-10">
            <h2 class="font-extrabold mb-3 tracking-tight text-lg">Overall Progress</h2>
            <div class="flex justify-between text-[11px] mb-2 text-emerald-50/80 uppercase font-bold tracking-widest">
              <span>{{ displayData.memorized }} memorized</span>
              <span>{{ displayData.total }} total</span>
            </div>
            <div class="w-full bg-slate-900/40 border border-white/10 rounded-full h-3 overflow-hidden">
              <div class="bg-gradient-to-r from-emerald-500 to-emerald-300 h-full rounded-full shadow-[0_0_12px_rgba(52,211,153,0.6)] transition-all duration-1000"
                   :style="{ width: progressPercent + '%' }"></div>
            </div>
            <div class="text-right mt-2 text-sm font-black text-emerald-400 italic">
              {{ progressPercent }}%
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div v-for="(stat, index) in [
            { label: 'Weekly Streak', val: displayData.streak, unit: 'Days', icon: '🔥', glow: 'bg-orange-500/10' },
            { label: 'Juz Completed', val: displayData.juz, unit: '/ 30', icon: '📖', glow: 'bg-emerald-500/10' }
          ]" :key="index" 
          class="relative overflow-hidden p-5 rounded-[1.5rem] transition active:scale-95 bg-white border border-slate-200 dark:bg-slate-900/40 dark:backdrop-blur-md dark:border-white/10 shadow-sm">
            <div :class="['absolute -top-10 -right-10 w-20 h-20 rounded-full blur-2xl opacity-0 dark:opacity-100 transition-opacity', stat.glow]"></div>
            <p class="relative z-10 text-[10px] uppercase tracking-[0.15em] mb-2 font-black text-slate-500 dark:text-slate-400">
              {{ stat.label }}
            </p>
            <div class="relative z-10 flex items-baseline gap-1">
              <span class="text-xl">{{ stat.icon }}</span>
              <p class="text-2xl font-black tracking-tighter dark:text-white">
                {{ stat.val }}
                <span class="text-[10px] font-bold ml-0.5 text-slate-400">{{ stat.unit }}</span>
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-slate-900/90 p-7 rounded-[2rem] shadow-sm border border-slate-100 dark:border-white/5 transition-all">
          <div class="flex justify-between items-center mb-8">
            <h2 class="font-extrabold text-slate-700 dark:text-slate-200 tracking-tight">Daily Dua</h2>
            <span class="text-[9px] px-2.5 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-full font-black uppercase tracking-widest border border-emerald-100 dark:border-emerald-500/20">
              Supplication
            </span>
          </div>

          <p dir="rtl" class="text-3xl leading-[3.5rem] text-slate-800 dark:text-slate-50 font-arabic mb-8 text-center antialiased min-h-[3.5rem]">
            {{ displayData.dua.arabic }}
          </p>

          <p class="text-sm text-slate-500 dark:text-slate-400 italic leading-relaxed mb-5 text-center px-4 font-medium">
            "{{ displayData.dua.translation }}"
          </p>

          <p class="text-[10px] text-slate-400 dark:text-slate-600 font-bold uppercase tracking-widest text-center">
            — {{ displayData.dua.reference }} —
          </p>
        </div>

      </div>
    </div>
  </div>
</template>