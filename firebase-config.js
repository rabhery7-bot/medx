import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBb58B3tLEe4QOw-JJzlgDrO6tcZ-9qgKY",
    authDomain: "studio-8223732654-49acc.firebaseapp.com",
    projectId: "studio-8223732654-49acc",
    storageBucket: "studio-8223732654-49acc.appspot.com",
    messagingSenderId: "8223732654",
    appId: "1:8223732654:web:1af2a"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); 