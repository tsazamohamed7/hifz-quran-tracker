<template>
  <div class="fixed bottom-6 inset-x-4 z-50">
    <nav 
      class="h-18 
         bg-emerald-600/90 dark:bg-slate-900/90
         backdrop-blur-lg 
         border border-emerald-400/30 dark:border-slate-700
         flex items-center justify-around px-2
         shadow-[0_8px_32px_rgba(0,0,0,0.1)]
         rounded-[2.5rem]
         transition-colors duration-300"
    >
      <router-link
        v-for="item in items"
        :key="item.to"
        :to="item.to"
        class="flex-1 flex flex-col items-center justify-center transition-all duration-300 relative group"
        :class="$route.path === item.to 
          ? 'text-white' 
          : 'text-emerald-100/60 dark:text-slate-400'"
      >

        <div class="relative flex items-center justify-center h-10 w-10 transition-transform duration-300 group-active:scale-75">
          <i :class="['fa text-2xl fa-fw', item.icon]"></i>
        </div>
        
        <span class="text-[10px] font-black mt-0.5 tracking-tighter uppercase">
          {{ item.label }}
        </span>
      </router-link>
    </nav>
  </div>
</template>

<script setup>
const items = [
  { to: "/dashboard", label: "Home", icon: "fa-solid fa-seedling" },
  { to: "/hifz", label: "Hifz", icon: "fa-solid fa-book-quran" },
  { to: "/murajaah", label: "Murajaah", icon: "fa-solid fa-bolt" }
];
</script>

<style scoped>
/* Smooth transition for backdrop blur */
nav {
  transition: all 0.3s ease;
}

/* Ensure content doesn't get hidden behind the floating nav */
:global(main) {
  padding-bottom: 120px !important;
}
</style>