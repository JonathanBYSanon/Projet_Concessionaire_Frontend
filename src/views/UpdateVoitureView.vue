<template>
    <div class="container mt-5">
      <div class="row">
        <!-- Form Section -->
        <div class="col-md-8">
          <FormTemplate
            :title="'Modifier le Véhicule'"
            :fields="fields"
            :initialData="formData"
            :buttonText="'Mettre à jour'"
            :errors="errors"
            @submit="handleSubmit"
          />
        </div>
        
        <!-- Image Section -->
        <div class="col-md-4">
          <h5 class="text-center">Prévisualisation de l'image</h5>
          <div class="text-center">
            <img
              :src="imagePreview || defaultPreview"
              alt="Prévisualisation indisponible"
              style="max-width: 100%; max-height: 300px; border: 1px solid #ddd; border-radius: 5px;"
            />
          </div>
          <div class="mt-3">
            <label for="imageUrl" class="form-label">Modifier l'URL de l'image</label>
            <input
              v-model="imageUrl"
              id="imageUrl"
              type="text"
              class="form-control"
              placeholder="Entrez l'URL de l'image"
            />
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import FormTemplate from "../components/FormTemplate.vue";
  import apiClient from "../services/api";
  import { toRaw } from "vue";
  
  export default {
    components: { FormTemplate },
    data() {
      return {
        formData: {
          vin: "",
          kilometrage: "",
          etat: "",
          ImageId: null,
          CouleurId: null,
          ModeleId: null,
          options: [],
        },
        startingImageUrl: "", // Used to track if the image has changed
        imageUrl: "", // Separately tracks the image URL
        imagePreview: null, // Stores the preview URL
        defaultPreview: "https://via.placeholder.com/300x200?text=Prévisualisation+indisponible",
        fields: [
          { name: "vin", label: "VIN", type: "text", required: true },
          { name: "kilometrage", label: "Kilométrage", type: "number", required: true },
          { name: "etat", label: "État", type: "text", required: true },
          {
            name: "CouleurId",
            label: "Couleur",
            type: "select",
            required: true,
            options: [],
          },
          {
            name: "ModeleId",
            label: "Modèle",
            type: "select",
            required: true,
            options: [],
          },
          {
            name: "options",
            label: "Options",
            type: "checkbox-group",
            options: [],
          },
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
      async fetchVoiture(id) {
        try {
          const response = await apiClient.get(`/voiture/${id}`);
          const car = response.data.data;
  
          // Populate form data
          this.formData = {
            vin: car.vin,
            kilometrage: car.kilometrage,
            etat: car.etat,
            ImageId: car.ImageId,
            CouleurId: car.CouleurId,
            ModeleId: car.ModeleId,
            options: car.Options.map((option) => option.id),
          };
  
          // Set the image URL and preview
          this.startingImageUrl = car.Image.url;
          this.imageUrl = car.Image.url;
          this.imagePreview = car.Image.url;
  
          // Fetch options for selects
          await this.fetchSelectOptions();
        } catch (error) {
          console.error("Erreur lors du chargement de la voiture :", error);
        }
      },
      async fetchSelectOptions() {
        try {
            const couleurs = await apiClient.get("/couleur");
            const modeles = await apiClient.get("/modele");
            const options = await apiClient.get("/option");

            // Populate couleurs
            this.fields.find((field) => field.name === "CouleurId").options = couleurs.data.data.map((item) => ({
            value: item.id,
            text: item.nom,
            }));

            // Populate modèles with marque details
            this.fields.find((field) => field.name === "ModeleId").options = modeles.data.data.map((item) => ({
            value: item.id,
            text: `${item.nom} (${item.annee}) - ${item.Marque?.nom || "Marque inconnue"}`,
            }));

            // Populate options
            this.fields.find((field) => field.name === "options").options = options.data.data.map((item) => ({
            value: item.id,
            text: item.nom,
            }));
        } catch (error) {
            console.error("Erreur lors du chargement des options de sélection :", error);
        }
    },
      async handleSubmit(data) {
        if (this.isSubmitting) return; // Prevent multiple submissions
  
        this.isSubmitting = true;
        const simpleData = toRaw(data);
        try {
          // Handle image logic outside the template
          if (this.imageUrl !== this.startingImageUrl || !this.formData.ImageId) {
              // Delete the old image if it exists
              if (this.formData.ImageId) {
                await apiClient.delete(`/image/${this.formData.ImageId}`);
              }
    
              // Create the new image
              const newImage = await apiClient.post("/image", { url: this.imageUrl });
              simpleData.ImageId = newImage.data.data.id;
            } else {
              simpleData.ImageId = this.formData.ImageId;
            }
  
          // Submit updated voiture data
          if (this.isEditMode) {
            await apiClient.put(`/voiture/${this.$route.params.id}`, simpleData);
            alert("La voiture a été modifiée avec succès !");
          } else {
            console.log(simpleData);
            await apiClient.post("/voiture", simpleData);
            alert("La voiture a été ajoutée avec succès !");
          }
  
          this.$router.push({ name: "home" });
        } catch (error) {
          if (error.response?.status === 400) {
            this.errors = this.processValidationErrors(error.response.data.errors);
          } else {
            this.errors.global.push("Une erreur est survenue lors de la soumission du formulaire.");
          }
        } finally {
          this.isSubmitting = false;
        }
      },
      processValidationErrors(apiErrors) {
        const structuredErrors = { global: [], fieldErrors: {} };
  
        apiErrors.forEach((err) => {
          if (err.param) {
            structuredErrors.fieldErrors[err.param] = err.msg;
          } else {
            structuredErrors.global.push(err.msg);
          }
        });
  
        return structuredErrors;
      },
    },
    watch: {
      imageUrl(newUrl) {
        this.imagePreview = newUrl || this.defaultPreview; // Dynamically update the image preview
      },
    },
    mounted() {
      if (this.$route.params.id) {
        this.isEditMode = true;
        this.fetchVoiture(this.$route.params.id);
      } else {
        this.fetchSelectOptions();
      }
    },
  };
  </script>
  
  
  