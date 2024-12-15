<template>
    <DataTable
        title="Gestion des rôles"
        :headers="['Titre']"
        :fields="['titre']"
        :data="roles"
        :loading="loading"
        :disableDelete="isDeleteDisabled"
        :showAddButton="true"
        @add="goToAddRole"
        @edit="editRole"
        @delete="deleteRole"
    />
</template>
<script>
    import DataTable from '../components/TableData.vue';
    import apiClient from '../services/api';

    export default {
        components: { DataTable },
        data() {
            return {
                roles: [],
                loading: true,
            };
        },
        methods: {
            async fetchRoles() {
                try {
                    const response = await apiClient.get('/role');
                    this.roles = response.data.data;
                } catch (error) {
                    console.error('Erreur lors du chargement des rôles :', error);
                } finally {
                    this.loading = false;
                }
            },
            async editRole(role) {
                this.$router.push({ name: 'edit-role', params: { id: role.id } });
            },
            async deleteRole(id) {
                if (confirm('Êtes-vous sûr de vouloir supprimer ce rôle ?')) {
                    try {
                        await apiClient.delete(`/role/${id}`);
                        this.roles = this.roles.filter(role => role.id !== id);
                    } catch (error) {
                        console.error('Erreur lors de la suppression :', error);
                    }
                }
            },
            isDeleteDisabled(role) {
                return role.titre === 'Admin'; // Empêche la suppression du rôle Admin
            },
            goToAddRole() {
                this.$router.push({ name: 'add-role' }); // Redirige vers la page d'ajout
            },
        },
        mounted() {
            this.fetchRoles();
        },
    };
</script>