<script setup>
import { ref, onMounted } from 'vue';
import db from '@/firestore';
import { useRouter } from 'vue-router';

const router = useRouter();
const nomeUtente = ref("");
const mostraInfo = ref(false);

// Stato per la sidebar (aperta/chiusa)
const drawer = ref(false);

// Elenco delle cucine per la sidebar
const cuisines = ref(['Italian', 'French', 'Indian', 'Japanese', 'Mexican']);

onMounted(() => {
  nomeUtente.value = db.getUser() || "Ospite";
});

function eseguiLogout() {
  db.logout();
  router.push("/login");
}
</script>

<template>
  <v-layout>
    
    <v-navigation-drawer v-model="drawer" temporary >
      <v-list color="primary">
        <v-list-item prepend-icon="mdi-home" to="/" link>
          <v-list-item-title>Homepage</v-list-item-title>
        </v-list-item>

        <v-list-item prepend-icon="mdi-heart" to="/favourites" link>
          <v-list-item-title>Ricette preferite</v-list-item-title>
        </v-list-item>

        <v-divider class="my-2"></v-divider>
        <v-list-subheader>CUCINE DAL MONDO</v-list-subheader>

        <v-list-item 
          v-for="cuisine in cuisines" 
          :key="cuisine" 
          :to="`/cuisine/${cuisine.toLowerCase()}`" 
          link
        >
          <v-list-item-title>{{ cuisine }}</v-list-item-title>
        </v-list-item>
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
        <v-card class="mt-2">
          <v-card-text>
            <div class="mx-auto text-center">
              <v-avatar color="primary" class="mb-2">
                <v-icon color="white">mdi-account</v-icon>
              </v-avatar>
              <h3>{{ nomeUtente }}</h3>
              <v-divider class="my-3"></v-divider>
              <v-btn variant="text" @click="mostraInfo = true">Info Profilo</v-btn>
              <v-divider class="my-3"></v-divider>
              <v-btn variant="text" color="error" @click="eseguiLogout">
                Logout <v-icon end>mdi-logout</v-icon>
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-menu>
    </v-app-bar>

    <v-main>
      <v-container>
        <h1>Benvenuto nella tua cucina digitale!</h1>
        <p>Seleziona una categoria dalla sidebar per iniziare a cucinare.</p>
        
      </v-container>

      <v-dialog v-model="mostraInfo" max-width="400">
        <v-card>
          <v-card-title>Informazioni Account</v-card-title>
          <v-card-text>
            Stai usando SpoonApp come: <strong>{{ nomeUtente }}</strong>
            <br>
            Accesso gestito tramite Firebase Firestore.
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="mostraInfo = false">Chiudi</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-main>

  </v-layout>
</template>

<style scoped></style>