import { useEffect, useState } from "react";
import styled from "styled-components";
import { getUsers, addConnectionById, acceptRequest, declineRequest } from "../actions";
import { connect } from "react-redux";
import { Redirect, Link } from "react-router-dom";
import './Messages.css';
import { collection, query, where, getDocs, orderBy, addDoc, updateDoc, doc, setDoc, or }from 'firebase/firestore';
import db, {
  auth,
  provider,
  storage,
  signInWithPopup,
  createUserWithEmailAndPassword,
} from "../firebase";
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { FaFlag } from 'react-icons/fa';
import { TiWarning } from "react-icons/ti";
import { GrAttachment } from 'react-icons/gr';
import { BsSendFill, BsFillEmojiSmileFill } from 'react-icons/bs';

const Messages = (props) => {
  const [users, setUsers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  let conversations = [];

  useEffect(() => {
  getUsers().then(data => {
    setUsers(data);
  });
  if(auth.currentUser){
    setCurrentUserId(auth.currentUser.uid);
  }
  return () => {
    setUsers([]);
  }
  }, [])

  const [flaggedMessages, loading, error] = useCollectionData(
    query(collection(db, "Messages"), where('flagged', '==', true),
    orderBy('createdAt')
    )
  );

  const flagMessage = async (id) => {
    await updateDoc(doc(db, "Messages", id), {
      flagged: true
    })
  };

  const unflagMessage = async (id) => {
    await updateDoc(doc(db, "Messages", id), {
      flagged: false
    })
  };

  const [messages, msgLoading, msgError] = useCollectionData(
    query(collection(db, "Messages"), or(where('sender', '==', currentUserId),
    where('recipient', '==', currentUserId))
    )
  );

  // Custom comparison function to sort messages by date timestamp
  const compare = (a, b) => {
    if (a.createdAt < b.createdAt) {
      return -1;
    }
    if (a.createdAt > b.createdAt) {
      return 1;
    }
    return 0;
  };

  // Sort the array by date timestamp
  messages?.sort(compare);
  console.log(messages);

  //For each user, put all past messages as a conversation and store all conversations in an array 
  users.forEach(user => {
    if(user.userId !== currentUserId){
      let filteredMessages = [];
      filteredMessages = messages?.filter(msg => msg.sender === user.userId || msg.recipient === user.userId)
      if(filteredMessages?.length !== 0){
        conversations.push({user: user, messages: filteredMessages});
      }
    }   
  });
  console.log(conversations);

  const ConversationList = ({ selectedConversationId, handleConversationClick }) => {
  return (
    <ul className="conversation-list">
      {conversations.map((conversation) => (
        <li
          key={conversation.user.userId}
          onClick={() => handleConversationClick(conversation.user.userId)}
          className={`conversation-list-item ${conversation.user.userId === selectedConversationId ? 'selected' : ''}`}
        >
          {conversation.user.photoURL ?
           <img src={conversation.user.photoURL} alt={conversation.user.displayName} /> :
           <img src="/images/user.svg" alt={conversation.user.displayName} />
          }
          <div>
            <h3>{conversation.user.displayName}</h3>
            {conversation.messages && conversation.messages[conversation.messages.length-1].message ?
             <p>{conversation.messages && conversation.messages[conversation.messages.length-1].message}</p> :
             <p>{conversation.messages && conversation.messages[conversation.messages.length-1].fileName}</p> 
            }
          </div>
        </li>
      ))}
    </ul>
  );
};

const Conversation = ({ conversation }) => {
  return (
    <div className="conversation">
      <ul className="conversation-messages">
        {conversation && conversation.messages && conversation.messages.map((msg) => (
          <li key={msg.id} className={`conversation-message ${msg.sender !== conversation.user.userId ? 'sent' : 'received'}`}>
            {/* {props.user && props.user.userId === msg.sender &&
            <img src={props.user.photoURL} alt={props.user.displayName} />
            } */}
            {conversation.user.photoURL && conversation.user.userId === msg.sender &&
            <img src={conversation.user.photoURL} alt={conversation.user.displayName} />
            }
            {!conversation.user.photoURL && conversation.user.userId === msg.sender &&
            <img src="/images/user.svg" alt={conversation.user.displayName} />
            }
            <div className="direct-message">
              {msg.file ? (
                <p>
                  <a href={msg.file} target="_blank" rel="noreferrer">
                  {msg.fileName}
                  </a>
                </p>
              ) : (
                <p>{msg.message}</p>
              )}
              <small className="direct-message-date">{Date(msg.createdAt)}</small>
              {msg.sender === conversation.user.userId && !msg.flagged && (
               <div className="direct-message-flag">
               <FaFlag onClick={() => flagMessage(msg.id)} />
             </div>
              )}
              {msg.sender === conversation.user.userId && msg.flagged && (
               <div className="direct-message-offense">
               <TiWarning onClick={() => unflagMessage(msg.id)} />
             </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Messenger = () => {
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const selectedConversation = conversations.find((conversation) => conversation.user.userId === selectedConversationId);

  const handleConversationClick = (id) => {
    setSelectedConversationId(id);
  };

  return (
    <div className="messenger">
      <ConversationList selectedConversationId={selectedConversationId} handleConversationClick={handleConversationClick} />
{selectedConversation ? (
<Conversation conversation={selectedConversation} />
) : (
  <Conversation conversation={conversations[0]} />
)}
</div>
);
};

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
        <h1>Conversations</h1>
        {/* <div className="row">
          <div className="column">
      </div>
      </div> */}
      <Messenger />
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