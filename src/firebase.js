// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyARhDWQhzJ6j_EvQi6e4a8NfmWQIUbtQvQ",
  authDomain: "budget-app-65d20.firebaseapp.com",
  projectId: "budget-app-65d20",
  storageBucket: "budget-app-65d20.appspot.com",
  messagingSenderId: "1007059826160",
  appId: "1:1007059826160:web:e104ae296e43697eca5935",
  measurementId: "G-HZXCJS8L5S",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);
export const db = getFirestore(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;
