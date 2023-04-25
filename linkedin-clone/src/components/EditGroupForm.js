import React, { useState } from "react";
import {
  doc,
  updateDoc,
  setDoc,
  collection,
  addDoc,
  getDoc,
} from "firebase/firestore";
import { useParams } from "react-router-dom";
import { storage, db, auth } from "../firebase";

const EditGroupForm = () => {
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  /* const [groupLocation, setGroupLocation] = useState("");
  const [groupRules, setGroupRules] = useState(""); */

  const { groupId } = useParams();

  /*   const updateGroup = async (e) => {
    e.preventDefault();
    const updateGroupData = {
      groupName: groupName,
      groupDescription: groupDescription,
      groupLocation: groupLocation,
      groupRules: groupRules,
    };

    const groupRef = doc(db, "Groups", groupId);
    await updateDoc(groupRef, updateGroupData, {
      merge: true,
    });
  }; */

  const updateGroup = async (e) => {
    e.preventDefault();
    const groupRef = doc(db, "Groups", groupId);

    const existingGroup = await getDoc(groupRef);
    const existingGroupData = existingGroup.data();

    const updatedGroupData = {
      groupName: groupName !== "" ? groupName : existingGroupData.groupName,
      groupDescription:
        groupDescription !== ""
          ? groupDescription
          : existingGroupData.groupDescription,
      /* groupLocation:
        groupLocation !== "" ? groupLocation : existingGroupData.groupLocation,
      groupRules: groupRules !== "" ? groupRules : existingGroupData.groupRules, */
    };

    await updateDoc(groupRef, updatedGroupData, { merge: true });
    window.location.reload();
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
      {/* <label>
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
      <button className="edit-save-btn" onClick={updateGroup}>Update Group</button>
    </form>
  );
};

export default EditGroupForm;
