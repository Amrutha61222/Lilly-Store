import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyB7nHNZQ9_RmT2s9DgKlw6hOkxI2sIlB7o",
    authDomain: "lilly-store.firebaseapp.com",
    projectId: "lilly-store",
    storageBucket: "lilly-store.firebasestorage.app",
    messagingSenderId: "669357936868",
    appId: "1:669357936868:web:4acfbea43079afb9545cf1",
    measurementId: "G-DKRRX0WCVY"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


export { auth, db };


