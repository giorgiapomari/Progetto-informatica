<script setup>
import { ref, onMounted } from 'vue';
import db from '@/firestore';
import { API_KEY, API_BASE_URL } from '@/config';
import axios from 'axios';

const nomeUtente = ref("");
const ricetteRandom = ref([]);
const caricamento = ref(true);

// La tua API Key recuperata dagli altri file del progetto
const apiKey = API_KEY; 
const apiBaseUrl = API_BASE_URL;

async function caricaRicetteCasuali(forzaAggiornamento = false) {
    // Se non forziamo l'aggiornamento, prova a recuperare le ricette dalla sessione
    if (!forzaAggiornamento) {
        const salvate = localStorage.getItem("ricetteEvidenza");
        if (salvate) {
            ricetteRandom.value = JSON.parse(salvate);
            caricamento.value = false;
            return;
        }
    }

    caricamento.value = true;
    try {
        const url = `${apiBaseUrl}/recipes/random?number=3&apiKey=${apiKey}`;
        const response = await axios.get(url);
        ricetteRandom.value = response.data.recipes;
        
        // Salva le nuove ricette nella sessione del browser
        localStorage.setItem("ricetteEvidenza", JSON.stringify(ricetteRandom.value));
    } catch (error) {
        console.error("Error loading the recipes", error);
    } finally {
        caricamento.value = false;
    }
}

onMounted(() => {
    // Recupera il nome dell'utente loggato
    nomeUtente.value = db.getUser() || "Guest";
    caricaRicetteCasuali();
});
</script>

<template>
  <v-container class="py-8">
    <v-row justify="center" class="text-center mb-10">
      <v-col cols="12" md="8">
        <h1 class="text-h2 font-weight-bold primary--text mb-2" style= "font-family: Arial Rounded MT" >
          Welcome, {{ nomeUtente }}!
        </h1>
        <h2 class="text-h5 text-grey-darken-1 font mb-6"style="font-family: Arial Rounded MT;">
          Explore a different culture of flavors every day with SpoonApp!
        </h2>
        <p class="text-body-1 text-grey-darken-2">
          Welcome to <strong>SpoonApp</strong>, the ultimate cooking companion. 
          Here you can explore flavors from every corner of the world, save your favorite dishes 
          and get inspired for your next special dinner.
        </p>
      </v-col>
    </v-row>

    <v-divider class="my-10"></v-divider>

    <v-row>
      <v-col cols="12" class="d-flex align-center justify-space-between">
        <div class="d-flex align-center">
          <v-icon color="orange-darken-2" size="32" class="me-2">mdi-star</v-icon>
          <h2 class="text-h4 font-weight-black" style="font-family: Arial Rounded MT">Featured recipes</h2>
        </div>
        <v-btn class="mb-4" color="primary" variant="outlined" prepend-icon="mdi-refresh" @click="caricaRicetteCasuali(true)">
          New recipes
        </v-btn>
      </v-col>

      <v-col v-if="caricamento" cols="12" class="text-center py-10">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
        <p class="mt-4 text-grey">We are choosing the best recipes for you...</p>
      </v-col>

      <v-col 
        v-else 
        v-for="ricetta in ricetteRandom" 
        :key="ricetta.id" 
        cols="12" sm="6" md="4"
      >
        <v-card 
          class="mx-auto h-100 flex-column d-flex elevation-4" 
          hover 
          :to="`/recipe/${ricetta.id}`"
          rounded="xl"
        >
          <v-img
            :src="ricetta.image"
            :alt="ricetta.title"
            height="220px"
            cover
            class="align-end"
          >
            <v-card-title class="text-white bg-black-transparent py-2">
              {{ ricetta.title }}
            </v-card-title>
          </v-img>

          <v-card-text class="flex-grow-1 pt-4">
            <div class="d-flex mb-2">
              <v-chip size="small" color="orange" class="me-2">
                <v-icon start icon="mdi-clock-outline"></v-icon>
                {{ ricetta.readyInMinutes }} min
              </v-chip>
              <v-chip size="small" color="green">
                <v-icon start icon="mdi-silverware-fork-knife"></v-icon>
                {{ ricetta.servings }} port.
              </v-chip>
            </div>
            <p class="text-truncate-2 text-body-2 text-grey-darken-1">
              {{ ricetta.summary.replace(/<[^>]*>/g, '') }}
            </p>
          </v-card-text>

          <v-card-actions class="pb-4 px-4">
            <v-btn block color="primary" variant="flat" rounded="lg">
              See preparation
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.bg-black-transparent {
  background: rgba(0, 0, 0, 0.6);
  width: 100%;
}

.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

h1 {
  background: linear-gradient(45deg, #eff2f4, #52a9ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

</style>