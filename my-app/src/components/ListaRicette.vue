<script setup>
import { addDoc, collection, getDocs, query, where, writeBatch, doc } from 'firebase/firestore';
import { onMounted, ref } from 'vue';
import db from '@/firestore'

// Riceviamo l'array delle ricette (che chiameremo 'ricette')
const props = defineProps(['ricette']);
const preferiti = ref(new Set());
let emits = defineEmits(['removeRecipe']);

function togglePreferiti(id) {
    if (!preferiti.value.has(id)) {
        // Aggiungiamo nei preferiti
        let nuovoPreferito = {
            "idRicetta": id,
            "utente": db.getUser()
        };
        addDoc(collection(db.db, "preferiti"), nuovoPreferito).then(function() {
            preferiti.value.add(id);
        });
    } else {
        // Toglierlo dai preferiti
        let q = query(collection(db.db, "preferiti"),
            where("utente", "==", db.getUser()),
            where("idRicetta", "==", id)
        );
        getDocs(q).then(function(querySnapshot) {
            let b = writeBatch(db.db);
            for (let document of querySnapshot.docs) {
                const docDaEliminare = doc(db.db, "preferiti", document.id)
                b.delete(docDaEliminare);
            }
            b.commit().then(function() {
                preferiti.value.delete(id);
                // Notifichiamo la pagina Favourites di togliere la card
                emits("removeRecipe", id);
            });
        });
    }
}

onMounted(function() {
    preferiti.value = new Set();
    const q = query(collection(db.db, "preferiti"),
        where("utente", "==", db.getUser()));
    getDocs(q).then(function(querySnapshot) {
        for (let pref of querySnapshot.docs) {
            preferiti.value.add(pref.data()['idRicetta']);
        }
    });
})
</script>

<template>
    <v-row>
        <v-col cols="12" md="6" lg="3" v-for="ricetta in ricette" :key="ricetta.id">
            <v-card elevation="2">
                <v-img height="200" cover :src="ricetta.image"></v-img>
                
                <v-card-item>
                    <v-card-title>{{ ricetta.title }}</v-card-title>
                    
                    <v-card-subtitle>Ricetta Spoonacular</v-card-subtitle>
                </v-card-item>

                <v-card-actions>
                    <v-btn :to="`/recipe/${ricetta.id}`" color="primary" variant="tonal">
                        Dettagli
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn 
                        :color="preferiti.has(ricetta.id) ? 'red' : 'grey'"
                        icon="mdi-heart"
                        @click="togglePreferiti(ricetta.id)"
                    ></v-btn>
                </v-card-actions>
            </v-card>
        </v-col>
    </v-row>
</template>