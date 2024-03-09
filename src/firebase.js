import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    // apiKey: process.env.VUE_APP_API,
    apiKey: "AIzaSyA005uTxZeFwF1wrDZTLqVtI4I2vA8X02U",
    authDomain: "chatwoe.firebaseapp.com",
    projectId: "chatwoe",
    storageBucket: "chatwoe.appspot.com",
    messagingSenderId: "525658730224",
    appId: "1:525658730224:web:f724573efdccaf66755c35",
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)