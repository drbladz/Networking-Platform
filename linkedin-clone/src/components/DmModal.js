import styled from "styled-components";
import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import { collection, query, where, getDocs, orderBy, addDoc }from 'firebase/firestore';
import db, {
  auth,
  provider,
  storage,
  signInWithPopup,
  createUserWithEmailAndPassword,
} from "../firebase";
import { useCollectionData } from 'react-firebase-hooks/firestore';

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

    if (message.trim() !== '') {
      await addDoc(collection(db, "Messages"), {
        sender: currentUserId,
        recipient: recipientId,
        message,
        createdAt: new Date(),
      })
      setMessage('');
    }
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
flex: 1;
overflow-y: auto;
.direct-message{
  border-radius: 4px;
  padding: 8px;
  margin: 8px;
  max-width: 80%;
}
.sent {
  background-color: #dcf8c6;
  align-self: flex-end;
}

.received {
  background-color: #fff;
  align-self: flex-start;
}
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