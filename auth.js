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

// Connexion
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

// Inscription
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

    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      role: "en_attente",
      createdAt: new Date().toISOString()
    });

    alert("Compte créé avec succès ! En attente d'approbation.");
  } catch (error) {
    alert("Erreur lors de l'inscription : " + error.message);
  }
};

// Gestion centralisée de la sécurité et des accès
onAuthStateChanged(auth, async (user) => {
  let pathname = window.location.pathname;
  let pageActuelle = pathname.split("/").pop().toLowerCase();

  if (pageActuelle === "" || pageActuelle === "index.html" || pathname.endsWith("/")) {
    pageActuelle = "index.htm";
  }

  const pageConnexion = "connexion.htm";
  const pageAccueil = "index.htm";

  // 1. Visiteur NON connecté
  if (!user) {
    if (pageActuelle !== pageConnexion) {
      window.location.replace(pageConnexion);
    } else {
      document.documentElement.style.visibility = "visible";
    }
    return;
  }

  // 2. Utilisateur connecté sur la page de connexion
  if (pageActuelle === pageConnexion) {
    window.location.replace(pageAccueil);
    return;
  }

  // 3. Vérification du rôle dans Firestore
  try {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    const estAbonne = userDoc.exists() && userDoc.data().role === "abonné";

    // Si on est sur une page de cours (pas l'accueil) et pas abonné -> Redirection accueil
    if (pageActuelle !== pageAccueil && !estAbonne) {
      alert("Accès refusé : Votre compte n'est pas encore activé par l'administrateur.");
      window.location.replace(pageAccueil);
      return;
    }

    // Sinon, afficher la page normalement
    document.documentElement.style.visibility = "visible";

  } catch (e) {
    console.error("Erreur de vérification Firestore :", e);
    if (pageActuelle !== pageAccueil) {
      window.location.replace(pageAccueil);
    }
  }
});
