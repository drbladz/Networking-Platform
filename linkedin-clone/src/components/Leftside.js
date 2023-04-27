import styled from "styled-components";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useSelector } from "react-redux";
import UpdatePhoto from "./UpdatePhoto";
import UploadDocuments from "./UploadDocuments";
import EditForm from "./EditForm";
import Modal from "react-modal";
import UpdateConnections from "./UpdateConnections";
import GroupCreationForm from "./GroupCreationForm";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import CreatePageForm from "./CreatePageForm";
import { deleteProfile } from "../actions";

//Modal.setAppElement("#root"); // set the modal's parent element

const Leftside = (props) => {
  //const [showForm, setShowForm] = useState(false);

  //function handleClick() {
  //  setShowForm(true);
  //}

  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showLanguage, setShowLanguage] = useState(false);

  const handleGroupClick = () => {
    setShowGroupModal(true);
  };

  const handleDocumentClick = () => {
    setShowDocumentsModal(true);
  };

  const handleConnectionClick = () => {
    setShowConnectionModal(true);
  };

  const handlePhotoClick = () => {
    setShowPhotoModal(true);
  };

  const handleEditClick = () => {
    setShowEditModal(true);
  };

  const handleClose = () => {
    setShowPhotoModal(false);
    setShowEditModal(false);
    setShowConnectionModal(false);
    setShowDocumentsModal(false);
    setShowGroupModal(false);
  };

  console.log(props.user);
  return (
    <Container>
      <ArtCard>
        <UserInfo>
          <CardBackground />
          <a>
            {props.user && props.user.photoURL ? (
              <img
                src={props.user.photoURL}
                referrerPolicy="no-referrer"
                style={{ width: "120px", height: "110px", objectFit: "cover", marginTop: '8px'}}
              />
            ) : (
              <Photo />
            )}
            {props.user && props.user.displayName ? (
              <StyledLink>Welcome Back, <span className="notranslate"> {props.user.displayName} </span> </StyledLink>
            ) : (
              <StyledLink>Welcome User</StyledLink>
            )}
          </a>
          <a>
            <Bio>{props.user && props.user.bio}</Bio>
          </a>
          <ChangeLanguageText onClick={() => setShowLanguage(!showLanguage)}>
            Change Language
          </ChangeLanguageText>
          <div style={{display: `${showLanguage ? 'block' : 'none'}`}} id="google_translate_element"></div>
          <a>
            <AddPhotoText onClick={handlePhotoClick}>
              Change Profile Picture
            </AddPhotoText>

            <CustomModal isOpen={showPhotoModal} onRequestClose={handleClose}>
              {showPhotoModal && <UpdatePhoto userId={props.user.userId} />}
            </CustomModal>
          </a>
          <a>
            <ViewDocumentsText onClick={handleDocumentClick}>
              My Stored Documents
            </ViewDocumentsText>

            <CustomModal4
              isOpen={showDocumentsModal}
              onRequestClose={handleClose}
            >
              {showDocumentsModal && (
                <UploadDocuments userId={props.user.userId} />
              )}
            </CustomModal4>
          </a>
          <Link 

            to="/job-preferences"
            
            style={{ textDecoration: "none", display: "block"  }}
          >
            <SetPreferencesText>
              Set Job Searching Preferences
            </SetPreferencesText>
          </Link>
          <Link to="/create-page"  style={{ textDecoration: 'none' , display: "block" }}>
            <CreatePageText>
              Create a Page
            </CreatePageText>
            
          </Link>
          <a>
            <CreateGroup onClick={handleGroupClick}>
              Create a new group
            </CreateGroup>
            <CustomModal5 isOpen={showGroupModal} onRequestClose={handleClose}>
              {showGroupModal && <GroupCreationForm />}
            </CustomModal5>
          </a>
          <DeleteProfile onClick={deleteProfile}>
              Delete Profile
              <Tooltip>Deleting your profile will result in losing all your data.</Tooltip>
          </DeleteProfile>
          <GroupList>
            <a>
              <div>
                <span>My groups:</span>
                {props.user &&
                  props.user.groupOwned &&
                  Object.keys(props.user.groupOwned).map((groupId) => (
                    <Link
                      to={`/groups/${groupId}`}
                      key={groupId}
                      style={{ textDecoration: "none" }}
                    >
                      <MyGroup>
                        <span className="notranslate">{props.user.groupOwned[groupId]}</span>
                      </MyGroup>
                    </Link>
                  ))}
              </div>
            </a>
          </GroupList>
          <GroupList2>
            <a>
              <div>
                <span>My Connections' groups:</span>
                {props.user &&
                  props.user.groupMemberOf &&
                  props.user.groupMemberOf.map((group) => (
                    <div key={group.groupId}>
                      <a
                        href={`/groups/${group.groupId}`}
                        style={{ textDecoration: "none" }}
                      >
                        <span className="notranslate">{group.group}</span>
                      </a>
                    </div>
                  ))}
              </div>
            </a>
          </GroupList2>
          <EditInfo>
            <img
              style={{cursor: 'pointer'}}
              onClick={handleEditClick}
              src="/images/edit-icon.svg"
              alt=""
            ></img>
            <CustomModal2 isOpen={showEditModal} onRequestClose={handleClose}>
              {showEditModal && <EditForm userId={props.user.userId} userInfo={props.user} />}
            </CustomModal2>
          </EditInfo>
        </UserInfo>

        <Widget>
          <a href="/network">
            <div>
              <span>Connections</span>
              <span>Grow your network</span>
            </div>
            <img src="/images/widget-icon.svg" alt="" />
          </a>
          <a>
            <ReviewConnections onClick={handleConnectionClick}>
              View Connections
            </ReviewConnections>
            <CustomModal3
              isOpen={showConnectionModal}
              onRequestClose={handleClose}
            >
              {showConnectionModal && (
                <UpdateConnections userId={props.user.userId} />
              )}
            </CustomModal3>
          </a>
        </Widget>
        <ContactInfo>
          <a>
            <div>
              <span>Contact Information</span>
              <span>{props.user && props.user.contactInfo}</span>
            </div>
          </a>
        </ContactInfo>
        <Education>
          <a>
            <div>
              <span>Educations</span>
              {props.user &&
                props.user.educations &&
                props.user.educations.map((e) => (
                  <span key={e.program}>{e.school}</span>
                ))}
            </div>
          </a>
        </Education>

        <Work>
          <a>
            <div>
              <span>Work</span>
              {props.user &&
                props.user.works &&
                props.user.works.map((work) => (
                  <span key={work.company}>{work.title}</span>
                ))}
            </div>
          </a>
        </Work>

        <Skills>
          <a>
            <div>
              <span>Skills</span>
              {props.user &&
                props.user.skills &&
                props.user.skills.map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
            </div>
          </a>
        </Skills>

        <Languages>
          <a>
            <div>
              <span>Languages</span>
              {props.user &&
                props.user.languages &&
                props.user.languages.map((lang) => (
                  <span key={lang}>{lang}</span>
                ))}
            </div>
          </a>
        </Languages>

        <Courses>
          <a>
            <div>
              <span>Courses</span>
              {props.user &&
                props.user.courses &&
                props.user.courses.map((course) => (
                  <span key={course.school}>{course.title}</span>
                ))}
            </div>
          </a>
        </Courses>

        <Projects>
          <a>
            <div>
              <span>Projects</span>
              {props.user &&
                props.user.projects &&
                props.user.projects.map((project) => (
                  <span key={project.title}>{project.title}</span>
                ))}
            </div>
          </a>
        </Projects>

        <Volunteerings>
          <a>
            <div>
              <span>Volunteerings</span>
              {props.user &&
                props.user.volunteerings &&
                props.user.volunteerings.map((v) => (
                  <span key={v.company}>{v.title}</span>
                ))}
            </div>
          </a>
        </Volunteerings>
        <Awards>
          <a>
            <div>
              <span>Awards</span>
              {props.user &&
                props.user.awards &&
                props.user.awards.map((award) => (
                  <span key={award.issuer}>{award.title}</span>
                ))}
            </div>
          </a>
        </Awards>

        <Recommandations>
          <a>
            <div>
              <span>Recommendations</span>
              {props.user &&
                props.user.recommendations &&
                props.user.recommendations.map((rec) => (
                  <span key={rec}>{rec}</span>
                ))}
            </div>
          </a>
        </Recommandations>

        <Item>
          <span>
            <img src="/images/item-icon.svg" alt="" />
            My Items
          </span>
        </Item>
      </ArtCard>

      <CommunityCard>
        <a>
          <span>Groups</span>
        </a>
        <a>
          <span>
            Events
            <img src="/images/plus-icon.svg" alt="" />
          </span>
        </a>
        <a>
          <span>Follow Hashtags</span>
        </a>
        <a>
          <span>Discover more</span>
        </a>
      </CommunityCard>
    </Container>
  );
};

const CustomModal5 = styled(Modal)`
  display: flex;
  align-items: center;
  flex-direction: column;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  width: 800px;
  height: 300px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  overflow-y: auto;
`;

const MyGroup = styled.div`
  color: #0a66c2;
  margin-top: 4px;
  font-size: 12px;
  line-height: 1.33;
  font-weight: 400;
`;

const CreateGroup = styled.div`
  color: #0a66c2;
  margin-top: 4px;
  font-size: 12px;
  line-height: 1.33;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    background-color: rgba(0, 0, 0, 0.08);
  }
`;

const ReviewConnections = styled.div`
  color: #0a66c2;
  margin-top: 4px;
  font-size: 12px;
  line-height: 1.33;
  font-weight: 400;
  cursor: pointer;
`;

const CustomModal3 = styled(Modal)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  width: 400px;
  height: 55%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  overflow-y: auto;
`;

const EditInfo = styled.div`
  position: absolute;
  right: 0;
  padding-bottom: 100px;
`;

const CustomModal = styled(Modal)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  width: 400px;
  height: 300px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const CustomModal4 = styled(Modal)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  width: 800px;
  height: 600px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const CustomModal2 = styled(Modal)`
  display: flex;
  align-items: center;
  flex-direction: column;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  width: 50%;
  height: 75%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  overflow-y: auto;
`;

const ContactInfo = styled.div`
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  padding-top: 12px;
  padding-bottom: 12px;
  & > a {
    text-decoration: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 12px;
    &:hover {
      background-color: rgba(0, 0, 0, 0.08);
    }
    div {
      display: flex;
      flex-direction: column;
      text-align: left;
      span {
        font-size: 12px;
        line-height: 1.333;
        &:first-child {
          color: rgba(0, 0, 0, 0.6);
        }
        &:nth-child(2) {
          color: rgba(0, 0, 0, 1);
        }
      }
    }
  }
  svg {
    color: rgba(0, 0, 0, 1);
  }
`;

const Education = styled.div`
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  padding-top: 12px;
  padding-bottom: 12px;
  & > a {
    text-decoration: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 12px;
    &:hover {
      background-color: rgba(0, 0, 0, 0.08);
    }
    div {
      display: flex;
      flex-direction: column;
      text-align: left;
      span {
        font-size: 12px;
        line-height: 1.333;
        &:first-child {
          color: rgba(0, 0, 0, 0.6);
        }
        &:nth-child(2) {
          color: rgba(0, 0, 0, 1);
        }
      }
    }
  }
  svg {
    color: rgba(0, 0, 0, 1);
  }
`;

const Work = styled.div`
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  padding-top: 12px;
  padding-bottom: 12px;
  & > a {
    text-decoration: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 12px;
    &:hover {
      background-color: rgba(0, 0, 0, 0.08);
    }
    div {
      display: flex;
      flex-direction: column;
      text-align: left;
      span {
        font-size: 12px;
        line-height: 1.333;
        &:first-child {
          color: rgba(0, 0, 0, 0.6);
        }
        &:nth-child(2) {
          color: rgba(0, 0, 0, 1);
        }
      }
    }
  }
  svg {
    color: rgba(0, 0, 0, 1);
  }
`;

const Skills = styled.div`
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  padding-top: 12px;
  padding-bottom: 12px;
  & > a {
    text-decoration: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 12px;
    &:hover {
      background-color: rgba(0, 0, 0, 0.08);
    }
    div {
      display: flex;
      flex-direction: column;
      text-align: left;
      span {
        font-size: 12px;
        line-height: 1.333;
        &:first-child {
          color: rgba(0, 0, 0, 0.6);
        }
        &:nth-child(2) {
          color: rgba(0, 0, 0, 1);
        }
      }
    }
  }
  svg {
    color: rgba(0, 0, 0, 1);
  }
`;

const GroupList = styled.div`
  padding-top: 12px;
  padding-bottom: 12px;
  & > a {
    text-decoration: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 12px;
    &:hover {
      background-color: rgba(0, 0, 0, 0.08);
    }
    div {
      display: flex;
      flex-direction: column;
      text-align: left;
      span {
        font-size: 12px;
        line-height: 1.333;
        &:first-child {
          text align: center
          color: black;
        }
        &:nth-child(2) {
          color: rgba(0, 0, 0, 1);
        }
      }
    }
  }
  svg {
    color: rgba(0, 0, 0, 1);
  }
`;
const GroupList2 = styled.div`
  padding-top: 12px;
  padding-bottom: 12px;
  & > a {
    text-decoration: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 12px;
    &:hover {
      background-color: rgba(0, 0, 0, 0.08);
    }
    div {
      display: flex;
      flex-direction: column;
      text-align: left;
      span {
        font-size: 12px;
        line-height: 1.333;
        &:first-child {
          text align: center
          color: black;
        }
        &:nth-child(2) {
          color: rgba(0, 0, 0, 1);
        }
      }
    }
  }
  svg {
    color: rgba(0, 0, 0, 1);
  }
`;

const Languages = styled.div`
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  padding-top: 12px;
  padding-bottom: 12px;
  & > a {
    text-decoration: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 12px;
    &:hover {
      background-color: rgba(0, 0, 0, 0.08);
    }
    div {
      display: flex;
      flex-direction: column;
      text-align: left;
      span {
        font-size: 12px;
        line-height: 1.333;
        &:first-child {
          color: rgba(0, 0, 0, 0.6);
        }
        &:nth-child(2) {
          color: rgba(0, 0, 0, 1);
        }
      }
    }
  }
  svg {
    color: rgba(0, 0, 0, 1);
  }
`;

const Courses = styled.div`
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  padding-top: 12px;
  padding-bottom: 12px;
  & > a {
    text-decoration: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 12px;
    &:hover {
      background-color: rgba(0, 0, 0, 0.08);
    }
    div {
      display: flex;
      flex-direction: column;
      text-align: left;
      span {
        font-size: 12px;
        line-height: 1.333;
        &:first-child {
          color: rgba(0, 0, 0, 0.6);
        }
        &:nth-child(2) {
          color: rgba(0, 0, 0, 1);
        }
      }
    }
  }
  svg {
    color: rgba(0, 0, 0, 1);
  }
`;

const Awards = styled.div`
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  padding-top: 12px;
  padding-bottom: 12px;
  & > a {
    text-decoration: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 12px;
    &:hover {
      background-color: rgba(0, 0, 0, 0.08);
    }
    div {
      display: flex;
      flex-direction: column;
      text-align: left;
      span {
        font-size: 12px;
        line-height: 1.333;
        &:first-child {
          color: rgba(0, 0, 0, 0.6);
        }
        &:nth-child(2) {
          color: rgba(0, 0, 0, 1);
        }
      }
    }
  }
  svg {
    color: rgba(0, 0, 0, 1);
  }
`;

const Volunteerings = styled.div`
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  padding-top: 12px;
  padding-bottom: 12px;
  & > a {
    text-decoration: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 12px;
    &:hover {
      background-color: rgba(0, 0, 0, 0.08);
    }
    div {
      display: flex;
      flex-direction: column;
      text-align: left;
      span {
        font-size: 12px;
        line-height: 1.333;
        &:first-child {
          color: rgba(0, 0, 0, 0.6);
        }
        &:nth-child(2) {
          color: rgba(0, 0, 0, 1);
        }
      }
    }
  }
  svg {
    color: rgba(0, 0, 0, 1);
  }
`;

const Projects = styled.div`
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  padding-top: 12px;
  padding-bottom: 12px;
  & > a {
    text-decoration: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 12px;
    &:hover {
      background-color: rgba(0, 0, 0, 0.08);
    }
    div {
      display: flex;
      flex-direction: column;
      text-align: left;
      span {
        font-size: 12px;
        line-height: 1.333;
        &:first-child {
          color: rgba(0, 0, 0, 0.6);
        }
        &:nth-child(2) {
          color: rgba(0, 0, 0, 1);
        }
      }
    }
  }
  svg {
    color: rgba(0, 0, 0, 1);
  }
`;

const Bio = styled.a`
  font-size: 10px;
`;

const Recommandations = styled.a`
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  padding-top: 12px;
  padding-bottom: 12px;
  & > a {
    text-decoration: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 12px;
    &:hover {
      background-color: rgba(0, 0, 0, 0.08);
    }
    div {
      display: flex;
      flex-direction: column;
      text-align: left;
      span {
        font-size: 12px;
        line-height: 1.333;
        &:first-child {
          color: rgba(0, 0, 0, 0.6);
        }
        &:nth-child(2) {
          color: rgba(0, 0, 0, 1);
        }
      }
    }
  }
  svg {
    color: rgba(0, 0, 0, 1);
  }
`;

const Container = styled.div`
  grid-area: leftside;
`;

const ArtCard = styled.div`
  text-align: center;
  overflow: hidden;
  margin-bottom: 8px;
  background-color: #fff;
  border-radius: 5px;
  transition: box-shadow 83ms;
  position: relative;
  border: none;
  box-shadow: 0 0 0 1px rgb(0 0 0 / 15%), 0 0 0 rgb(0 0 0 / 20%);
`;

const UserInfo = styled.div`
  padding-bottom: 50px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  padding: 12px 12px 16px;
  word-wrap: break-word;
  word-break: break-word;
`;

const CardBackground = styled.div`
  background: url("/images/card-bg.svg");
  background-position: center;
  background-size: 462px;
  height: 54px;
  margin: -12px -12px 0;
`;

const Photo = styled.div`
  box-shadow: none;
  background-image: url("/images/photo.svg");
  width: 72px;
  height: 72px;
  box-sizing: border-box;
  background-clip: content-box;
  background-color: white;
  background-position: center;
  background-size: 60%;
  background-repeat: no-repeat;
  border: 2px solid white;
  margin: -38px auto 12px;
  border-radius: 50%;
`;

const StyledLink = styled.div`
  font-size: 16px;
  line-height: 1.5;
  color: rgba(0, 0, 0, 0.9);
  font-weight: 600;
`;

const AddPhotoText = styled.div`
  color: #0a66c2;
  margin-top: 4px;
  font-size: 12px;
  line-height: 1.33;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    background-color: rgba(0, 0, 0, 0.08);
  }
`;

const ViewDocumentsText = styled.div`
  color: #0a66c2;
  margin-top: 4px;
  font-size: 12px;
  line-height: 1.33;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    background-color: rgba(0, 0, 0, 0.08);
  }
`;

const Widget = styled.div`
  margin-top: 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  padding-top: 12px;
  padding-bottom: 12px;
  & > a {
    text-decoration: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 12px;
    &:hover {
      background-color: rgba(0, 0, 0, 0.08);
    }
    div {
      display: flex;
      flex-direction: column;
      text-align: left;
      span {
        font-size: 12px;
        line-height: 1.333;
        &:first-child {
          color: rgba(0, 0, 0, 0.6);
        }
        &:nth-child(2) {
          color: rgba(0, 0, 0, 1);
        }
      }
    }
  }
  svg {
    color: rgba(0, 0, 0, 1);
  }
`;

const Item = styled.a`
  border-color: rgba(0, 0, 0, 0.8);
  text-align: left;
  padding: 12px;
  font-size: 12px;
  display: block;
  span {
    display: flex;
    align-items: center;
    color: rgba(0, 0, 0, 1);
    svg {
      color: rgba(0, 0, 0, 0.6);
    }
  }
  &:hover {
    background-color: rgba(0, 0, 0, 0.08);
  }
`;

const CommunityCard = styled(ArtCard)`
  padding: 8px 0 0;
  text-align: left;
  display: flex;
  flex-direction: column;
  a {
    color: black;
    padding: 4px 12px 4px 12px;
    font-size: 12px;
    &:hover {
      color: #0a66c2;
    }
    span {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    &:last-child {
      color: rgba(0, 0, 0, 0.6);
      text-decoration: none;
      border-top: 1px solid #d6cec2;
      padding: 12px;
      &:hover {
        background-color: rgba(0, 0, 0, 0.08);
      }
    }
  }
`;

const SetPreferencesText = styled.span`
  color: #0a66c2;
  margin-top: 4px;
  font-size: 12px;
  line-height: 1.33;
  font-weight: 400;
  cursor: pointer;
  display: flex;
  justify-content: center;
  transition: all 0.3s ease;
  &:hover {
    background-color: rgba(0, 0, 0, 0.08);
  }
`;

const CreatePageText = styled.span`
  color: #0a66c2;
  margin-top: 4px;
  font-size: 12px;
  line-height: 1.33;
  font-weight: 400;
  cursor: pointer;
  display: flex;
  justify-content: center;
  transition: all 0.3s ease;
  &:hover {
    background-color: rgba(0, 0, 0, 0.08);
  }
`;

const ChangeLanguageText = styled.span`
  color: #0a66c2;
  margin-top: 4px;
  font-size: 12px;
  line-height: 1.33;
  font-weight: 400;
  cursor: pointer;
  display: flex;
  justify-content: center;
  transition: all 0.3s ease;
  &:hover {
    background-color: rgba(0, 0, 0, 0.08);
  }
`;

const Tooltip = styled.span`
  visibility: hidden;
  width: 180px;
  background-color: #555;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 8px;
  font-size: 10px;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  margin-left: -90px;
  opacity: 0;
  transition: opacity 0.3s;
  white-space: pre-wrap;
  word-wrap: break-word;
  
  &:after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #555 transparent transparent transparent;
  }
`;

const DeleteProfile = styled.a`
  position: relative;
  display: inline-block;
  color: #ef4444;
  margin-top: 4px;
  font-size: 12px;
  line-height: 1.33;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  justify-content: center;
  transition: all 0.3s ease;
  &:hover {
    background-color: rgba(207, 0, 15, 0.5);
    color: black;
  }
  &:hover ${Tooltip} {
    visibility: visible;
    opacity: 1;
  }
`;
const mapStateToProps = (state) => {
  return {
    user: state.userState.user,
    educations: state.userState.educations,
  };
};

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Leftside);
