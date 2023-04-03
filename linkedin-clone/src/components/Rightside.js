import styled from "styled-components";
import { connect } from "react-redux";
import { db } from '../firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { getAuth } from "firebase/auth";

const Rightside = () => {
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();



  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const userId = user.uid;
        
        fetchSuggestedUsers(userId);
      } else {
        setLoading(false);
      }
    });
    
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

const fetchSuggestedUsers = async (userId) => {
  const usersRef = collection(db, 'Users');
  const usersSnapshot = await getDocs(usersRef);
  const usersData = usersSnapshot.docs
    .map((doc) => ({ ...doc.data(), id: doc.id }))
    .filter((u) => u.id !== userId);

  const currentUserDoc = await getDoc(doc(db, 'Users', userId));
  const currentUser = { ...currentUserDoc.data(), id: currentUserDoc.id };
  console.log("Current user params:", currentUser.searchingPreferences);
  const commonUsers = usersData
    .map((u) => ({
      ...u,
      industry: u.searchingPreferences ? u.searchingPreferences.industry : '',
      commonConnections: Array.isArray(u.connections) ? u.connections.filter((c) =>
        Array.isArray(currentUser.connections) && currentUser.connections.some((uc) => uc.id === c.id)
      ).length : 0,
      coursesMatchScore: courseMatchScore(currentUser.courses, u.courses),
    }))
    .filter((u) => !Array.isArray(currentUser.connections) || !currentUser.connections.some((c) => c.id === u.id))
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

      // Sort by common school and course title (as the third filter)
      return b.coursesMatchScore - a.coursesMatchScore;
    });

  // You can adjust the limit to show more or fewer suggested users
  setSuggestedUsers(commonUsers.slice(0, 11));
  setLoading(false);
};

    return () => unsubscribe();
  }, []);

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
    <div className="suggestedUsers">
      <h1>Suggested Users</h1>
      <ul>
  {suggestedUsers.map((user) => (
    <li key={user.id}>
      <div>
        <Avatar style={{ backgroundImage: `url(${user.photoURL || 'https://static-exp1.licdn.com/sc/h/1b4vl1r54ijmrmcyxzoidwmxs'})` }} />
      </div>
      <div>
        <h3>{user.displayName}</h3>
        <button>Connect</button>
      </div>
    </li>
  ))}
</ul>
    </div>
    </div>
  );
};

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
  background-image: url("https://static-exp1.licdn.com/sc/h/1b4vl1r54ijmrmcyxzoidwmxs");
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
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

const mapStateToProps = (state) =>{
  return {
    user: state.userState.user
  }
}

const mapDispatchToProps = (dispatch) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Rightside)