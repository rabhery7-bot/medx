import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AlzaSyBb58B3tLEe4QOw-JJzlgDr06tcZ-9qgKY",
  authDomain: "studio-8223732654-49acc.firebaseapp.com",
  projectId: "studio-8223732654-49acc",
  storageBucket: "studio-8223732654-49acc.firebasestorage.app",
  messagingSenderId: "936947686357",
  appId: "1:936947686357:web:66b53d0cbbe4da290f3b5c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Fonction de Connexion
window.login = async function() {
  const email = document.getElementById("auth-email")?.value;
  const password = document.getElementById("auth-password")?.value;

  if (!email || !password) {
    alert("Veuillez remplir tous les champs.");
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    alert("Erreur de connexion : " + error.message);
  }
};

// Fonction d'Inscription
window.signup = async function() {
  const email = document.getElementById("auth-email")?.value;
  const password = document.getElementById("auth-password")?.value;

  if (!email || !password) {
    alert("Veuillez remplir tous les champs.");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Création du document dans Firestore avec role "en_attente"
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      role: "en_attente",
      createdAt: new Date().toISOString()
    });

    alert("Compte créé avec succès ! En attente de validation par l'administrateur.");
  } catch (error) {
    alert("Erreur lors de l'inscription : " + error.message);
  }
};

// GESTION DES ACCÈS
onAuthStateChanged(auth, async (user) => {
  // Récupération du nom de la page actuelle
  const fullPath = window.location.pathname;
  let filename = fullPath.substring(fullPath.lastIndexOf('/') + 1).toLowerCase();

  // Si on est à la racine
  if (filename === "" || filename === "index.html") {
    filename = "index.htm";
  }

  // 1. SI L'UTILISATEUR N'EST PAS CONNECTÉ
  if (!user) {
    if (filename !== "connexion.htm") {
      window.location.replace("connexion.htm");
    } else {
      document.documentElement.style.visibility = "visible";
    }
    return;
  }

  // 2. SI L'UTILISATEUR EST CONNECTÉ
  
  // S'il est sur la page de connexion, on l'envoie sur l'accueil
  if (filename === "connexion.htm") {
    window.location.replace("index.htm");
    return;
  }

  // S'il est sur la page d'accueil, on affiche la page directement
  if (filename === "index.htm") {
    document.documentElement.style.visibility = "visible";
    return;
  }

  // 3. VÉRIFICATION DES PAGES DE COURS (ex: medecine.htm)
  try {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    
    if (userDoc.exists() && userDoc.data().role === "abonné") {
      // L'utilisateur est autorisé
      document.documentElement.style.visibility = "visible";
    } else {
      // L'utilisateur n'est PAS autorisé
      alert("Accès refusé : Votre compte est en attente d'approbation.");
      window.location.replace("index.htm");
    }
  } catch (error) {
    console.error("Erreur Firestore :", error);
    window.location.replace("index.htm");
  }
});
