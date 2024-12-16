<!--
{
    "id": 1,
    "nom": "bullshit",
    "annee": 1999,
    "createdAt": "2024-11-28T04:49:27.000Z",
    "updatedAt": "2024-11-28T04:49:27.000Z",
    "MarqueId": 1
}
-->

<template>
    <DataTable
        title="Gestion des modeles"
        :headers="['Nom', 'Année', 'Marque']"
        :fields="['nom', 'annee', 'MarqueId']"
        :data="modeles"
        :loading="loading"
        :disableDelete="isDeleteDisabled"
        :showAddButton="true"
        @add="goToAddModele"
        @edit="editModele"
        @delete="deleteModele"/>
</template>

<script>
    import DataTable from '../components/TableData.vue';
    import apiClient from '../services/api';

    export default {
        components: { DataTable },
        data() {
            return {
                modeles: [],
                loading: true,
            };
        },
        methods: {
            async fetchModeles() {
                try {
                    const response = await apiClient.get('/modele');
                    this.modeles = response.data.data;
                } catch (error) {
                    console.error('Erreur lors du chargement des modeles :', error);
                } finally {
                    this.loading = false;
                }
            },
            async editModele(modele) {
                this.$router.push({ name: 'edit-modele', params: { id: modele.id } });
            },
            async deleteModele(id) {
                if (confirm('Êtes-vous sûr de vouloir supprimer ce modele ?')) {
                    try {
                        await apiClient.delete(`/modele/${id}`);
                        this.modeles = this.modeles.filter(modele => modele.id !== id);
                    } catch (error) {
                        console.error('Erreur lors de la suppression :', error);
                    }
                }
            },
            isDeleteDisabled(modele) {
                return false; 
            },
            goToAddModele() {
                this.$router.push({ name: 'add-modele' }); // Redirige vers la page d'ajout
            },
        },
        mounted() {
            this.fetchModeles();
        },
    };
</script>