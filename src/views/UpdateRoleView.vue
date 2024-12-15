<template>
    <FormTemplate
        :title="isEditMode ? 'Modifier un rôle' : 'Ajouter un rôle'"
        :fields="fields"
        :initialData="role"
        :buttonText="isEditMode ? 'Mettre à jour' : 'Créer'"
        :errors="errors"
        @submit="handleSubmit"
    />
</template>

<script>
import FormTemplate from '../components/FormTemplate.vue';
import apiClient from '../services/api';
import {toRaw} from 'vue';

export default {
  components: { FormTemplate },
  data() {
    return {
      role: {
        titre: '',
      },
      fields: [
        { name: 'titre', label: 'Titre', type: 'text', required: true },
      ],
      isEditMode: false,
      isSubmiting: false,
      errors: {
          global: [],
          fieldErrors: {},
      },
    };
  },
  methods: {
    async fetchRole(id) {
      try {
        const response = await apiClient.get(`/role/${id}`);
        this.role = response.data.data;
      } catch (error) {
        console.error('Erreur lors de la récupération du rôle :', error);
      }
    },
    async handleSubmit(data) {

      if (this.isSubmitting) {
        return; // Prevent multiple submissions
      }

      this.isSubmitting = true; // Mark as submitting

        const simpleData = toRaw(data);
      try {
        if (this.isEditMode) {
          await apiClient.put(`/role/${this.role.id}`, {...simpleData});
          alert('Role modifié avec succès.');
        } else {
          await apiClient.post('/role', {...simpleData});
          alert('Role ajouté avec succès.');
        }
        this.$router.push({ name: 'manage-roles' });
      } catch (error) {
        if (error.response && error.response.status === 400) {
            this.errors = this.processValidationErrors(error.response.data.errors);
        } else {
            this.errors.global = ['Une erreur inattendue est survenue. Veuillez réessayer.'];
        }
      }finally {
        this.isSubmitting = false; // Reset the guard
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
      this.fetchRole(this.$route.params.id);
    }
  },
};

</script>