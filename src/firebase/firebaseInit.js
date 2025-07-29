import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBpG4m4RuhUtPqYdoh2mZjDT16c6NngBO4",
  authDomain: "dashboard-salud.firebaseapp.com",
  projectId: "dashboard-salud",
  storageBucket: "dashboard-salud.firebasestorage.app",
  messagingSenderId: "170889911939",
  appId: "1:170889911939:web:3f3cd1573b8550619905b6",
  measurementId: "G-PTKKTPSVKN"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };