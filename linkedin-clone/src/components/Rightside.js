import { useEffect, useState } from "react";
import styled from "styled-components";
import { getUsers, addConnectionById, getNameById, acceptRequest, declineRequest, getRequests } from "../actions";
import { connect } from "react-redux";

const Rightside = (props) => {
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
  getUsers().then(data => {
    setUsers(data);
  });
  console.log("users:");
  console.log(users);
  console.log(props.user.requests);
  if (props.user){
    if (props.user.requests !== undefined){
      setRequests(props.user.requests);
  }
  }
  //console.log(getRequests());
  return () => {
    setUsers([]);
    setRequests([]); 
  }
  }, [])

  return (
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
      <BannerCard>
        <img
          src="https://www.blackenterprise.com/wp-content/blogs.dir/1/files/2022/01/iStock-1290639027-scaled.jpg"
          alt=""
        />
      </BannerCard>
      <table>
        <caption>Users</caption>
        <tbody>
        {users.map((user, index) => (
          <tr key={user.userId}>
            {user.displayName}
            <button onClick={() => addConnectionById(user.userId)}>Connect</button>
            {/* {(props.user.pending.includes(user.userId)) ? <button disabled>Pending</button> : <button onClick={addConnectionById(user.userId)}>Connect</button>} */}
          </tr>
      ))} 
      </tbody>
      </table>
      <br/>
      <table>
        <caption>Requests</caption>
        {requests.map((requestId, index) => (
          <tr key={requestId}>
            {requestId}
            <button onClick={() => acceptRequest(requestId)}>Accept</button>
            <button onClick={() => declineRequest(requestId)}>Decline</button>
          </tr>   
        )
        )}
      </table>
    </Container>
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