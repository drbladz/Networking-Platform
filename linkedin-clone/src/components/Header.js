import styled from "styled-components";
import {connect } from "react-redux";
import { signOutAPI, getUsers} from "../actions";
import { getAllJobPostings } from "../actions/index";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import db from '../firebase';
import 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faSearch } from '@fortawesome/free-solid-svg-icons';

const getUserSearchingPreferences = async () => {
  try {
    const currentUser = getAuth().currentUser;
    const userDocRef = doc(db, 'Users', currentUser.uid);
    const docSnap = await getDoc(userDocRef);
    
    if (docSnap.exists()) {
      const userData = docSnap.data();
      return userData.searchingPreferences;
    } else {
      console.log('No user found with this userId:', currentUser.uid);
      return null;
    }
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    return null;
  }
};


const filterJobsByPreferences = (jobs, preferences) => {
  return jobs.filter((job) => {
    if (!job.jobParameters) {
      return false;
    }

    const {
      experienceLevel,
      industry,
      jobType,
      remoteWorkOption,
    } = job.jobParameters;

    return (
      experienceLevel === preferences.experienceLevel &&
      industry === preferences.industry &&
      jobType === preferences.jobType &&
      remoteWorkOption === preferences.remoteWorkOption
    );
  });
};

const Header = (props) => {
  const [value, setValue] = useState("");
  const [users, setUsers] = useState([]);
  const [jobPostings, setJobPostings] = useState([]);
  const [searchPreferences, setSearchPreferences] = useState(null);
  const [usePreferences, setUsePreferences] = useState(false);
  useEffect(() => {
  getUsers().then(data => {
    setUsers(data);
  });

  getAllJobPostings().then(data => {
    setJobPostings(data);
  });

  if (props.user) {
    getUserSearchingPreferences(props.user.userId).then(searchingPreferences => {
      setSearchPreferences(searchingPreferences);
    });
  }
  console.log("get users and job postings");
  return () => {
    setUsers([]);
    setJobPostings([]);
  }
  }, [])

  const onChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <Container>
    <Content>
      <Logo>
        <Link to="/home">
          <img src="/images/jobshare.png" width="40px" alt="" />
        </Link>
      </Logo>
      <SearchContainer>
      <Search>
        <div>
        <input type="text" placeholder="Search" value={value} onChange={onChange} style={{width: '1100px'}} />
        </div>
        <SearchIcon>
          <img src="/images/search-icon.svg" alt="" />
        </SearchIcon>
        <ToggleButtonContainer>
        <ToggleButton usePreferences={usePreferences} onClick={() => setUsePreferences(!usePreferences)}>
  {usePreferences ? <><FontAwesomeIcon icon={faCog} /> Search with Preferences</> : <> Search All Jobs</>}
</ToggleButton>
        </ToggleButtonContainer>
        <Dropdown show={value}>
  {value && (
    <>
      <UserSection>
        <SectionLabel>Users</SectionLabel>
        {users
          .filter((user) => {
            const searchTerm = value.toLowerCase();
            let fullName;
            if (user.displayName) {
              fullName = user.displayName.toLowerCase();
            } else {
              fullName = "No name";
            }
            return searchTerm && fullName.startsWith(searchTerm);
          })
          .slice(0, 10)
          .map((user) => (
            <DropdownRow key={user.userId}>
              <Link
                to={{
                  pathname: `/user/${user.userId}`,
                  state: user,
                }}
                style={{ textDecoration: "none", color: "black" }}
                onClick={() => setValue("")}
              >
                {user.photoURL ? (
                  <UserPhoto
                    src={user.photoURL}
                    alt=""
                    width={30}
                    height={30}
                  />
                ) : (
                  <UserPhoto
                    src="/images/user.svg"
                    alt=""
                    width={30}
                    height={30}
                  />
                )}
                {user.displayName}
              </Link>
            </DropdownRow>
          ))}
      </UserSection>
      <HorizontalLine />
      <JobSection>
  <SectionLabel>Jobs</SectionLabel>
  {(usePreferences ? filterJobsByPreferences(props.jobPostings, searchPreferences) : props.jobPostings)
    .filter((job) => {
      const searchTerm = value.toLowerCase();
      const title = job.postTitle.toLowerCase();
      const description = job.postDescription.toLowerCase();
      return (
        searchTerm &&
        (title.startsWith(searchTerm) ||
          description.startsWith(searchTerm))
      );
    })
    .slice(0, 10)
    .map((job) => (
      <DropdownRow key={job.id}>
        <Link
          to={{
            pathname: `/job-posting/${job.id}`,
            state: job,
          }}
          style={{ textDecoration: "none", color: "black" }}
          onClick={() => setValue("")}
          target="_blank"
        >
          {job.postTitle}
        </Link>
      </DropdownRow>
    ))}
</JobSection>
    </>
  )}
</Dropdown>
        </Search>
      </SearchContainer>
        <Nav>
          <NavListWrap>
            <NavList className="active">
              <Link to="/home">
                <img src="/images/nav-home.svg" alt="" />
                <span>Home</span>
              </Link>
            </NavList>

            <NavList>
              <Link to="/network">
                <img src="/images/nav-network.svg" alt="" />
                <span>My Network</span>
              </Link>
            </NavList>

            <NavList>
              <a>
                <img src="/images/nav-jobs.svg" alt="" />
                <span>Jobs</span>
              </a>
            </NavList>

            <NavList>
              <a>
                <img src="/images/nav-messaging.svg" alt="" />
                <span>Messaging</span>
              </a>
            </NavList>

            <NavList>
              <a>
                <img src="/images/nav-notifications.svg" alt="" />
                <span>Notifications</span>
              </a>
            </NavList>

            <User>
              <a>
                {props.user && props.user.photoURL ?
                <img src={props.user.photoURL} referrerPolicy="no-referrer"/>
                :<img src="/images/user.svg" alt="" />}
                <span>
                  Me
                  <img src="/images/down-icon.svg" alt="" />
                </span>
                
              </a>

              <SignOut onClick={()=>props.signOut()}>
                <a>Sign Out</a>
              </SignOut>
            </User>

            <Work>
              <a>
                <img src="/images/nav-work.svg" alt="" />
                <span>
                  Work
                  <img src="/images/down-icon.svg" alt="" />
                </span>
              </a>
            </Work>
          </NavListWrap>
        </Nav>
      </Content>
    </Container>
  );
};

const Container = styled.div`
  background-color: white;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  left: 0;
  padding: 0 24px;
  position: fixed;
  top: 0;
  width: 100vw;
  z-index: 100;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  margin: 0 auto;
  min-height: 100%;
  max-width: 1128px;
`;

const Logo = styled.span`
  margin-right: 8px;
  font-size: 0px;
`;

const Search = styled.div`
  opacity: 1;
  flex-grow: 1;
  position: relative;
  display: flex;
  align-items: center;
  & > div {
    max-width: 280px;
    input {
      border: none;
      box-shadow: none;
      background-color: #eef3f8;
      border-radius: 2px;
      color: rgba(0, 0, 0, 0.9);
      width: 218px;
      padding: 0 8px 0 40px;
      line-height: 1.75;
      font-weight: 400;
      font-size: 14px;
      height: 34px;
      border-color: #dce6f1;
      vertical-align: text-top;
      outline: none; 
    }
  }
`;

const SearchContainer = styled.div`
  position: relative;
`;
const ToggleButtonContainer = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 0.5rem;
`;

const SearchIcon = styled.div`
  width: 40px;
  position: absolute;
  z-index: 1;
  top: 10px;
  left: 2px;
  border-radius: 0 2px 2px 0;
  margin: 0;
  pointer-events: none;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Dropdown = styled.div`
  background-color: white;
  display: ${({ show }) => (show ? 'flex' : 'none')};
  flex-direction: column;
  border: 1px solid gray;
  border-radius: 5px;
  position: absolute;
  z-index: 2;
  width: 100%;
  top: 50px;
`;
const UserSection = styled.div`
  display: flex;
  flex-direction: column;
`;
const SectionLabel = styled.div`
  background-color: #f5f5f5;
  font-weight: bold;
  padding: 5px;
`;
const HorizontalLine = styled.hr`
  margin: 0;
  border: 0;
  border-top: 1px solid gray;
`;

const JobSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const DropdownRow = styled.div`
  cursor: pointer;
  text-align: start;
  margin: 2px 0;
  padding: 5px;
  &:hover {
    background-color: Gainsboro;
  }
`;

const UserPhoto = styled.img`
  margin-right: 5px;
  border-radius: 50%;
`;

const Nav = styled.nav`
  margin-left: auto;
  display: block;
  @media (max-width: 768px) {
    position: fixed;
    left: 0;
    bottom: 0;
    background: white;
    width: 100%;
  }
`;
const ToggleButton = styled.button`
  margin-left: 10px;
  border: none;
  background-color: ${({ usePreferences }) => usePreferences ? '#E5F3FF' : '#FFFFFF'};
  border-radius: 2px;
  color: ${({ usePreferences }) => usePreferences ? '#0E6AFF' : 'rgba(0, 0, 0, 0.6)'};
  padding: 5px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;

  &:hover {
    background-color: ${({ usePreferences }) => usePreferences ? '#E5F3FF' : 'rgba(0, 0, 0, 0.05)'};
  }
  
  svg {
    margin-right: 5px;
    fill: ${({ usePreferences }) => usePreferences ? '#0E6AFF' : 'rgba(0, 0, 0, 0.6)'};
  }
`;
const NavListWrap = styled.ul`
  display: flex;
  flex-wrap: nowrap;
  list-style-type: none;

  .active {
    span:after {
      content: "";
      transform: scaleX(1);
      border-bottom: 2px solid var(--white, #fff);
      bottom: 0;
      left: 0;
      position: absolute;
      transition: transform 0.2s ease-in-out;
      width: 100%;
      border-color: rgba(0, 0, 0, 0.9);
    }
  }
`;

const NavList = styled.li`
  display: flex;
  align-items: center;
  a {
    align-items: center;
    background: transparent;
    display: flex;
    flex-direction: column;
    font-size: 12px;
    font-weight: 400;
    justify-content: center;
    line-height: 1.5;
    min-height: 52px;
    min-width: 80px;
    position: relative;
    text-decoration: none;

    span {
      color: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
    }

    @media (max-width: 768px) {
      min-width: 70px;
    }
  }

  &:hover,
  &:active {
    a {
      span {
        color: rgba(0, 0, 0, 0.9);
      }
    }
  }
`;

const SignOut = styled.div`
  position: absolute;
  top: 45px;
  background: white;
  border-radius: 0 0 5px 5px;
  width: 100px;
  height: 40px;
  font-size: 16px;
  transition-duration: 167ms;
  text-align: center;
  display: none;
`;

const User = styled(NavList)`
  a > svg {
    width: 24px;
    border-radius: 50%;
  }

  a > img {
    width: 24px;
    height: 24px;
    border-radius: 50%;
  }

  span {
    display: flex;
    align-items: center;
  }

  &:hover {
    ${SignOut} {
      align-items: center;
      display: flex;
      justify-content: center;
    }
  }
`;

const Work = styled(User)`
  border-left: 1px solid rgba(0, 0, 0, 0.08);
`;

const mapStateToProps = (state) =>{
  return {
    user: state.userState.user,
    jobPostings: state.jobPostingsState.jobPostings,
  }
}

const mapDispatchToProps = (dispatch) => ({
  signOut: () => dispatch(signOutAPI())
})

export default connect(mapStateToProps, mapDispatchToProps)(Header)
