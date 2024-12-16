<template>
    <div class="container mt-5">
      <h2 class="text-center">{{ title }}</h2>

      <!-- Messages d'erreurs globaux -->
      <div v-if="errors.global && errors.global.length" class="alert alert-danger">
        <ul>
          <li v-for="(error, index) in errors.global" :key="index">{{ error }}</li>
        </ul>
      </div>
      <form @submit.prevent="handleSubmit">
        <div v-for="(field, index) in fields" :key="index" class="mb-3">
          <label :for="field.name" class="form-label">{{ field.label }}</label>
  
          <!-- Champs Texte / Email / Password -->
          <input
            v-if="field.type !== 'select' && field.type !== 'checkbox-group'"
            :type="field.type"
            v-model="formData[field.name]"
            class="form-control"
            :id="field.name"
            :required="field.required"
            :placeholder="field.placeholder || ''"
          />

          <!-- Checkbox Group -->
          <div v-else-if="field.type === 'checkbox-group'" class="checkbox-group">
            <div
              v-for="option in field.options"
              :key="option.value"
              class="form-check form-check-inline"
            >
              <input
                class="form-check-input"
                type="checkbox"
                :id="`${field.name}-${option.value}`"
                :value="option.value"
                v-model="formData[field.name]"
              />
              <label class="form-check-label" :for="`${field.name}-${option.value}`">
                {{ option.text }}
              </label>
            </div>
          </div>
  
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

          

          <!-- Message d'erreur spécifique au champ -->
          <div v-if="errors.fieldErrors[field.name]" class="text-danger mt-1">
            {{ errors.fieldErrors[field.name] }}
          </div>
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
      errors: {
        type: Object,
        default: () => ({ global: [], fieldErrors: {} }),
      },
    },
    methods: {
      handleSubmit() {
        this.$emit('submit', this.formData); // Émet un événement avec les données du formulaire
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
  