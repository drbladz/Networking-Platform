import styled from "styled-components";
import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import { collection, query, where, getDocs, orderBy, addDoc, updateDoc, doc, setDoc }from 'firebase/firestore';
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
import { v4 as uuidv4 } from "uuid";


const DmModal = ({ currentUserId, recipientId }) => {
  
  const [message, setMessage] = useState('');
  const [messages, loading, error] = useCollectionData(
    query(collection(db, "Messages"), where('sender', 'in', [currentUserId, recipientId]),
    where('recipient', 'in', [currentUserId, recipientId]),
    orderBy('createdAt')
    )
  );

  const sendMessage = async (e) => {
    e.preventDefault();
    const id = uuidv4()

    if (message.trim() !== '') {
      await setDoc(doc(collection(db, "Messages"), id), {
        id: id,
        sender: currentUserId,
        recipient: recipientId,
        message,
        createdAt: new Date(),
        flagged: false
      })
      setMessage('');
    }
  };

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

  useEffect(() => {
    // Scroll to the bottom of the chat window on initial load and on new messages
    const chatWindow = document.getElementById('chat-window');
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }, [messages]);

  return (
    <Container>
    <DirectMessageContainer className="direct-message-container">
      <DirectMessageChatWindow id="chat-window" className="direct-message-chat-window">
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}
        {messages &&
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`direct-message ${
                msg.sender === currentUserId ? 'sent' : 'received'
              }`}
            >
              {msg.message}
              {msg.sender === recipientId && !msg.flagged && (
               <div className="direct-message-flag">
               <FaFlag onClick={() => flagMessage(msg.id)} />
             </div>
              )}
              {msg.sender === recipientId && msg.flagged && (
               <div className="direct-message-offense">
               <TiWarning onClick={() => unflagMessage(msg.id)} />
             </div>
              )}
            </div>
          ))}
      </DirectMessageChatWindow>

      <form onSubmit={sendMessage}>
        <input
          type="text"
          placeholder="Type your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </DirectMessageContainer>
    </Container>
  );
};

export default DmModal;

const DirectMessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const DirectMessageChatWindow = styled.div`
.direct-message {
  width: auto;
  max-width: 70%;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  word-wrap: break-word;
  background-color: #e6e6e6;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  display: flex;
  flex-direction: column;
}

.direct-message.sent {
  align-self: end;
  background-color: #007bff;
  color: #fff;
}

.direct-message.received {
  align-self: start;
}

.direct-message-flag {
  display: none;
  top: 0;
  right: 20;
  color: yellow;
}
.direct-message-offense {
  top: 0;
  right: 20;
  color: red;
}

.direct-message:hover .direct-message-flag {
  display: block;
}

  flex: 1;
  overflow-y: auto;
  max-height: 400px;
`

const Container = styled.div`
width: 100%;
position: fixed;
top: 0;
left: 0;
right: 0;
bottom: 0;
z-index: 9999;
color: black;
background-color: rgba(0, 0, 0, 0.8);
`;

const Content = styled.div`
width: 100%;
max-width: 750px;
background-color: white;
max-height: 90%;
overflow: initial;
border-radius: 5px;
position: relative;
display: flex;
flex-direction: column;
top: 32px;
margin: 0 auto;
`;