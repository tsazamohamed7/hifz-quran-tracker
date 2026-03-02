<script setup>
import { watch, ref, computed } from "vue";

const props = defineProps({
  show: Boolean,
  surah: Object
});

const emit = defineEmits(["close", "save"]);

const form = ref({
  surah_no: null,
  surah_name: "",
  start_ayah: 1,
  end_ayah: null
});

const showToast = ref(false); // 🔥 For the success message

// 🔥 Check if user has changed the default suggestion
const isDirty = computed(() => {
  if (!props.surah) return false;
  return form.value.end_ayah !== (props.surah.memorizedAyah + 1);
});

const livePercentage = computed(() => {
  if (!props.surah?.totalAyah || !form.value.end_ayah) return 0;
  const perc = (form.value.end_ayah / props.surah.totalAyah) * 100;
  return Math.min(Math.round(perc), 100);
});

function fillTotalAyah() {
  if (props.surah?.totalAyah) {
    form.value.end_ayah = props.surah.totalAyah;
  }
}

watch(
  () => props.surah,
  (newSurah) => {
    if (!newSurah) return;
    form.value.surah_no = newSurah.surahNumber;
    form.value.surah_name = newSurah.surahName;
    form.value.start_ayah = newSurah.memorizedAyah + 1;
    form.value.end_ayah = newSurah.memorizedAyah + 1;
  },
  { immediate: true }
);

function submit() {
  emit("save", {
    surah_no: form.value.surah_no,
    start_ayah: form.value.start_ayah,
    end_ayah: form.value.end_ayah
  });
  
  // 🔥 Trigger Toast
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
    emit('close');
  }, 1500); 
}
</script>

<template>
  <Transition name="fade">
    <div
      v-if="show"
      class="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <div 
        class="relative overflow-hidden bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 p-7 rounded-[2rem] w-full max-w-[340px] shadow-2xl transition-all animate-in zoom-in-95 duration-200"
      >
        <div class="absolute -top-12 -right-12 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl dark:block hidden"></div>

        <div class="relative z-10">
          <header class="mb-6 flex justify-between items-start">
            <div>
              <span class="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400 mb-1 block">
                Memorization Update
              </span>
              <h3 class="text-xl font-black text-slate-800 dark:text-white tracking-tight leading-tight">
                {{ form.surah_name }}
              </h3>
            </div>
            <div class="bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-500/20">
               <span class="text-xs font-black text-emerald-600 dark:text-emerald-400">{{ livePercentage }}%</span>
            </div>
          </header>

          <div class="space-y-5">
            <div class="group">
              <label class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Current Progress</label>
              <div class="relative mt-1.5">
                <input
                  type="number"
                  v-model="form.start_ayah"
                  disabled
                  class="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/5 text-slate-400 dark:text-slate-500 font-bold text-sm transition-all"
                />
                <span class="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-300 uppercase">From</span>
              </div>
            </div>

            <div>
              <div class="flex justify-between items-end ml-1">
                <label class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Last Ayah Memorized of {{ props.surah?.totalAyah }}</label>
                <span class="text-[9px] font-bold text-slate-400 uppercase"></span>
              </div>
              <div class="relative mt-1.5">
                <input
                  type="number"
                  v-model="form.end_ayah"
                  :min="form.start_ayah"
                  autofocus
                  class="w-full p-3.5 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-white/10 focus:border-emerald-500 dark:focus:border-emerald-500 text-slate-800 dark:text-white font-black text-lg outline-none transition-all shadow-sm focus:shadow-emerald-500/10"
                />
                <span 
                    @click="fillTotalAyah"
                    class="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-emerald-500 uppercase tracking-tighter cursor-pointer hover:text-emerald-400 active:scale-90 transition-all select-none"
                >
                Full
                </span>
              </div>
              
              <div class="mt-2 px-1">
                <div class="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
                  <div 
                    class="h-full bg-emerald-500 transition-all duration-300" 
                    :style="{ width: livePercentage + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-3 mt-8">
            <button
              @click="submit"
              class="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-[0.15em] shadow-lg shadow-emerald-900/20 active:scale-[0.97] transition-all"
            >
              Update Journey
            </button>
            
            <button @click="$emit('close')" class="w-full py-3 text-[10px] font-black uppercase tracking-widest transition-colors"
                :class="isDirty ? 'text-amber-500 dark:text-amber-400' : 'text-slate-400 dark:text-slate-500'"
            >
                {{ isDirty ? 'Discard Changes' : 'Dismiss' }}
            </button>
          </div>
        </div>

      </div>

      <Transition name="slide-up">
        <div v-if="showToast" class="absolute bottom-10 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 z-[60]">
          <span class="text-lg">✨</span>
          <span class="text-xs font-black uppercase tracking-widest">Progress Saved!</span>
        </div>
      </Transition>

    </div>
  </Transition>
</template>

<style scoped>
/* Toast Animation */
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.slide-up-enter-from { transform: translate(-50%, 100px); opacity: 0; }
.slide-up-leave-to { transform: translate(-50%, 20px); opacity: 0; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>