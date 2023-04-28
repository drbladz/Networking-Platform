import styled from "styled-components";
import { removeConnectionById } from "../actions";
import { connect } from "react-redux";
import { useState, useEffect  } from "react";
import DmModal from "./DmModal";
import { AiFillMessage } from "react-icons/ai";
import db from "../firebase";
import { getDoc, doc } from "firebase/firestore";

const UpdateConnections = (props) => {
  const [showDm, setShowDm] = useState(false);
  const [recipientId, setRecipientId] = useState("");

  const handleDmOpen = (recipientId) => {
    setRecipientId(recipientId);
    setShowDm(true);
  };

  const handleDmClose = () => {
    setRecipientId("");
    setShowDm(false);
  };
  const [filteredConnections, setFilteredConnections] = useState([]);
  // useEffect(() => {
  //   async function filterConnections() {
  //     if (props.user && props.user.connections) {
  //       const activeConnections = [];
  
  //       for (const connection of props.user.connections) {
  //         const userRef = doc(db, "Users", connection.id);
  //         const userSnapshot = await getDoc(userRef);
  //         if (userSnapshot.exists()) {
  //           const isActive = userSnapshot.get("active");
  //           if (isActive === undefined || isActive === true) {
  //             activeConnections.push(connection);
  //           }
  //         }
  //       }
  
  //       setFilteredConnections(activeConnections);
  //     } else {
  //       setFilteredConnections([]);
  //     }
  //   }
  
  //   filterConnections();
  // }, []);

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
              <ConnectionName className="notranslate">{connection.name}</ConnectionName>
              <DmButton onClick={() => handleDmOpen(connection.id)}>
                <AiFillMessage />
              </DmButton>
              <DeleteButton
                onClick={() => {
                  props.removeConnectionById(connection.id);
                }}
              >
                Delete
              </DeleteButton>
            </ConnectionItem>
          ))}
      </ConnectionsList>
      {showDm && (
        <DmModal
          currentUserId={props.user.userId}
          recipientId={recipientId}
        ></DmModal>
      )}
    </ConnectionsContainer>
  );
};

const ConnectionsContainer = styled.div`
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  padding: 16px;
  border-radius: 10px;
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
  flex-wrap: wrap;

  &:last-of-type {
    border-bottom: none;
  }
`;

const ConnectionName = styled.p`
  margin: 0;
  font-size: 16px;
  width: 40%;
`;

const ConnectionPhoto = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const DeleteButton = styled.button`
  background-color: #f44336;
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

const DmButton = styled.button`
  background-color: rgb(79, 117, 220);
  color: #fff;
  border: none;
  padding: 8px 16px;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: blue;
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

const mapDispatchToProps = (dispatch) => ({
  removeConnectionById: (id) => dispatch(removeConnectionById(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UpdateConnections);
