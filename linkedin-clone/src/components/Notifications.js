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


  const [user, userLoading, userError] = useCollectionData(
    query(collection(db, "Users"), where('userId', '==', currentUserId)
    )
  );
  let notifications = []
  if (user && user[0].notifications) {
    notifications = user[0].notifications.reverse();
  }

  const markAsViewed = async (notification) => {
    const notifIndex = notifications.findIndex(notif => notif.date === notification.date);
    notifications[notifIndex].viewed = true;
    await updateDoc(doc(db, "Users", currentUserId), {
      notifications: notifications
    })
  };

  const viewRequest = async (notification) => {
    const notifIndex = notifications.findIndex(notif => notif.date === notification.date);
    notifications[notifIndex].viewed = true;
    await updateDoc(doc(db, "Users", currentUserId), {
      notifications: notifications
    })
    window.location.assign("/network");
  };

  const viewPost = async (notification) => {
    const notifIndex = notifications.findIndex(notif => notif.date === notification.date);
    notifications[notifIndex].viewed = true;
    await updateDoc(doc(db, "Users", currentUserId), {
      notifications: notifications
    })
    window.location.assign(notification.postURL);
  };

  const handleClear = async () => {
    const clearedNotifs = notifications.filter(notif => notif.viewed === false)
    await updateDoc(doc(db, "Users", currentUserId), {
      notifications: clearedNotifs
    })
    console.log("cleared");
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
                <p>{notification.notification}</p>
                {notification.notification && 
                notification.notification.includes("connect") &&
                <button className="buttonc" onClick={() => viewRequest(notification)}>
                  Go to Network
                </button>
                }
                {notification.postURL && 
                <button className="buttonc" onClick={() => viewPost(notification)}>View Post</button>
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

const mapStateToProps = (state) => {
  return {
    user: state.userState.user
  }
}

const mapDispatchToProps = (dispatch) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Notifications)
