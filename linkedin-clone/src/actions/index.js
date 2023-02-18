import db, {auth, provider, storage, signInWithPopup} from "../firebase"
import store from "../store"
import {ADD_POST, SET_USER} from "./actionType"
import {doc, getDoc, collection, getDocs} from "firebase/firestore"



export const setUser = (payload) =>({
  type: SET_USER,
  user: payload,
})

export const addPosting = (payload) =>({
  type: ADD_POST,
  post: payload,
})

export function signInAPI(){
 /* const collectionRef = collection(db, "Users");
  const collectionSnap = await getDocs(collectionRef);
  collectionSnap.forEach(doc => {
    console.log(doc.data());
})*/
  return (dispatch) =>{
    
    signInWithPopup(auth , provider)
    .then((payload) => {
      console.log(payload)
      dispatch(setUser(payload.user))})
    .catch((error) => alert(error.message))
  }
}

export function createUser(email, password){
  return (dispatch) =>{
    console.log(email + ' ' + password)
    auth.createUserWithEmailAndPassword(email, password)
    .catch((error) => {
      console.log("err")
      alert(error.message)})
      console.log("here")
  }
}

export function getUserAuth(){
  return (dispatch) =>{
    auth.onAuthStateChanged(async (user) =>{
      if(user){
        dispatch(setUser(user))
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