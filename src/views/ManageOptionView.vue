<!--
 {
            "id": 1,
            "nom": "Climatisation",
            "description": "Climatisation",
            "createdAt": "2024-11-28T04:35:14.000Z",
            "updatedAt": "2024-11-28T04:35:14.000Z"
        }
-->

<template>
    <DataTable
        title="Gestion des options"
        :headers="['Nom', 'Description']"
        :fields="['nom', 'description']"
        :data="options"
        :loading="loading"
        :showAddButton="true"
        @disableDelete="isDeleteDisabled"
        @add="goToAddOption"
        @edit="editOption"
        @delete="deleteOption"/>
</template>

<script>
    import DataTable from '../components/TableData.vue';
    import apiClient from '../services/api';
    
    export default {
        components: { DataTable },
        data() {
            return {
                options: [],
                loading: true,
            };
        },
        methods: {
            async fetchOptions() {
                try {
                    const response = await apiClient.get('/option');
                    this.options = response.data.data;
                } catch (error) {
                    console.error('Erreur lors du chargement des options :', error);
                } finally {
                    this.loading = false;
                }
            },
            async editOption(option) {
                this.$router.push({ name: 'edit-option', params: { id: option.id } });
            },
            async deleteOption(id) {
                if (confirm('Êtes-vous sûr de vouloir supprimer cette option ?')) {
                    try {
                        await apiClient.delete(`/option/${id}`);
                        this.options = this.options.filter(option => option.id !== id);
                    } catch (error) {
                        console.error('Erreur lors de la suppression :', error);
                    }
                }
            },
            async isDeleteDisabled(option) {
                return false;
            },
            goToAddOption() {
                this.$router.push({ name: 'add-option' });
            },
        },
        mounted() {
            this.fetchOptions();
        },
    };
</script>