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
  const [pendingGroups, setPendingGroups] = useState([]);
  const [pendingJoinRequests, setPendingJoinRequests] = useState([]);

  const [groupInvites, setGroupInvites] = useState([]);

  async function acceptGroupInvite(invite) {
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

    // Update the groupInvites state variable
    setGroupInvites((prevInvites) =>
      prevInvites.filter(
        (i) => i.userId !== invite.userId || i.groupId !== invite.groupId
      )
    );
  }

  async function declineGroupInvite(invite) {
    // Remove the invite from the user's groupInvites field
    const userRef = doc(db, "Users", invite.userId);
    updateDoc(userRef, {
      groupInvites: arrayRemove(invite),
    });

    // Update the groupInvites state variable
    setGroupInvites((prevInvites) =>
      prevInvites.filter(
        (i) => i.userId !== invite.userId || i.groupId !== invite.groupId
      )
    );
  }
  useEffect(() => {
    getGroups().then((data) => {
      setGroups(data);
    });

    const fetchPendingGroupsAndJoinRequests = async () => {
      if (props.user) {
        const userRef = doc(db, "Users", props.user.userId);
        const userDoc = await getDoc(userRef);

        // Fetch group join requests
        const requests = userDoc.data().groupJoinRequests || [];
        setGroupJoinRequests(requests);

        // Fetch pending groups
        const pending = userDoc.data().pendingGroups || [];
        setPendingGroups(pending);

        // Fetch group invites
        const invites = userDoc.data().groupInvites || [];
        setGroupInvites(invites);

        // Fetch pending join requests
        const pendingJoinRequests = userDoc.data().pendingJoinRequests || [];
        setPendingJoinRequests(pendingJoinRequests);
      }
    };

    fetchPendingGroupsAndJoinRequests();

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
    // Remove the groupId from the user's pendingJoinRequests field in Firebase

    await updateDoc(userRef, {
      pendingJoinRequests: arrayRemove(request.groupId),
    });
  }

  async function declineGroupJoinRequest(request) {
    const groupCreatorRef = doc(db, "Users", props.user.userId);
    updateDoc(groupCreatorRef, {
      groupJoinRequests: arrayRemove(request),
    });

    // Remove the groupId from the pendingGroups field in the respective User document
    const userRef = doc(db, "Users", request.userId);
    await updateDoc(userRef, {
      pendingGroups: arrayRemove(request.groupId),
    });

    // Update the groupJoinRequests state variable
    setGroupJoinRequests((prevRequests) =>
      prevRequests.filter(
        (r) => r.userId !== request.userId || r.groupId !== request.groupId
      )
    );
  }

  return (
    <Container>
      {!props.user && <Redirect to="/" />}
      <table className="center">
        <caption>
          <b>Group Invitations</b>
        </caption>
        {groupInvites.length === 0 && <p>No Invites</p>}
        {groupInvites.map((invite, index) => (
          <tr key={index}>
            <td>{invite.inviterName}</td>
            <td>has invited you to join {invite.groupName}</td>
            <td>
              <button
                className="accept"
                onClick={() => acceptGroupInvite(invite)}
              >
                Accept
              </button>
            </td>
            <td>
              <button
                className="decline"
                onClick={() => declineGroupInvite(invite)}
              >
                Decline
              </button>
            </td>
          </tr>
        ))}
      </table>

      <table className="center">
        <caption>
          <b>Group Join Requests</b>
        </caption>
        {groupJoinRequests.length === 0 && <p>No Requests</p>}
        {groupJoinRequests.map((request, index) => (
          <tr key={index}>
            <td>{request.userName}</td>
            <td>wants to join {request.groupName}</td>
            <td>
              <button
                className="accept"
                onClick={() => acceptGroupJoinRequest(request)}
              >
                Accept
              </button>
            </td>
            <td>
              <button
                className="decline"
                onClick={() => declineGroupJoinRequest(request)}
              >
                Decline
              </button>
            </td>
          </tr>
        ))}
      </table>
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
                        <button className="buttonp" disabled>
                          Joined
                        </button>
                      ) : pendingGroups.includes(group.groupId) ? (
                        <button className="buttonp" disabled>
                          Pending
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
