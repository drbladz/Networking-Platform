import db, {auth, provider, storage, signInWithPopup, createUserWithEmailAndPassword} from "../firebase"
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth"
import store from "../store"
import {SET_JOB_POSTINGS, SET_USER} from "./actionType"
import {doc, getDoc, collection, getDocs, setDoc, addDoc, updateDoc} from "firebase/firestore"
import { async } from "@firebase/util"
import { v4 as uuidv4 } from 'uuid';

export const setUser = (payload) => ({
  type: SET_USER,
  user: payload,
});

export const setJobPostings = (payload) =>({
  type: SET_JOB_POSTINGS,
  jobPostings: payload,
})

// Define a function to handle form submission and update user document
export function updateUserProfile(userId, updatedUserData, currentUserData) {
  // Update the user document in the "Users" collection
  for (let property in currentUserData) {
    if (
      updatedUserData[property] == "" ||
      !updatedUserData.hasOwnProperty(property)
    ) {
      updatedUserData[property] = currentUserData[property];
    }
  }

  return async (dispatch) => {
    console.log("got herrre");
    const userDocumentRef = doc(db, `Users/${userId}`);

    await setDoc(userDocumentRef, updatedUserData, {
      merge: true,
    });

    dispatch(setUser(updatedUserData));
  };
}

export function updateProfilePicture(userId, updatedPicture, file) {
  return async (dispatch) => {
    // Update the user document in the "Users" collection
    const userDocumentRef = doc(db, `Users/${userId}`);

    // If there is a file, convert it to base64 and store it in Firestore
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const fileData = reader.result;
        updatedPicture.profilePicture = fileData;
        await updateDoc(userDocumentRef, updatedPicture);
        dispatch({ type: "UPDATE_USER_PROFILE", payload: updatedPicture });
      };
    } else {
      // If there is no file, update the user document without profile picture
      await updateDoc(userDocumentRef, updatedPicture);
      dispatch({ type: "UPDATE_USER_PROFILE", payload: updatedPicture });
    }
  };
}

async function userExistsInDB(userId) {
  // Get the document reference
  const userDocumentRef = doc(db, "Users", userId);
  const userDocument = await getDoc(userDocumentRef);
  console.log(userDocument);
  if (userDocument.exists()) {
    return true;
  }
  console.log("nop");
  return false;
}

async function getUserDataById(userId) {
  // Get the document reference
  const userDocumentRef = doc(db, `Users/${userId}`);
  const userDocument = await getDoc(userDocumentRef);
  return userDocument.data();
}

async function createUserInDB(InitialUserData) {
  /*const collectionRef = collection(db, "Users");
  const collectionSnap = await getDocs(collectionRef);
  collectionSnap.forEach(doc => {
    console.log(doc.data());
  })*/
  // Get the document reference
  console.log("got herrre");
  const userDocumentRef = doc(db, `Users/${InitialUserData.userId}`);

  // Get the document data
  //const documentSnapshot = await documentRef.get();
  await setDoc(userDocumentRef, InitialUserData);
}

export function signInAPI() {
  /* const collectionRef = collection(db, "Users");
  const collectionSnap = await getDocs(collectionRef);
  collectionSnap.forEach(doc => {
    console.log(doc.data());
})*/
  return (dispatch) => {
    signInWithPopup(auth, provider)
      .then(async (payload) => {
        let userExist = await userExistsInDB(payload.user.uid);
        if (!userExist) {
          console.log("here");
          const InitialDataToStore = {
            userId: payload.user.uid,
            displayName: payload.user.displayName,
            photoURL: payload.user.photoURL,
            contactInfo: payload.user.phoneNumber,
            mail: payload.user.email,
            volunteerings: "",
            works: "",
            courses: "",
            educations: "",
            languages: "",
            projects: "",
            recommendations: "",
            skills: "",
            awards: "",
            bio: "",
            connections: [],
          };
          //can send more data from google to create the user
          await createUserInDB(InitialDataToStore);
        }
        const userData = await getUserDataById(payload.user.uid);
        dispatch(setUser(userData));
        const jobPostings = await getAllJobPostings()
        dispatch(setJobPostings(jobPostings))
      })
      .catch((error) => alert(error.message));
  };
}

export function createUserByEmail(email, password, fullName) {
  return (dispatch) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (payload) => {
        console.log(payload);
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
        //can send more data from google to create the user
        await createUserInDB(InitialDataToStore)
      
      const userData = await getUserDataById(payload.user.uid)
      dispatch(setUser(userData))
      const jobPostings = await getAllJobPostings()
      console.log("wawawaw")
      dispatch(setJobPostings(jobPostings))})
    .catch((error) => alert(error.message))
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

  export function createJobPosting(userId, postTitle, postDescription, currentPostingsList, userPhotoURL,displayName, mandatoryResume, mandatoryCoverLetter){
    return (dispatch) => {
      const newJobPostingData = {
        id: uuidv4(),
        userId: userId,
        postTitle: postTitle,
        postDescription: postDescription,
        timeStamp: Date.now(),
        photoURL: userPhotoURL,
        displayName: displayName,
        mandatoryResume: mandatoryResume,
        mandatoryCoverLetter: mandatoryCoverLetter
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
      console.log("got herrre" + newJobPostingData)

      // old code
      // const jobPostingCollectionRef = collection(db,`JobPostings`)
    
      const jobPostingCollectionRef = collection(db, 'JobPostings');
      const docRef = doc(jobPostingCollectionRef, newJobPostingData.id);

    // Get the document data
    //const documentSnapshot = await documentRef.get();

    if (newJobPostingData.mandatoryResume === undefined) {
      newJobPostingData.mandatoryResume = false;
    }
    if (newJobPostingData.mandatoryCoverLetter === undefined) {
      newJobPostingData.mandatoryCoverLetter = false;
    }
    // old code
    //await addDoc(jobPostingCollectionRef, newJobPostingData);

     await setDoc(docRef, newJobPostingData);
    } 

/*
export function createPosting(jobName, jobField, experience){
  return (dispacth) =>{
    //function that create a post in the database
    dispatch(addPosting(payload))
  }
}*/
