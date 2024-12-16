<!--
    {
            "id": 1,
            "nom": "Bamboclat",
            "pays": "Jamaica",
            "createdAt": "2024-11-28T04:39:49.000Z",
            "updatedAt": "2024-11-28T04:39:49.000Z"
        }
-->

<template>
    <DataTable
        title="Gestion des marques"
        :headers="['Nom', 'Pays']"
        :fields="['nom', 'pays']"
        :data="marques"
        :loading="loading"
        :disableDelete="isDeleteDisabled"
        :showAddButton="true"
        @add="goToAddMarque"
        @edit="editMarque"
        @delete="deleteMarque"/>

</template>

<script>
    import DataTable from '../components/TableData.vue';
    import apiClient from '../services/api';

    export default {
        components: { DataTable },
        data() {
            return {
                marques: [],
                loading: true,
            };
        },
        methods: {
            async fetchMarques() {
                try {
                    const response = await apiClient.get('/marque');
                    this.marques = response.data.data;
                } catch (error) {
                    console.error('Erreur lors du chargement des marques :', error);
                } finally {
                    this.loading = false;
                }
            },
            async editMarque(marque) {
                this.$router.push({ name: 'edit-marque', params: { id: marque.id } });
            },
            async deleteMarque(id) {
                if (confirm('Êtes-vous sûr de vouloir supprimer cette marque ?')) {
                    try {
                        await apiClient.delete(`/marque/${id}`);
                        this.marques = this.marques.filter(marque => marque.id !== id);
                    } catch (error) {
                        console.error('Erreur lors de la suppression :', error);
                    }
                }
            },
            isDeleteDisabled(marque) {
                return false;
            },
            goToAddMarque() {
                this.$router.push({ name: 'add-marque' });
            },
        },
        mounted() {
            this.fetchMarques();
        },
    };
</script>