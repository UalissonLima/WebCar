import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCmsB5K5oVkNRCSwVcQZAjPUsWyuwmLnJY",
  authDomain: "webcar-54f2b.firebaseapp.com",
  projectId: "webcar-54f2b",
  storageBucket: "webcar-54f2b.appspot.com",
  messagingSenderId: "719479098787",
  appId: "1:719479098787:web:e7db616c66aad0145b5e16",
  measurementId: "G-5JG9TZS759"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { db, storage, auth };
