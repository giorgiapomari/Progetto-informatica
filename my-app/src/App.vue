<script setup>
import { ref, onMounted, watch } from 'vue';
import db from '@/firestore';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { API_KEY, API_BASE_URL } from '@/config';

const router = useRouter();
const nomeUtente = ref("");
const mostraInfo = ref(false);
const authenticated = ref(false);

// Variabili per la ricerca
const searchQuery = ref(null); 
const searchInput = ref(""); 
const suggestions = ref([]);
const loadingSearch = ref(false);

// Stato per la sidebar
const drawer = ref(false);

// Elenco delle cucine
const cuisines = ref(['Italian', 'French', 'Indian', 'Japanese', 'Mexican']);

// Controlliamo l'autenticazione ad ogni cambio di pagina
router.afterEach(function() {
  authenticated.value = db.isAuthenticated();
  if (authenticated.value) {
    nomeUtente.value = db.getUser();
  } else {
    nomeUtente.value = "";
  }
});

onMounted(() => {
  authenticated.value = db.isAuthenticated();
  nomeUtente.value = db.getUser() || "Ospite";
});

function eseguiLogout() {
  db.logout();
  authenticated.value = false;
  router.push("/login");
}

// Cerca suggerimenti mentre digiti (dopo 3 caratteri)
watch(searchInput, async (newVal) => {
  if (!newVal || newVal.length < 3) {
    suggestions.value = [];
    return;
  }
  loadingSearch.value = true;
  try {
    const res = await axios.get(`${API_BASE_URL}/recipes/autocomplete?query=${newVal}&number=5&apiKey=${API_KEY}`);
    suggestions.value = res.data;
  } catch (error) {
    console.error("Errore ricerca:", error);
  } finally {
    loadingSearch.value = false;
  }
});

// Vai alla ricetta quando ne selezioni una dalla tendina
function apriRicetta(ricetta) {
  if (ricetta && ricetta.id) {
    router.push(`/recipe/${ricetta.id}`);
    searchQuery.value = null; // Svuota la barra dopo il click
  }
}
</script>

<template>
  <v-app>
    <v-layout v-if="authenticated">
      <v-navigation-drawer v-model="drawer" temporary>
        <v-list color="primary">
          <v-list-item prepend-icon="mdi-home" to="/home" link title="Homepage"></v-list-item>
          <v-list-item prepend-icon="mdi-heart" to="/favourites" link title="Ricette preferite"></v-list-item>

          <v-divider class="my-2"></v-divider>
          <v-list-subheader>FOOD FROM THE WORLD</v-list-subheader>

          <v-list-item 
            v-for="cuisine in cuisines" 
            :key="cuisine" 
            :to="`/cuisine/${cuisine.toLowerCase()}`" 
            link
            :title="cuisine"
          ></v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-app-bar color="primary" elevation="2">
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
        
        <v-app-bar-title style="min-width: 160px; flex: none;">SpoonApp 🍳</v-app-bar-title>

        <v-spacer></v-spacer>

        <v-autocomplete
          v-model="searchQuery"
          v-model:search="searchInput"
          :items="suggestions"
          :loading="loadingSearch"
          item-title="title"
          item-value="id"
          return-object
          @update:modelValue="apriRicetta"
          prepend-inner-icon="mdi-magnify"
          placeholder="Search recipes..."
          variant="solo-filled"
          flat
          hide-details
          rounded
          density="compact"
          class="mx-4" 
          style="max-width: 450px; width: 100%;"
          clearable
          no-data-text="No recipes found"
        ></v-autocomplete>

        <v-spacer></v-spacer>

        <v-menu min-width="200px" rounded>
          <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props" class="me-4">
              <v-avatar color="white" size="large">
                <v-icon color="primary">mdi-account</v-icon>
              </v-avatar>
            </v-btn>
          </template>
          <v-card>
            <v-card-text class="text-center">
              <h3>{{ nomeUtente }}</h3>
              <v-divider class="my-3"></v-divider>
              <v-btn variant="text" @click="mostraInfo = true">Profile Info</v-btn>
              <v-divider class="my-3"></v-divider>
              <v-btn variant="text" color="error" @click="eseguiLogout">
                Logout <v-icon end>mdi-logout</v-icon>
              </v-btn>
            </v-card-text>
          </v-card>
        </v-menu>
      </v-app-bar>

      <v-dialog v-model="mostraInfo" max-width="400">
        <v-card title="Account Info">
          <v-card-text>
            You are using SpoonApp as: <strong>{{ nomeUtente }}</strong>
            <br> Managed access via Firebase.
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="mostraInfo = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-main>
        <router-view></router-view>
      </v-main>
    </v-layout>

    <v-main v-else>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>