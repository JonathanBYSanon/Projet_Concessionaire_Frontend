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
              <RouterLink to="/home" class="nav-link">Acceuil</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/" class="nav-link">Deconnexion</RouterLink>
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

<style scoped>
  header {
    position: sticky;
    top: 0;
    z-index: 1030;
  }

  footer {
    position: sticky;
    bottom: 0;
    width: 100%;
    background-color: #f8f9fa; /* Bootstrap light background */
    padding: 1rem;
    border-top: 1px solid #ddd; /* Optional: add a border at the top */
  }
</style>
