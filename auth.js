// Importation des SDK Firebase Web v10
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
  apiKey: "AlzaSyBb58B3tLEe4QOw-JJzlgDr06tcZ-9qgKY",
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

// --- FONCTION D'INSCRIPTION ---
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

    // Création de la fiche utilisateur dans Firestore
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      role: "gratuit",
      createdAt: new Date()
    });

    alert("Compte créé avec succès !");
    window.location.replace("index.htm");
  } catch (error) {
    alert("Erreur d'inscription : " + error.message);
  }
};

// --- FONCTION DE CONNEXION ---
window.login = async function() {
  const email = document.getElementById("auth-email")?.value;
  const password = document.getElementById("auth-password")?.value;

  if (!email || !password) {
    alert("Veuillez remplir tous les champs.");
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.replace("index.htm");
  } catch (error) {
    alert("Erreur de connexion : " + error.message);
  }
};

// --- FONCTION DE DÉCONNEXION ---
window.logout = function() {
  signOut(auth).then(() => {
    localStorage.removeItem("verifier_statut_apprentissage");
    window.location.replace("connexion.htm");
  });
};

// --- CONTROLES D'ACCÈS ET VERROUILLAGE ---
onAuthStateChanged(auth, async (user) => {
  const pageActuelle = window.location.pathname.split("/").pop() || "index.htm";
  const pageConnexion = "connexion.htm";

  if (!user) {
    // Si non connecté et pas sur la page de connexion -> Redirection immédiate
    if (pageActuelle !== pageConnexion) {
      window.location.replace(pageConnexion);
    }
  } else {
    // Si connecté et tente d'aller sur la page de connexion -> Redirection vers l'accueil
    if (pageActuelle === pageConnexion) {
      window.location.replace("index.htm");
      return;
    }

    // Gestion du statut d'abonnement Firestore
    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists() && userDoc.data().role === "abonné") {
        localStorage.setItem("verifier_statut_apprentissage", "true");
      } else {
        localStorage.setItem("verifier_statut_apprentissage", "false");
      }
    } catch (e) {
      console.error("Erreur Firestore :", e);
    }

    // Rendre la page visible une fois la sécurité vérifiée
    document.documentElement.style.visibility = "visible";
  }
});
