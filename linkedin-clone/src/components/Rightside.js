
import styled from "styled-components";
import './rightside.css'
import { connect } from "react-redux";
import { db } from '../firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { getAuth } from "firebase/auth";
import {Link } from "react-router-dom";
import { getUsers, addConnectionById, acceptRequest, declineRequest } from "../actions";
// Main RighSide component
const Rightside = (props) => {

  // Define state variables
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const [displayedUsers, setDisplayedUsers] = useState(30);



  // Function to calculate course match score
  const courseMatchScore = (currentUserCourses, otherUserCourses) => {
    let score = 0;
    if (!currentUserCourses || !otherUserCourses) {
      return score;
    }
  
    currentUserCourses.forEach((currentUserCourse) => {
      otherUserCourses.forEach((otherUserCourse) => {
        if (currentUserCourse.school === otherUserCourse.school) {
          score += 1;
          if (currentUserCourse.title === otherUserCourse.title) {
            score += 1;
          }
        }
      });
    });
  
    return score;
  };

  // Function to calculate skills match score
  const skillsMatchScore = (currentUserSkills, otherUserSkills) => {
    let score = 0;
    if (!Array.isArray(currentUserSkills) || !Array.isArray(otherUserSkills)) {
      return score;
    }
  
    currentUserSkills.forEach((currentUserSkill) => {
      otherUserSkills.forEach((otherUserSkill) => {
        if (currentUserSkill && otherUserSkill && currentUserSkill.toLowerCase() === otherUserSkill.toLowerCase()) {

          score += 1;
        }
      });
    });
  
    return score;
  };

  // Function to calculate language match score
  const languagesMatchScore = (currentUserLanguages, otherUserLanguages) => {
    let score = 0;
    if (!Array.isArray(currentUserLanguages) || !Array.isArray(otherUserLanguages)) {
      return score;
    }
  
    currentUserLanguages.forEach((currentUserLanguage) => {
      otherUserLanguages.forEach((otherUserLanguage) => {
        if (currentUserLanguage && otherUserLanguage && currentUserLanguage.toLowerCase() === otherUserLanguage.toLowerCase()) {
          score += 1;
        }
      });
    });
  
    return score;
  };


  // Function to fetch suggested users
  const fetchSuggestedUsers = async (userId) => {
    const usersRef = collection(db, 'Users');
    const usersSnapshot = await getDocs(usersRef);
    const usersData = usersSnapshot.docs
    .map((doc) => ({ ...doc.data(), id: doc.id }))
    .filter((u) => u.id !== userId);
  
    const currentUserDoc = await getDoc(doc(db, 'Users', userId));
    const currentUser = { ...currentUserDoc.data(), id: currentUserDoc.id };
  
  const commonUsers = usersData
  .map((u) => ({
    ...u,
    industry: u.searchingPreferences ? u.searchingPreferences.industry : '',
    experienceLevelMatch: currentUser.searchingPreferences &&
          u.searchingPreferences &&
          currentUser.searchingPreferences.experienceLevel === u.searchingPreferences.experienceLevel ? 1 : 0,
    commonConnections: Array.isArray(u.connections) ? u.connections.filter((c) =>
      Array.isArray(currentUser.connections) && currentUser.connections.some((uc) => uc.id === c.id)
    ).length : 0,
    coursesMatchScore: courseMatchScore(currentUser.courses, u.courses),
    skillsMatchScore: skillsMatchScore(currentUser.skills, u.skills),
    languagesMatchScore: languagesMatchScore(currentUser.languages, u.languages), 
  }))
    .filter((u) => {
      const isConnected = Array.isArray(currentUser.connections) && currentUser.connections.some((c) => c.id === u.id);
      const isPending = Array.isArray(currentUser.pending) && currentUser.pending.includes(u.id);
      return !isConnected && !isPending;
    })
    .sort((a, b) => {
      // Sort by common connections (descending)
      const commonConnectionsDiff = b.commonConnections - a.commonConnections;
      if (commonConnectionsDiff !== 0) {
        return commonConnectionsDiff;
      }
    
      // Sort by common industry (if both have the same number of common connections)
      if (currentUser.searchingPreferences && currentUser.searchingPreferences.industry) {
        const currentUserIndustry = currentUser.searchingPreferences.industry;
        const aMatch = a.industry === currentUserIndustry;
        const bMatch = b.industry === currentUserIndustry;
    
        if (aMatch && !bMatch) {
          return -1;
        }
        if (!aMatch && bMatch) {
          return 1;
        }
      }
    
      // Sort by common school and course title (as the third and fifth filter)
      const coursesMatchDiff = b.coursesMatchScore - a.coursesMatchScore;
      if (coursesMatchDiff !== 0) {
        return coursesMatchDiff;
      }
    
      // Sort by common skills (as the fifth filter)
      const skillsMatchDiff = b.skillsMatchScore - a.skillsMatchScore;
      if (skillsMatchDiff !== 0) {
        return skillsMatchDiff;
      }
  
       // Sort by common languages (as the sixth filter)
       const languagesMatchDiff = b.languagesMatchScore - a.languagesMatchScore;
       if (languagesMatchDiff !== 0) {
         return languagesMatchDiff;
       }
  
        // Sort by experience level (as the seventh filter)
        return b.experienceLevelMatch - a.experienceLevelMatch;
    });
  
    // Adjust the limit to show more or fewer suggested users
    setSuggestedUsers(commonUsers.slice(0, 15));
    setLoading(false);
  };



  // useEffect hook to fetch suggested users and handle window resize
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const userId = user.uid;
        
        fetchSuggestedUsers(userId, displayedUsers);
      } else {
        setLoading(false);
      }
    });



    

    
    return () => {
      unsubscribe();
      
    }
    
  }, []);

  // Return statement to show loading indicator while data is being fetched
  if (loading) {
    return <div>Loading...</div>;
    
  }
  




  
  return (
    <div>
          <Container>
      <FollowCard>
        <Title>
          <h2>Add to your feed</h2>
          <img src="/images/feed-icon.svg" alt="" />
        </Title>

        <FeedList>
          <li>
            <a>
              <Avatar />
            </a>
            <div>
              <span>#Jobshare</span>
              <button>Follow</button>
            </div>
          </li>
          <li>
            <a>
              <Avatar />
            </a>
            <div>
              <span>#Video</span>
              <button>Follow</button>
            </div>
          </li>
        </FeedList>

        <Recommendation>
          View all recommendations
          <img src="/images/right-icon.svg" alt="" />
        </Recommendation>
      </FollowCard>

    </Container>
    <div style={{marginTop: '30px'}}>
      <h1>Suggested Users</h1>
      <SuggestedUsers className="SuggestedUsers">
  {suggestedUsers.map((user) => (
    <li key={user.id} style={{textAlign: 'center'}}>
      <div>
        
      <Link to={{
            pathname: `/user/${user.userId}`,
            state: user
            }}  style={{ textDecoration: 'none', color: 'black' }}> 
        <Avatar>
          {user.photoURL ?
          <img src={user.photoURL} style={{height: '48px', width: '48px', borderRadius: '50%'}} /> :
          <img src="/images/user.svg" style={{height: '48px', width: '48px', borderRadius: '50%'}} />
          }
        </Avatar>
      </Link>
      
      </div>
      <div>
      
        
        <Link to={{
            pathname: `/user/${user.userId}`,
            state: user
            }}  style={{ textDecoration: 'none', color: 'black' }}> 
            <div>
            <h3 className="notranslate">{user.displayName}</h3>
            </div>
      </Link>
      </div>
      {(props.user && props.user.pending && props.user.pending.includes(user.userId)) ? <button className="buttonp" disabled>Pending</button> : 
            <button className="buttonc" onClick={() => {
              props.addConnectionById(user.userId);
              }}>Connect</button>}
    </li>
  ))}
</SuggestedUsers>
    </div>
    </div>
  );
};


//styling
const Container = styled.div`
  grid-area: rightside;
`;

const FollowCard = styled.div`
  text-align: center;
  overflow: hidden;
  margin-bottom: 8px;
  background-color: #fff;
  border-radius: 5px;
  position: relative;
  border: none;
  box-shadow: 0 0 0 1px rgb(0 0 0 / 15%), 0 0 0 rgb(0 0 0 / 20%);
  padding: 12px;
`;

const Title = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  width: 100%;
  color: rgba(0, 0, 0, 0.6);
`;

const FeedList = styled.ul`
  margin-top: 16px;
  li {
    display: flex;
    align-items: center;
    margin: 12px 0;
    position: relative;
    font-size: 14px;
    & > div {
      display: flex;
      flex-direction: column;
    }
    button {
      background-color: transparent;
      color: rgba(0, 0, 0, 0.6);
      box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.6);
      padding: 16px;
      align-items: center;
      border-radius: 15px;
      box-sizing: border-box;
      font-weight: 600;
      display: inline-flex;
      justify-content: center;
      max-height: 32px;
      max-width: 480px;
      text-align: center;
      outline: none;
    }
  }
`;

const Avatar = styled.div`
  width: 48px;
  height: 48px;
  margin-right: 8px;
`;

const Recommendation = styled.a`
  color: #0a66c2;
  display: flex;
  align-items: center;
  font-size: 14px;
`;

const BannerCard = styled(FollowCard)`
  img {
    width: 100%;
    height: 100%;
  }
`;


const SuggestedUsers = styled.div`
  @media (max-width: 768px) {
    margin-bottom: 50px;
  }
`;

// mapStateToProps function to map user state to props
const mapStateToProps = (state) =>{
  return {
    user: state.userState.user
  }
}

// mapDispatchToProps function to map dispatch to props

const mapDispatchToProps = (dispatch) => ({
  addConnectionById: (id) => dispatch(addConnectionById(id)),
  acceptRequest: (id) => dispatch(acceptRequest(id)),
  declineRequest: (id) => dispatch(declineRequest(id))
})


// Connect the component to the Redux store
export default connect(mapStateToProps, mapDispatchToProps)(Rightside)