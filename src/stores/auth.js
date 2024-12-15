import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    role: null,
  }),
  getters: {
    isAdmin(state) {
      return state.role === 'Admin'; // Vérifie si le rôle est "Admin"
    },
  },
  actions: {
    setAuth({ token, role }) {
      this.token = token;
      this.role = role;

      // Stocker dans localStorage pour persistance
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
    },
    logout() {
      this.token = null;
      this.role = null;

      // Nettoyer localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('role');
    },
    loadFromLocalStorage() {
      // Charger les données depuis localStorage
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');

      // Si les données existent, les injecter dans le store
      if (token && role) {
        this.token = token;
        this.role = role;
      }
    },
  },
});
