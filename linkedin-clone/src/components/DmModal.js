import styled from "styled-components";
import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  updateDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import db, { storage } from "../firebase";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { FaFlag } from "react-icons/fa";
import { TiWarning } from "react-icons/ti";
import { GrAttachment } from "react-icons/gr";
import { BsSendFill, BsFillEmojiSmileFill } from "react-icons/bs";
import Picker from "@emoji-mart/react";
import { v4 as uuidv4 } from "uuid";

const DmModal = ({ currentUserId, recipientId }) => {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [showPicker, setShowPicker] = useState(false);

  // Get all messages
  const [messages, loading, error] = useCollectionData(
    query(
      collection(db, "Messages"),
      where("sender", "in", [currentUserId, recipientId]),
      where("recipient", "in", [currentUserId, recipientId]),
      orderBy("createdAt")
    )
  );

  // Send message and update db
  const sendMessage = async (e) => {
    e.preventDefault();
    const id = uuidv4();

    if (message.trim() !== "") {
      await setDoc(doc(collection(db, "Messages"), id), {
        id: id,
        sender: currentUserId,
        recipient: recipientId,
        message,
        createdAt: new Date(),
        flagged: false,
        reviewed: false,
      });
      setMessage("");
    } else if (file) {
      const storageRef = ref(storage, `messages/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      await setDoc(doc(collection(db, "Messages"), id), {
        id: id,
        sender: currentUserId,
        recipient: recipientId,
        file: downloadURL,
        fileName: file.name,
        createdAt: new Date(),
        flagged: false,
      });
      setFile(null);
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // User can press Enter on keyboard to send message
  const handleEnter = (e) => {
    if (e.key === "Enter") {
      sendMessage(e);
    }
  };

  const flagMessage = async (id) => {
    await updateDoc(doc(db, "Messages", id), {
      flagged: true,
    });
  };

  const unflagMessage = async (id) => {
    await updateDoc(doc(db, "Messages", id), {
      flagged: false,
    });
  };

  useEffect(() => {
    // Scroll to the bottom of the chat window on initial load and on new messages
    const chatWindow = document.getElementById("chat-window");
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }, [messages]);

  return (
    <Container>
      <DirectMessageContainer className="direct-message-container">
        <DirectMessageChatWindow
          id="chat-window"
          className="direct-message-chat-window"
        >
          {loading && <p>Loading...</p>}
          {error && <p>Error: {error.message}</p>}
          {messages &&
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`direct-message ${
                  msg.sender === currentUserId ? "sent" : "received"
                }`}
              >
                {msg.file ? (
                  <a href={msg.file} target="_blank" rel="noreferrer">
                    {msg.fileName}
                  </a>
                ) : (
                  <div>{msg.message}</div>
                )}
                <div className="direct-message-date">{new Date(msg.createdAt.seconds * 1000 + msg.createdAt.nanoseconds / 1000000).toLocaleString()}</div>
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
        {showPicker && (
          <div style={{ marginLeft: "auto" }}>
            <Picker
              onEmojiSelect={(emoji) => setMessage(message + emoji.native)}
            />
          </div>
        )}
        <InputBox>
          <input
            type="text"
            placeholder="Type your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleEnter}
          />
          {file && (
            <div
              style={{
                border: "1px dashed",
                borderColor: "#007bff",
                borderRadius: "2px",
              }}
            >
              {file.name.length > 10
                ? `${file.name.substring(0, 10)}...${file.name.substring(
                    file.name.length - 4
                  )}`
                : file.name}
            </div>
          )}
          <div style={{ marginLeft: "auto" }}>
            <label htmlFor="attach">
              <GrAttachment
                cursor="pointer"
                style={{ marginRight: "10px" }}
              ></GrAttachment>
            </label>
            <input
              type="file"
              id="attach"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <BsFillEmojiSmileFill
              onClick={() => setShowPicker(!showPicker)}
              cursor="pointer"
              style={{ marginRight: "10px" }}
            ></BsFillEmojiSmileFill>
            <BsSendFill color="blue" cursor="pointer" onClick={sendMessage}>
              <button type="submit">Send</button>
            </BsSendFill>
          </div>
        </InputBox>
      </DirectMessageContainer>
    </Container>
  );
};

export default DmModal;

const DirectMessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

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
    margin-left: auto;
  }

  .direct-message.received {
    align-self: start;
  }

  .direct-message-date {
    display: none;
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

  .direct-message:hover .direct-message-date {
    font-size: 8px;
    display: block;
  }

  flex: 1;
  overflow-y: auto;
  padding: 10px;
`;

const InputBox = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: white;

  input[type="text"] {
    border: none;
    outline: none;
  }
`;

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
