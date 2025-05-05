
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAfTyc7HCyRtSUO4bzdtxp_wH_ipNBuYOw",
  authDomain: "ai-rh-platform.firebaseapp.com",
  projectId: "ai-rh-platform",
  storageBucket: "ai-rh-platform.firebasestorage.app",
  messagingSenderId: "960665959797",
  appId: "1:960665959797:web:d88deeb8fa417ba2ea273c",
  measurementId: "G-HF7GG2J11R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
