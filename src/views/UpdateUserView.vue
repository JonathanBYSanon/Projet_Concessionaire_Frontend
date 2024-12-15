<template>
    <FormTemplate
      :title="isEditMode ? 'Modifier Utilisateur' : 'Ajouter Utilisateur'"
      :fields="fields"
      :initialData="user"
      :buttonText="isEditMode ? 'Mettre à Jour' : 'Créer'"
      :errors="errors"
      @submit="handleSubmit"
    />
  </template>
  
  <script>
  import FormTemplate from '../components/FormTemplate.vue';
  import apiClient from '../services/api';
  import { toRaw } from 'vue';
  
  export default {
    components: { FormTemplate },
    data() {
      return {
        user: {
          nom: '',
          prenom: '',
          email: '',
          naissance: '',
          RoleId: '',
          password: '', // Nécessaire pour l'ajout/modification
        },
        fields: [
          { name: 'nom', label: 'Nom', type: 'text', required: true },
          { name: 'prenom', label: 'Prénom', type: 'text', required: true },
          { name: 'email', label: 'Email', type: 'email', required: true },
          { name: 'naissance', label: 'Date de Naissance', type: 'date', required: true },
          {
            name: 'RoleId',
            label: 'Rôle',
            type: 'select',
            required: true,
            options: [], // Les options seront chargées dynamiquement
          },
          { name: 'password', label: 'Mot de passe', type: 'password', required: false },
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
      async fetchRoles() {
        try {
          const response = await apiClient.get('/role');
          this.fields.find(f => f.name === 'RoleId').options = response.data.data.map(role => ({
            value: role.id,
            text: role.titre,
          }));
        } catch (error) {
          console.error('Erreur lors du chargement des rôles :', error);
        }
      },
      async fetchUser(id) {
        try {
          const response = await apiClient.get(`/utilisateur/${id}`);
          this.user = { ...response.data.data, password: '' }; // Laisse le champ mot de passe vide
        } catch (error) {
          console.error('Erreur lors de la récupération de l\'utilisateur :', error);
        }
      },
      async handleSubmit(data) {
        if (this.isSubmitting) {
          return; // Empêche les soumissions multiples
        }
        this.isSubmitting = true; // Marque comme soumis
        const simpleData = toRaw(data);
        try {
          if (this.isEditMode) {
            if (!data.password) delete data.password; // Supprime le mot de passe s'il est vide
            await apiClient.put(`/utilisateur/${this.$route.params.id}`, { ...simpleData });
            alert('Utilisateur modifié avec succès.');
          } else {
            await apiClient.post('/utilisateur', { ...simpleData });
            alert('Utilisateur ajouté avec succès.');
          }
          this.$router.push('/admin/utilisateurs');
        } catch (error) {
            if (error.response && error.response.status === 400) {
              this.errors = this.processValidationErrors(error.response.data.errors);
            } else {
              this.errors.global = ['Une erreur inattendue est survenue. Veuillez réessayer.'];
            }
        } finally {
          this.isSubmitting = false; // Réinitialise la protection
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
      this.fetchRoles();
      if (this.$route.params.id) {
        this.isEditMode = true;
        this.fetchUser(this.$route.params.id);
      }
    },
  };
  </script>
  
  
  