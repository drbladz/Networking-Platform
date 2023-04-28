import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDSF95Omw8cDWsSJv0voode74ejNERmM3Y",
  authDomain: "linkedin-clone-4d54b.firebaseapp.com",
  projectId: "linkedin-clone-4d54b",
  storageBucket: "linkedin-clone-4d54b.appspot.com",
  messagingSenderId: "282227423036",
  appId: "1:282227423036:web:01cdf61961f1dcf27ed039",
  measurementId: "G-SBWGHV1VVT"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const auth = getAuth(firebaseApp);
const provider = new GoogleAuthProvider();

const storage = getStorage(firebaseApp);

export {
  auth,
  storage,
  db,
  provider,
  signInWithPopup,
  createUserWithEmailAndPassword,
};
export default db;




