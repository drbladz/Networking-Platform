import styled from "styled-components";
import { connect } from "react-redux";
import { signOutAPI, getUsers } from "../actions";
import { Link, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faFileAlt } from "@fortawesome/free-solid-svg-icons";
import {
  filterJobsByPreferences,
  getUserSearchingPreferences,
} from "../actions/index";
import { db, auth } from "../firebase";
import { collection, doc, query, where, updateDoc } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { MdNotificationsActive } from "react-icons/md";
import { useCollection } from "react-firebase-hooks/firestore";

const Header = (props) => {
  // useState hook to manage the search input value
  const [value, setValue] = useState("");
  // useState hook to manage the list of users returned by the API call
  const [users, setUsers] = useState([]);
  const [searchPreferences, setSearchPreferences] = useState(null);
  const [usePreferences, setUsePreferences] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [pages, pagesLoading, pagesError] = useCollection(
    query(
      collection(db, "Pages"),
      where("pageName", ">=", value),
      where("pageName", "<=", value + "\uf8ff")
    )
  );


  // useEffect hook to call the getUsers function from the actions file on component mount
  useEffect(() => {
    // getUsers returns a promise that resolves to an array of user objects
    getUsers().then((data) => {
      setUsers(data);
    });

    if (props.user) {
      getUserSearchingPreferences(props.user.userId).then(
        (searchingPreferences) => {
          setSearchPreferences(searchingPreferences);
        }
      );
    }
    // console.log statement to show when the component is mounted

    console.log("get users and search preferences");
    if (auth.currentUser) {
      setCurrentUserId(auth.currentUser.uid);
    }
    // return statement to clean up the users state on component unmount
    return () => {
      setUsers([]);
    };
  }, []);
  // function to update the search input value when the user types
  const onChange = (event) => {
    setValue(event.target.value);
  };

  // Get realtime current user data
  const [user, userLoading, userError] = useCollectionData(
    query(collection(db, "Users"), where("userId", "==", currentUserId))
  );
  let notifications = [];
  // Get notifications
  if (user && user[0] && user[0].notifications) {
    notifications = user[0].notifications;
  } 

  // component JSX for the Header
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
              <input
                type="text"
                placeholder="Search"
                value={value}
                onChange={onChange}
              />
            </div>
            <SearchIcon>
              <img src="/images/search-icon.svg" alt="" />
            </SearchIcon>

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
                        return searchTerm && 
                        fullName.startsWith(searchTerm) &&
                        (user.active === undefined || user.active === true);
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
                            <div className="notranslate">{user.displayName}</div>
                            
                          </Link>
                        </DropdownRow>
                      ))}
                  </UserSection>
                  <HorizontalLine />
                  <JobSection>
                    <SectionLabel>Jobs</SectionLabel>
                    {(usePreferences && searchPreferences
                      ? filterJobsByPreferences(
                          props.jobPostings,
                          searchPreferences
                        )
                      : props.jobPostings
                    )
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
                  <HorizontalLine />
                  <PagesSection>
  <SectionLabel>Pages</SectionLabel>
  {pages &&
    pages.docs
      .filter((page) => {
        const searchTerm = value.toLowerCase();
        const pageName = page.data().pageName.toLowerCase();
        const pageDescription = page.data().pageDescription.toLowerCase();
        return (
          searchTerm &&
          (pageName.includes(searchTerm) ||
            pageDescription.includes(searchTerm))
        );
      })
      .map((page) => (
        <DropdownRow key={page.id}>
          <Link
            to={{
              pathname: `/page/${page.id}`,
              state: {
                pageName: page.data().pageName,
                pageDescription: page.data().pageDescription,
              },
            }}
            style={{ textDecoration: "none", color: "black" }}
            onClick={() => setValue("")}
          >
            <PageContent>
              {page.data().pageImageURL ? (
                <PageImage
                  src={page.data().pageImageURL}
                  alt=""
                  width={30}
                  height={30}
                />
              ) : (
                <PageImage
                  src="/images/placeholder-image.svg"
                  alt=""
                  width={30}
                  height={30}
                />
              )}
              <PageName className="notranslate">{page.data().pageName}</PageName>
            </PageContent>
          </Link>
        </DropdownRow>
      ))}
</PagesSection>
                </>
              )}
            </Dropdown>
          </Search>
        </SearchContainer>
        <ToggleButtonContainer>
          <ToggleButton
            usePreferences={usePreferences}
            onClick={() => setUsePreferences(!usePreferences)}
          >
            {usePreferences ? (
              <>
                <FontAwesomeIcon icon={faCog} /> Search with Preferences
              </>
            ) : (
              <> Search All Jobs</>
            )}
          </ToggleButton>
        </ToggleButtonContainer>
        <Nav>
          <NavListWrap>
            <NavList className="active">
              <NavLink to="/home">
                <img src="/images/nav-home.svg" alt="" />
                <span>Home</span>
              </NavLink>
            </NavList>

            <NavList>
              <NavLink to="/network">
                <img src="/images/nav-network.svg" alt="" />
                <span>My Network</span>
              </NavLink>
            </NavList>

            <NavList>
              <NavLink to="/groupNetwork">
                <a>
                  <img src="/images/nav-jobs.svg" alt="" />
                  <span>Groups</span>
                </a>
              </NavLink>
            </NavList>

            <NavList>
            <NavLink to="/pages">
              <a>
                <FontAwesomeIcon icon={faFileAlt} color="#666666" style={{fontSize: '24px'}}/>
                <span>Pages</span>
              </a>
            </NavLink>
          </NavList>

            <NavList>
              <NavLink to="/messages">
                <a>
                  <img src="/images/nav-messaging.svg" alt="" />
                  <span>Messaging</span>
                </a>
              </NavLink>
            </NavList>

            <NavList>
              <NavLink to="/notifications">
                <a>
                  {notifications &&
                  notifications[notifications.length - 1] &&
                  notifications[notifications.length - 1].viewed === false ? (
                    <MdNotificationsActive color="orange" size={24} />
                  ) : (
                    <img src="/images/nav-notifications.svg" alt="" />
                  )}
                  <span>Notifications</span>
                </a>
              </NavLink>
            </NavList>

            <User>
              <a>
                {props.user && props.user.photoURL ? (
                  <img src={props.user.photoURL} referrerPolicy="no-referrer" />
                ) : (
                  <img src="/images/user.svg" alt="" />
                )}
                <span>
                  Me
                  <img src="/images/down-icon.svg" alt="" />
                </span>
              </a>

              <SignOut onClick={() => props.signOut()}>
                <a>Sign Out</a>
              </SignOut>
            </User>

            {/* <Work>
              <a>
                <img src="/images/nav-work.svg" alt="" />
                <span>
                  Work
                  <img src="/images/down-icon.svg" alt="" />
                </span>
              </a>
            </Work> */}
          </NavListWrap>
        </Nav>
      </Content>
    </Container>
  );
};
// Styles for the main container
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
// Styles for the content inside the container
const Content = styled.div`
  display: flex;
  align-items: center;
  margin: 0 auto;
  min-height: 100%;
  max-width: 1128px;
`;
// Styles for the logo
const Logo = styled.span`
  margin-right: 8px;
  font-size: 0px;
`;
// Styles for the search input
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
const PageContent = styled.div`
  display: flex;
  align-items: center;
`;
const SearchContainer = styled.div`
  position: relative;
`;
const ToggleButtonContainer = styled.div``;
// Styles for the search icon
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
// Styles for the dropdown menu
const Dropdown = styled.div`
  background-color: white;
  display: ${({ show }) => (show ? "flex" : "none")};
  flex-direction: column;
  border: 1px solid gray;
  border-radius: 5px;
  position: absolute;
  z-index: 2;
  width: 150%;
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
// Styles for the rows in the dropdown menu
const DropdownRow = styled.div`
  cursor: pointer;
  text-align: start;
  margin: 2px 0;
  padding: 5px;
  &:hover {
    background-color: Gainsboro;
  }
`;
// Styles for the user photo
const UserPhoto = styled.img`
  margin-right: 5px;
  border-radius: 50%;
`;
// Styles for the navigation bar
const Nav = styled.nav`
  margin-left: auto;
  display: block;
  @media (max-width: 768px) {
    position: fixed;
    left: 0;
    bottom: 0;
    background: white;
    width: 100%;
    overflow-x: auto;
  }
`;
const ToggleButton = styled.button`
  margin-left: 10px;
  border: none;
  background-color: ${({ usePreferences }) =>
    usePreferences ? "#E5F3FF" : "#FFFFFF"};
  border-radius: 2px;
  color: ${({ usePreferences }) =>
    usePreferences ? "#0E6AFF" : "rgba(0, 0, 0, 0.6)"};
  padding: 5px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;

  &:hover {
    background-color: ${({ usePreferences }) =>
      usePreferences ? "#E5F3FF" : "rgba(0, 0, 0, 0.05)"};
  }

  svg {
    margin-right: 5px;
    fill: ${({ usePreferences }) =>
      usePreferences ? "#0E6AFF" : "rgba(0, 0, 0, 0.6)"};
  }
`;
// Styles for the navigation list wrapper
const NavListWrap = styled.ul`
  display: flex;
  flex-wrap: nowrap;
  list-style-type: none;

  a.active {
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
  cursor: pointer;
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
const PagesSection = styled.div`
  display: flex;
  flex-direction: column;
`;
const PageImage = styled.img`
  border-radius: 50%;
  margin-right: 8px;
`;
const PageName = styled.div`
  font-weight: bold;
`;

const PageDescription = styled.div`
  font-size: 12px;
  color: gray;
`;
const Work = styled(User)`
  border-left: 1px solid rgba(0, 0, 0, 0.08);
`;

const mapStateToProps = (state) => {
  return {
    user: state.userState.user,
    jobPostings: state.jobPostingsState.jobPostings,
  };
};

const mapDispatchToProps = (dispatch) => ({
  signOut: () => dispatch(signOutAPI()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
