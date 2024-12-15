<template>
    <div class="container mt-5">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>{{ title }}</h2>
        <!-- Bouton "Nouveau" -->
        <button
          v-if="showAddButton"
          class="btn btn-primary"
          @click="$emit('add')"
        >
          Nouveau
        </button>
      </div>
      <div v-if="loading" class="text-center">Chargement...</div>
      <div v-else>
        <table class="table table-striped">
          <thead>
            <tr>
              <th v-for="(header, index) in headers" :key="index">{{ header }}</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in data" :key="item.id">
              <td v-for="field in fields" :key="field">{{ item[field] }}</td>
              <td>
                <button
                  class="btn btn-warning btn-sm"
                  @click="$emit('edit', item)"
                >
                  Modifier
                </button>
                <button
                  v-if="showDelete"
                  class="btn btn-danger btn-sm"
                  @click="$emit('delete', item.id)"
                  :disabled="disableDelete(item)"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      title: {
        type: String,
        required: true,
      },
      headers: {
        type: Array,
        required: true,
      },
      fields: {
        type: Array,
        required: true,
      },
      data: {
        type: Array,
        required: true,
      },
      loading: {
        type: Boolean,
        default: false,
      },
      showDelete: {
        type: Boolean,
        default: true,
      },
      disableDelete: {
        type: Function,
        default: () => false, // Par défaut, la suppression est activée
      },
      showAddButton: {
        type: Boolean,
        default: false, // Affiche ou masque le bouton "Nouveau"
      },
    },
  };
  </script>
  
  