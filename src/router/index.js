import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/login",
      name: "login",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/login.vue"),
    },
    // employee routes
    {
      path: "/employee/",
      name: "emp-land",

      component: () => import("../views/employee/landpage.vue"),
      children: [
        {
          path: "dashboard",
          name: "emp-dash",

          component: () => import("../views/employee/dashboard.vue"),
        },
        {
          path: "add",
          name: "emp-add",

          component: () => import("../views/employee/add.vue"),
        },
        {
          path: "all",
          name: "emp-all",

          component: () => import("../views/employee/all.vue"),
        },
        {
          path: ":id",
          name: "emp-page",

          component: () => import("../views/employee/employeePage.vue"),
        },
      ],
    },
  ],
});

export default router;
