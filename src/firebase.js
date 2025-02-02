// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// Remove analytics if you're not using it
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDodcV18ab4Lr5Bo2iG7Djqb_o7EXp9Vxw",
  authDomain: "wildfire-4c52d.firebaseapp.com",
  projectId: "wildfire-4c52d",
  storageBucket: "wildfire-4c52d.firebasestorage.app",
  messagingSenderId: "598914825976",
  appId: "1:598914825976:web:8572ab1e7e8cdc68f0050d",
  measurementId: "G-5G9005SNPY"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
// Remove analytics if you're not using it
// export const analytics = getAnalytics(app);  