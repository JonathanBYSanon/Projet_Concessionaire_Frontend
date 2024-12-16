<!--
    {
        "id": 1,
        "nom": "Blanc",
        "code": "#0000000",
        "createdAt": "2024-11-28T04:38:21.000Z",
        "updatedAt": "2024-11-28T04:38:21.000Z"
    }
-->

<template>
    <DataTable
        title="Gestion des couleurs"
        :headers="['Nom', 'Code']"
        :fields="['nom', 'code']"
        :data="couleurs"
        :loading="loading"
        :showAddButton="true"
        @disableDelete="isDeleteDisabled"
        @add="goToAddCouleur"
        @edit="editCouleur"
        @delete="deleteCouleur"/>

</template>

<script>
    import DataTable from '../components/TableData.vue';
    import apiClient from '../services/api';

    export default {
        components: { DataTable },
        data() {
            return {
                couleurs: [],
                loading: true,
            };
        },
        methods: {
            async fetchCouleurs() {
                try {
                    const response = await apiClient.get('/couleur');
                    this.couleurs = response.data.data;
                } catch (error) {
                    console.error('Erreur lors du chargement des couleurs :', error);
                } finally {
                    this.loading = false;
                }
            },
            async editCouleur(couleur) {
                this.$router.push({ name: 'edit-couleur', params: { id: couleur.id } });
            },
            async deleteCouleur(id) {
                if (confirm('Êtes-vous sûr de vouloir supprimer cette couleur ?')) {
                    try {
                        await apiClient.delete(`/couleur/${id}`);
                        this.couleurs = this.couleurs.filter(couleur => couleur.id !== id);
                    } catch (error) {
                        console.error('Erreur lors de la suppression :', error);
                    }
                }
            },
            isDeleteDisabled(couleur) {
                return false;
            },
            goToAddCouleur() {
                this.$router.push({ name: 'add-couleur' });
            },
        },
        mounted() {
            this.fetchCouleurs();
        },
    }
</script>