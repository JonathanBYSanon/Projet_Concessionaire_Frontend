<template>
    <div class="container mt-5">
      <h2 class="text-center">{{ title }}</h2>
      <form @submit.prevent="$emit('submit', formData)">
        <div v-for="(field, index) in fields" :key="index" class="mb-3">
          <label :for="field.name" class="form-label">{{ field.label }}</label>
  
          <!-- Champs Texte / Email / Password -->
          <input
            v-if="field.type !== 'select'"
            :type="field.type"
            v-model="formData[field.name]"
            class="form-control"
            :id="field.name"
            :required="field.required"
            :placeholder="field.placeholder || ''"
          />
  
          <!-- Champ Sélecteur -->
          <select
            v-else
            v-model="formData[field.name]"
            class="form-select"
            :id="field.name"
            :required="field.required"
          >
            <option v-for="option in field.options" :key="option.value" :value="option.value">
              {{ option.text }}
            </option>
          </select>
        </div>
        <button type="submit" class="btn btn-primary w-100">{{ buttonText }}</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      title: {
        type: String,
        required: true,
      },
      fields: {
        type: Array,
        required: true, // Structure : [{ name, label, type, required, options }]
      },
      initialData: {
        type: Object,
        required: true, // Données initiales pour le formulaire
      },
      buttonText: {
        type: String,
        default: 'Soumettre',
      },
    },
    data() {
      return {
        formData: { ...this.initialData }, // Copie des données initiales
      };
    },
    watch: {
        initialData: {
        immediate: true,
        deep: true, // Permet de détecter les changements dans des objets imbriqués
        handler(newValue) {
            this.formData = { ...newValue }; // Met à jour `formData` lorsque `initialData` change
        },
        },
    },
  };
  </script>
  