import db, {auth, provider, storage, signInWithPopup, createUserWithEmailAndPassword} from "../firebase"
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth"
import store from "../store"
import {ADD_POST, SET_USER} from "./actionType"
import {doc, getDoc, collection, getDocs, setDoc, updateDoc, FieldValue, arrayUnion, arrayRemove} from "firebase/firestore"
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

export async function getUsers(){
  const collectionRef = collection(db,"Users");
  const collectionSnap = await getDocs(collectionRef);
  console.log(collectionSnap);
  let users = [];
  collectionSnap.forEach(doc => {
    users.push(doc.data());
  })
  return users
}

export async function addConnectionById(id){
  const currentUserRef = doc(db,"Users",auth.currentUser.uid);
  const otherUserRef = doc(db,"Users",id);

  //current user is pending and other user gets a request
  updateDoc(currentUserRef, {pending: arrayUnion(id)});
  updateDoc(otherUserRef, {requests: arrayUnion(auth.currentUser.uid)});
  console.log("Request has been sent!");
}

export async function acceptRequest(id){
  const currentUserRef = doc(db,"Users",auth.currentUser.uid);
  const otherUserRef = doc(db,"Users",id);

  //Both users get added in their connections
  updateDoc(currentUserRef, {connections: arrayUnion(id)});
  updateDoc(otherUserRef, {connections: arrayUnion(auth.currentUser.uid)});
  console.log("accepted");
}

export async function declineRequest(id){
  const currentUserRef = doc(db,"Users",auth.currentUser.uid);
  const otherUserRef = doc(db,"Users",id);

  //remove request and pending for other user
  updateDoc(currentUserRef, {requests: arrayRemove(id)});
  updateDoc(otherUserRef, {pending: arrayRemove(auth.currentUser.uid)});
  console.log("declined");
}

export async function removeConnectionById(id){
  const currentUserRef = doc(db,"Users",auth.currentUser.uid);
  const otherUserRef = doc(db,"Users",id);

  //Remove connections for both users
  updateDoc(currentUserRef, {connections: arrayRemove(id)});
  updateDoc(otherUserRef, {connections: arrayRemove(auth.currentUser.uid)});
  console.log("removed");
}

export async function getNameById(id){
  const userDocumentRef = doc(db,"Users",id);
  const userDocument = await getDoc(userDocumentRef);
  console.log("get name");
  return userDocument.data().displayName;
  
}

export async function getRequests(){
  const userDocumentRef = doc(db,"Users",auth.currentUser.id);
  const userDocument = await getDoc(userDocumentRef);
  return userDocument.data().requests;
}

async function getUserDataById(userId){
  // Get the document reference
  const userDocumentRef = doc(db,`Users/${userId}`)
  const userDocument = await getDoc(userDocumentRef);
  return userDocument.data()
}

async function createUserInDB(InitialUserData){
  /*const collectionRef = collection(db, "Users");
  const collectionSnap = await getDocs(collectionRef);
  collectionSnap.forEach(doc => {
    console.log(doc.data());
  })*/
    // Get the document reference
    console.log("got herrre")
    const userDocumentRef = doc(db,`Users/${InitialUserData.userId}`)

  // Get the document data
  //const documentSnapshot = await documentRef.get();
   await setDoc(userDocumentRef, InitialUserData);
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
        const InitialDataToStore = {
          userId: payload.user.uid,
          displayName: payload.user.displayName,
          photoURL: payload.user.photoURL,
          contactInfo: payload.user.phoneNumber,
          mail: payload.user.email,
          volunteerings: [],
          works: [],
          courses: [],
          educations: [],
          languages: [],
          projects: [],
          recommendations: [],
          skills: [],
          awards: [],
          bio: "",
          connections: [],
          requests: [],
          pending: [],
        }
        //can send more data from google to create the user
        await createUserInDB(InitialDataToStore)
      }
      const userData = await getUserDataById(payload.user.uid)
      dispatch(setUser(userData))})
    .catch((error) => alert(error.message))
  }
}

export function createUserByEmail(email, password, fullName){
  return (dispatch) =>{
    createUserWithEmailAndPassword(auth,email,password)
    .then(async (payload) => {
      console.log(payload)
      const InitialDataToStore = {
        userId: payload.user.uid,
        displayName: fullName,
        photoURL: "",
        contactInfo: "",
        mail: email,
        volunteerings: [],
        works: [],
        courses: [],
        educations: [],
        languages: [],
        projects: [],
        recommendations: [],
        skills: [],
        awards: [],
        bio: "",
        connections: [],
        requests: [],
        pending: [],
      }
      //provide him with more data to fill the field in database
      await createUserInDB(InitialDataToStore)
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