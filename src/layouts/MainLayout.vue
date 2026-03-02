<script setup>
import { ref, onMounted } from "vue";
import BottomNav from "../components/BottomNav.vue";

const isDark = ref(false);

function applyTheme(value) {
  const html = document.documentElement;

  if (value) {
    html.classList.add("dark");
  } else {
    html.classList.remove("dark");
  }

  localStorage.setItem("theme", value ? "dark" : "light");
}

function toggleDark() {
  isDark.value = !isDark.value;
  applyTheme(isDark.value);
}

onMounted(() => {
  const saved = localStorage.getItem("theme");

  if (saved) {
    isDark.value = saved === "dark";
  } else {
    // optional: follow system preference
    isDark.value = window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  applyTheme(isDark.value);
});
</script>

<template>
  <div class="h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">

    <!-- Header -->
    <header
      class="h-16 flex items-center justify-between px-6 
             bg-emerald-600 dark:bg-slate-900 
             text-white shadow-md sticky top-0 z-50 transition-colors duration-300"
    >
      
      <div class="w-8"></div>

      <router-link to="/" class="flex flex-col items-center">
        <img src="../assets/icon-hifz.svg" alt="Logo"
             class="h-7 w-auto brightness-0 invert" />
        <span class="text-[10px] font-bold tracking-[0.2em] uppercase opacity-80 mt-1">
          Hifz Tracker
        </span>
      </router-link>

      <!-- 🌙 Dark Toggle -->
      <button
        @click="toggleDark"
        class="w-8 h-8 flex items-center justify-center rounded-full 
               bg-white/20 dark:bg-white/10 
               hover:scale-110 active:scale-90 transition"
      >
        <i
          :class="isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon'"
          class="text-sm"
        ></i>
      </button>

    </header>

    <!-- Content -->
    <main
      class="flex-1 overflow-y-auto p-4 pb-24
             bg-slate-50 dark:bg-slate-950
             transition-colors duration-300"
    >
      <router-view />
    </main>

    <BottomNav />
  </div>
</template>

<style scoped>
.app {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  height: 56px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  border-bottom: 1px solid #eee;
  font-weight: bold;
}

.content {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  padding-bottom: 80px; /* space for bottom nav */
}
</style>
