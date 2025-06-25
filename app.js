// Firebase App (the core Firebase SDK) is always required
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBP_07YnGi79bOMY1K6mm3gHVgk2-UUb_o",
  authDomain: "sign-in-backend-bfd1d.firebaseapp.com",
  projectId: "sign-in-backend-bfd1d",
  storageBucket: "sign-in-backend-bfd1d.firebasestorage.app",
  messagingSenderId: "480221653864",
  appId: "1:480221653864:web:02bf18eba295f8f87d04dd",
  measurementId: "G-35MJBXS97H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// Firestore collection reference
const signInCollection = collection(db, "signedInUsers");

// Sign In
window.signIn = async function () {
  const name = prompt("Enter your name to sign in:");
  if (!name) return;

  const time = new Date().toISOString();
  try {
    await addDoc(signInCollection, { name, time });
    alert(`${name} signed in at ${new Date(time).toLocaleString()}`);
  } catch (e) {
    console.error("Error signing in:", e);
    alert("Sign in failed.");
  }
};

// Sign Out
window.signOut = async function () {
  const snapshot = await getDocs(signInCollection);
  const users = [];
  snapshot.forEach((docSnap) => {
    users.push({ id: docSnap.id, ...docSnap.data() });
  });

  if (users.length === 0) {
    alert("No users currently signed in.");
    return;
  }

  const list = users.map((u, i) => `${i + 1}. ${u.name}`).join("\n");
  const index = parseInt(prompt(`Choose a number to sign out:\n${list}`)) - 1;

  if (index >= 0 && users[index]) {
    try {
      await deleteDoc(doc(db, "signedInUsers", users[index].id));
      alert(`${users[index].name} signed out.`);
      document.getElementById("signedInList").innerHTML = "";
    } catch (e) {
      console.error("Error signing out:", e);
      alert("Sign out failed.");
    }
  } else {
    alert("Invalid selection.");
  }
};

// View Signed In
window.viewSignedIn = async function () {
  const snapshot = await getDocs(signInCollection);
  const listContainer = document.getElementById("signedInList");
  const users = [];

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    users.push(`<li>${data.name} at ${new Date(data.time).toLocaleString()}</li>`);
  });

  listContainer.innerHTML = users.length > 0
    ? `<h3>Currently Signed In:</h3><ul>${users.join("")}</ul>`
    : "<p>No one is currently signed in.</p>";
};
