<template>
    
      <DataTable
        title="Gérer les Utilisateurs"
        :headers="['Nom', 'Prénom', 'Email', 'Date de Naissance', 'Rôle (ID)']"
        :fields="['nom', 'prenom', 'email', 'naissance', 'RoleId']"
        :data="users"
        :loading="loading"
        :disableDelete="isDeleteDisabled"
        :showAddButton="true"
        @add="goToAddUser"
        @edit="editUser"
        @delete="deleteUser"
      />

  </template>
  
  <script>
  import DataTable from '../components/TableData.vue';
  import apiClient from '../services/api';
  
  export default {
    components: { DataTable },
    data() {
      return {
        users: [],
        loading: true,
      };
    },
    methods: {
      async fetchUsers() {
        try {
          const response = await apiClient.get('/utilisateur');
          this.users = response.data.data;
        } catch (error) {
          console.error('Erreur lors du chargement des utilisateurs :', error);
        } finally {
          this.loading = false;
        }
      },
      editUser(user) {
        this.$router.push({ name: 'edit-user', params: { id: user.id } });
      },
      async deleteUser(id) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
          try {
            await apiClient.delete(`/utilisateur/${id}`);
            this.users = this.users.filter(user => user.id !== id);
          } catch (error) {
            console.error('Erreur lors de la suppression :', error);
          }
        }
      },
      isDeleteDisabled(user) {
        return user.RoleId === 1; // Empêche la suppression des utilisateurs Admin
      },
      goToAddUser() {
        this.$router.push({ name: 'add-user' }); // Redirige vers la page d'ajout
      },
    },
    mounted() {
      this.fetchUsers();
    },
  };
  </script>
  
  