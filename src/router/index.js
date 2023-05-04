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

    // models routes
    {
      path: "/model/",
      name: "model-land",

      component: () => import("../views/models/landpage.vue"),
      children: [
        {
          path: "dashboard",
          name: "model-dash",

          component: () => import("../views/models/dashboard.vue"),
        },
        {
          path: "add",
          name: "model-add",

          component: () => import("../views/models/add.vue"),
        },
        {
          path: "all",
          name: "model-all",

          component: () => import("../views/models/all.vue"),
        },
        {
          path: ":id",
          name: "model-page",

          component: () => import("../views/models/modelPage.vue"),
        },
      ],
    },
    // material routes
    {
      path: "/storage/material/",
      name: "material-land",

      component: () => import("../views/storage/material/landpage.vue"),
      children: [
        {
          path: "dashboard",
          name: "material-dash",

          component: () => import("../views/storage/material/dashboard.vue"),
        },
        {
          path: "add",
          name: "material-add",

          component: () => import("../views/storage/material/add.vue"),
        },
        {
          path: "all",
          name: "material-all",

          component: () => import("../views/storage/material/all.vue"),
        },
        {
          path: ":id",
          name: "material-page",

          component: () => import("../views/storage/material/materialPage.vue"),
        },
      ],
    },
    // properties routes
    {
      path: "/storage/property/",
      name: "property-land",

      component: () => import("../views/storage/properties/landpage.vue"),
      children: [
        {
          path: "dashboard",
          name: "property-dash",

          component: () => import("../views/storage/properties/dashboard.vue"),
        },
        {
          path: "add",
          name: "property-add",

          component: () => import("../views/storage/properties/add.vue"),
        },
        {
          path: "all",
          name: "property-all",

          component: () => import("../views/storage/properties/all.vue"),
        },
        {
          path: ":id",
          name: "property-page",

          component: () =>
            import("../views/storage/properties/propertyPage.vue"),
        },
      ],
    },
    //color routes
    {
      path: "/utils/color/",
      name: "color-land",

      component: () => import("../views/utils/colors/landpage.vue"),
      children: [
        {
          path: "dashboard",
          name: "color-dash",

          component: () => import("../views/utils/colors/dashboard.vue"),
        },
        {
          path: "add",
          name: "color-add",

          component: () => import("../views/utils/colors/add.vue"),
        },
        {
          path: "all",
          name: "color-all",

          component: () => import("../views/utils/colors/all.vue"),
        },
        {
          path: ":id",
          name: "color-page",

          component: () => import("../views/utils/colors/colorPage.vue"),
        },
      ],
    },

    //sizes routes
    {
      path: "/utils/size/",
      name: "size-land",

      component: () => import("../views/utils/sizes/landpage.vue"),
      children: [
        {
          path: "dashboard",
          name: "size-dash",

          component: () => import("../views/utils/sizes/dashboard.vue"),
        },
        {
          path: "add",
          name: "size-add",

          component: () => import("../views/utils/sizes/add.vue"),
        },
        {
          path: "all",
          name: "size-all",

          component: () => import("../views/utils/sizes/all.vue"),
        },
        {
          path: ":id",
          name: "size-page",

          component: () => import("../views/utils/sizes/sizePage.vue"),
        },
      ],
    },
    //roles routes
    {
      path: "/utils/role/",
      name: "role-land",

      component: () => import("../views/utils/roles/landpage.vue"),
      children: [
        {
          path: "dashboard",
          name: "role-dash",

          component: () => import("../views/utils/roles/dashboard.vue"),
        },
        {
          path: "add",
          name: "role-add",

          component: () => import("../views/utils/roles/add.vue"),
        },
        {
          path: "all",
          name: "role-all",

          component: () => import("../views/utils/roles/all.vue"),
        },
        {
          path: ":id",
          name: "role-page",

          component: () => import("../views/utils/roles/rolePage.vue"),
        },
      ],
    },
  ],
});

export default router;
