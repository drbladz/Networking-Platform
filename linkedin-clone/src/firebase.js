import { initializeApp } from 'firebase/app';
import { getFirestore} from 'firebase/firestore';
import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBSQt_8LUhxp_XTDsPE2jbkiPLiBXbsNHk",
  authDomain: "linkedin-clone-9fd09.firebaseapp.com",
  projectId: "linkedin-clone-9fd09",
  storageBucket: "linkedin-clone-9fd09.appspot.com",
  messagingSenderId: "1035473589943",
  appId: "1:1035473589943:web:6bbb31759f0906592e1f32",
  measurementId: "G-051EYS02K7"
};

const firebaseApp = initializeApp(firebaseConfig)
const db = getFirestore(firebaseApp)

const auth = getAuth(firebaseApp)
const provider = new GoogleAuthProvider()

const storage = getStorage()

export {auth, storage, db, provider, signInWithPopup, createUserWithEmailAndPassword}
export default db