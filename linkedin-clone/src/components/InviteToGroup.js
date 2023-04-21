import styled from "styled-components";
import { useState } from "react";
import { connect } from "react-redux";
import { storage, db, auth } from "../firebase";
import { useParams } from "react-router-dom";
import {
  doc,
  updateDoc,
  setDoc,
  collection,
  addDoc,
  getDoc,
  arrayUnion,
} from "firebase/firestore";

const InviteToGroup = (props) => {
  const { groupId } = useParams();
  const userId = auth.currentUser.uid;
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleInvite = async (connectionId) => {
    try {
      // Get a reference to the group document in Firestore
      const groupRef = doc(db, "Groups", groupId);

      // Get the current group members
      const groupDoc = await getDoc(groupRef);
      const currentMembers = groupDoc.data().groupMembers || [];
      const groupName = groupDoc.data().groupName;

      // Check if the connection is already a member
      if (currentMembers.some((member) => member.userId === connectionId)) {
        alert("This connection is already a member of the group!");
        return;
      }

      // Get the name of the connection with the given ID
      const currentUserDoc = await getDoc(doc(db, "Users", userId));
      const connection = currentUserDoc
        .data()
        .connections.find((conn) => conn.id === connectionId);
      const connectionName = connection.name;

      // Create a new invite object
      const invite = {
        groupId: groupId,
        groupName: groupName,
        userId: connectionId,
        userName: connectionName,
        inviterId: userId,
        inviterName: currentUserDoc.data().displayName,
        inviterPhotoURL: currentUserDoc.data().photoURL,
      };

      // Update the invited user's document with the new groupInvites field
      // Notify user
      await updateDoc(doc(db, "Users", connectionId), {
        groupInvites: arrayUnion(invite),
        notifications: arrayUnion({
          notification: `${
            currentUserDoc.data().displayName
          } has invited you to join his group.`,
          photoURL: currentUserDoc.data().photoURL,
          date: new Date(),
          viewed: false,
        }),
      });

      // Display success message
      setSuccess(`${connectionName} has been invited to the group!`);
      alert(`${connectionName} has been invited to the group!`);

      // Close the modal
      /* handleClose(); */
    } catch (error) {
      console.error("Error inviting connection to group: ", error);
      setError("Error inviting connection to group");
    }
  };
  return (
    <ConnectionsContainer>
      <ConnectionsHeader>Connections</ConnectionsHeader>
      <ConnectionsList>
        {props.user &&
          props.user.connections.map((connection) => (
            <ConnectionItem key={connection.id}>
              {connection.photoURL ? (
                <ConnectionPhoto src={connection.photoURL} alt="" />
              ) : (
                <ConnectionPhoto src="/images/user.svg" alt="" />
              )}
              <ConnectionName>{connection.name}</ConnectionName>
              <InviteButton
                onClick={() => handleInvite(connection.id)}
                groupId={groupId}
              >
                Invite
              </InviteButton>
            </ConnectionItem>
          ))}
      </ConnectionsList>
    </ConnectionsContainer>
  );
};

const ConnectionsContainer = styled.div`
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  padding: 16px;
  margin-top: 16px;
`;

const ConnectionsHeader = styled.h3`
  font-size: 20px;
  margin-bottom: 16px;
`;

const ConnectionsList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const ConnectionItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #ccc;

  &:last-of-type {
    border-bottom: none;
  }
`;

const ConnectionName = styled.p`
  margin: 0;
  font-size: 16px;
`;

const ConnectionPhoto = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const InviteButton = styled.button`
  background-color: rgb(79, 117, 220);
  color: #fff;
  border: none;
  padding: 8px 16px;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #d32f2f;
  }

  &:active {
    background-color: #b71c1c;
  }
`;

const mapStateToProps = (state) => {
  return {
    user: state.userState.user,
  };
};
export default connect(mapStateToProps)(InviteToGroup);
