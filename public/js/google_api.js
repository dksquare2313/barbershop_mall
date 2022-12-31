// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAKOwX4fO9hsXo3H2S4wy9yJZwRY1rsVRQ",
  authDomain: "test-f3b4e.firebaseapp.com",
  projectId: "test-f3b4e",
  storageBucket: "test-f3b4e.appspot.com",
  messagingSenderId: "687864777558",
  appId: "1:687864777558:web:c9dbf59b2dbc0be93424f7",
  measurementId: "G-RYY2MHED18",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
