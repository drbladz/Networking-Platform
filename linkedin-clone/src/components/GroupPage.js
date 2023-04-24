import styled from "styled-components";
//import Main from "./Main";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { storage, db, auth } from "../firebase";
import EditGroupForm from "./EditGroupForm";
import Modal from "react-modal";
import { HiUserGroup } from "react-icons/hi";
import { BsFillTrashFill } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";
import { IoPersonAdd } from "react-icons/io5";
import { useCollectionData } from "react-firebase-hooks/firestore";
import {
  doc,
  updateDoc,
  setDoc,
  collection,
  addDoc,
  getDoc,
  query,
  where,
  arrayRemove,
  deleteDoc,
} from "firebase/firestore";
import InviteToGroup from "./InviteToGroup";

import GroupJobPostings from "./GroupJobPostings";

const GroupPage = (props) => {
  const { groupId } = useParams();

  const [error1, setError1] = useState(null);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [adminName, setAdminName] = useState("");
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminId, setAdminId] = useState("");

  const [showEditForm, setShowEditForm] = useState(false);
  const [groupMembers, setGroupMembers] = useState([]);

  /* const [jobPostings, loading, error] = useCollectionData(
    query(collection(db, "JobPostings"), where("groupId", "==", groupId))
  ); */

  const handleEditClick = () => {
    setShowEditForm(true);
  };

  const handleClose = () => {
    setShowEditForm(false);
    setShowConnectionModal(false);
  };

  useEffect(() => {
    const getGroupName = async () => {
      try {
        // Create a reference to the job posting document in Firestore
        const groupRef = doc(db, "Groups", groupId);
        // Get the job posting document from Firestore
        const groupDoc = await getDoc(groupRef);
        // Set the job title state variable to the title of the job posting
        setGroupName(groupDoc.data().groupName);
      } catch (error) {
        setError1(error);
      }
    };
    getGroupName();
  }, [groupId]);

  useEffect(() => {
    const getGroupDescription = async () => {
      try {
        // Create a reference to the job posting document in Firestore
        const groupRef = doc(db, "Groups", groupId);
        // Get the job posting document from Firestore
        const groupDoc = await getDoc(groupRef);
        // Set the job title state variable to the title of the job posting
        setGroupDescription(groupDoc.data().groupDescription);
      } catch (error) {
        setError1(error);
      }
    };
    getGroupDescription();
  }, [groupId]);

  useEffect(() => {
    const getAdminName = async () => {
      try {
        // Create a reference to the job posting document in Firestore
        const groupRef = doc(db, "Groups", groupId);
        // Get the job posting document from Firestore
        const groupDoc = await getDoc(groupRef);
        // Set the job title state variable to the title of the job posting
        setAdminName(groupDoc.data().adminName);
      } catch (error) {
        setError1(error);
      }
    };
    getAdminName();
  }, [groupId]);

  useEffect(() => {
    const getGroupMembers = async () => {
      try {
        const groupRef = doc(db, "Groups", groupId);
        const groupDoc = await getDoc(groupRef);
        const membersArray = groupDoc.data().groupMembers;
        setGroupMembers(membersArray);
      } catch (error) {
        setError1(error);
      }
    };
    getGroupMembers();
  }, [groupId]);

  useEffect(() => {
    const getAdminName = async () => {
      try {
        const groupRef = doc(db, "Groups", groupId);
        const groupDoc = await getDoc(groupRef);
        setAdminName(groupDoc.data().adminName);

        // Check if the current user is the admin
        if (groupDoc.data().createdBy === props.currentUser.uid) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        setError1(error);
      }
    };
    getAdminName();
  }, [groupId, props.currentUser]);

  useEffect(() => {
    const getGroupData = async () => {
      try {
        const groupRef = doc(db, "Groups", groupId);
        const groupDoc = await getDoc(groupRef);
        setGroupName(groupDoc.data().groupName);
        setGroupDescription(groupDoc.data().groupDescription);
        setAdminId(groupDoc.data().createdBy);
        setGroupMembers(groupDoc.data().groupMembers);
      } catch (error) {
        setError1(error);
      }
    };
    getGroupData();
  }, [groupId]);

  async function quitGroup(groupId, userId) {
    // Get the user's name
    const userRef = doc(db, "Users", userId);
    const userSnapshot = await getDoc(userRef);
    const user = userSnapshot.data();
    const userName = user.displayName;

    // Remove the user from the groupMembers field array in the group document
    const groupRef = doc(db, "Groups", groupId);
    const groupSnapshot = await getDoc(groupRef);
    const group = groupSnapshot.data();
    const updatedGroupMembers = group.groupMembers.filter(
      (member) => member.userName !== userName
    );

    await updateDoc(groupRef, {
      groupMembers: updatedGroupMembers,
    });

    // Remove the respective groupId from the groupMemberOf field in the respective User document
    const updatedGroupMemberOf = user.groupMemberOf.filter(
      (group) => group.groupId !== groupId
    );

    await updateDoc(userRef, {
      groupMemberOf: updatedGroupMemberOf,
    });

    // Remove the groupId from the pendingJoinRequests field in the User document
    await updateDoc(userRef, {
      pendingJoinRequests: arrayRemove(groupId),
    });

    const userSnapshotAfterQuit = await getDoc(userRef);
    const userAfterQuit = userSnapshotAfterQuit.data();
    if (userAfterQuit.pendingJoinRequests.includes(groupId)) {
      await updateDoc(userRef, {
        pendingJoinRequests: arrayRemove(groupId),
      });
    }

    window.location.assign("/home");
  }

  async function deleteGroup(groupId) {
    console.log("deleted");
    // Get the group document
    const groupRef = doc(db, "Groups", groupId);
    const groupSnapshot = await getDoc(groupRef);
    const group = groupSnapshot.data();

    // Remove the respective groupId from the groupMemberOf field in each member's User document
    const groupMembers = group.groupMembers;
    for (const member of groupMembers) {
      const memberUserId = member.userId;
      const memberUserRef = doc(db, "Users", memberUserId);
      const memberUserSnapshot = await getDoc(memberUserRef);
      const memberUser = memberUserSnapshot.data();
      const updatedGroupMemberOf = memberUser.groupMemberOf.filter(
        (group) => group.groupId !== groupId
      );

      await updateDoc(memberUserRef, {
        groupMemberOf: updatedGroupMemberOf,
      });
    }

    // Get the creator's document and remove the respective groupName from the groupOwned field
    const creatorId = group.createdBy;
    const creatorRef = doc(db, "Users", creatorId);
    const creatorSnapshot = await getDoc(creatorRef);
    const creator = creatorSnapshot.data();

    // Remove the respective groupId and groupName from the groupOwned field
    const updatedGroupOwned = {};
    for (const [key, value] of Object.entries(creator.groupOwned)) {
      if (key !== groupId) {
        updatedGroupOwned[key] = value;
      }
    }

    await updateDoc(creatorRef, {
      groupOwned: updatedGroupOwned,
    });

    // Delete the group document
    await deleteDoc(groupRef);

    // Redirect to another page (e.g., home) after the group is deleted
    window.location.assign("/home");
  }

  const currentUser = auth.currentUser;

  return (
    <>
      <Banner>
        <HiUserGroup size={50} />
        <BannerTitle className="notranslate">{groupName}</BannerTitle>
        <BannerAdmin>
          <h3>Admin Name: <span className="notranslate">{adminName}</span> </h3>
          {currentUser && adminId !== currentUser.uid && (
            <QuitButton>
              <button className="remove-button" onClick={() => quitGroup(groupId, currentUser.uid)}>
                Quit Group
              </button>
            </QuitButton>
          )}
          {/* <h4>Admin Id: {adminId}</h4> */}
        </BannerAdmin>
        {currentUser && adminId === currentUser.uid && (
          <>
            <DeleteGroupButton onClick={() => deleteGroup(groupId)}>
              <BsFillTrashFill color="white" size={16} />
              &nbsp;Delete Group
              </DeleteGroupButton>

              <EditGroupButton onClick={handleEditClick}>
                <AiFillEdit color="white" size={16} />
                &nbsp;Edit Group Information
              </EditGroupButton>
              <CustomModal5 isOpen={showEditForm} onRequestClose={handleClose}>
                {showEditForm && <EditGroupForm />}
              </CustomModal5>

              <InviteButton onClick={() => setShowConnectionModal(true)}>
                <IoPersonAdd color="white" size={16} />
                &nbsp;Invite People
              </InviteButton>
              <CustomModal6
                isOpen={showConnectionModal}
                onRequestClose={handleClose}
              >
                {showConnectionModal && <InviteToGroup />}
              </CustomModal6>
          </>
        )}
      </Banner>

      <Content>
        <Leftside>
          <Card>
            <h4>Group Members</h4>
            {groupMembers.length > 0 ? (
              <ul>
                {groupMembers.map((member, index) => (
                  <li key={index} className="notranslate">{member.userName}</li>
                ))}
              </ul>
            ) : (
              <p>No members in this group yet.</p>
            )}
          </Card>
        </Leftside>
        <GroupFeed>
          <GroupJobPostings />
        </GroupFeed>

        <Rightside>
          <Card>
            <h4>Group Description</h4>
            <p>{groupDescription}</p>
          </Card>
        </Rightside>
      </Content>
    </>
  );
};

const CustomModal5 = styled(Modal)`
  display: flex;
  align-items: center;
  flex-direction: column;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  width: 800px;
  height: 300px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  overflow-y: auto;
`;

const CustomModal6 = styled(Modal)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  width: 400px;
  height: 300px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  overflow-y: auto;
`;

const EditGroupButton = styled.div`
display: flex;
align-items: center;
padding: 8px;
margin-bottom: 5px;
background-color: #0077FF;
color: #FFFFFF;
border: none;
border-radius: 4px;
font-size: 14px;
cursor: pointer;
transition: background-color 0.3s ease;
&:hover {
  background-color: #0058CC;
}
`;

const DeleteGroupButton = styled.div`
display: flex;
padding: 8px;
margin-bottom: 5px;
background-color: red;
color: #FFFFFF;
border: none;
border-radius: 4px;
font-size: 14px;
cursor: pointer;
align-items: center;
transition: background-color 0.3s ease;
&:hover {
  background-color: darkred;
}
`;
const InviteButton = styled.div`
display: flex;
align-items: center;
padding: 8px;
background-color: #0077FF;
color: #FFFFFF;
border: none;
border-radius: 4px;
font-size: 14px;
cursor: pointer;
transition: background-color 0.3s ease;
&:hover {
  background-color: #0058CC;
}
`;
const QuitButton = styled.div`
  color: #0a66c2;
  margin-top: 4px;
  font-size: 12px;
  line-height: 1.33;
  font-weight: 400;
  text-align: center;
`;

const Banner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 0;
  padding-top: 100px;
  background-color: #f5f5f5;
`;

const BannerTitle = styled.h1`
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 12px;
`;

const BannerAdmin = styled.p`
  font-size: 18px;
  color: gray;
  align-items: center;
  padding-bottom: 10px;
`;

const Content = styled.div`
  max-width: 1128px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 3fr 1fr;
  grid-gap: 24px;
  padding: 24px 0;
`;

const Leftside = styled.div``;

const GroupFeed = styled.div`
  display: flex;
  flex-direction: column;
`;

const Rightside = styled.div``;

const Card = styled.div`
  padding: 16px;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.1);

  h4 {
    margin-bottom: 12px;
    font-weight: bold;
  }

  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;

    li {
      margin-bottom: 6px;
    }
  }
`;

export default GroupPage;
