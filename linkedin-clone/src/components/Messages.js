import { useEffect, useState } from "react";
import styled from "styled-components";
import { getUsers, addConnectionById, acceptRequest, declineRequest } from "../actions";
import { connect } from "react-redux";
import { Redirect, Link } from "react-router-dom";
import './Messages.css';
import { collection, query, where, getDocs, orderBy, addDoc, updateDoc, doc, setDoc }from 'firebase/firestore';
import db, {
  auth,
  provider,
  storage,
  signInWithPopup,
  createUserWithEmailAndPassword,
} from "../firebase";
import { useCollectionData } from 'react-firebase-hooks/firestore';

const Messages = (props) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
  getUsers().then(data => {
    setUsers(data);
  });
  return () => {
    setUsers([]);
  }
  }, [])

  const [flaggedMessages, loading, error] = useCollectionData(
    query(collection(db, "Messages"), where('flagged', '==', true),
    orderBy('createdAt')
    )
  );

  return (
    <Container>
      {!props.user && <Redirect to="/" />}
      <table className="center">
        <caption><b></b></caption>
        {(props.user && props.user.requests && props.user.requests.length === 0) && <div>No requests</div>}
        {props.user && props.user.requests ? props.user.requests.map((req, index) => (
          <tr className="reqRow" key={req.id}>
            <td>
            {req.photoURL ?
              <img src={req.photoURL} alt="" width={50} height={50} />
              :<img src="/images/user.svg" alt="" height="50" width="50"/>
            }
            </td>
            <td>
            {req.name}
            </td>
            <td>
            <button className="accept" onClick={() => {
              props.acceptRequest(req.id);
            }}>Accept</button>
            </td>
            <td>
            <button className="decline" onClick={() => {
              props.declineRequest(req.id);
            }}>Decline</button>
            </td>
          </tr>   
        )
        ) : <div></div>}
      </table>
      <br/>
      <div className="wrapper"> 
      <div className="container">
        <h1>Flagged Messages</h1>
        <div className="row">
          <div className="column">
          {loading && <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}
        {props.user && flaggedMessages && flaggedMessages.map((flaggedMessage)  => (
            <div className="flag-card" key={flaggedMessage.id}>
            <div>
            </div>
            <h2>{flaggedMessage.sender}</h2>
            <br/>
            {flaggedMessage.file ? 
            <p>
              <a href={flaggedMessage.file} target="_blank" rel="noreferrer">
                  {flaggedMessage.fileName}
                </a>
            </p> :
            <p>"{flaggedMessage.message}"</p>
            }
            <button className="buttonc" onClick={() => {
              }}>Ban</button>
            <button className="buttonc" onClick={() => {
              }}>Tolerate</button>
          </div>
      ))} 
      </div>
      </div>
      </div> 
      </div>
      <br/>
      <div className="wrapper"> 
      <div className="container">
        <h1>Current Conversations</h1>
        <div className="row">
          <div className="column">
      </div>
      </div>
      </div>  
      </div>
    </Container>
  );
}

const Container = styled.div`
  padding-top: 72px;
  max-width: 100%;
`;

const mapStateToProps = (state) =>{
    return {
      user: state.userState.user
    }
  }
  
  const mapDispatchToProps = (dispatch) => ({
    addConnectionById: (id) => dispatch(addConnectionById(id)),
    acceptRequest: (id) => dispatch(acceptRequest(id)),
    declineRequest: (id) => dispatch(declineRequest(id))
  })
  
  export default connect(mapStateToProps, mapDispatchToProps)(Messages)