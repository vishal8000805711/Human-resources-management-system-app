import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAHk2cQiFc1IOywTPeGc16GsBILA1UVP50",
  authDomain: "human-resource-management-sys.firebaseapp.com",
  projectId: "human-resource-management-sys",
  storageBucket: "human-resource-management-sys.firebasestorage.app",
  messagingSenderId: "491397390398",
  appId: "1:491397390398:web:484b3cb5cc465474c2316f",
  measurementId: "G-LTEPJ67LDW"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)