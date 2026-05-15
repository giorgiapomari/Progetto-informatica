<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { onBeforeRouteUpdate } from 'vue-router';
import { API_KEY, API_BASE_URL } from '@/config';
import ListaRicette from '@/components/ListaRicette.vue';
// Assicurati di avere un componente per la singola card o usa Vuetify direttamente qui
// import RicettaCard from '@/components/RicettaCard.vue';

const props = defineProps(['type']); // 'type' sarà la cucina (es. italian, mexican)
const ricette = ref([]);
const caricamento = ref(false);

const apiKey = API_KEY;
const apiBaseUrl = API_BASE_URL;

function caricaRicette(cucina) {
    caricamento.value = true;
    ricette.value = [];

    // Endpoint per cercare ricette in base alla cucina (cuisine)
    // ✅ URL CORRETTO (rimosso /food)
    // In elencoRicette.vue
    const url = `${apiBaseUrl}/recipes/complexSearch?cuisine=${cucina}&apiKey=${apiKey}&number=12&addRecipeInformation=true`;

    axios.get(url)
        .then(response => {
            // Spoonacular mette i risultati dentro l'oggetto .results
            ricette.value = response.data.results;
        })
        .catch(err => console.error("Loading error:", err))
        .finally(() => {
            caricamento.value = false;
        });
}

// Quando cambiamo cucina restando nella stessa pagina (es. da Italian a Mexican)
onBeforeRouteUpdate((to) => {
    caricaRicette(to.params.type);
});

// Al primo caricamento
onMounted(() => {
    caricaRicette(props.type);
});
</script>

<template>
    <v-container>
        <h1 class="text-capitalize mb-6">Cuisine {{ type }}</h1>

        <v-row v-if="caricamento" justify="center">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </v-row>

        <v-row v-else>
            <lista-ricette :ricette="ricette"></lista-ricette>

            <v-col v-if="ricette.length === 0 && !caricamento" cols="12">
                <v-alert type="info">No recipes found for this cuisine.</v-alert>
            </v-col>
        </v-row>
    </v-container>
</template>

<style scoped>
h1 {
    border-bottom: 2px solid;
    display: inline-block;
}
</style>