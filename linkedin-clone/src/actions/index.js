import db, {auth, provider, storage, signInWithPopup, createUserWithEmailAndPassword} from "../firebase"
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth"
import store from "../store"
import {SET_JOB_POSTINGS, SET_USER} from "./actionType"
import {doc, getDoc, collection, getDocs, setDoc, addDoc} from "firebase/firestore"
import { async } from "@firebase/util"



export const setUser = (payload) =>({
  type: SET_USER,
  user: payload,
})

export const setJobPostings = (payload) =>({
  type: SET_JOB_POSTINGS,
  jobPostings: payload,
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

        }
        //can send more data from google to create the user
        await createUserInDB(InitialDataToStore)
      }
      const userData = await getUserDataById(payload.user.uid)
      dispatch(setUser(userData))
      const jobPostings = await getAllJobPostings()
      console.log("wawawaw")
      dispatch(setJobPostings(jobPostings))})
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
      }
      //provide him with more data to fill the field in database
      await createUserInDB(InitialDataToStore)
      const userData = await getUserDataById(payload.user.uid)
      dispatch(setUser(userData))
      const jobPostings = await getAllJobPostings()
      dispatch(setJobPostings(jobPostings))})
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
    const jobPostings = await getAllJobPostings()
    console.log("wowowo")
    dispatch(setJobPostings(jobPostings))
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
      dispatch(setJobPostings(null))
    })
    .catch((error) => console.log(error))
  }
}

async function getAllJobPostings(){
    console.log("here")
    const jobPostingsRef = collection(db, "JobPostings");
    const jobPostingsRaw = await getDocs(jobPostingsRef);
    const jobPostingsData = []
    jobPostingsRaw.forEach(doc => {
    jobPostingsData.push(doc.data());
  })
  console.log("leaving")
  return jobPostingsData
  }

  export function createJobPosting(userId, postTitle, postDescription, currentPostingsList, userPhotoURL,displayName){
    return (dispatch) => {
      const newJobPostingData = {
        userId: userId,
        postTitle: postTitle,
        postDescription: postDescription,
        timeStamp: Date.now(),
        photoURL: userPhotoURL,
        displayName: displayName
      }
      createJobPostingInDB(newJobPostingData).then(() => {
        currentPostingsList.push(newJobPostingData);
        const newPostingsList = currentPostingsList.map(ele => ele)
        dispatch(setJobPostings(newPostingsList))
      })
      .catch((error) => console.log(error))
    }
  }

  async function createJobPostingInDB(newJobPostingData){
    /*const collectionRef = collection(db, "Users");
    const collectionSnap = await getDocs(collectionRef);
    collectionSnap.forEach(doc => {
      console.log(doc.data());
    })*/
      // Get the document reference
      console.log("got herrre")
      const jobPostingCollectionRef = collection(db,`JobPostings`)
  
    // Get the document data
    //const documentSnapshot = await documentRef.get();
     await addDoc(jobPostingCollectionRef, newJobPostingData);
    } 

/*
export function createPosting(jobName, jobField, experience){
  return (dispacth) =>{
    //function that create a post in the database
    dispatch(addPosting(payload))
  }
}*/