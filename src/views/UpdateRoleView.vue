<template>
    <FormTemplate
        :title="isEditMode ? 'Modifier un rôle' : 'Ajouter un rôle'"
        :fields="fields"
        :initialData="role"
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
        const simpleData = toRaw(data);
        console.log(simpleData);
      try {
        if (this.isEditMode) {
          await apiClient.put(`/role/${this.role.id}`, {...simpleData});
        } else {
          await apiClient.post('/role', {...simpleData});
        }
        this.$router.push({ name: 'manage-roles' });
      } catch (error) {
        console.error('Erreur lors de la soumission du formulaire :', error);
      }
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