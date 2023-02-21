import db, {auth, provider, storage, signInWithPopup, createUserWithEmailAndPassword} from "../firebase"
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth"
import store from "../store"
import {ADD_POST, SET_USER} from "./actionType"
import {doc, getDoc, collection, getDocs, setDoc} from "firebase/firestore"
import { async } from "@firebase/util"



export const setUser = (payload) =>({
  type: SET_USER,
  user: payload,
})

export const addPosting = (payload) =>({
  type: ADD_POST,
  post: payload,
})

async function userExistsInDB(userId){
   // Get the document reference
   const userDocumentRef = doc(db,"Users",userId)
   const userDocument = await getDoc(userDocumentRef);
   console.log(userDocument)
   if(userDocument.exists()){
    return true
   }
   console.log("nop")
   return false
}

async function getUserDataById(userId){
  // Get the document reference
  const userDocumentRef = doc(db,`Users/${userId}`)
  const userDocument = await getDoc(userDocumentRef);
  return userDocument.data()
}

async function createUserInDB(userId){
  /*const collectionRef = collection(db, "Users");
  const collectionSnap = await getDocs(collectionRef);
  collectionSnap.forEach(doc => {
    console.log(doc.data());
  })*/
    // Get the document reference
    console.log("got herrre")
    const userDocumentRef = doc(db,`Users/${userId}`)

  // Get the document data
  //const documentSnapshot = await documentRef.get();
   await setDoc(userDocumentRef, {
      userId: userId,
      name: "test",
      state: "test",
      country: "USA"
    });
  } 

export function signInAPI(){
 /* const collectionRef = collection(db, "Users");
  const collectionSnap = await getDocs(collectionRef);
  collectionSnap.forEach(doc => {
    console.log(doc.data());
})*/
  return (dispatch) =>{
    signInWithPopup(auth , provider)
    .then(async (payload) => {
      let userExist = await userExistsInDB(payload.user.uid)
      if(!userExist){
        console.log("here")
        //can send more data from google to create the user
        await createUserInDB(payload.user.uid)
      }
      const userData = await getUserDataById(payload.user.uid)
      dispatch(setUser(userData))})
    .catch((error) => alert(error.message))
  }
}

export function createUserByEmail(email, password){
  return (dispatch) =>{
    createUserWithEmailAndPassword(auth,email,password)
    .then(async (payload) => {
      console.log(payload)
      //provide him with more data to fill the field in database
      await createUserInDB(payload.user.uid)
      const userData = await getUserDataById(payload.user.uid)
      dispatch(setUser(userData))})
    .catch((error) => {
      console.log(error)
      alert(error.message)})
  }
}

export function loginWithEmail(email, password){
  return(dispatch) => {
    signInWithEmailAndPassword(auth, email, password)
  .then(async (userCredential) => {
    // Signed in 
    const user = userCredential.user;
    const userData = await getUserDataById(user.uid)
    dispatch(setUser(userData))
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert(errorMessage)
  });
  }
}

export function getUserAuth(){
  return (dispatch) =>{
    onAuthStateChanged(auth, async (user) =>{
      if(user){
        const userData = getUserDataById(user.uid)
        dispatch(setUser(userData))
      }
    })
  }
}

export function signOutAPI(){
  return (dispatch) => {
    auth.signOut().then(() => {
      dispatch(setUser(null))
    })
    .catch((error) => console.log(error))
  }
}


/*
export function createPosting(jobName, jobField, experience){
  return (dispacth) =>{
    //function that create a post in the database
    dispatch(addPosting(payload))
  }
}*/