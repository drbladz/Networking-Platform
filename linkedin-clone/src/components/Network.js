import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  getUsers,
  addConnectionById,
  acceptRequest,
  declineRequest,
} from "../actions";
import { connect } from "react-redux";
import { Redirect, Link } from "react-router-dom";
import Modal from "react-modal";
import "./Network.css";
import UpdateConnections from "./UpdateConnections";

const Network = (props) => {
  const [users, setUsers] = useState([]);
  const [showConnectionModal, setShowConnectionModal] = useState(false);

  const handleConnectionClick = () => {
    setShowConnectionModal(true);
  };

  const handleClose = () => {
    setShowConnectionModal(false);
  };

  useEffect(() => {
    getUsers().then((data) => {
      setUsers(data);
    });
    return () => {
      setUsers([]);
    };
  }, []);

  return (
    <Container>
      <table className="center">
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
              <td className="notranslate">{req.name}</td>
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
      </table>
      <br />
      <a>
            <ReviewConnections onClick={handleConnectionClick}>
              My Connections
            </ReviewConnections>
            <CustomModal3
              isOpen={showConnectionModal}
              onRequestClose={handleClose}
            >
              {showConnectionModal && (
                <UpdateConnections userId={props.user.userId} />
              )}
            </CustomModal3>
          </a>
      <div className="wrapper">
        <div className="container">
          <h1>Add Connections</h1>
          <div className="row">
            <div className="column">
              {props.user &&
                props.user.requests &&
                users
                  .filter(
                    (user) =>
                      user.userId !== props.user.userId &&
                      !props.user.requests.some((c) => c.id === user.userId) &&
                      !props.user.connections.some((c) => c.id === user.userId)
                  )
                  .map((user, index) => (
                    <div className="card" key={user.userId}>
                      <Link
                        to={{
                          pathname: `/user/${user.userId}`,
                          state: user,
                        }}
                        style={{ textDecoration: "none", color: "black" }}
                      >
                        <div>
                          {user.photoURL ? (
                            <img
                              src={user.photoURL}
                              alt=""
                              height="100"
                              width="100"
                            />
                          ) : (
                            <img
                              src="/images/user.svg"
                              alt=""
                              height="100"
                              width="100"
                            />
                          )}
                        </div>
                      </Link>

                      <h2 className="notranslate">{user.displayName}</h2>
                      {props.user &&
                      props.user.pending &&
                      props.user.pending.includes(user.userId) ? (
                        <button className="buttonp" disabled>
                          Pending
                        </button>
                      ) : (
                        <button
                          className="buttonc"
                          onClick={() => {
                            props.addConnectionById(user.userId);
                          }}
                        >
                          Connect
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

const ReviewConnections = styled.div`
  color: #0a66c2;
  margin-top: 4px;
  margin-left: 30px;
  font-size: 16px;
  line-height: 1.33;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const CustomModal3 = styled(Modal)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  width: 400px;
  height: 55%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  overflow-y: auto;
`;

const mapStateToProps = (state) => {
  return {
    user: state.userState.user,
  };
};

const mapDispatchToProps = (dispatch) => ({
  addConnectionById: (id) => dispatch(addConnectionById(id)),
  acceptRequest: (id) => dispatch(acceptRequest(id)),
  declineRequest: (id) => dispatch(declineRequest(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Network);