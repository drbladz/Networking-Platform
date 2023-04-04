import { useEffect, useState } from "react";
import styled from "styled-components";
import { getUsers, addConnectionById, banUser, warnUser } from "../actions";
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

  const handleBanUser = async (banUserId, messageId) =>{
    banUser(banUserId)
    await updateDoc(doc(db, "Messages", messageId), {
      reviewed: true
    })
  }

  const handleWarnUser = async (warnUserId, messageId) =>{
    warnUser(warnUserId)
    await updateDoc(doc(db, "Messages", messageId), {
      reviewed: true
    })
  }

  return (
    <Container>
      {!props.user && <Redirect to="/" />}
        {(props.user && props.user.displayName == "admin" && (
      <div className="wrapper"> 
      <div className="container">
        <h1>Flagged Messages</h1>
        <div className="row">
          <div className="column">
          {loading && <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}
        {props.user && flaggedMessages && flaggedMessages.map((flaggedMessage)  => {
          if(!flaggedMessage.reviewed){
            return(
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
            <p>"{flaggedMessage.message}"</p>}
            <button className="buttonc" onClick={() => handleBanUser(flaggedMessage.sender, flaggedMessage.id)}>Ban</button>
            <button className="buttonc" onClick={() => handleWarnUser(flaggedMessage.sender, flaggedMessage.id)
              }>Tolerate</button>
          </div>)}
      })} 
      </div>
      </div>
      </div> 
      </div>))}
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
    banUser: (id)=> dispatch(banUser(id)),
    warnUser: (id)=> dispatch(warnUser(id)),
  })
  
  export default connect(mapStateToProps, mapDispatchToProps)(Messages)