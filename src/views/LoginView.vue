<!-- page de connexion email et password en utilisant bootstrap-->
<template>
  <div class="login-page d-flex justify-content-center align-items-center min-vh-100">
    <div class="card shadow p-4" style="width: 400px;">
      <h2 class="text-center mb-4">Login</h2>
      <form @submit.prevent="handleLogin">
        <!-- Email Input -->
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input
            type="email"
            id="email"
            class="form-control"
            v-model="email"
            placeholder="Enter your email"
            required
          />
        </div>

        <!-- Password Input -->
        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input
            type="password"
            id="password"
            class="form-control"
            v-model="password"
            placeholder="Enter your password"
            required
          />
        </div>

        <!-- Submit Button -->
        <button type="submit" class="btn btn-primary w-100">Login</button>
      </form>

      <!-- Error Message -->
      <p v-if="errorMessage" class="text-danger text-center mt-3">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script>
    import { useAuthStore } from '../stores/auth';
    import apiClient from '../services/api';

    export default {
        data() {
            return {
            email: '',
            password: '',
            errorMessage: '',
            };
        },
        methods: {
            async handleLogin() {
            try {
                const response = await apiClient.post('/login', {
                email: this.email,
                password: this.password,
                });

                const { token, role } = response.data;

                // Mettre à jour Pinia avec les informations d'authentification
                const authStore = useAuthStore();
                authStore.setAuth({ token, role });

                // Redirect to the home page
                this.$router.push('/home');
            } catch (error) {
                console.error(error);
                this.errorMessage =
                error.response?.data?.message || 'Invalid email or password. Please try again.';
            }
            },
        },
        mounted() {
          const authStore = useAuthStore();
          authStore.logout(); // Déconnexion via Pinia
        },
    };

</script>

<style scoped>
    .login-page {
    background-color: #f8f9fa; /* Light background for the page */
    }

    .card {
    border-radius: 10px; /* Smooth border for the card */
    }
</style>
