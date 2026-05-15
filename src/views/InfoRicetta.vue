<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { API_KEY, API_BASE_URL } from '@/config';
import db from "@/firestore"; // Assicurati che il percorso sia corretto
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";

const commentSubject = ref(""); // Oggetto del commento
const commentText = ref("");    // Testo del commento
const commenti = ref([]);       // Lista dei commenti da mostrare
const rules = [value => !!value || 'Campo obbligatorio.'];

// Funzione per caricare i commenti da Firebase
async function caricaCommenti() {
    const q = query(collection(db.db, "commenti"), where("recipeId", "==", props.recipeId));
    try {
        const querySnapshot = await getDocs(q);
        commenti.value = [];
        querySnapshot.forEach((doc) => {
            commenti.value.push(doc.data());
        });
    } catch (e) {
        console.error("Errore caricamento commenti:", e);
    }
}

// Funzione per inviare il commento a Firebase
async function inviaForm() {
    if (!commentSubject.value || !commentText.value) return;

    let nuovoCommento = {
        utente: db.getUser(),
        recipeId: props.recipeId,
        quando: new Date(),
        titolo: commentSubject.value,
        testo: commentText.value
    };

    try {
        await addDoc(collection(db.db, "commenti"), nuovoCommento);
        commentSubject.value = "";
        commentText.value = "";
        caricaCommenti(); // Ricarica la lista dopo l'invio
    } catch (e) {
        alert("Error submitting comment. Please try again.");
    }
}

// Riceviamo l'ID della ricetta come prop
const props = defineProps(['recipeId']);
const recipe = ref(null);
const loading = ref(true);

onMounted(async () => {
    // La API Key è di Giorgia Pomari
    const apiKey = API_KEY;
    const apiBaseUrl = API_BASE_URL;
    const url = `${apiBaseUrl}/recipes/${props.recipeId}/information?apiKey=${apiKey}`;

    try {
        const response = await axios.get(url);
        recipe.value = response.data;
    } catch (error) {
        console.error("Errore nel caricamento della ricetta:", error);
    } finally {
        loading.value = false;
    }
    caricaCommenti();
});
</script>

<template>
    <v-container v-if="recipe">
        <v-row align="center">
            <v-col cols="12" md="6">
                <v-img :src="recipe.image" :alt="recipe.title" class="rounded-lg elevation-3"></v-img>
            </v-col>
            <v-col cols="12" md="6">
                <h1 class="text-h3 mb-4">{{ recipe.title }}</h1>
                <div class="d-flex mb-4">
                    <v-chip class="me-2" color="primary">🕒 {{ recipe.readyInMinutes }} min</v-chip>
                    <v-chip color="secondary">🍴 {{ recipe.servings }} porzioni</v-chip>
                </div>
                <p v-html="recipe.summary" class="text-body-1"></p>
            </v-col>
        </v-row>

        <v-divider class="my-8"></v-divider>

        <v-row>
            <v-col cols="12" md="4">
                <h2 class="mb-4">Ingredienti</h2>
                <v-list class="bg-grey-lighten-4 rounded">
                    <v-list-item v-for="ing in recipe.extendedIngredients" :key="ing.id">
                        • {{ ing.original }}
                    </v-list-item>
                </v-list>
            </v-col>

            <v-col cols="12" md="8">
                <h2 class="mb-4">Preparazione</h2>
                <div v-if="recipe.analyzedInstructions.length > 0">
                    <div v-for="(step, index) in recipe.analyzedInstructions[0].steps" :key="index" class="mb-4">
                        <strong>Passaggio {{ step.number }}:</strong>
                        <p>{{ step.step }}</p>
                    </div>
                </div>
                <p v-else>Istruzioni non disponibili.</p>
            </v-col>
        </v-row>

        <v-divider class="my-8"></v-divider>

        <v-divider class="my-8"></v-divider>

        <v-row>
            <v-col cols="12">
                <h2 class="mb-4">Commenti</h2>

                <v-card variant="outlined" class="pa-4 mb-6">
                    <v-form @submit.prevent="inviaForm">
                        <v-text-field v-model="commentSubject" label="Subject" :rules="rules" variant="outlined"
                            density="compact"></v-text-field>
                        <v-textarea v-model="commentText" label="Your comment..." :rules="rules" variant="outlined"
                            rows="3"></v-textarea>
                        <v-btn color="primary" type="submit" prepend-icon="mdi-send">
                            Submit Comment
                        </v-btn>
                    </v-form>
                </v-card>

                <v-list lines="three" v-if="commenti.length > 0">
                    <v-card v-for="(c, i) in commenti" :key="i" class="mb-3" elevation="1">
                        <v-card-item>
                            <v-card-title>{{ c.titolo }}</v-card-title>
                            <v-card-subtitle>
                                Submitted by: <strong>{{ c.utente }}</strong>
                            </v-card-subtitle>
                        </v-card-item>
                        <v-card-text>{{ c.testo }}</v-card-text>
                    </v-card>
                </v-list>

                <v-alert v-else type="info" variant="tonal">
                    No comments yet. Be the first to comment!
                </v-alert>
            </v-col>
        </v-row>
    </v-container>

    <v-container v-else-if="loading" class="text-center">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </v-container>
</template>

<style scoped>
h1 {
    color: #2c3e50;
    font-weight: bold;
}

h2 {
    border-left: 5px solid #fb8c00;
    padding-left: 10px;
}
</style>