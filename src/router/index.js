import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: {requiresAuth: true},
    },
    {
      path: '/admin/utilisateurs',
      name: 'ManageUsers',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/ManageUserView.vue'),
      meta: {requiresAuth: true, adminOnly: true},
    },
    {
      path: '/admin/utilisateur/ajouter',
      name: 'add-user',
      component: () => import('../views/UpdateUserView.vue'),
      meta: { requiresAuth: true, adminOnly: true },
    },
    {
      path: '/admin/utilisateur/modifer/:id',
      name: 'edit-user',
      component: () => import('../views/UpdateUserView.vue'),
      meta: { requiresAuth: true, adminOnly: true },
    },
    {
      path: '/admin/roles',
      name: 'manage-roles',
      component: () => import('../views/ManageRoleView.vue'),
      meta: { requiresAuth: true, adminOnly: true },
    },
    {
      path: '/admin/role/ajouter',
      name: 'add-role',
      component: () => import('../views/UpdateRoleView.vue'),
      meta: { requiresAuth: true, adminOnly: true },
    },
    {
      path: '/admin/role/modifer/:id',
      name: 'edit-role',
      component: () => import('../views/UpdateRoleView.vue'),
      meta: { requiresAuth: true, adminOnly: true },
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
      meta: {requiresAuth: true},
    },




    { 
      path: '/:pathMatch(.*)*', 
      redirect: '/'
    }
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  // Charger les données de localStorage si elles ne sont pas dans Pinia
  if (!authStore.token) {
    authStore.loadFromLocalStorage();
  }

  // Vérification des routes nécessitant une authentification
  if (to.meta.requiresAuth && !authStore.token) {
    return next({ name: 'login' }); // Redirige vers la page de connexion
  }

  // Vérification des routes réservées aux admins
  if (to.meta.adminOnly && !authStore.isAdmin) {
    return next({ name: 'home' }); // Redirige vers la page d'accueil
  }

  next();
});

export default router
