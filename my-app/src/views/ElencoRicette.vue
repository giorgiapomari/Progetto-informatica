<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { onBeforeRouteUpdate } from 'vue-router';
// Assicurati di avere un componente per la singola card o usa Vuetify direttamente qui
// import RicettaCard from '@/components/RicettaCard.vue';

const props = defineProps(['type']); // 'type' sarà la cucina (es. italian, mexican)
const ricette = ref([]);
const caricamento = ref(false);

const apiKey = 'cd31399f04b8490f99a11c2186f522e7'; // Inserisci qui la tua chiave Spoonacular

function caricaRicette(cucina) {
    caricamento.value = true;
    ricette.value = [];

    // Endpoint per cercare ricette in base alla cucina (cuisine)
    // ✅ URL CORRETTO (rimosso /food)
    const url = `https://api.spoonacular.com/recipes/complexSearch?cuisine=${cucina}&apiKey=${apiKey}&number=12`;

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
        <h1 class="text-capitalize mb-6">Cucina {{ type }}</h1>

        <v-row v-if="caricamento" justify="center">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </v-row>

        <v-row v-else>
            <v-col v-for="ricetta in ricette" :key="ricetta.id" cols="12" sm="6" md="4" lg="3">
                <v-card :to="`/recipe/${ricetta.id}`" link hover class="mx-auto my-2">
                    <v-img :src="ricetta.image" height="200px" cover></v-img>

                    <v-card-title class="text-subtitle-1">
                        {{ ricetta.title }}
                    </v-card-title>

                    <v-card-actions>
                        <v-btn color="primary" variant="text">Guarda Ricetta</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>

            <v-col v-if="ricette.length === 0 && !caricamento" cols="12">
                <v-alert type="info">Nessuna ricetta trovata per questa categoria.</v-alert>
            </v-col>
        </v-row>
    </v-container>
</template>

<style scoped>
h1 {
    border-bottom: 2px solid #primary;
    display: inline-block;
}
</style>