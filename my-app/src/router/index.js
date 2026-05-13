import { createRouter, createWebHistory } from 'vue-router'
// 1. Importiamo le "pagine" (Assicurati che i nomi dei file siano corretti)
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Signup from '../views/Signup.vue'
import ElencoRicette from '../views/ElencoRicette.vue'
import InfoRicetta from '../views/InfoRicetta.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login' // <--- Aggiungi o modifica questa riga
    }, {
      // Questa è la rotta che manca per le cucine!
      path: '/cuisine/:type',
      name: 'Cuisine',
      component: ElencoRicette,
      props: true // Permette a ElencoRicette di ricevere "type" come prop
    },
    {
      // Questa serve per il dettaglio della singola ricetta
      path: '/recipe/:recipeId',
      name: 'RecipeDetail',
      component: InfoRicetta,
      props: true
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/home', // La pagina principale del sito
      name: 'home',
      component: Home
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup
    }
  ],
})

export default router
