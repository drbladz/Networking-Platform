import React, { useState, useEffect } from 'react'
import db from '../firebase';
import { auth } from '../firebase';
import { collection, doc, query, where, updateDoc } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import styled from 'styled-components';
import './Notifications.css'

const Notifications = (props) => {
    const [currentUserId, setCurrentUserId] = useState(null);
    const [currentUserDocument, setCurrentUserDocument] = useState(null);
    const currentUserRef = doc(db, `Users/${currentUserId}`);
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
      if (user && user[0].notifications){
        notifications = user[0].notifications.reverse();
      }
      console.log(user);
      console.log(notifications);

      const markAsViewed = async (date) => {
        const notifIndex = notifications.findIndex(notif => notif.date === date);
        notifications[notifIndex].viewed = true;
        await updateDoc(doc(db, "Users", currentUserId), {
            notifications: notifications
          })
      };
  return (
    <Container>
    {!props.user && <Redirect to="/" />}
    <h1 style={{textAlign: 'center'}}>Notifications</h1>
    <div className="wrapper" style={{width: '50%', margin: 'auto'}}>
        <div className="container">
            <h3 style={{marginBottom: '10px'}}>New</h3>
            <NotificationList>
            {notifications && notifications.filter(n => !n.viewed).map((notification) => (
        <NotificationItem key={notification.date} className={`notification ${notification.viewed ? "viewed" : ""}`}>
          {notification.photoURL ? 
          <img src={notification.photoURL} width={50} height={50} style={{borderRadius: '50%'}}/> :
          <img src="/images/user.svg" alt="" height={50} width={50} style={{borderRadius: '50%'}}/>
          }
          <p>{notification.notification}</p>
          {!notification.viewed && (
            <button className="buttonc" onClick={() => markAsViewed(notification.date)}>Mark as Viewed</button>
          )}
        </NotificationItem>
      ))}
      </NotificationList>
        </div>
    </div>
    <div className="wrapper" style={{width: '50%', margin: 'auto'}}>
        <div className="container">
            <h3 style={{marginBottom: '10px'}}>Previous</h3>
            <NotificationList>
            {notifications && notifications.filter(n => n.viewed).map((notification) => (
        <NotificationItem key={notification.date} className={`notification ${notification.viewed ? "viewed" : ""}`}>
          {notification.photoURL ? 
          <img src={notification.photoURL} width={50} height={50} style={{borderRadius: '50%'}}/> :
          <img src="/images/user.svg" alt="" height={50} width={50} style={{borderRadius: '50%'}}/>
          }
          <p>{notification.notification}</p>
          {!notification.viewed && (
            <button className="buttonc" onClick={() => markAsViewed(notification.date)}>Mark as Viewed</button>
          )}
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
