import styled from "styled-components";
import Header from "./Header";
//import Main from "./Main";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { storage, db, auth } from "../firebase";
import EditGroupForm from "./EditGroupForm";
import Modal from "react-modal";
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

  const currentUser = auth.currentUser;

  return (
    <>
      <Header />
      <Banner>
        <BannerTitle>{groupName}</BannerTitle>
        <BannerAdmin>
          <h3>Admin Name: {adminName}</h3>
          {/* <h4>Admin Id: {adminId}</h4> */}
        </BannerAdmin>
        {currentUser && adminId === currentUser.uid && (
          <>
            <EditGroupButton>
              <button onClick={handleEditClick}>Edit Group Informations</button>
              <CustomModal5 isOpen={showEditForm} onRequestClose={handleClose}>
                {showEditForm && <EditGroupForm />}
              </CustomModal5>
            </EditGroupButton>
            <InviteButton>
              <button onClick={() => setShowConnectionModal(true)}>
                Invite People
              </button>
              <CustomModal6
                isOpen={showConnectionModal}
                onRequestClose={handleClose}
              >
                {showConnectionModal && <InviteToGroup />}
              </CustomModal6>
            </InviteButton>
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
                  <li key={index}>{member.userName}</li>
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
`;

const EditGroupButton = styled.div`
  color: #0a66c2;
  margin-top: 4px;
  font-size: 12px;
  line-height: 1.33;
  font-weight: 400;
`;
const InviteButton = styled.div`
  color: #0a66c2;
  margin-top: 4px;
  font-size: 12px;
  line-height: 1.33;
  font-weight: 400;
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
