import React, { useState } from "react";
import {
  doc,
  updateDoc,
  setDoc,
  collection,
  addDoc,
  getDoc,
} from "firebase/firestore";
import { storage, db, auth } from "../firebase";
import { connect } from "react-redux";
import { updateGroup } from "../actions";

function GroupCreationForm(props) {
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  /* const [groupLocation, setGroupLocation] = useState("");
  const [groupRules, setGroupRules] = useState(""); */
  const [groupMembers, setGroupMembers] = useState([]);

  const createGroup = async (e) => {
    e.preventDefault();
    const userId = auth.currentUser.uid;

    // Set admin name
    const currentUserRef = doc(db, "Users", userId);
    const currentUserDocument = await getDoc(currentUserRef);
    const adminName = currentUserDocument.data().displayName;

    const updateGroupData = {
      groupName: groupName,
      groupDescription: groupDescription,
      /*  groupLocation: groupLocation,
      groupRules: groupRules, */
      createdBy: userId,
      adminName: adminName,
      groupMembers: groupMembers,
    };

    const groupsRef = collection(db, "Groups");

    console.log(adminName);
    // Get the new group's ID
    const newGroupRef = await addDoc(groupsRef, updateGroupData);
    const newGroupId = newGroupRef.id;

    // Add the groupId field to the group document
    await updateDoc(newGroupRef, { groupId: newGroupId });

    // Update the user's groupOwned field
    const userRef = doc(db, "Users", userId);
    const userDoc = await getDoc(userRef);
    const groupOwned = userDoc.data().groupOwned || {}; // fetch existing groupOwned or use an empty object
    const updatedGroupOwned = {
      ...groupOwned,
      [newGroupId]: groupName,
    };
    await updateDoc(userRef, { groupOwned: updatedGroupOwned });

    console.log(updatedGroupOwned);
    window.location.assign("/home");
  };

  return (
    <form className="form">
      <label>
        Group Name:
        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
      </label>
      <br />
      <label>
        Group Description:
        <textarea
          value={groupDescription}
          placeholder={"What is the purpose of your group?"}
          onChange={(e) => setGroupDescription(e.target.value)}
        />
      </label>
      {/*  <label>
        Group Location:
        <textarea
          value={groupLocation}
          placeholder={"Add a location to your group"}
          onChange={(e) => setGroupLocation(e.target.value)}
        />
      </label>
      <br />
      <label>
        Group Rules:
        <textarea
          value={groupRules}
          placeholder={"Set the tone and expectations of your group"}
          onChange={(e) => setGroupRules(e.target.value)}
        />
      </label> */}
      <button className="edit-save-btn" onClick={createGroup}>Create Group</button>
    </form>
  );
}

export default GroupCreationForm;
