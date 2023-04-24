// Import the required firebase modules, actions and other external dependencies.
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
import {
  SET_JOB_POSTINGS,
  SET_USER,
  SET_USER_JOB_POSTINGS,
} from "./actionType";
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
  query,
  where,
} from "firebase/firestore";
import { async } from "@firebase/util";
import { v4 as uuidv4 } from "uuid";
import { useParams } from "react-router-dom";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';




// Define an action creator to set the current user in the store.
export const setUser = (payload) => ({
  type: SET_USER,
  user: payload,
});
// Define an action creator to set the job postings in the store.
export const setJobPostings = (payload) => ({
  type: SET_JOB_POSTINGS,
  jobPostings: payload,
});
// Define an action creator to set the user job postings in the store.
export const setUserJobPostings = (payload) => ({
  type: SET_USER_JOB_POSTINGS,
  userJobPostings: payload,
});

/* export function updateGroup(userId, updatedGroupData, currentGroupData) {
  for (let property in currentGroupData) {
    if (
      updatedGroupData[property] == "" ||
      !updatedGroupData.hasOwnProperty(property)
    ) {
      updatedGroupData[property] = currentGroupData[property];
    }
  }

  return async (dispatch) => {
    const groupDocumentRef = doc(db, `Groups/${userId}`);

    // Check if the document exists
    const groupDocument = await getDoc(groupDocumentRef);

    if (!groupDocument.exists()) {
      // If the document doesn't exist, create it with the initial data
      await setDoc(groupDocumentRef, updatedGroupData, {
        merge: true,
      });
    } else {
      // If the document exists, update it with the merged data
      await updateDoc(groupDocumentRef, updatedGroupData);
    }

    dispatch(setUser(updatedGroupData));
  };
} */

// Define a function to handle form submission and update user document
export function updateUserProfile(userId, updatedUserData, currentUserData) {
  // Update the user document in the "Users" collection
  for (let property in currentUserData) {
    if (
      //updatedUserData[property] == "" ||
      !updatedUserData.hasOwnProperty(property)
    ) {
      updatedUserData[property] = currentUserData[property];
    }
  }
  // Async function to update the user document and dispatch the updated user data to the store.

  return async (dispatch) => {
    console.log("got herrre");
    const userDocumentRef = doc(db, `Users/${userId}`);

    await setDoc(userDocumentRef, updatedUserData, {
      merge: true,
    });

    dispatch(setUser(updatedUserData));
  };
}
// Define an action creator to set the updated profile picture in the store.
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
// Async function to get all the users from the database.
export async function getUsers() {
  const collectionRef = collection(db, "Users");
  const collectionSnap = await getDocs(collectionRef);
  console.log(collectionSnap);
  let users = [];
  collectionSnap.forEach((doc) => {
    users.push(doc.data());
  });
  return users;
}

// Async function to get all the groups from the database.
export async function getGroups() {
  const collectionRef = collection(db, "Groups");
  const collectionSnap = await getDocs(collectionRef);
  console.log(collectionSnap);
  let groups = [];
  collectionSnap.forEach((doc) => {
    groups.push({ ...doc.data(), groupId: doc.id });
  });
  return groups;
}

export const sendJoinGroupRequest = (groupId, userId) => {
  return async (dispatch) => {
    const currentUserRef = doc(db, "Users", userId);
    const currentUserDocument = await getDoc(currentUserRef);
    const groupRef = doc(db, "Groups", groupId);
    const groupDocument = await getDoc(groupRef);
    const groupCreatorId = groupDocument.data().createdBy;
    const groupCreatorRef = doc(db, "Users", groupCreatorId);

    // Add pending group for the current user
    updateDoc(currentUserRef, { pendingGroups: arrayUnion(groupId) });

    // Add join request for the group creator
    updateDoc(groupCreatorRef, {
      groupJoinRequests: arrayUnion({
        groupId: groupId,
        groupName: groupDocument.data().groupName,
        userId: userId,
        userName: currentUserDocument.data().displayName,
        userPhotoURL: currentUserDocument.data().photoURL,
      }),
    });

    // Add the groupId to the user's pendingJoinRequests field in Firebase
    const userRef = doc(db, "Users", userId);
    updateDoc(userRef, {
      pendingJoinRequests: arrayUnion(groupId),
    });

    // Create notification for the group creator
    updateDoc(groupCreatorRef, {
      notifications: arrayUnion({
        notification: `${
          currentUserDocument.data().displayName
        } wants to join ${groupDocument.data().groupName}.`,
        photoURL: currentUserDocument.data().photoURL,
        date: new Date(),
        viewed: false,
      }),
    });

    const userData = await getUserDataById(auth.currentUser.uid);
    dispatch(setUser(userData));
  };
};

// Async function to add a connection by id.
export function addConnectionById(id) {
  return async (dispatch) => {
    const currentUserRef = doc(db, "Users", auth.currentUser.uid);
    const currentUserDocument = await getDoc(currentUserRef);
    const otherUserRef = doc(db, "Users", id);

    //current user is pending and other user gets a request
    // Add pending and request for the current user and other user, respectively.
    updateDoc(currentUserRef, { pending: arrayUnion(id) });
    updateDoc(otherUserRef, {
      requests: arrayUnion({
        id: auth.currentUser.uid,
        name: currentUserDocument.data().displayName,
        photoURL: currentUserDocument.data().photoURL,
      }),
    });

    // Create notification for the other user
    updateDoc(otherUserRef, {
      notifications: arrayUnion({
        notification: `${
          currentUserDocument.data().displayName
        } wants to connect.`,
        photoURL: currentUserDocument.data().photoURL,
        date: new Date(),
        viewed: false,
      }),
    });
    console.log("Request has been sent!");

    const userData = await getUserDataById(auth.currentUser.uid);
    dispatch(setUser(userData));
  };
}
// This function accepts a request by updating the current user's document and the document of the user with the specified ID
// It takes in an "id" parameter which is the ID of the user whose request is being accepted
export function acceptRequest(id) {
  return async (dispatch) => {
    // Get the document of the current user
    const currentUserRef = doc(db, "Users", auth.currentUser.uid);
    const currentUserDocument = await getDoc(currentUserRef);
    // Get the document of the other user
    const otherUserRef = doc(db, "Users", id);
    const otherUserDocument = await getDoc(otherUserRef);

    //Both users get added in their connections
    updateDoc(currentUserRef, {
      connections: arrayUnion({
        id: id,
        name: otherUserDocument.data().displayName,
        photoURL: otherUserDocument.data().photoURL,
      }),
    });
    updateDoc(otherUserRef, {
      connections: arrayUnion({
        id: auth.currentUser.uid,
        name: currentUserDocument.data().displayName,
        photoURL: currentUserDocument.data().photoURL,
      }),
    });
    //Clear their pending and request
    updateDoc(currentUserRef, {
      requests: arrayRemove({
        id: id,
        name: otherUserDocument.data().displayName,
        photoURL: otherUserDocument.data().photoURL,
      }),
    });
    updateDoc(otherUserRef, { pending: arrayRemove(auth.currentUser.uid) });

    // Create notification for the other user
    updateDoc(otherUserRef, {
      notifications: arrayUnion({
        notification: `${
          currentUserDocument.data().displayName
        } accepted you request.`,
        photoURL: currentUserDocument.data().photoURL,
        date: new Date(),
        viewed: false,
      }),
    });
    console.log("accepted");

    const userData = await getUserDataById(auth.currentUser.uid);
    dispatch(setUser(userData));
  };
}
// This function declines a request by removing it from the current user's document and the document of the user with the specified ID
// It takes in an "id" parameter which is the ID of the user whose request is being declined
export function declineRequest(id) {
  return async (dispatch) => {
    const currentUserRef = doc(db, "Users", auth.currentUser.uid);
    const otherUserRef = doc(db, "Users", id);
    const otherUserDocument = await getDoc(otherUserRef);

    //remove request and pending for other user
    updateDoc(currentUserRef, {
      requests: arrayRemove({
        id: id,
        name: otherUserDocument.data().displayName,
        photoURL: otherUserDocument.data().photoURL,
      }),
    });
    updateDoc(otherUserRef, { pending: arrayRemove(auth.currentUser.uid) });
    console.log("declined");
    // Retrieve the current user's data and dispatch it using the "setUser" function
    const userData = await getUserDataById(auth.currentUser.uid);
    dispatch(setUser(userData));
  };
}
// Defines the `removeConnectionById` function that takes an `id` parameter
export function removeConnectionById(id) {
  // Returns an asynchronous function that takes a `dispatch` parameter
  return async (dispatch) => {
    // Gets the current user's document from the database
    const currentUserRef = doc(db, "Users", auth.currentUser.uid);
    const currentUserDocument = await getDoc(currentUserRef);
    // Gets the document of the user to remove the connection with from the database
    const otherUserRef = doc(db, "Users", id);
    const otherUserDocument = await getDoc(otherUserRef);

    //Remove connections for both users
    updateDoc(currentUserRef, {
      connections: arrayRemove({
        id: id,
        name: otherUserDocument.data().displayName,
        photoURL: otherUserDocument.data().photoURL,
      }),
    });
    updateDoc(otherUserRef, {
      connections: arrayRemove({
        id: auth.currentUser.uid,
        name: currentUserDocument.data().displayName,
        photoURL: currentUserDocument.data().photoURL,
      }),
    });
    // Logs a message to the console indicating that the connection has been removed
    console.log("removed");
    // Gets the current user's data from the database and dispatches it to the Redux store using the `setUser` action
    const userData = await getUserDataById(auth.currentUser.uid);
    dispatch(setUser(userData));
  };
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
            savedJobs: [],
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
        const userJobPostings = jobPostings.filter(
          (job) => job.userId == userData.userId
        );
        dispatch(setUserJobPostings(userJobPostings));
        if (userData.ban) {
          alert("You have broken our policy and been banned");
          auth.signOut().then(() => {
            dispatch(setUser(null));
            dispatch(setJobPostings(null));
          });
        } else {
          if (userData.warn) {
            alert("You have an offense and been warned");
          }
          dispatch(setUser(userData));
          const jobPostings = await getAllJobPostings();
          dispatch(setJobPostings(jobPostings));
          const userJobPostings = jobPostings.filter(
            (job) => job.userId == userData.userId
          );
          dispatch(setUserJobPostings(userJobPostings));
        }
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
          savedJobs: [],
          connections: [],
          requests: [],
          pending: [],
        };
        //can send more data from google to create the user
        await createUserInDB(InitialDataToStore);
        const userData = await getUserDataById(payload.user.uid);
        dispatch(setUser(userData));
        const jobPostings = await getAllJobPostings();
        dispatch(setJobPostings(jobPostings));
        const userJobPostings = jobPostings.filter(
          (job) => job.userId == userData.userId
        );
        dispatch(setUserJobPostings(userJobPostings));
      })
      .catch((e) => {
        alert(e);
      });
  };
}

export function editJobPosting(editedJobPosting, currentPostingsList) {
  return async (dispatch) => {
    const jobDocumentRef = doc(db, `JobPostings/${editedJobPosting.id}`);
    await setDoc(jobDocumentRef, editedJobPosting)
      .then(() => {
        currentPostingsList = currentPostingsList.filter(
          (job) => job.id != editedJobPosting.id
        );
        currentPostingsList.push(editedJobPosting);
        const newPostingsList = currentPostingsList.map((job) => job);
        const newUserPostingsList = [];
        for (let i in newPostingsList) {
          if (newPostingsList[i].userId == editedJobPosting.userId) {
            newUserPostingsList.push(newPostingsList[i]);
          }
        }
        dispatch(setJobPostings(newPostingsList));
        dispatch(setUserJobPostings(newUserPostingsList));
      })
      .catch((error) => alert(error.message));
  };
}

export const deleteGroupJobPosting = (
  jobPostingId,
  userId,
  groupId,
  currentPostingsList
) => {
  return async (dispatch) => {
    const jobDocumentRef = doc(db, "JobPostings", jobPostingId);
    await deleteDoc(jobDocumentRef);

    const newPostingsList = currentPostingsList.filter(
      (job) => job.id !== jobPostingId
    );
    const newUserPostingsList = newPostingsList.filter(
      (job) => job.userId === userId
    );

    dispatch(setJobPostings(newPostingsList));
    dispatch(setUserJobPostings(newUserPostingsList));
  };
};

export function editGroupJobPosting(
  editedJobPosting,
  currentPostingsList,
  groupId
) {
  return async (dispatch) => {
    const jobDocumentRef = doc(db, `JobPostings/${editedJobPosting.id}`);
    const jobDocument = await getDoc(jobDocumentRef);
    const currentGroupId = jobDocument.data().groupId;
    editedJobPosting.groupId = currentGroupId; // add the current groupId to the editedJobPosting object
    await setDoc(jobDocumentRef, editedJobPosting)
      .then(() => {
        const newPostingsList = currentPostingsList.map((job) =>
          job.id === editedJobPosting.id ? editedJobPosting : job
        );
        const newUserPostingsList = newPostingsList.filter(
          (job) => job.userId === editedJobPosting.userId
        );
        dispatch(setJobPostings(newPostingsList));
        dispatch(setUserJobPostings(newUserPostingsList));
      })
      .catch((error) => alert(error.message));
  };
}

export function deleteJobPosting(jobPostingId, userId, currentPostingsList) {
  return async (dispatch) => {
    const jobDocumentRef = doc(db, `JobPostings/${jobPostingId}`);
    await deleteDoc(jobDocumentRef)
      .then(() => {
        currentPostingsList = currentPostingsList.filter(
          (job) => job.id != jobPostingId
        );
        const newPostingsList = currentPostingsList.map((job) => job);
        const newUserPostingsList = [];
        for (let i in newPostingsList) {
          if (newPostingsList[i].userId == userId) {
            newUserPostingsList.push(newPostingsList[i]);
          }
        }
        dispatch(setJobPostings(newPostingsList));
        dispatch(setUserJobPostings(newUserPostingsList));
      })
      .catch((error) => alert(error.message));
  };
}

export function createGroupJobPosting(
  userId,
  postTitle,
  postDescription,
  currentPostingsList,
  userPhotoURL,
  displayName,
  mandatoryResume,
  mandatoryCoverLetter,
  isExternal,
  jobParameters,
  groupId = null
) {
  return async (dispatch) => {
    const newJobPostingData = {
      id: uuidv4(),
      userId: userId,
      groupId: groupId,
      postTitle: postTitle,
      postDescription: postDescription,
      timeStamp: Date.now(),
      photoURL: userPhotoURL,
      displayName: displayName,
      mandatoryResume: mandatoryResume,
      mandatoryCoverLetter: mandatoryCoverLetter,
      isExternal: isExternal,
      jobParameters: jobParameters,
    };
    createJobPostingInDB(newJobPostingData)
      .then(() => {
        currentPostingsList.push(newJobPostingData);
        const newPostingsList = currentPostingsList.map((ele) => ele);
        const newUserPostingsList = [];
        for (let i in newPostingsList) {
          if (newPostingsList[i].userId == userId) {
            newUserPostingsList.push(newPostingsList[i]);
          }
        }
        dispatch(setJobPostings(newPostingsList));
        dispatch(setUserJobPostings(newUserPostingsList));
      })
      .catch((error) => alert(error.message));

      const groupRef = doc(db, "Groups", groupId);
      const groupDocument = await getDoc(groupRef);
      const currentUserRef = doc(db, "Users", auth.currentUser.uid);
      const currentUserDocument = await getDoc(currentUserRef);

    // Create notification for the all group members
    groupDocument.data().groupMembers.forEach((member) => {
      updateDoc(doc(db, "Users", member.userId), {
        notifications: arrayUnion({
          notification: `${
            currentUserDocument.data().displayName
          } posted in ${groupDocument.data().groupName}.`,
          postURL: `/groups/${newJobPostingData.groupId}`,
          photoURL: currentUserDocument.data().photoURL,
          date: new Date(),
          viewed: false,
        }),
      });
    });
  };
}

export function savePost(jobId, userData) {
  return (dispatch) => {
    userData.savedJobs.push(jobId);
    let updatedUserData = {};
    for (let property in userData) {
      updatedUserData[property] = userData[property];
    }
    console.log(updatedUserData);
    const userDocumentRef = doc(db, `Users/${updatedUserData.userId}`);
    updateDoc(userDocumentRef, updatedUserData)
      .then((result) => {
        console.log(result);
        dispatch(setUser(updatedUserData));
      })
      .catch((e) => {
        alert(e);
      });
  };
}

export function unsavePost(jobId, userData) {
  return (dispatch) => {
    if (userData.savedJobs) {
      userData.savedJobs = userData.savedJobs.filter(
        (savedJob) => savedJob !== jobId
      );
    } else {
      userData.savedJobs = [];
    }
    let updatedUserData = {};
    for (let property in userData) {
      updatedUserData[property] = userData[property];
    }
    console.log(updatedUserData);
    const userDocumentRef = doc(db, `Users/${updatedUserData.userId}`);
    updateDoc(userDocumentRef, updatedUserData)
      .then((result) => {
        dispatch(setUser(updatedUserData));
      })
      .catch((e) => {
        alert(e);
      });
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
  return async (dispatch) => {
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
      jobParameters: jobParameters,
    };
    createJobPostingInDB(newJobPostingData)
      .then(() => {
        currentPostingsList.push(newJobPostingData);
        const newPostingsList = currentPostingsList.map((ele) => ele);
        const newUserPostingsList = [];
        for (let i in newPostingsList) {
          if (newPostingsList[i].userId == userId) {
            newUserPostingsList.push(newPostingsList[i]);
          }
        }
        dispatch(setJobPostings(newPostingsList));
        dispatch(setUserJobPostings(newUserPostingsList));
      })
      .catch((error) => alert(error.message));

    const currentUserRef = doc(db, "Users", auth.currentUser.uid);
    const currentUserDocument = await getDoc(currentUserRef);

    // Create notification for the all connections
    currentUserDocument.data().connections.forEach((connection) => {
      updateDoc(doc(db, "Users", connection.id), {
        notifications: arrayUnion({
          notification: `${
            currentUserDocument.data().displayName
          } added a post`,
          postURL: `/job-posting/${newJobPostingData.id}`,
          photoURL: currentUserDocument.data().photoURL,
          date: new Date(),
          viewed: false,
        }),
      });
    });
  };
}

export function loginWithEmail(email, password) {
  console.log("here");
  return (dispatch) => {
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Signed in
        const user = userCredential.user;
        const userData = await getUserDataById(user.uid);
        if (userData.ban) {
          alert("You have broken our policy and been banned");
          auth.signOut().then(() => {
            dispatch(setUser(null));
            dispatch(setJobPostings(null));
          });
        } else {
          if (userData.warn) {
            alert("You have an offense and been warned");
          }
          dispatch(setUser(userData));
          const jobPostings = await getAllJobPostings();
          console.log("wowowo");
          dispatch(setJobPostings(jobPostings));
          const userJobPostings = jobPostings.filter(
            (job) => job.userId == userData.userId
          );
          dispatch(setUserJobPostings(userJobPostings));
          // ...
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
        alert(errorMessage);
      });
  };
}

export function getUserAuth() {
  return (dispatch) => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userData = await getUserDataById(user.uid);
        const jobPostings = await getAllJobPostings();
        const userJobPostings = jobPostings.filter(
          (job) => job.userId === userData.userId
        );

        dispatch(setUser(userData));
        dispatch(setJobPostings(jobPostings));
        dispatch(setUserJobPostings(userJobPostings));
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
      window.location.assign("/");
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

    const { experienceLevel, industry, jobType, remoteWorkOption } =
      job.jobParameters;

    return (
      experienceLevel === preferences.experienceLevel &&
      industry === preferences.industry &&
      jobType === preferences.jobType &&
      remoteWorkOption === preferences.remoteWorkOption
    );
  });
};

export const getUserSearchingPreferences = async () => {
  try {
    const currentUser = getAuth().currentUser;
    const userDocRef = doc(db, "Users", currentUser.uid);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const userData = docSnap.data();
      return userData.searchingPreferences;
    } else {
      console.log("No user found with this userId:", currentUser.uid);
      return null;
    }
  } catch (error) {
    console.error("Error fetching user preferences:", error);
    return null;
  }
};

export const banUser = async (banUserId) => {
  try {
    const banUserDocRef = doc(db, "Users", banUserId);
    await updateDoc(banUserDocRef, {
      ban: true,
    });
  } catch (error) {
    console.error("Error banning the user", error);
    return null;
  }
};

export const warnUser = async (warnUserId) => {
  try {
    const warnUserDocRef = doc(db, "Users", warnUserId);
    await updateDoc(warnUserDocRef, {
      warn: true,
    });
  } catch (error) {
    console.error("Error warning the user", error);
    return null;
  }
};

export function acceptGroupInvite(invite) {
  return async (dispatch) => {
    // Add the user to the groupMembers field object in the group document
    const groupRef = doc(db, "Groups", invite.groupId);
    updateDoc(groupRef, {
      groupMembers: arrayUnion({
        userId: invite.userId,
        userName: invite.userName,
      }),
    });

    // Add the respective groupId in the groupMemberOf field in the respective User document
    const userRef = doc(db, "Users", invite.userId);
    updateDoc(userRef, {
      groupMemberOf: arrayUnion({
        group: invite.groupName,
        groupId: invite.groupId,
      }),
      groupInvites: arrayRemove(invite),
    });

    // Update user state
    const userData = await getUserDataById(auth.currentUser.uid);
    dispatch(setUser(userData));  
  }
}

export function declineGroupInvite(invite) {
  return async (dispatch) => {
    // Remove the invite from the user's groupInvites field
    const userRef = doc(db, "Users", invite.userId);
    updateDoc(userRef, {
      groupInvites: arrayRemove(invite),
    });

    // Update user state
    const userData = await getUserDataById(auth.currentUser.uid);
    dispatch(setUser(userData));  
  }
}

export function acceptGroupJoinRequest(request) {
  return async (dispatch) => {
    // Add the user to the groupMembers field object in the group document
    const groupRef = doc(db, "Groups", request.groupId);
    updateDoc(groupRef, {
      groupMembers: arrayUnion({
        userId: request.userId,
        userName: request.userName,
      }),
    });

    // Add the respective groupId in the groupMemberOf field in the respective User document
    const userRef = doc(db, "Users", request.userId);
    updateDoc(userRef, {
      groupMemberOf: arrayUnion({
        group: request.groupName,
        groupId: request.groupId,
      }),
    });

    // Remove the join request from the group creator's groupJoinRequests field
    const groupCreatorRef = doc(db, "Users", auth.currentUser.uid);
    updateDoc(groupCreatorRef, {
      groupJoinRequests: arrayRemove(request),
    });

    // Remove the groupId from the user's pendingJoinRequests field in Firebase
    await updateDoc(userRef, {
      pendingJoinRequests: arrayRemove(request.groupId),
    });

    // Remove the groupId from the pendingGroups field in the respective User document
    await updateDoc(userRef, {
      pendingGroups: arrayRemove(request.groupId),
    });

    // Create notification for the other user
    const groupCreatorDocument = await getDoc(groupCreatorRef);
    updateDoc(userRef, {
      notifications: arrayUnion({
        notification: `${
          groupCreatorDocument.data().displayName
        } approved your request to join ${request.groupName}.`,
        photoURL: groupCreatorDocument.data().photoURL,
        postURL: `/groups/${request.groupId}`,
        date: new Date(),
        viewed: false,
      }),
    });

    // Update user state
    const userData = await getUserDataById(auth.currentUser.uid);
    dispatch(setUser(userData));  
  } 
}

export function declineGroupJoinRequest(request) {
  return async (dispatch) => {
    const groupCreatorRef = doc(db, "Users", auth.currentUser.uid);
    updateDoc(groupCreatorRef, {
      groupJoinRequests: arrayRemove(request),
    });

    // Remove the groupId from the pendingGroups field in the respective User document
    const userRef = doc(db, "Users", request.userId);
    await updateDoc(userRef, {
      pendingGroups: arrayRemove(request.groupId),
    });

    // Update user state
    const userData = await getUserDataById(auth.currentUser.uid);
    dispatch(setUser(userData));  
  }
}

 export const createPage = async (pageName, pageDescription, pageImage) => {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error('User not authenticated');
  }

  const storage = getStorage();

  let pageImageURL = '';

  if (pageImage) {
    const storageRef = ref(storage, `page-images/${currentUser.uid}/${pageImage.name}`);
    const uploadTask = uploadBytesResumable(storageRef, pageImage);

    await new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Handle uploading progress
        },
        (error) => {
          // Handle error
          reject(error);
        },
        async () => {
          // Handle successful upload
          pageImageURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve();
        },
      );
    });
  }

  const newPage = {
    pageName,
    pageDescription,
    pageImageURL,
    pageOwnerId: currentUser.uid,
  };

  const pagesCollectionRef = collection(db, 'Pages');
  await addDoc(pagesCollectionRef, newPage); 
};