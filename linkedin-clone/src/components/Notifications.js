import React, { useState, useEffect } from 'react'
import { db, auth } from '../firebase';
import { collection, doc, query, where, updateDoc } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import styled from 'styled-components';
import './Notifications.css'

const Notifications = (props) => {
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    if (auth.currentUser) {
      setCurrentUserId(auth.currentUser.uid);
    }
  }, []);

  // Get realtime current user data
  const [user, userLoading, userError] = useCollectionData(
    query(collection(db, "Users"), where('userId', '==', currentUserId)
    )
  );
  let notifications = [];
  // Sort notifications by latest
  if (user && user[0].notifications) {
    notifications = user[0].notifications.sort((a, b) => b.date - a.date);
  }

  // Update db and mark notification as viewed
  const markAsViewed = async (notification) => {
    const notifIndex = notifications.findIndex(notif => notif.date === notification.date);
    notifications[notifIndex].viewed = true;
    await updateDoc(doc(db, "Users", currentUserId), {
      notifications: notifications
    })
  };

  // Set notification as viewed and redirect to network page
  const viewRequest = async (notification) => {
    const notifIndex = notifications.findIndex(notif => notif.date === notification.date);
    notifications[notifIndex].viewed = true;
    await updateDoc(doc(db, "Users", currentUserId), {
      notifications: notifications
    })
    window.location.assign("/network");
  };

  // Set notification as viewed and redirect to network page
  const viewGroupRequest = async (notification) => {
    const notifIndex = notifications.findIndex(notif => notif.date === notification.date);
    notifications[notifIndex].viewed = true;
    await updateDoc(doc(db, "Users", currentUserId), {
      notifications: notifications
    })
    window.location.assign("/groupNetwork");
  };

  // Set notification as viewed and redirect to the post
  const viewPost = async (notification) => {
    const notifIndex = notifications.findIndex(notif => notif.date === notification.date);
    notifications[notifIndex].viewed = true;
    await updateDoc(doc(db, "Users", currentUserId), {
      notifications: notifications
    })
    window.location.assign(notification.postURL);
  };

  // Clear previous notifications
  const handleClear = async () => {
    const clearedNotifs = notifications.filter(notif => notif.viewed === false)
    await updateDoc(doc(db, "Users", currentUserId), {
      notifications: clearedNotifs
    })
  };
  
  return (
    <Container>
      {!props.user && <Redirect to="/" />}
      <h1 style={{ textAlign: 'center' }}>Notifications</h1>
      {userLoading && <p>Loading...</p>}
      {userError && <p>Error: {userError.message}</p>}
      <div className="wrapper" style={{ width: '55%', margin: 'auto' }}>
        <div className="container">
          <h3 style={{ marginBottom: '10px' }}>New</h3>
          <NotificationList>
            {notifications && notifications.filter(n => !n.viewed).map((notification) => (
              <NotificationItem key={notification.date} className={`notification ${notification.viewed ? "viewed" : ""}`}>
                {notification.photoURL ?
                  <img src={notification.photoURL} width={50} height={50} style={{ borderRadius: '50%' }} /> :
                  <img src="/images/user.svg" alt="" height={50} width={50} style={{ borderRadius: '50%' }} />
                }
                <NotificationText>
                  <p>{notification.notification}</p>
                  <small style={{color: '#999', fontSize: '12px'}}>{new Date(notification.date.seconds * 1000 + notification.date.nanoseconds / 1000000).toLocaleString()}</small>
                </NotificationText>
                {notification.notification && 
                notification.notification.includes("connect") &&
                <button className="buttonc" onClick={() => viewRequest(notification)}>
                  Go to Network
                </button>
                }
                {notification.notification && 
                (notification.notification.includes("wants to join") || notification.notification.includes("invited you to join")) &&
                <button className="buttonc" onClick={() => viewGroupRequest(notification)}>
                  Go to Groups
                </button>
                }
                {notification.postURL && 
                <button className="buttonc" onClick={() => viewPost(notification)}>View</button>
                }
                <button className="buttonc" onClick={() => markAsViewed(notification)}>Mark as Viewed</button>
                
              </NotificationItem>
            ))}
          </NotificationList>
        </div>
      </div>
      <div className="wrapper" style={{ width: '55%', margin: 'auto' }}>
        <div className="container">
          <h3 style={{ marginBottom: '10px' }}>Previous</h3>
          {notifications && notifications.filter(n => n.viewed).length !== 0 &&
            <button onClick={handleClear} style={{ marginBottom: '10px', borderRadius: '5px', cursor: 'pointer' }}>
              Clear
            </button>
          }
          <NotificationList>
            {notifications && 
            notifications.filter(n => n.viewed).map((notification) => (
              <NotificationItem key={notification.date} className={`notification ${notification.viewed ? "viewed" : ""}`}>
                {notification.photoURL ?
                  <img src={notification.photoURL} width={50} height={50} style={{ borderRadius: '50%' }} /> :
                  <img src="/images/user.svg" alt="" height={50} width={50} style={{ borderRadius: '50%' }} />
                }
                <p>{notification.notification}</p>
              </NotificationItem>
            ))}
          </NotificationList>
        </div>
      </div>
    </Container>
  )
}

const Container = styled.div`
  padding-top: 72px;
  max-width: 100%;
`;

const NotificationList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const NotificationItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 10px;
  border-bottom: 1px solid #ccc;
  flex-wrap: wrap;

`;

const NotificationText = styled.div`
  display: flex;
  flex-direction: column;
`;

const mapStateToProps = (state) => {
  return {
    user: state.userState.user
  }
}

const mapDispatchToProps = (dispatch) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Notifications)
