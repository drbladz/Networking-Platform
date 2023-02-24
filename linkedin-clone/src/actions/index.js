import db, {
  auth,
  provider,
  storage,
  signInWithPopup,
  createUserWithEmailAndPassword,
} from "../firebase";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import store from "../store";
import { ADD_POST, SET_USER } from "./actionType";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { async } from "@firebase/util";

export const setUser = (payload) => ({
  type: SET_USER,
  user: payload,
});

export const addPosting = (payload) => ({
  type: ADD_POST,
  post: payload,
});

// Define a function to handle form submission and update user document
export function updateUserProfile(userId, updatedUserData) {
  // Update the user document in the "Users" collection

  return async (dispatch) => {
    console.log("got herrre");
    const userDocumentRef = doc(db, `Users/${userId}`);

    const userData = await setDoc(userDocumentRef, updatedUserData, {
      merge: true,
    });
    console.log(userData);
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
          };
          //can send more data from google to create the user
          await createUserInDB(InitialDataToStore);
        }
        const userData = await getUserDataById(payload.user.uid);
        dispatch(setUser(userData));
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
        };
        //provide him with more data to fill the field in database
        await createUserInDB(InitialDataToStore);
        const userData = await getUserDataById(payload.user.uid);
        dispatch(setUser(userData));
      })
      .catch((error) => {
        console.log(error);
        alert(error.message);
      });
  };
}

export function loginWithEmail(email, password) {
  return (dispatch) => {
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Signed in
        const user = userCredential.user;
        const userData = await getUserDataById(user.uid);
        dispatch(setUser(userData));
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
      });
  };
}

export function getUserAuth() {
  return (dispatch) => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userData = getUserDataById(user.uid);
        dispatch(setUser(userData));
      }
    });
  };
}

export function signOutAPI() {
  return (dispatch) => {
    auth
      .signOut()
      .then(() => {
        dispatch(setUser(null));
      })
      .catch((error) => console.log(error));
  };
}

/*
export function createPosting(jobName, jobField, experience){
  return (dispacth) =>{
    //function that create a post in the database
    dispatch(addPosting(payload))
  }
}*/
