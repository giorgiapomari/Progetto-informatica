<script setup>
import { onMounted, ref } from 'vue';
import { collection, getDocs, query, where } from 'firebase/firestore';
import axios from 'axios';
import db from '@/firestore'
import ListaRicette from '@/components/ListaRicette.vue';

const ricette = ref([]);
// USA LA TUA API KEY DI SPOONACULAR
const apiKey = 'cd31399f04b8490f99a11c2186f522e7'; 

function eliminaDallaLista(id) {
    // Filtriamo usando .id (Spoonacular) invece di .idMeal
    ricette.value = ricette.value.filter(r => r.id !== id);
}

onMounted(async function() {
    ricette.value = [];
    const preferitiIds = [];
    
    // 1. Prendo i preferiti da Firestore
    const q = query(collection(db.db, "preferiti"),
        where("utente", "==", db.getUser()));
    
    const querySnapshot = await getDocs(q);
    for (let pref of querySnapshot.docs) {
        preferitiIds.push(pref.data()['idRicetta']);
    }

    // 2. Per ogni ID, chiedo i dettagli a SPOONACULAR
    for (let id of preferitiIds) {
        try {
            // URL corretto per Spoonacular: get recipe information by ID
            const url = `https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`;
            const response = await axios.get(url);
            
            if (response.data) {
                ricette.value.push(response.data);
            }
        } catch (e) {
            console.error("Errore caricamento ricetta Spoonacular ID:", id, e);
        }
    }
})
</script>

<template>
    <v-container>
        <h1 class="mb-5">Le mie Ricette Preferite</h1>
        <div v-if="ricette.length > 0">
            <lista-ricette :ricette="ricette" @remove-recipe="eliminaDallaLista"></lista-ricette>
        </div>
        <v-alert v-else type="info" variant="tonal">
            Non hai ancora salvato nessuna ricetta.
        </v-alert>
    </v-container>
</template>