import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import swal from "sweetalert";
import axios from "axios";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: {
        requiresAuth: true,
      },
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
      meta: {
        requiresAuth: true,
      },
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
    // user routes
    {
      path: "/user/",
      name: "user-land",
      meta: {
        requiresAuth: true,
      },
      component: () => import("../views/users/landpage.vue"),
      children: [
        {
          path: "dashboard",
          name: "user-dash",

          component: () => import("../views/users/dashboard.vue"),
        },
        {
          path: "add",
          name: "user-add",

          component: () => import("../views/users/add.vue"),
        },
        {
          path: "all",
          name: "user-all",

          component: () => import("../views/users/all.vue"),
        },
        {
          path: ":id",
          name: "user-page",

          component: () => import("../views/users/userPage.vue"),
        },
      ],
    },
    // models routes
    {
      path: "/model/",
      name: "model-land",
      meta: {
        requiresAuth: true,
      },
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
      meta: {
        requiresAuth: true,
      },
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
      meta: {
        requiresAuth: true,
      },
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
    // cartons routes
    {
      path: "/storage/carton/",
      name: "carton-land",
      meta: {
        requiresAuth: true,
      },
      component: () => import("../views/storage/cartons/landPage.vue"),
      children: [
        {
          path: "dashboard",
          name: "carton-dash",

          component: () => import("../views/storage/cartons/dashboard.vue"),
        },
        {
          path: "add",
          name: "carton-add",

          component: () => import("../views/storage/cartons/add.vue"),
        },
        {
          path: "all",
          name: "carton-all",

          component: () => import("../views/storage/cartons/all.vue"),
        },
        {
          path: ":id",
          name: "carton-page",

          component: () => import("../views/storage/cartons/cartonPage.vue"),
        },
      ],
    },
    // supplier routes
    {
      path: "/supplier/",
      name: "supplier-land",
      meta: {
        requiresAuth: true,
      },
      component: () => import("../views/suppliers/landpage.vue"),
      children: [
        {
          path: "dashboard",
          name: "supplier-dash",

          component: () => import("../views/suppliers/dashboard.vue"),
        },
        {
          path: "add",
          name: "supplier-add",

          component: () => import("../views/suppliers/add.vue"),
        },
        {
          path: "all",
          name: "supplier-all",

          component: () => import("../views/suppliers/all.vue"),
        },
        {
          path: ":id",
          name: "supplier-page",

          component: () => import("../views/suppliers/supplierPage.vue"),
        },
      ],
    },
    // client routes
    {
      path: "/client/",
      name: "client-land",
      meta: {
        requiresAuth: true,
      },
      component: () => import("../views/clients/landpage.vue"),
      children: [
        {
          path: "dashboard",
          name: "client-dash",

          component: () => import("../views/clients/dashboard.vue"),
        },
        {
          path: "add",
          name: "client-add",

          component: () => import("../views/clients/add.vue"),
        },
        {
          path: "all",
          name: "client-all",

          component: () => import("../views/clients/all.vue"),
        },
        {
          path: ":id",
          name: "client-page",

          component: () => import("../views/clients/clientPage.vue"),
        },
      ],
    },
    // requests routes
    {
      path: "/request/",
      name: "request-land",
      meta: {
        requiresAuth: true,
      },
      component: () => import("../views/requests/landpage.vue"),
      children: [
        {
          path: "dashboard",
          name: "request-dash",

          component: () => import("../views/requests/dashboard.vue"),
        },
        {
          path: "add",
          name: "request-add",

          component: () => import("../views/requests/add.vue"),
        },
        {
          path: "all",
          name: "request-all",

          component: () => import("../views/requests/all.vue"),
        },
        {
          path: ":id",
          name: "request-page",

          component: () => import("../views/requests/requestPage.vue"),
        },
      ],
    },
    // shipment routes
    {
      path: "/shipment/",
      name: "shipment-land",
      meta: {
        requiresAuth: true,
      },
      component: () => import("../views/shipment/landpage.vue"),
      children: [
        {
          path: "dashboard",
          name: "shipment-dash",

          component: () => import("../views/shipment/dashboard.vue"),
        },
        {
          path: "add",
          name: "shipment-add",

          component: () => import("../views/shipment/add.vue"),
        },
        {
          path: "all",
          name: "shipment-all",

          component: () => import("../views/shipment/all.vue"),
        },
        {
          path: ":id",
          name: "shipment-page",

          component: () => import("../views/shipment/shipmentPage.vue"),
        },
      ],
    },
    // order routes
    {
      path: "/order/",
      name: "order-land",
      meta: {
        requiresAuth: true,
      },
      component: () => import("../views/orders/landPage.vue"),
      children: [
        {
          path: "dashboard",
          name: "order-dash",

          component: () => import("../views/orders/dashboard.vue"),
        },
        {
          path: "add",
          name: "order-add",

          component: () => import("../views/orders/add.vue"),
        },
        {
          path: "all",
          name: "order-all",

          component: () => import("../views/orders/all.vue"),
        },
        {
          path: ":id",
          name: "order-page",

          component: () => import("../views/orders/orderPage.vue"),
        },
      ],
    },
    //color routes
    {
      path: "/utils/color/",
      name: "color-land",
      meta: {
        requiresAuth: true,
      },
      component: () => import("../views/utils/colors/landPage.vue"),
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
      meta: {
        requiresAuth: true,
      },
      component: () => import("../views/utils/sizes/landPage.vue"),
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
      meta: {
        requiresAuth: true,
      },
      component: () => import("../views/utils/roles/landPage.vue"),
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
    //user roles routes
    {
      path: "/utils/user_role/",
      name: "user_roles-land",
      meta: {
        requiresAuth: true,
      },
      component: () => import("../views/utils/user_roles/landPage.vue"),
      children: [
        {
          path: "dashboard",
          name: "user_roles-dash",

          component: () => import("../views/utils/user_roles/dashboard.vue"),
        },
        {
          path: "add",
          name: "user_roles-add",

          component: () => import("../views/utils/user_roles/add.vue"),
        },
        {
          path: "all",
          name: "user_roles-all",

          component: () => import("../views/utils/user_roles/all.vue"),
        },
        {
          path: ":id",
          name: "user_roles-page",

          component: () =>
            import("../views/utils/user_roles/user_rolePage.vue"),
        },
      ],
    },
    //type routes
    {
      path: "/utils/type/",
      name: "type-land",
      meta: {
        requiresAuth: true,
      },
      component: () => import("../views/utils/types/landPage.vue"),
      children: [
        {
          path: "dashboard",
          name: "type-dash",

          component: () => import("../views/utils/types/dashboard.vue"),
        },
        {
          path: "add",
          name: "type-add",

          component: () => import("../views/utils/types/add.vue"),
        },
        {
          path: "all",
          name: "type-all",

          component: () => import("../views/utils/types/all.vue"),
        },
        {
          path: ":id",
          name: "type-page",

          component: () => import("../views/utils/types/typePage.vue"),
        },
      ],
    },
    //machine type routes
    {
      path: "/utils/machinetype/",
      name: "machinet-land",
      meta: {
        requiresAuth: true,
      },
      component: () => import("../views/utils/machinetype/landPage.vue"),
      children: [
        {
          path: "dashboard",
          name: "machinet-dash",

          component: () => import("../views/utils/machinetype/dashboard.vue"),
        },
        {
          path: "add",
          name: "machinet-add",

          component: () => import("../views/utils/machinetype/add.vue"),
        },
        {
          path: "all",
          name: "machinet-all",

          component: () => import("../views/utils/machinetype/all.vue"),
        },
        {
          path: ":id",
          name: "machinet-page",

          component: () => import("../views/utils/machinetype/machinePage.vue"),
        },
      ],
    },
    //stage routes
    {
      path: "/utils/stage/",
      name: "stage-land",
      meta: {
        requiresAuth: true,
      },
      component: () => import("../views/utils/stages/landPage.vue"),
      children: [
        {
          path: "dashboard",
          name: "stage-dash",

          component: () => import("../views/utils/stages/dashboard.vue"),
        },
        {
          path: "add",
          name: "stage-add",

          component: () => import("../views/utils/stages/add.vue"),
        },
        {
          path: "all",
          name: "stage-all",

          component: () => import("../views/utils/stages/all.vue"),
        },
        {
          path: ":id",
          name: "stage-page",

          component: () => import("../views/utils/stages/stagePage.vue"),
        },
      ],
    },
    //print routes
    {
      path: "/print",
      name: "print",
      meta: {
        requiresAuth: true,
      },
      component: () => import("../views/prints/mainPrint.vue"),
    },
    {
      path: "/consumptionPrint",
      name: "consumptionPrint",
      meta: {
        requiresAuth: true,
      },
      component: () => import("../views/prints/consumptionPrint.vue"),
    },
    {
      path: "/orderPrint",
      name: "orderPrint",
      meta: {
        requiresAuth: true,
      },
      component: () => import("../views/prints/orderPrint.vue"),
    },
    {
      path: "/orderMPrint",
      name: "orderMPrint",
      meta: {
        requiresAuth: true,
      },
      component: () => import("../views/prints/orderModelPrint.vue"),
    },
    //test
    {
      path: "/lazysoftware/credits",
      name: "test",

      component: () => import("../views/test.vue"),
    },
  ],
});

export default router;
router.beforeEach((to, from, next) => {
  function name() {
    const isLoggedIn = localStorage.getItem("code") ? true : false;
    if (to.meta.requiresAuth && !isLoggedIn) {
      // User is not logged in and the route requires authentication

      swal("error", "you have to login first", "error");

      next("/login"); // Redirect the user to the login page or another appropriate route
    } else if (to.path === "/login" && isLoggedIn) {
      swal("success", "you're already logged in", "success");
      next("/");
    } else {
      // User is logged in or the route does not require authentication
      next(); // Continue to the intended route
    }
  }
  name();
});
