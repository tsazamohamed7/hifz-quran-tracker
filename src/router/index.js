import { createRouter, createWebHashHistory } from "vue-router";
import MainLayout from "../layouts/MainLayout.vue";

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      component: MainLayout,
      children: [
        {
          path: "dashboard",
          component: () => import("../views/Dashboard.vue"),
          meta: { title: "Dashboard" }
        },
        {
          path: "hifz",
          component: () => import("../views/Hifz.vue"),
          meta: { title: "Products" }
        },
        {
          path: "murajaah",
          component: () => import("../views/Murajaah.vue"),
          meta: { title: "Orders" }
        },
        { path: "", redirect: "/dashboard" }
      ]
    }
  ]
});
