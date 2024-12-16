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
    <FormTemplate
        :title="isEditMode ? 'Modifier une option' : 'Ajouter une option'"
        :fields="fields"
        :initialData="option"
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
                option: {
                    nom: '',
                    description: '',
                },
                fields: [
                    { name: 'nom', label: 'Nom', type: 'text', required: true },
                    { name: 'description', label: 'Description', type: 'text', required: true },
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
            async fetchOption(id) {
                try {
                    const response = await apiClient.get(`/option/${id}`);
                    this.option = response.data.data;
                } catch (error) {
                    console.error('Erreur lors du chargement de l\'option :', error);
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
                        await apiClient.put(`/option/${this.$route.params.id}`,{...simpleData});
                        message = 'L\'option a bien été modifiée.';
                    } else {
                        await apiClient.post('/option', { ...simpleData });
                        message = 'L\'option a bien été ajoutée.';
                    }
                    this.$router.push({ name: 'manage-option' });
                    alert(message);
                } catch (error) {
                    if (error.response.status === 400) {
                        this.errors = this.processValidationErrors(error.response.data.errors);
                    } else {
                        this.errors.global.push('Une erreur est survenue lors de la sauvegarde de l\'option.');
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
                this.fetchOption(this.$route.params.id);
            }
        },
    }
</script>