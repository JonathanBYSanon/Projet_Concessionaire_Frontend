<!--
{
    "nom":"bullshit2",
    "annee":1999,
    "MarqueId":1
}
-->

<template>
    <FormTemplate
        :title="isEditMode ? 'Modifier un modele' : 'Ajouter un modele'"
        :fields="fields"
        :initialData="modele"
        :buttonText="isEditMode ? 'Mettre à jour' : 'Créer'"
        :errors="errors"
        @submit="handleSubmit"
    />

</template>

<script>
    import apiClient from '../services/api';
    import FormTemplate from '../components/FormTemplate.vue';
    import { toRaw } from 'vue';

    export default {
        components: { FormTemplate },
        data() {
            return {
                modele: {
                    nom: '',
                    annee: '',
                    MarqueId: '',
                },
                fields: [
                    { name: 'nom', label: 'Nom', type: 'text', required: true },
                    { name: 'annee', label: 'Année', type: 'number', required: true },
                    { name: 'MarqueId', label: 'Marque', type: 'select', required: true, options: [] },
                    
                ],
                isEditMode: false,
                isSubmitting: false,
                errors: {
                    global: [],
                    fieldErrors: {},
                },
            };
        },
        methods: {
            async fetchMarques() {
                try {
                    const response = await apiClient.get('/marque');
                    this.fields.find(f => f.name === 'MarqueId').options = response.data.data.map(marque => ({
                        value: marque.id,
                        text: marque.nom,
                    }));
                } catch (error) {
                    console.error('Erreur lors du chargement des marques :', error);
                }
            },
            async fetchModele(id) {
                try {
                    const response = await apiClient.get(`/modele/${id}`);
                    this.modele = response.data.data;
                } catch (error) {
                    console.error('Erreur lors de la récupération du modele :', error);
                }
            },
            async handleSubmit(data) {
                let message = '';
                if (this.isSubmitting) {
                    return; // Prevent multiple submissions
                }

                this.isSubmitting = true; // Mark as submitting

                const simpleData = toRaw(data);
                try {
                    if (this.isEditMode) {
                        await apiClient.put(`/modele/${this.modele.id}`, { ...simpleData });
                        message = 'Modele modifié avec succès.';
                    } else {
                        await apiClient.post('/modele', { ...simpleData });
                        message = 'Modele ajouté avec succès.';
                    }
                    this.$router.push({ name: 'manage-modele' });
                    alert(message);
                } catch (error) {
                    if (error.response.status === 400) {
                        this.errors = this.processValidationErrors(error.response.data);
                    } else {
                        this.errors.global = ['Une erreur est survenue. Veuillez réessayer.'];
                    }
                } finally {
                    this.isSubmitting = false;
                }
            },
            processValidationErrors(apiErrors) {
                const structuredErrors = { global: [], fieldErrors: {} };

                apiErrors.forEach((err) => {
                    if (err.param) {
                    // Erreur pour un champ spécifique
                    structuredErrors.fieldErrors[err.param] = err.msg;
                    } else {
                    // Erreur globale
                    structuredErrors.global.push(err.msg);
                    }
                });
                return structuredErrors;
            },
        },
        mounted() {
            this.fetchMarques();
            if (this.$route.params.id) {
                this.isEditMode = true;
                this.fetchModele(this.$route.params.id);
            }
        },
    };

    
</script>