// Importation des SDK Firebase Web
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import {
    getFirestore,
    doc,
    setDoc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Vos identifiants Firebase
const firebaseConfig = {
    apiKey: "AlzaSyBb58B3tLEe4QOw-JJzlgDrO6tcZ-9qgKY",
    authDomain: "studio-8223732654-49acc.firebaseapp.com",
    projectId: "studio-8223732654-49acc",
    storageBucket: "studio-8223732654-49acc.firebasestorage.app",
    messagingSenderId: "936947686357",
    appId: "1:936947686357:web:66b53d0cbbe4da290f3b5c"
};

// Initialisation
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Inscription
window.signup = async function() {
    const email = document.getElementById("auth-email").value;
    const password = document.getElementById("auth-password").value;

    if (!email || !password) {
        alert("Veuillez remplir tous les champs.");
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
            email: user.email,
            role: "free",
            createdAt: new Date()
        });

        alert("Compte créé avec succès !");
    } catch (error) {
        alert("Erreur d'inscription : " + error.message);
    }
};

// Connexion
window.login = async function() {
    const email = document.getElementById("auth-email").value;
    const password = document.getElementById("auth-password").value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        alert("Erreur de connexion : " + error.message);
    }
};

// Déconnexion
window.logout = function() {
    signOut(auth).then(() => {
        localStorage.removeItem("check_learn_status");
        window.location.reload();
    });
};

// Gestion de l'affichage de l'utilisateur
onAuthStateChanged(auth, async (user) => {
    const loggedOutView = document.getElementById("logged-out-view");
    const loggedInView = document.getElementById("logged-in-view");
    const userEmailDisplay = document.getElementById("user-email-display");
    const statusLabel = document.getElementById("status-label");

    if (user) {
        if (loggedOutView) loggedOutView.style.display = "none";
        if (loggedInView) loggedInView.style.display = "block";
        if (userEmailDisplay) userEmailDisplay.innerText = user.email;

        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.role === "subscribed") {
                if (statusLabel) {
                    statusLabel.innerText = "Abonné Premium
⭐
";
                    statusLabel.style.background = "#dcfce7";
                    statusLabel.style.color = "#15803d";
                }
                localStorage.setItem("check_learn_status", "subscribed");
            } else {
                if (statusLabel) statusLabel.innerText = "Compte Gratuit";
                localStorage.setItem("check_learn_status", "free");
            }
        }
    } else {
        if (loggedOutView) loggedOutView.style.display = "block";
        if (loggedInView) loggedInView.style.display = "none";
        localStorage.removeItem("check_learn_status");
    }
}); 