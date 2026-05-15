<script setup>
import { ref, onMounted } from 'vue';
import db from '@/firestore';
import { useRouter } from 'vue-router';

const router = useRouter();
const nomeUtente = ref("");
const mostraInfo = ref(false);
const authenticated = ref(false);

// Stato per la sidebar
const drawer = ref(false);

// Elenco delle cucine
const cuisines = ref(['Italian', 'French', 'Indian', 'Japanese', 'Mexican']);

// Controlliamo l'autenticazione ad ogni cambio di pagina
router.afterEach(function() {
  // 1. Controlla se l'utente è loggato
  authenticated.value = db.isAuthenticated();
  
  // 2. AGGIORNA IL NOME (Questo è il pezzo che mancava!)
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
</script>

<template>
  <v-app>
  <v-layout v-if="authenticated">
    <v-navigation-drawer v-model="drawer" permanent>
      <v-list color="primary">
        <v-list-item prepend-icon="mdi-home" to="/home" link title="Homepage"></v-list-item>
        <v-list-item prepend-icon="mdi-heart" to="/favourites" link title="Ricette preferite"></v-list-item>

        <v-divider class="my-2"></v-divider>
        <v-list-subheader>CUCINE DAL MONDO</v-list-subheader>

        <v-list-item v-for="cuisine in cuisines" :key="cuisine" :to="`/cuisine/${cuisine.toLowerCase()}`" link
          :title="cuisine"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar color="primary" elevation="2">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title>SpoonApp 🍳</v-app-bar-title>
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
            <v-btn variant="text" @click="mostraInfo = true">Info Profilo</v-btn>
            <v-divider class="my-3"></v-divider>
            <v-btn variant="text" color="error" @click="eseguiLogout">
              Logout <v-icon end>mdi-logout</v-icon>
            </v-btn>
          </v-card-text>
        </v-card>
      </v-menu>
    </v-app-bar>

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

    <v-main>
      <router-view></router-view>
    </v-main>

  </v-layout>

  <v-main v-else>
    <router-view></router-view> </v-main>
  </v-app>

</template>