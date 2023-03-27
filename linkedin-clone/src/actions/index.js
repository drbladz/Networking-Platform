import db, {
  auth,
  provider,
  storage,
  signInWithPopup,
  createUserWithEmailAndPassword,
} from "../firebase";
import { getAuth } from "firebase/auth";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import store from "../store";
import { SET_JOB_POSTINGS, SET_USER, SET_USER_JOB_POSTINGS } from "./actionType";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  arrayUnion, 
  arrayRemove,
} from "firebase/firestore";
import { async } from "@firebase/util";
import { v4 as uuidv4 } from "uuid";

export const setUser = (payload) => ({
  type: SET_USER,
  user: payload,
});

export const setJobPostings = (payload) => ({
  type: SET_JOB_POSTINGS,
  jobPostings: payload,
});

export const setUserJobPostings = (payload) => ({
  type: SET_USER_JOB_POSTINGS,
  userJobPostings: payload
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

export const updateProfilePicture = (currentUser) => {
  console.log("yuyu");
  return (dispatch) => {
    dispatch(setUser(currentUser));
  };
};

/*
export const updateDocuments = (currentUser) => {
  return (dispatch) => {
    dispatch(setUser(currentUser));
  };
};
*/

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

export function addConnectionById(id){
  return async (dispatch) => {
    const currentUserRef = doc(db,"Users",auth.currentUser.uid);
    const currentUserDocument = await getDoc(currentUserRef);
    const otherUserRef = doc(db,"Users",id);

    //current user is pending and other user gets a request
    updateDoc(currentUserRef, {pending: arrayUnion(id)});
    updateDoc(otherUserRef, {requests: arrayUnion({id: auth.currentUser.uid, name: currentUserDocument.data().displayName, photoURL: currentUserDocument.data().photoURL})});
    console.log("Request has been sent!");

    const userData = await getUserDataById(auth.currentUser.uid);
    dispatch(setUser(userData));
  }
}

export function acceptRequest(id){
  return async (dispatch) => {
    const currentUserRef = doc(db,"Users",auth.currentUser.uid);
    const currentUserDocument = await getDoc(currentUserRef);
    const otherUserRef = doc(db,"Users",id);
    const otherUserDocument = await getDoc(otherUserRef);

    //Both users get added in their connections
    updateDoc(currentUserRef, {connections: arrayUnion({id: id, name: otherUserDocument.data().displayName, photoURL: otherUserDocument.data().photoURL})});
    updateDoc(otherUserRef, {connections: arrayUnion({id: auth.currentUser.uid, name: currentUserDocument.data().displayName, photoURL: currentUserDocument.data().photoURL})});
    //Clear their pending and request
    updateDoc(currentUserRef, {requests: arrayRemove({id: id, name: otherUserDocument.data().displayName, photoURL: otherUserDocument.data().photoURL})});
    updateDoc(otherUserRef, {pending: arrayRemove(auth.currentUser.uid)});
    console.log("accepted");

    const userData = await getUserDataById(auth.currentUser.uid);
    dispatch(setUser(userData));
  }
  
}

export function declineRequest(id){
  return async (dispatch) => {
    const currentUserRef = doc(db,"Users",auth.currentUser.uid);
    const otherUserRef = doc(db,"Users",id);
    const otherUserDocument = await getDoc(otherUserRef);

    //remove request and pending for other user
    updateDoc(currentUserRef, {requests: arrayRemove({id: id, name: otherUserDocument.data().displayName, photoURL: otherUserDocument.data().photoURL})});
    updateDoc(otherUserRef, {pending: arrayRemove(auth.currentUser.uid)});
    console.log("declined");

    const userData = await getUserDataById(auth.currentUser.uid);
    dispatch(setUser(userData));
  }
}

export function removeConnectionById(id){
  return async (dispatch) => {
    const currentUserRef = doc(db,"Users",auth.currentUser.uid);
    const currentUserDocument = await getDoc(currentUserRef);
    const otherUserRef = doc(db,"Users",id);
    const otherUserDocument = await getDoc(otherUserRef);

    //Remove connections for both users
    updateDoc(currentUserRef, {connections: arrayRemove({id: id, name: otherUserDocument.data().displayName, photoURL: otherUserDocument.data().photoURL})});
    updateDoc(otherUserRef, {connections: arrayRemove({id: auth.currentUser.uid, name: currentUserDocument.data().displayName, photoURL: currentUserDocument.data().photoURL})});
    console.log("removed");

    const userData = await getUserDataById(auth.currentUser.uid);
    dispatch(setUser(userData));
  }
  
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
            requests: [],
            pending: [],
          };
          //can send more data from google to create the user
          await createUserInDB(InitialDataToStore);
        }
        const userData = await getUserDataById(payload.user.uid);
        dispatch(setUser(userData));
        const jobPostings = await getAllJobPostings();
        dispatch(setJobPostings(jobPostings));
        const userJobPostings = jobPostings.filter(job => job.userId == userData.userId)
        dispatch(setUserJobPostings(userJobPostings))
      })
      .catch((error) => alert(error.message));
  };
}

export function createUserByEmail(email, password, fullName) {
  return (dispatch) => {
    createUserWithEmailAndPassword(auth, email, password).then(
      async (payload) => {
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
          requests: [],
          pending: [],
        };
        //can send more data from google to create the user
        await createUserInDB(InitialDataToStore);
        const userData = await getUserDataById(payload.user.uid)
        dispatch(setUser(userData))
        const jobPostings = await getAllJobPostings();
        dispatch(setJobPostings(jobPostings));
        const userJobPostings = jobPostings.filter(job => job.userId == userData.userId)
        dispatch(setUserJobPostings(userJobPostings))
      }
    );
  };
}

export function editJobPosting(
 editedJobPosting,
 currentPostingsList
) {
  return async (dispatch) => {
    const jobDocumentRef = doc(db, `JobPostings/${editedJobPosting.id}`);
      await setDoc(jobDocumentRef, editedJobPosting)
      .then(() => {
       currentPostingsList = currentPostingsList.filter((job) => job.id != editedJobPosting.id)
        currentPostingsList.push(editedJobPosting);
        const newPostingsList = currentPostingsList.map((job) => job);
        const newUserPostingsList = []
        for(let i in newPostingsList){
          if(newPostingsList[i].userId == editedJobPosting.userId){
            newUserPostingsList.push(newPostingsList[i])
          }
        }
        dispatch(setJobPostings(newPostingsList));
        dispatch(setUserJobPostings(newUserPostingsList))
      })
      .catch((error) => alert(error.message));
  };
}

export function deleteJobPosting(
  jobPostingId,
  userId,
  currentPostingsList
 ) {
   return async (dispatch) => {
     const jobDocumentRef = doc(db, `JobPostings/${jobPostingId}`);
       await deleteDoc(jobDocumentRef)
       .then(() => {
        currentPostingsList = currentPostingsList.filter((job) => job.id != jobPostingId)
         const newPostingsList = currentPostingsList.map((job) => job);
         const newUserPostingsList = []
         for(let i in newPostingsList){
           if(newPostingsList[i].userId == userId){
             newUserPostingsList.push(newPostingsList[i])
           }
         }
         dispatch(setJobPostings(newPostingsList));
         dispatch(setUserJobPostings(newUserPostingsList))
       })
       .catch((error) => alert(error.message));
   };
 }

export function createJobPosting(
  userId,
  postTitle,
  postDescription,
  currentPostingsList,
  userPhotoURL,
  displayName,
  mandatoryResume,
  mandatoryCoverLetter,
  isExternal,
  jobParameters
) {
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
      mandatoryCoverLetter: mandatoryCoverLetter,
      isExternal: isExternal,
      jobParameters: jobParameters
    };
    createJobPostingInDB(newJobPostingData)
      .then(() => {
        currentPostingsList.push(newJobPostingData);
        const newPostingsList = currentPostingsList.map((ele) => ele);
        const newUserPostingsList = []
        for(let i in newPostingsList){
          if(newPostingsList[i].userId == userId){
            newUserPostingsList.push(newPostingsList[i])
          }
        }
        dispatch(setJobPostings(newPostingsList));
        dispatch(setUserJobPostings(newUserPostingsList))
      })
      .catch((error) => alert(error.message));
  };
}

export function loginWithEmail(email, password) {
  console.log("here")
  return (dispatch) => {
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Signed in
        const user = userCredential.user;
        const userData = await getUserDataById(user.uid);
        dispatch(setUser(userData));
        const jobPostings = await getAllJobPostings();
        console.log("wowowo");
        dispatch(setJobPostings(jobPostings));
        const userJobPostings = jobPostings.filter(job => job.userId == userData.userId)
        dispatch(setUserJobPostings(userJobPostings))
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage)
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
        dispatch(setJobPostings(null));
      })
      .catch((error) => console.log(error));
  };
}

async function getAllJobPostings() {
  console.log("here");
  const jobPostingsRef = collection(db, "JobPostings");
  const jobPostingsRaw = await getDocs(jobPostingsRef);
  const jobPostingsData = [];
  jobPostingsRaw.forEach((doc) => {
    jobPostingsData.push(doc.data());
  });
  console.log("leaving");
  return jobPostingsData;
}
export { getAllJobPostings };
async function createJobPostingInDB(newJobPostingData) {
  /*const collectionRef = collection(db, "Users");
    const collectionSnap = await getDocs(collectionRef);
    collectionSnap.forEach(doc => {
      console.log(doc.data());
    })*/
  // Get the document reference
  console.log("got herrre" + newJobPostingData);

  // old code
  // const jobPostingCollectionRef = collection(db,`JobPostings`)

  const jobPostingCollectionRef = collection(db, "JobPostings");
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


export const filterJobsByPreferences = (jobs, preferences) => {
  return jobs.filter((job) => {
    if (!job.jobParameters) {
      return false;
    }

    const {
      experienceLevel,
      industry,
      jobType,
      remoteWorkOption,
    } = job.jobParameters;

    return (
      experienceLevel === preferences.experienceLevel &&
      industry === preferences.industry &&
      jobType === preferences.jobType &&
      remoteWorkOption === preferences.remoteWorkOption
    );
  });
};

export   const getUserSearchingPreferences = async () => {
  try {
    const currentUser = getAuth().currentUser;
    const userDocRef = doc(db, 'Users', currentUser.uid);
    const docSnap = await getDoc(userDocRef);
    
    if (docSnap.exists()) {
      const userData = docSnap.data();
      return userData.searchingPreferences;
    } else {
      console.log('No user found with this userId:', currentUser.uid);
      return null;
    }
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    return null;
  }
};