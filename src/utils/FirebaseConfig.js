
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { collection, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBk1mTwGyGPX2oy9H5h4DQPlq83q6WYkj8",
  authDomain: "quirxtalk-2.firebaseapp.com",
  projectId: "quirxtalk-2",
  storageBucket: "quirxtalk-2.appspot.com",
  messagingSenderId: "967299154610",
  appId: "1:967299154610:web:1abdaf637909769d38ffab",
  measurementId: "G-ZL9JLEK2P9"
};

const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);
export const firebaseDB = getFirestore(app);

export const userRef = collection(firebaseDB,"users");
export const meetingRef = collection(firebaseDB,"meetings");