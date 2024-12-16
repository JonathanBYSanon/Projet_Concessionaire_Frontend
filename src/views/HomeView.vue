<template>
  <div class="justify-content-center align-items-center min-vh-100">
  <div id="car-carousel" class="container mt-5">
    <h2 class="text-center mb-4">Nos Voitures</h2>
    <button class="btn btn-primary" @click="addCar">Ajouter une Voiture</button>
    <div v-if="loading" class="text-center">
      <p>Chargement des voitures...</p>
    </div>
    <div v-else-if="cars.length === 0" class="text-center">
      <p>Aucune voiture disponible.</p>
    </div>
    <div id="carouselExample" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-inner">
        <div
          v-for="(car, index) in cars"
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

                <div class="card-buttons">
                  <button class="btn btn-warning btn-sm" @click="editCar(car)">Modifier</button>
                  <button class="btn btn-danger btn-sm" @click="deleteCar(car.id)">Supprimer</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Carrousel Controls -->
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
  import apiClient from '../services/api';

  export default {
    data() {
      return {
        cars: [],
        loading: true, // Indique si les données sont en cours de chargement
      };
    },
    methods: {
      async fetchCars() {
        try {
          const response = await apiClient.get('/voiture'); // Remplace '/voiture' par ton endpoint exact
          this.cars = response.data.data; // Assure-toi que 'data' correspond bien à la réponse API
        } catch (error) {
          console.error('Erreur lors du chargement des voitures:', error);
        } finally {
          this.loading = false;
        }
      },
      addCar() {
        // Redirect to the car creation page
        this.$router.push({ name: "add-voiture" });
      },
      editCar(car) {
        // Navigate to the edit page
        this.$router.push({ name: "edit-voiture", params: { id: car.id } });
      },
      async deleteCar(car) {
        if (!confirm("Êtes-vous sûr de vouloir supprimer ce véhicule ?")) return;

        try {
          // Step 1: Delete the associated image
          if (car.ImageId) {
            await apiClient.delete(`/image/${car.ImageId}`);
          }

          // Step 2: Delete the voiture
          await apiClient.delete(`/voiture/${car.id}`);

          // Step 3: Update the local cars list
          this.cars = this.cars.filter((c) => c.id !== car.id);
          alert("Véhicule et image supprimés avec succès !");
        } catch (error) {
          console.error("Erreur lors de la suppression :", error);
          alert("Une erreur est survenue lors de la suppression !");
        }
      },

    },
    mounted() {
      this.fetchCars();
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


