<script setup>
import { ref } from 'vue';
import db from '@/firestore';
import router from '@/router';

const username = ref("");
const password = ref("");
const messages = ref([]);
const loginLoading = ref(undefined);

async function login() {
  if (!username.value || !password.value) {
    messages.value.push({ text: "Missing data!", color: 'warning' });
    return;
  }
  loginLoading.value = "primary";
  try {
    let loggedUser = await db.verificaLogin(username.value, password.value);
    db.setUser(loggedUser);
    router.push("/home");
  } catch (e) {
    messages.value.push({ text: e.message, color: 'error' });
  } finally {
    loginLoading.value = undefined;
  }
}

function vaiARegistrazione() {
  router.push("/signup");
}
</script>

<template>
  <v-container class="fill-height bg-grey-lighten-3" fluid>
    <v-row align="center" justify="center" no-gutters>
      
      <v-col cols="12" sm="8" md="4" lg="3">
        
        <v-card class="elevation-12 pa-4" rounded="lg">
          <v-card-item class="justify-center">
            <v-card-title class="text-h5 flex-column align-center d-flex">
              <span class="font-weight-bold">Login</span>
            </v-card-title>
          </v-card-item>

          <v-card-text class="mt-4">
            <v-form @submit.prevent="login">
              <v-text-field
                v-model.trim="username"
                label="Username"
                prepend-inner-icon="mdi-account"
                variant="outlined"
                class="mb-2"
                :disabled="!!loginLoading"
              ></v-text-field>

              <v-text-field
                v-model.trim="password"
                label="Password"
                type="password"
                prepend-inner-icon="mdi-lock"
                variant="outlined"
                density="comfortable"
                :disabled="!!loginLoading"
              ></v-text-field>

              <v-btn
                :loading="!!loginLoading"
                color="primary"
                size="large"
                block
                type="submit"
                class="mt-4 text-none"
                elevation="2"
              >
                Sign In
              </v-btn>
            </v-form>
          </v-card-text>

          <v-divider class="my-4"></v-divider>

          <v-card-actions class="justify-center">
            <v-btn variant="text" size="small" @click="vaiARegistrazione">
              Don't have an account? <span class="text-primary ml-1">Sign Up</span>
            </v-btn>
          </v-card-actions>
        </v-card>

      </v-col>
    </v-row>
  </v-container>

  <v-snackbar-queue v-model="messages" closable></v-snackbar-queue>
</template>


<style scoped>
/* Rende lo sfondo un po' più gradevole */
.v-container {
    background: linear-gradient(to bottom right, #f5f5f5, #e0e0e0);
}
</style>