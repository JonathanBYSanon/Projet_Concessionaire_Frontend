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
    <FormTemplate
        :title="isEditMode ? 'Modifier une couleur' : 'Ajouter une couleur'"
        :fields="fields"
        :initialData="couleur"
        :buttonText="isEditMode ? 'Mettre à jour' : 'Créer'"
        :errors="errors"
        @submit="handleSubmit"/>

</template>

<script>
    import FormTemplate from '../components/FormTemplate.vue';
    import apiClient from '../services/api';
    import {toRaw} from 'vue';

    export default {
        components: {FormTemplate},
        data() {
            return {
                couleur: {
                    nom: '',
                    code: '',
                },
                fields: [
                    {name: 'nom', label: 'Nom', type: 'text', required: true},
                    {name: 'code', label: 'Code', type: 'color', required: true},
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
            async fetchCouleur(id) {
                try {
                    const response = await apiClient.get(`/couleur/${id}`);
                    this.couleur = response.data.data;
                } catch (error) {
                    console.error('Erreur lors du chargement de la couleur :', error);
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
                        await apiClient.put(`/couleur/${this.$route.params.id}`, simpleData);
                        message = 'La couleur a été mise à jour avec succès.';
                    } else {
                        await apiClient.post('/couleur', simpleData);
                        message = 'La couleur a été créée avec succès.';
                    }
                    this.$router.push({name: 'manage-couleur'});
                    alert(message);
                } catch (error) {
                    if (error.response && error.response.status === 400) {
                        this.errors = this.processValidationErrors(error.response.data.errors);
                    } else {
                        this.errors.global.push('Une erreur s\'est produite lors de la soumission du formulaire.');
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
                this.fetchCouleur(this.$route.params.id);
            }
        },
    }
</script>