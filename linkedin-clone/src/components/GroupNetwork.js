import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  getGroups,
  sendJoinGroupRequest,
  groupJoinRequest,
  declineRequest,
} from "../actions";
import {
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../firebase";
import { connect } from "react-redux";
import { Redirect, Link } from "react-router-dom";
import "./GroupNetwork.css";

const GroupNetwork = (props) => {
  const [groups, setGroups] = useState([]);
  const [groupJoinRequests, setGroupJoinRequests] = useState([]);

  async function fetchGroupJoinRequests(userId) {
    const userRef = doc(db, "Users", userId);
    const userDoc = await getDoc(userRef);
    const requests = userDoc.data().groupJoinRequests || [];
    setGroupJoinRequests(requests);
  }

  useEffect(() => {
    getGroups().then((data) => {
      setGroups(data);
      console.log(groups);
    });
    if (props.user) {
      fetchGroupJoinRequests(props.user.userId);
    }
    return () => {
      setGroups([]);
    };
  }, [props.user]);

  async function acceptGroupJoinRequest(request) {
    // Add the user to the groupMembers field object in the group document
    const groupRef = doc(db, "Groups", request.groupId);
    updateDoc(groupRef, {
      groupMembers: arrayUnion({
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
    const groupCreatorRef = doc(db, "Users", props.user.userId);
    updateDoc(groupCreatorRef, {
      groupJoinRequests: arrayRemove(request),
    });

    // Update the groupJoinRequests state variable
    setGroupJoinRequests((prevRequests) =>
      prevRequests.filter(
        (r) => r.userId !== request.userId || r.groupId !== request.groupId
      )
    );
  }

  async function declineGroupJoinRequest(request) {
    const groupCreatorRef = doc(db, "Users", props.user.userId);
    updateDoc(groupCreatorRef, {
      groupJoinRequests: arrayRemove(request),
    });

    // Update the groupJoinRequests state variable
    setGroupJoinRequests((prevRequests) =>
      prevRequests.filter(
        (r) => r.userId !== request.userId || r.groupId !== request.groupId
      )
    );
  }

  useEffect(() => {
    getGroups().then((data) => {
      setGroups(data);
    });
    return () => {
      setGroups([]);
    };
  }, []);

  return (
    <Container>
      {!props.user && <Redirect to="/" />}
      {groupJoinRequests.length > 0 && (
        <div>
          <h3>Group Join Requests:</h3>
          {groupJoinRequests.map((request, index) => (
            <div key={index}>
              <span>
                {request.userName} wants to join {request.groupName}
              </span>
              <button onClick={() => acceptGroupJoinRequest(request)}>
                Accept
              </button>
              <button onClick={() => declineGroupJoinRequest(request)}>
                Decline
              </button>
            </div>
          ))}
        </div>
      )}
      <br />
      <div className="wrapper">
        <div className="container">
          <h1>Add Groups</h1>
          <div className="row">
            <div className="column">
              {groups &&
                groups
                  .filter((group) => group.createdBy !== props.user.userId)
                  .map((group, index) => (
                    <div className="card" key={group.groupId}>
                      <Link
                        to={{
                          pathname: `/group/${group.groupId}`,
                          state: groups,
                        }}
                        style={{ textDecoration: "none", color: "black" }}
                      ></Link>
                      <div className="group-info">
                        <h2>{group.groupName}</h2>
                        <p>{group.groupDescription}</p>
                      </div>
                      {props.user &&
                      props.user.groupMemberOf &&
                      Object.values(props.user.groupMemberOf).some(
                        (g) => g.groupId === group.groupId
                      ) ? (
                        <button className="buttonc" disabled>
                          Joined
                        </button>
                      ) : (
                        <button
                          className="buttonc"
                          onClick={async () => {
                            await sendJoinGroupRequest(
                              group.groupId,
                              props.user.userId
                            );
                          }}
                        >
                          Join
                        </button>
                      )}
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

const Container = styled.div`
  padding-top: 72px;
  max-width: 100%;
`;

const mapStateToProps = (state) => {
  return {
    user: state.userState.user,
  };
};

const mapDispatchToProps = (dispatch) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(GroupNetwork);
