import styled from "styled-components";
import Header from "./Header";
import Main from "./Main";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { storage, db } from "../firebase";
import EditGroupForm from "./EditGroupForm";
import Modal from "react-modal";
import {
  doc,
  updateDoc,
  setDoc,
  collection,
  addDoc,
  getDoc,
} from "firebase/firestore";

const GroupPage = (props) => {
  const { groupId } = useParams();

  const [error, setError] = useState(null);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [showEditForm, setShowEditForm] = useState(false);

  const handleEditClick = () => {
    setShowEditForm(true);
  };

  const handleClose = () => {
    setShowEditForm(false);
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
        setError(error);
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
        setError(error);
      }
    };
    getGroupDescription();
  }, [groupId]);

  return (
    <>
      <Header />
      <Banner>
        <BannerTitle>Group Title {groupName}</BannerTitle>
        <BannerAdmin>Admin: John Doe</BannerAdmin>
        <EditGroupButton>
          <button onClick={handleEditClick}>Edit Group Informations</button>
        </EditGroupButton>
        <CustomModal5 isOpen={showEditForm} onRequestClose={handleClose}>
          {showEditForm && <EditGroupForm />}
        </CustomModal5>
      </Banner>

      <Content>
        <Leftside>
          <Card>
            <h4>Group Members</h4>
            <ul>
              <li>Member 1</li>
              <li>Member 2</li>
              <li>Member 3</li>
              <li>Member 4</li>
            </ul>
          </Card>
        </Leftside>
        <GroupFeed>
          <Main />
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
  height: 800px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  overflow-y: auto;
`;

const EditGroupButton = styled.div`
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
