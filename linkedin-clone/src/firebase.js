import firebase from "firebase"

const firebaseConfig = {
  apiKey: "AIzaSyBSQt_8LUhxp_XTDsPE2jbkiPLiBXbsNHk",
  authDomain: "linkedin-clone-9fd09.firebaseapp.com",
  projectId: "linkedin-clone-9fd09",
  storageBucket: "linkedin-clone-9fd09.appspot.com",
  messagingSenderId: "1035473589943",
  appId: "1:1035473589943:web:6bbb31759f0906592e1f32",
  measurementId: "G-051EYS02K7"
};

const firebaseApp = firebase.initializeApp(firebaseConfig)
const db = firebaseApp.firestore()

const auth = firebase.auth()
const provider = new firebase.auth.GoogleAuthProvider()

const storage = firebase.storage()

export {auth, provider, storage}
export default db