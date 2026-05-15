// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, query, where, getDocs, collection, addDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDQ8VWSWOZRnlHksjY6dCJzeYRH0sdtYws",
  authDomain: "progetto-informatica-ricette.firebaseapp.com",
  projectId: "progetto-informatica-ricette",
  storageBucket: "progetto-informatica-ricette.firebasestorage.app",
  messagingSenderId: "211008219757",
  appId: "1:211008219757:web:14a60db3331f70dba02d64"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default {
  db: db,

  //LOGIN UTENTE GIA REGISTRATO
  // Verifica se l'utente esiste e la password coincide
  verificaLogin: async function (username, password) {
    // 1. Riferimento alla raccolta "utenti"
    const utentiRef = collection(db, "utenti");

    // 2. Creiamo una query: cerca il documento dove il campo "nome" è uguale a quello inserito
    const q = query(utentiRef, where("nome", "==", username));
    
    // 3. Eseguiamo la ricerca nel DB
    const querySnapshot = await getDocs(q);

    // 4. Verifichiamo se abbiamo trovato qualcuno
    if (!querySnapshot.empty) {
        // Prendiamo i dati del primo documento trovato
        const userData = querySnapshot.docs[0].data();

        // 5. Controllo password (nel tuo caso "pasticcio")
        if (userData.password === password) {
            return username; // Login riuscito!
        } else {
            throw new Error("La password è sbagliata");
        }
    } else {
        // Se la query è vuota, significa che non esiste un campo "nome" con quel valore
        throw new Error("Lo username inserito non esiste");
    }
  },

  setUser: function(nome) {
    localStorage.setItem("login", nome);
  },

  getUser: function() {
    return localStorage.getItem("login");
  },

  isAuthenticated: function () {
    return localStorage.getItem("login") ? true : false;
  },

  //REGISTRAZIONE NUOVO UTENTE

  // ... dentro l'export default, aggiungi questa funzione:
  registraUtente: async function (nuovoUtente) {
      try {
        const utentiRef = collection(db, "utenti");
        const docRef = await addDoc(utentiRef, nuovoUtente);
        return docRef.id;
      } catch (e) {
        throw new Error("Errore durante la registrazione: " + e.message);
      }
    },

  //LOGOUT
    logout: function() {
    localStorage.removeItem("login");
  },
  
  
};
;


