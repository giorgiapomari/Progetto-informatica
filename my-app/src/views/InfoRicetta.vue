<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';

// Riceviamo l'ID della ricetta come prop
const props = defineProps(['recipeId']);
const recipe = ref(null);
const loading = ref(true);

// Mock per i commenti (visto che l'API Spoonacular non gestisce commenti utenti)
/* const newComment = ref("");
const comments = ref([
    { user: 'Marco', text: 'Provata ieri, davvero squisita!' },
    { user: 'Sara', text: 'Ho aggiunto un pizzico di sale in più, perfetta.' }
]);*/

const addComment = () => {
    if (newComment.value.trim()) {
        comments.value.push({ user: 'Tu', text: newComment.value });
        newComment.value = "";
    }
};

onMounted(async () => {
    // La API Key è di Giorgia Pomari
    const apiKey = 'ec7c838447f346c1a3851578c84dc92f'; 
    const url = `https://api.spoonacular.com/recipes/${props.recipeId}/information?apiKey=${apiKey}`;

    try {
        const response = await axios.get(url);
        recipe.value = response.data;
    } catch (error) {
        console.error("Errore nel caricamento della ricetta:", error);
    } finally {
        loading.value = false;
    }
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

        <v-row>
            <v-col cols="12">
                <h2 class="mb-4">Commenti</h2>
                <v-list lines="two">
                    <v-list-item v-for="(c, i) in comments" :key="i" :subtitle="c.text" :title="c.user">
                        <template v-slot:prepend>
                            <v-avatar color="grey-lighten-2">👤</v-avatar>
                        </template>
                    </v-list-item>
                </v-list>

                <v-textarea 
                    v-model="newComment"
                    label="Lascia un commento..." 
                    variant="outlined" 
                    rows="2"
                    append-inner-icon="mdi-send"
                    @click:append-inner="addComment"
                    class="mt-4"
                ></v-textarea>
            </v-col>
        </v-row>
    </v-container>

    <v-container v-else-if="loading" class="text-center">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </v-container>
</template>

<style scoped>
h1 { color: #2c3e50; font-weight: bold; }
h2 { border-left: 5px solid #fb8c00; padding-left: 10px; }
</style>