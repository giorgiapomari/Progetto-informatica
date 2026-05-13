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

async function caricaRicetteCasuali() {
    caricamento.value = true;
    try {
        // Endpoint per ottenere ricette casuali
        const url = `${apiBaseUrl}/recipes/random?number=3&apiKey=${apiKey}`;
        const response = await axios.get(url);
        ricetteRandom.value = response.data.recipes;
    } catch (error) {
        console.error("Errore nel caricamento delle ricette casuali:", error);
    } finally {
        caricamento.value = false;
    }
}

onMounted(() => {
    // Recupera il nome dell'utente loggato
    nomeUtente.value = db.getUser() || "Ospite";
    caricaRicetteCasuali();
});
</script>

<template>
  <v-container class="py-8">
    <v-row justify="center" class="text-center mb-10">
      <v-col cols="12" md="8">
        <h1 class="text-h2 font-weight-bold primary--text mb-2">
          Benvenut*, {{ nomeUtente }}! 👋
        </h1>
        <h2 class="text-h5 text-grey-darken-1 font-italic mb-6">
          "Cucinare è un modo di dare, non solo di nutrire."
        </h2>
        <p class="text-body-1 text-grey-darken-2">
          Benvenuto su <strong>SpoonApp</strong>, il tuo compagno ideale in cucina. 
          Qui puoi esplorare sapori da ogni angolo del mondo, salvare i tuoi piatti preferiti 
          e lasciarti ispirare per la tua prossima cena speciale.
        </p>
      </v-col>
    </v-row>

    <v-divider class="my-10"></v-divider>

    <v-row>
      <v-col cols="12" class="d-flex align-center mb-4">
        <v-icon color="orange-darken-2" size="32" class="me-2">mdi-star</v-icon>
        <h2 class="text-h4 font-weight-black">Ricette in Evidenza</h2>
      </v-col>

      <v-col v-if="caricamento" cols="12" class="text-center py-10">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
        <p class="mt-4 text-grey">Stiamo scegliendo le migliori ricette per te...</p>
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
                {{ ricetta.servings }} porz.
              </v-chip>
            </div>
            <p class="text-truncate-2 text-body-2 text-grey-darken-1">
              {{ ricetta.summary.replace(/<[^>]*>/g, '') }}
            </p>
          </v-card-text>

          <v-card-actions class="pb-4 px-4">
            <v-btn block color="primary" variant="flat" rounded="lg">
              Vedi Preparazione
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
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

h1 {
  background: linear-gradient(45deg, #eff2f4, #52a9ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>