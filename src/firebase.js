// firebase.js
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
    apiKey: "AIzaSyDfjQWgESRPJ9-25gui7Xg-Se6ggPSmmrg",
    authDomain: "prof-bruno.firebaseapp.com",
    projectId: "prof-bruno",
    storageBucket: "prof-bruno.appspot.com",
    messagingSenderId: "668359353020",
    appId: "1:668359353020:web:ea3b9b16082435074c66b9"
};

const app = firebase.initializeApp(firebaseConfig);

const db = app.firestore();
const storage = app.storage();
const auth = app.auth();

export { db, storage, auth, firebase as default };
