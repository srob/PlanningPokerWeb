import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD_Jka-UXy2UH8EaDOV8qH7eEqKnNYIGkM",
  authDomain: "planningpoker-d1443.firebaseapp.com",
  projectId: "planningpoker-d1443",
  storageBucket: "planningpoker-d1443.firebasestorage.app",
  messagingSenderId: "630121000526",
  appId: "1:630121000526:web:e180bd5bf8f3a4df5cdd1f"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
