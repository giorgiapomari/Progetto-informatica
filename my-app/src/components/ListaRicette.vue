<script setup>
import { addDoc, collection, getDocs, query, where, writeBatch, doc } from 'firebase/firestore';
import { onMounted, ref } from 'vue';
import db from '@/firestore'

const props = defineProps(['ricette']);
const preferiti = ref(new Set());
let emits = defineEmits(['removeRecipe']);

function togglePreferiti(id) {
    if (!preferiti.value.has(id)) {
        let nuovoPreferito = {
            "idRicetta": id,
            "utente": db.getUser()
        };
        addDoc(collection(db.db, "preferiti"), nuovoPreferito).then(function() {
            preferiti.value.add(id);
        });
    } else {
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
    <v-container>
        <v-row>
        <v-col 
            v-for="ricetta in ricette" 
            :key="ricetta.id" 
            cols="12" sm="6" md="4" lg="3"
        >
            <v-card 
                class="mx-auto h-100 flex-column d-flex elevation-4 position-relative" 
                hover 
                :to="`/recipe/${ricetta.id}`"
                rounded="xl"
            >
                <v-img
                    :src="ricetta.image"
                    height="220px"
                    cover
                    class="align-end"
                >
                    <v-card-title class="text-white bg-black-transparent py-2 text-subtitle-1">
                        {{ ricetta.title }}
                    </v-card-title>
                </v-img>

                <v-btn
                    class="position-absolute"
                    style="top: 10px; right: 10px; z-index: 2;"
                    :color="preferiti.has(ricetta.id) ? 'red' : 'white'"
                    icon="mdi-heart"
                    variant="flat"
                    size="small"
                    @click.stop.prevent="togglePreferiti(ricetta.id)"
                ></v-btn>

                <v-card-text class="flex-grow-1 pt-4">
                    <div class="d-flex mb-2" v-if="ricetta.readyInMinutes">
                        <v-chip size="small" color="orange" class="me-2">
                            <v-icon start icon="mdi-clock-outline"></v-icon>
                            {{ ricetta.readyInMinutes }} min
                        </v-chip>
                        <v-chip size="small" color="green" v-if="ricetta.servings">
                            <v-icon start icon="mdi-silverware-fork-knife"></v-icon>
                            {{ ricetta.servings }} port.
                        </v-chip>
                    </div>
                    
                    <p v-if="ricetta.summary" class="text-truncate-2 text-body-2 text-grey-darken-1">
                        {{ ricetta.summary.replace(/<[^>]*>/g, '') }}
                    </p>
                    <p v-else class="text-body-2 text-grey-darken-1">
                        Click to find out the details of this delicious Spoonacular recipe.
                    </p>
                </v-card-text>

                <v-card-actions class="pb-4 px-4">
                    <v-btn block color="primary" variant="flat" rounded="lg">
                        See preparation
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-col>
    </v-row>
    </v-container>
    
</template>

<style scoped>
.bg-black-transparent {
    background: rgba(0, 0, 0, 0.6);
    width: 100%;
}

.text-truncate-2 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* Mantieni la posizione relativa per gestire il pulsante preferiti assoluto */
.position-relative {
    position: relative;
}
</style>