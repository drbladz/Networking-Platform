import React, { useState } from 'react'
import { connect } from 'react-redux';
import { useLocation, Redirect } from 'react-router-dom';
import styled from 'styled-components';
import { addConnectionById, acceptRequest, declineRequest } from '../actions';
import './UserProfile.css';
import Modal from "react-modal";
import DmModal from './DmModal';
// Define a functional component called UserProfile
const UserProfile = (props) => {
    // Get the user data from the location object provided by react-router-dom
  const location = useLocation();
  const user = location.state;

  //Handle DM modal display if the user is a connection
  const [showDm, setShowDm] = useState(false);

  return (
         // Render the user profile container
    <Container>
      {!props.user && <Redirect to="/" />}
      <div className="profile-container">
        <Card><div className="header">
          {user.photoURL ? <img src={user.photoURL} alt="profilepic" /> : <img src="/images/user.svg" alt="" />}
          <h1>{user.displayName}</h1>
          {user.works.length !== 0 ? <h3>{user.works[0].title}</h3> : <h3>Software Engineer</h3>}
          {user.works.length !== 0 ? <p>{user.works[0].location}</p> : <p>Montreal, QC</p>}

          {props.user && props.user.userId !== user.userId &&
            <div>
              {(props.user.pending && props.user.pending.includes(user.userId)) &&
                <button className="buttonp" disabled>Pending</button>
              }

              {props.user.requests &&
                !props.user.requests.some(r => r.id === user.userId) &&
                props.user.pending && !props.user.pending.includes(user.userId) &&
                props.user.connections &&
                !props.user.connections.some(c => c.id === user.userId) &&
                <button className="buttonc" onClick={() => {
                  props.addConnectionById(user.userId);
                }}>Connect</button>
              }

              {props.user.connections &&
                props.user.connections.some(c => c.id === user.userId) &&
                <button className="message-btn" onClick={() => setShowDm(true)}>Message</button>
              }

              {props.user.requests &&
                props.user.requests.some(r => r.id === user.userId) &&
                <div>
                  <button className="accept" onClick={() => {
                    props.acceptRequest(user.userId);
                  }}>Accept</button>
                  <button className="decline" onClick={() => {
                    props.declineRequest(user.userId);
                  }}>Decline</button>
                </div>
              }
            </div>}
        </div>
        </Card>
        {user.bio &&
          <div className="about">
            <h3>About</h3>
            <p>
              {user.bio}
            </p>
          </div>}
        <div className="experience">
          <h3>Experience</h3>
          {user.works &&
            user.works.map(work => (
              <div className="job" key={work.title}>
                <h5>{work.title}</h5>
                <p>{work.company}</p>
                <p>{work.startDate} - {work.endDate}</p>
                <p>{work.location}</p>
                <ul>
                  {work.description &&
                    work.description.replace(/([.?!])\s*(?=[A-Z])/g, "$1|").split("|").map(info => (
                      <li key={info}>{info}</li>
                    ))}
                </ul>
              </div>
            ))
          }
        </div>
        <div className="education">
          <h3>Education</h3>
          {user.educations &&
            user.educations.map(education => (
              <div className="school" key={education.school}>
                <h5>{education.school}</h5>
                <p>{education.program}</p>
                <p>{education.startDate} - {education.endDate}</p>
              </div>
            ))}
        </div>
        {user.volunteerings &&
          <div className="experience">
            <h3>Volunteering</h3>
            {user.volunteerings.map(volunteering => (
              <div className="job" key={volunteering.title}>
                <h5>{volunteering.title}</h5>
                <p>{volunteering.company}</p>
                <p>{volunteering.startDate} - {volunteering.endDate}</p>
                <ul>
                  {volunteering.description &&
                    volunteering.description.replace(/([.?!])\s*(?=[A-Z])/g, "$1|").split("|").map(info => (
                      <li key={info}>{info}</li>
                    ))}
                </ul>
              </div>
            ))
            }
          </div>}
        {user.skills &&
          <div className="skills">
            <h3>Skills</h3>
            <ul>
              {user.skills.map(skill => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </div>}
        {user.courses &&
          <div className="courses">
            <h3>Courses</h3>
            {user.courses.map(course => (
              <div className="school" key={course.title}>
                <h5>{course.title}</h5>
                <p>{course.school}</p>
              </div>
            ))}
          </div>}
        {user.projects &&
          <div className="experience">
            <h3>Projects</h3>
            {user.projects.map(project => (
              <div className="job" key={project.title}>
                <h5>{project.title}</h5>
                <p>{project.startDate} - {project.endDate}</p>
                <ul>
                  {project.description &&
                    project.description.replace(/([.?!])\s*(?=[A-Z])/g, "$1|").split("|").map(info => (
                      <li key={info}>{info}</li>
                    ))}
                </ul>
              </div>
            ))
            }
          </div>}
        {user.awards &&
          <div className="experience">
            <h3>Awards</h3>
            {user.awards.map(award => (
              <div className="job" key={award.title}>
                <h5>{award.title}</h5>
                <p>{award.issuer}, {award.date}</p>
                <ul>
                  {award.description &&
                    award.description.replace(/([.?!])\s*(?=[A-Z])/g, "$1|").split("|").map(info => (
                      <li key={info}>{info}</li>
                    ))}
                </ul>
              </div>
            ))
            }
          </div>}
        {user.languages &&
          <div className="skills">
            <h3>Languages</h3>
            <ul>
              {user.languages.map(language => (
                <li key={language}>{language}</li>
              ))}
            </ul>
          </div>}
        {user.recommendations &&
          <div className="skills">
            <h3>Recommendations</h3>
            <ul>
              {user.recommendations.map(recommendation => (
                <li key={recommendation}>{recommendation}</li>
              ))}
            </ul>
          </div>}
          <div style={{marginTop: '50px'}}>&nbsp;</div>
      </div>
      {showDm &&
      <Modal className="dm-modal" isOpen={showDm} onRequestClose={() => setShowDm(false)}>
        <DmModal currentUserId={props.user.userId} recipientId={user.userId} />
      </Modal> 
      }
    </Container>
  )
}
// Defines a container component with padding and maximum width.
const Container = styled.div`
  padding-top: 72px;
  max-width: 100%;
`;
// Defines a card component with a background image, rounded corners, and other styling.
const Card = styled.div`
  background-image: url("/images/card-bg.svg");
  background-repeat: no-repeat;
  background-size: 100% 40%;
  border-radius: 10px;
`;
// Maps Redux store state and dispatch to props for the UserProfile component.
const mapStateToProps = (state) => {
  return {
    user: state.userState.user
  }
}
// Maps dispatch functions to props for the UserProfile component.
const mapDispatchToProps = (dispatch) => ({
  addConnectionById: (id) => dispatch(addConnectionById(id)),
  acceptRequest: (id) => dispatch(acceptRequest(id)),
  declineRequest: (id) => dispatch(declineRequest(id))
})
// Connects the UserProfile component to the Redux store with the mapped state and dispatch functions.
export default connect(mapStateToProps, mapDispatchToProps)(UserProfile)
