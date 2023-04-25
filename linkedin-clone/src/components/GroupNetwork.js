import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  getGroups,
  sendJoinGroupRequest,
  acceptGroupInvite,
  declineGroupInvite,
  acceptGroupJoinRequest,
  declineGroupJoinRequest,
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
import { HiUserGroup } from "react-icons/hi";
import "./GroupNetwork.css";

const GroupNetwork = (props) => {
  const [groups, setGroups] = useState([]);
  const [groupJoinRequests, setGroupJoinRequests] = useState([]);
  const [pendingGroups, setPendingGroups] = useState([]);
  const [pendingJoinRequests, setPendingJoinRequests] = useState([]);

  const [groupInvites, setGroupInvites] = useState([]);

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

  return (
    <Container>
      <table className="group-center">
        <caption>
          <b>Group Invitations</b>
        </caption>
        {groupInvites.length === 0 && <p>No Invites</p>}
        {groupInvites.map((invite, index) => (
          <tr key={index}>
            <td>
            {invite.inviterPhotoURL ? (
                  <img src={invite.inviterPhotoURL} alt="" width={50} height={50} style={{borderRadius: '50%'}} />
                ) : (
                  <img src="/images/user.svg" alt="" width={50} height={50} style={{borderRadius: '50%'}}/>
                )}
            </td>
            <td>{invite.inviterName}</td>
            <td>has invited you to join {invite.groupName}</td>
            <td>
              <button
                className="group-accept"
                onClick={() => props.acceptGroupInvite(invite)}
              >
                Accept
              </button>
            </td>
            <td>
              <button
                className="group-decline"
                onClick={() => props.declineGroupInvite(invite)}
              >
                Decline
              </button>
            </td>
          </tr>
        ))}
      </table>

      <table className="group-center" style={{marginTop:'2em'}}>
        <caption>
          <b>Group Join Requests</b>
        </caption>
        {groupJoinRequests.length === 0 && <p>No Requests</p>}
        {groupJoinRequests.map((request, index) => (
          <tr key={index}>
            <td>
            {request.userPhotoURL ? (
                  <img src={request.userPhotoURL} alt="" width={50} height={50} style={{borderRadius: '50%'}} />
                ) : (
                  <img src="/images/user.svg" alt="" width={50} height={50} style={{borderRadius: '50%'}}/>
                )}
            </td>
            <td>{request.userName}</td>
            <td>wants to join {request.groupName}</td>
            <td>
              <button
                className="group-accept"
                onClick={() => props.acceptGroupJoinRequest(request)}
              >
                Accept
              </button>
            </td>
            <td>
              <button
                className="group-decline"
                onClick={() => props.declineGroupJoinRequest(request)}
              >
                Decline
              </button>
            </td>
          </tr>
        ))}
      </table>
      <br />
      <div className="group-wrapper">
        <div className="group-container">
          <h1>Add Groups</h1>
          <div className="group-row">
            <div className="group-column">
              {groups && props.user &&
                groups
                  .filter((group) => group.createdBy !== props.user.userId)
                  .map((group, index) => (
                    <div className="group-card" key={group.groupId}>
                      <Link
                        to={{
                          pathname: `/group/${group.groupId}`,
                          state: groups,
                        }}
                        style={{ textDecoration: "none", color: "black" }}
                      ></Link>
                      <div className="group-info">
                        <h2>{group.groupName}</h2>
                        <HiUserGroup size={50} />
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
                          className="group-buttonc"
                          onClick={() => {
                            props.sendJoinGroupRequest(
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

const mapDispatchToProps = (dispatch) => ({
  sendJoinGroupRequest: (groupId, userId) => dispatch(sendJoinGroupRequest(groupId, userId)),
  acceptGroupInvite: (invite) => dispatch(acceptGroupInvite(invite)),
  declineGroupInvite: (invite) => dispatch(declineGroupInvite(invite)),
  acceptGroupJoinRequest: (request) => dispatch(acceptGroupJoinRequest(request)),
  declineGroupJoinRequest: (request) => dispatch(declineGroupJoinRequest(request)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GroupNetwork);
