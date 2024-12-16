<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <header>
    <!-- Bootstrap Navbar -->
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <!-- Brand Logo -->
        <a class="navbar-brand" href="#">Car Dealership</a>

        <!-- Navigation Links -->
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <RouterLink to="/home" class="nav-link border-end">Acceuil</RouterLink>
            </li>
            <li v-if="isAdmin" class="nav-item dropdown border-end">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                id="userDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Gestion Utilisateurs
              </a>
              <ul class="dropdown-menu" aria-labelledby="userDropdown">
                <li class="dropdown-item">
                  <RouterLink to="/admin/utilisateurs" class="nav-link border-bottom">Gérer Utilisateurs</RouterLink>
                </li>
                <li class="dropdown-item">
                  <RouterLink to="/admin/roles" class="nav-link border-bottom">Gérer Rôles</RouterLink>
                </li>
              </ul>
            </li>
            <li class="nav-item dropdown border-end">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                id="userDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
              Gestion Autres
              </a>
              <ul class="dropdown-menu" aria-labelledby="userDropdown">
                <li class="dropdown-item">
                  <RouterLink to="/modeles" class="nav-link border-bottom">Gérer Modeles</RouterLink>
                </li>
                <li class="dropdown-item">
                  <RouterLink to="/marques" class="nav-link border-bottom">Gérer Marques</RouterLink>
                </li>
                <li class="dropdown-item">
                  <RouterLink to="/options" class="nav-link border-bottom">Gérer Options</RouterLink>
                </li>
                <li class="dropdown-item">
                  <RouterLink to="/couleurs" class="nav-link border-bottom">Gérer Couleurs</RouterLink>
                </li>
              </ul>
            </li>
            <li class="nav-item">
              <RouterLink to="/" class="nav-link border-end">Deconnexion</RouterLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>

  <RouterView />

  <footer class="bg-light text-center text-lg-start mt-auto">
    <div class="text-center p-3">
      <p class="mb-0">
        Projet réalisé par <strong>Groupe 13</strong> : Jonathan, Salma, Andre, Sabrine
      </p>
    </div>
  </footer>

</template>

<script>
  import { useAuthStore } from './stores/auth';

  export default {
    computed: {
      isAdmin() {
        const authStore = useAuthStore();
        return authStore.isAdmin; // Accès au getter du store
      },
    },
    mounted() {
      const authStore = useAuthStore();
      authStore.loadFromLocalStorage(); // Charger les données stockées
    },
  };
</script>

<style scoped>
  .container {
    min-height: 80vh;
  }

  header {
    position: sticky;
    top: 0;
    z-index: 1030;
  }

  footer {
    bottom: 0;
    width: 100%;
    background-color: #f8f9fa; /* Bootstrap light background */
    padding: 1rem;
    border-top: 1px solid #ddd; /* Optional: add a border at the top */
  }
</style>
