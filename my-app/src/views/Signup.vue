<script setup>
import { ref, reactive } from 'vue';
import db from '@/firestore';
import { useRouter } from 'vue-router';

const router = useRouter();
const loading = ref(false);
const messages = ref([]);

const form = reactive({
  realName: '',
  username: '',
  password: ''
});

async function handleSignup() {
  if (!form.username || !form.password) {
    messages.value.push({ text: "Riempi tutti i campi!", color: 'error' });
    return;
  }

  loading.value = true;
  try {
    // Creiamo l'oggetto da mandare a Firestore
    const nuovoUtente = {
      nome: form.username, // Usiamo "nome" per far funzionare il tuo login
      password: form.password,
      dataIscrizione: new Date().toISOString()
    };

    await db.registraUtente(nuovoUtente);
    
    messages.value.push({ text: "Registrazione completata!", color: 'success' });
    
    // Dopo 2 secondi portalo al login
    setTimeout(() => {
      router.push('/login');
    }, 2000);

  } catch (e) {
    messages.value.push({ text: e.message, color: 'error' });
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <v-container class="fill-height bg-grey-lighten-3" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12 pa-4" rounded="lg">
          <v-card-title class="text-h5 text-center font-weight-bold">
            Crea Account
          </v-card-title>
          
          <v-card-text>
            <v-form @submit.prevent="handleSignup">

              <v-text-field
                v-model="form.username"
                label="Scegli un Username"
                variant="outlined"
                prepend-inner-icon="mdi-at"
              ></v-text-field>

              <v-text-field
                v-model="form.password"
                label="Password"
                type="password"
                variant="outlined"
                prepend-inner-icon="mdi-lock-outline"
              ></v-text-field>

              <v-btn
                color="success"
                size="large"
                block
                type="submit"
                :loading="loading"
                class="mt-4"
              >
                Registrati
              </v-btn>
            </v-form>
          </v-card-text>

          <v-card-actions class="justify-center">
            <v-btn variant="text" @click="$router.push('/login')">
              Hai già un account? Accedi
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  
  <v-snackbar-queue v-model="messages" closable></v-snackbar-queue>
</template>


<style scoped>
</style>