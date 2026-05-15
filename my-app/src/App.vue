<script setup>
import { ref, onMounted } from 'vue';
import db from '@/firestore';
import { useRouter } from 'vue-router';

const router = useRouter();

const authenticated = ref(false); // Parte sempre da false per mostrare il login
const nomeUtente = ref("");
const mostraInfo = ref(false);
const drawer = ref(false);
const cuisines = ref(['Italian', 'French', 'Indian', 'Japanese', 'Mexican']);

// Gestiamo tutto DOPO la navigazione
router.afterEach(() => {
  // 1. Chiude la sidebar automaticamente quando cambi sezione
  drawer.value = false;

  // 2. Controlla lo stato attuale
  const isLogged = db.isAuthenticated();
  authenticated.value = isLogged;
  
  if (isLogged) {
    nomeUtente.value = db.getUser();
  }
});

onMounted(() => {
  // Al caricamento iniziale verifichiamo se c'è un utente, 
  // ma non forziamo il redirect alla home, così resta dove si trova (es. Login)
  authenticated.value = db.isAuthenticated();
  if (authenticated.value) {
    nomeUtente.value = db.getUser();
  }
});

function eseguiLogout() {
  db.logout();
  authenticated.value = false;
  router.push("/login");
}
</script>

<template>
  <v-app>
    <!-- Il layout appare solo se sei loggata E non sei nella pagina di login -->
    <v-layout v-if="authenticated && $route.path !== '/login'">
      
      <!-- Usiamo 'temporary' così si chiude bene e non blocca la visuale -->
      <v-navigation-drawer v-model="drawer" temporary>
        <v-list color="primary">
          <v-list-item prepend-icon="mdi-home" to="/home" link title="Homepage"></v-list-item>
          <v-list-item prepend-icon="mdi-heart" to="/favourites" link title="Ricette preferite"></v-list-item>
          <v-divider class="my-2"></v-divider>
          <v-list-subheader>CUCINE DAL MONDO</v-list-subheader>
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
        <v-app-bar-title>SpoonApp 🍳</v-app-bar-title>
        <v-spacer></v-spacer>

        <!-- Menu Profilo -->
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
              <v-btn variant="text" @click="mostraInfo = true">Info Profilo</v-btn>
              <v-divider class="my-3"></v-divider>
              <v-btn variant="text" color="error" @click="eseguiLogout">
                Logout <v-icon end>mdi-logout</v-icon>
              </v-btn>
            </v-card-text>
          </v-card>
        </v-menu>
      </v-app-bar>

      <v-main>
        <router-view></router-view>
      </v-main>
    </v-layout>

    <!-- Se non sei loggata o sei nel login, mostra solo il contenuto pulito -->
    <v-main v-else>
      <router-view></router-view>
    </v-main>

    <!-- Dialog Info (lascialo fuori dal v-layout per sicurezza) -->
    <v-dialog v-model="mostraInfo" max-width="400">
      <v-card title="Informazioni Account">
        <v-card-text>
          Stai usando SpoonApp come: <strong>{{ nomeUtente }}</strong>
          <br> Accesso gestito tramite Firebase.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="mostraInfo = false">Chiudi</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>