<template>
  <div class="justify-content-center align-items-center min-vh-100">
    <div id="car-carousel" class="container mt-5">
      <!-- Header Section -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Nos Voitures</h2>
        <button class="btn btn-primary" @click="addCar">Ajouter une Voiture</button>
      </div>

      <!-- Filtering Bar -->
      <div class="filter-bar mb-4">
        <div class="row">
          <div class="col-md-4">
            <select class="form-select" v-model="filters.MarqueId" @change="applyFilters">
              <option value="">Toutes les Marques</option>
              <option v-for="marque in marques" :key="marque.id" :value="marque.id">
                {{ marque.nom }}
              </option>
            </select>
          </div>
          <div class="col-md-4">
            <select class="form-select" v-model="filters.ModeleId" @change="applyFilters">
              <option value="">Tous les Modèles</option>
              <option v-for="modele in filteredModeles" :key="modele.id" :value="modele.id">
                {{ modele.nom }} ({{ modele.annee }})
              </option>
            </select>
          </div>
          <div class="col-md-4">
            <input
              type="text"
              class="form-control"
              placeholder="Rechercher par VIN"
              v-model="filters.vin"
              @input="applyFilters"
            />
          </div>
        </div>
      </div>

      <!-- Carousel Section -->
      <div v-if="loading" class="text-center">
        <p>Chargement des voitures...</p>
      </div>
      <div v-else-if="filteredCars.length === 0" class="text-center">
        <p>Aucune voiture correspondante.</p>
      </div>
      <div id="carouselExample" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-inner">
          <div
            v-for="(car, index) in filteredCars"
            :key="car.id"
            class="carousel-item"
            :class="{ active: index === 0 }"
          >
            <div class="card mx-auto" style="width: 80%; max-width: 600px;">
              <img :src="car.Image.url" class="card-img-top" :alt="`Image de ${car.Modele.nom}`" />
              <div class="card-body">
                <h5 class="card-title">{{ car.Modele.Marque.nom }} - {{ car.Modele.nom }}</h5>
                <div class="card-text">
                  <input
                    type="color"
                    :value="car.Couleur.code"
                    disabled
                    style="border: none; cursor: default;"
                  />
                  <br />
                  <strong>Pays d'origine:</strong> {{ car.Modele.Marque.pays }}<br />
                  <strong>Année:</strong> {{ car.Modele.annee }}<br />
                  <strong>État:</strong> {{ car.etat }}<br />
                  <strong>Kilométrage:</strong> {{ car.kilometrage }} km<br />
                  <strong>Options:</strong>
                  <ul>
                    <li v-for="(option, index) in car.Options" :key="index">{{ option.nom }}</li>
                  </ul>

                  <div class="card-buttons mt-3">
                    <button class="btn btn-warning btn-sm" @click="editCar(car)">Modifier</button>
                    <button class="btn btn-danger btn-sm" @click="deleteCar(car)">Supprimer</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Carousel Controls -->
        <button
          class="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExample"
          data-bs-slide="prev"
        >
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button
          class="carousel-control-next"
          type="button"
          data-bs-target="#carouselExample"
          data-bs-slide="next"
        >
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import apiClient from "../services/api";

export default {
  data() {
    return {
      cars: [], // All cars
      filteredCars: [], // Cars after applying filters
      marques: [], // List of marques
      modeles: [], // List of modeles
      loading: true, // Loading state
      filters: {
        MarqueId: "",
        ModeleId: "",
        vin: "",
      },
    };
  },
  methods: {
    async fetchCars() {
      try {
        const response = await apiClient.get("/voiture");
        this.cars = response.data.data;
        this.filteredCars = [...this.cars]; // Initialize filtered cars with all cars
      } catch (error) {
        console.error("Erreur lors du chargement des voitures :", error);
      } finally {
        this.loading = false;
      }
    },
    async fetchFilters() {
      try {
        const marquesResponse = await apiClient.get("/marque");
        this.marques = marquesResponse.data.data;

        const modelesResponse = await apiClient.get("/modele");
        this.modeles = modelesResponse.data.data;
      } catch (error) {
        console.error("Erreur lors du chargement des filtres :", error);
      }
    },
    applyFilters() {
      // Start with all cars
      let result = [...this.cars];

      // Filter by MarqueId if provided
      if (this.filters.MarqueId !== "") {
        result = result.filter((car) => car.Modele.Marque?.id === parseInt(this.filters.MarqueId));
      }

      // Filter by ModeleId if provided
      if (this.filters.ModeleId !== "") {
        result = result.filter((car) => car.ModeleId === parseInt(this.filters.ModeleId));
      }

      // Filter by VIN if provided
      if (this.filters.vin !== "") {
        result = result.filter((car) =>
          car.vin.toLowerCase().includes(this.filters.vin.toLowerCase())
        );
      }

      // Update the filteredCars list
      this.filteredCars = result;
    },
    addCar() {
      this.$router.push({ name: "add-voiture" });
    },
    editCar(car) {
      this.$router.push({ name: "edit-voiture", params: { id: car.id } });
    },
    async deleteCar(car) {
      if (!confirm("Êtes-vous sûr de vouloir supprimer ce véhicule ?")) return;

      try {
        await apiClient.delete(`/voiture/${car.id}`);
        this.cars = this.cars.filter((c) => c.id !== car.id);
        this.applyFilters(); // Reapply filters after deletion
      } catch (error) {
        console.error("Erreur lors de la suppression :", error);
      }
    },
  },
  computed: {
    filteredModeles() {
      // Dynamically filter modeles based on selected MarqueId
      if (!this.filters.MarqueId) return this.modeles;
      return this.modeles.filter(
        (modele) => modele.MarqueId === parseInt(this.filters.MarqueId)
      );
    },
  },
  watch: {
    filters: {
      handler: "applyFilters", // Reapply filters when any filter value changes
      deep: true, // Watch nested filter properties
      immediate: true, // Apply filters immediately on load
    },
  },
  mounted() {
    this.fetchCars();
    this.fetchFilters();
  },
};
</script>



<style>
  .carousel-item img {
    max-height: 400px;
    object-fit: cover;
  }

  .card {
    border-radius: 10px; /* Smooth card borders */
  }

  input[type="color"] {
    width: 40px;
    height: 40px;
    padding: 0;
    border-radius: 5px;
  }

  .carousel-control-prev-icon,
  .carousel-control-next-icon {
    background-color: lightgray;
  }

  .card-buttons button {
    margin: 0 5px;
  }
</style>


