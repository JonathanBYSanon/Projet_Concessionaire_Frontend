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
    // Voitures
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: {requiresAuth: true},
    },
    {
      path: '/voiture/ajouter',
      name: 'add-voiture',
      component: () => import('../views/UpdateVoitureView.vue'),
      meta: {requiresAuth: true},
    },
    {
      path: '/voiture/modifer/:id',
      name: 'edit-voiture',
      component: () => import('../views/UpdateVoitureView.vue'),
      meta: {requiresAuth: true},
    },
    // Utilisateurs
    {
      path: '/admin/utilisateurs',
      name: 'manage-user',
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
    // Roles
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
    // Modeles
    {
      path: '/modeles',
      name: 'manage-modele',
      component: () => import('../views/ManageModeleView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/modele/ajouter',
      name: 'add-modele',
      component: () => import('../views/UpdateModeleView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/modele/modifer/:id',
      name: 'edit-modele',
      component: () => import('../views/UpdateModeleView.vue'),
      meta: { requiresAuth: true },
    },
    // Marques
    {
      path: '/marques',
      name: 'manage-marque',
      component: () => import('../views/ManageMarqueView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/marque/ajouter',
      name: 'add-marque',
      component: () => import('../views/UpdateMarqueView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/marque/modifer/:id',
      name: 'edit-marque',
      component: () => import('../views/UpdateMarqueView.vue'),
      meta: { requiresAuth: true },
    },
    // Options
    {
      path: '/options',
      name: 'manage-option',
      component: () => import('../views/ManageOptionView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/option/ajouter',
      name: 'add-option',
      component: () => import('../views/UpdateOptionView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/option/modifer/:id',
      name: 'edit-option',
      component: () => import('../views/UpdateOptionView.vue'),
      meta: { requiresAuth: true },
    },
    // couleurs
    {
      path: '/couleurs',
      name: 'manage-couleur',
      component: () => import('../views/ManageCouleurView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/couleur/ajouter',
      name: 'add-couleur',
      component: () => import('../views/UpdateCouleurView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/couleur/modifer/:id',
      name: 'edit-couleur',
      component: () => import('../views/UpdateCouleurView.vue'),
      meta: { requiresAuth: true },
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
