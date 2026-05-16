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
    const url = `${apiBaseUrl}/recipes/complexSearch?cuisine=${cucina}&apiKey=${apiKey}&number=12`;

    axios.get(url)
        .then(response => {
            // Spoonacular mette i risultati dentro l'oggetto .results
            ricette.value = response.data.results;
        })
        .catch(err => console.error("Errore nel caricamento:", err))
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
        <!-- 1. Il Titolo della pagina -->
        <h1 class="text-capitalize mb-6">Cucina {{ type }}</h1>

        <!-- 2. Riga per il CARICAMENTO: si accende solo se 'caricamento' è true -->
        <v-row v-if="caricamento" justify="center" class="py-10">
            <v-col cols="12" class="text-center">
                <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
            </v-col>
        </v-row>

        <!-- 3. Riga per i RISULTATI: si accende in alternativa (v-else) -->
        <v-row v-else>
            <!-- La lista delle ricette (che internamente avrà le sue colonne per le card) -->
            <v-col cols="12">
                <lista-ricette :ricette="ricette"></lista-ricette>
            </v-col>

            <!-- Messaggio di avviso se l'array è vuoto -->
            <v-col v-if="ricette.length === 0" cols="12">
                <v-alert type="info" variant="tonal">
                    Nessuna ricetta trovata per questa categoria.
                </v-alert>
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