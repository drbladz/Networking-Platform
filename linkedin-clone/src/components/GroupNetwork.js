import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  getGroups,
  addConnectionById,
  acceptRequest,
  declineRequest,
} from "../actions";
import { connect } from "react-redux";
import { Redirect, Link } from "react-router-dom";
import "./GroupNetwork.css";

const GroupNetwork = (props) => {
  const [groups, setGroups] = useState([]);

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
      {/* <table className="center">
      <caption>
        <b>Requests</b>
      </caption>
      {props.user &&
        props.user.requests &&
        props.user.requests.length === 0 && <div>No requests</div>}
      {props.user && props.user.requests ? (
        props.user.requests.map((req, index) => (
          <tr className="reqRow" key={req.id}>
            <td>
              {req.photoURL ? (
                <img src={req.photoURL} alt="" width={50} height={50} />
              ) : (
                <img src="/images/user.svg" alt="" height="50" width="50" />
              )}
            </td>
            <td>{req.name}</td>
            <td>
              <button
                className="accept"
                onClick={() => {
                  props.acceptRequest(req.id);
                }}
              >
                Accept
              </button>
            </td>
            <td>
              <button
                className="decline"
                onClick={() => {
                  props.declineRequest(req.id);
                }}
              >
                Decline
              </button>
            </td>
          </tr>
        ))
      ) : (
        <div></div>
      )}
    </table> */}
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
                          onClick={() => {
                            // Add logic to join the group
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
