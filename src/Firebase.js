// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCGgYBm8TFwDo9G3SWUOGomDn-C2kxQufc",
  authDomain: "karna-bcf2d.firebaseapp.com",
  projectId: "karna-bcf2d",
  storageBucket: "karna-bcf2d.firebasestorage.app",
  messagingSenderId: "851822033683",
  appId: "1:851822033683:web:f44723b450f8bb12d878e6",
  measurementId: "G-J9L7GF5B2G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Auth and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

// Export providers
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();

export default app;