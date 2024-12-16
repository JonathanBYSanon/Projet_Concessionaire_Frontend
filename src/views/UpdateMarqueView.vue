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
    <FormTemplate
        :title="isEditMode ? 'Modifier une marque' : 'Ajouter une marque'"
        :fields="fields"
        :initialData="marque"
        :buttonText="isEditMode ? 'Mettre à jour' : 'Créer'"
        :errors="errors"
        @submit="handleSubmit"/>
</template>

<script>
    import FormTemplate from '../components/FormTemplate.vue';
    import apiClient from '../services/api';
    import { toRaw } from 'vue';

    export default {
        components: { FormTemplate },
        data() {
            return {
                marque: {
                    nom: '',
                    pays: '',
                },
                fields: [
                    { name: 'nom', label: 'Nom', type: 'text', required: true },
                    { name: 'pays', label: 'Pays', type: 'text', required: true },
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
            async fetchMarque(id) {
                try {
                    const response = await apiClient.get(`/marque/${id}`);
                    this.marque = response.data.data;
                } catch (error) {
                    console.error('Erreur lors du chargement de la marque :', error);
                }
            },
            async handleSubmit(data) {
                let message = '';
                if (this.isSubmitting) {
                    return; // Prevent multiple submissions
                }

                this.isSubmitting = true;
                const simpleData = toRaw(data);
                try {
                    if (this.isEditMode) {
                        await apiClient.put(`/marque/${this.marque.id}`,{... simpleData});
                        message = 'La marque a été modifiée avec succès';
                    } else {
                        await apiClient.post('/marque', { ...simpleData });
                        message = 'La marque a été ajoutée avec succès';
                    }
                    this.$router.push({ name: 'manage-marque' });
                    alert(message);
                } catch (error) {
                    if (error.response.status === 400) {
                        this.errors = this.processValidationErrors(error.response.data.errors);
                    } else {
                        message = 'Une erreur est survenue lors de la soumission du formulaire';
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
            if (this.$route.params.id) {
                this.isEditMode = true;
                this.fetchMarque(this.$route.params.id);
            }
        },
    };
</script>