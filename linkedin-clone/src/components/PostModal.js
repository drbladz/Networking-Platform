import styled from "styled-components";
import { useState } from "react";
import { createJobPosting } from "../actions";
import { connect } from "react-redux";
import db from "../firebase";
import { updateDoc, doc, arrayUnion } from "firebase/firestore";

const PostModal = (props) => {
  console.log(props.jobPostings);
  const [postTitle, setPostTitle] = useState("");
  const [postDescription, setPostDescription] = useState("");
  const [mandatoryResume, setMandatoryResume] = useState(false);
  const [mandatoryCoverLetter, setMandatoryCoverLetter] = useState(false);
  const [isExternal, setIsExternal] = useState(false);
  const [jobType, setJobType] = useState("");
  const [industry, setIndustry] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [remoteWorkOption, setRemoteWorkOption] = useState("");

  const reset = (e) => {
    setPostDescription("");
    setPostTitle("");
    setMandatoryResume(false);
    setMandatoryCoverLetter(false);
    setIsExternal(false);
    setJobType("");
    setIndustry("");
    setExperienceLevel("");
    setRemoteWorkOption("");
    props.handleClick(e);
  };

  return (
    <>
      {props.showModal === "open" && (
        <Container>
          <Content>
            <Header>
              <h2>Create Job Posting</h2>
              <button onClick={(e) => reset(e)}>
                <img src="/images/close-icon.svg" />
              </button>
            </Header>
            <SharedContent>
              <UserInfo>
                {props.user && props.user.photoURL ? (
                  <img src={props.user.photoURL} />
                ) : (
                  <img src="/images/user.svg" />
                )}
                {props.user && props.user.displayName ? (
                  <span className="notranslate">{props.user.displayName}</span>
                ) : (
                  <span>User</span>
                )}
              </UserInfo>
              <Editor>
                <input
                  type="text"
                  placeholder="Title"
                  onChange={(e) => setPostTitle(e.target.value)}
                />
                <textarea
                  value={postDescription}
                  placeholder="Job Description or External link"
                  onChange={(e) => setPostDescription(e.target.value)}
                />
              </Editor>
              <div>
                <h3>Required Documents (If Applicable)</h3>
                <label>
                  <input
                    type="checkbox"
                    checked={mandatoryResume}
                    onChange={() => setMandatoryResume(!mandatoryResume)}
                  />
                  Resume
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={mandatoryCoverLetter}
                    onChange={() =>
                      setMandatoryCoverLetter(!mandatoryCoverLetter)
                    }
                  />
                  Cover Letter
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={isExternal}
                    onChange={() => setIsExternal(!isExternal)}
                  />
                  Is External
                </label>
              </div>
              <div>
                <h3>Job Type</h3>
                <select
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                >
                  <option value="">Select Job Type</option>
                  <option value="full-time">Full-Time</option>
                  <option value="part-time">Part-Time</option>
                  <option value="contract">Contract</option>
                </select>
              </div>
              <div>
                <h3>Industry / Sector</h3>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                >
                  <option value="">Select an industry</option>
                  <option value="accounting">Accounting</option>
                  <option value="advertising">Advertising</option>
                  <option value="aerospace">Aerospace</option>
                  <option value="agriculture">Agriculture</option>
                  <option value="architecture">Architecture</option>
                  <option value="art">Art</option>
                  <option value="automotive">Automotive</option>
                  <option value="banking">Banking</option>
                  <option value="beauty">Beauty</option>
                  <option value="biotech">Biotech</option>
                  <option value="childcare">Childcare</option>
                  <option value="construction">Construction</option>
                  <option value="consulting">Consulting</option>
                  <option value="customer service">Customer Service</option>
                  <option value="defense">Defense</option>
                  <option value="e-commerce">E-commerce</option>
                  <option value="education">Education</option>
                  <option value="energy">Energy</option>
                  <option value="engineering">Engineering</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="environmental">Environmental</option>
                  <option value="fashion">Fashion</option>
                  <option value="finance">Finance</option>
                  <option value="fitness">Fitness</option>
                  <option value="food and beverage">Food and Beverage</option>
                  <option value="gaming">Gaming</option>
                  <option value="government">Government</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="hospitality">Hospitality</option>
                  <option value="human resources">Human Resources</option>
                  <option value="humanitarian">Humanitarian</option>
                  <option value="insurance">Insurance</option>
                  <option value="interior design">Interior Design</option>
                  <option value="internet">Internet</option>
                  <option value="IT">IT</option>
                  <option value="legal">Legal</option>
                  <option value="logistics">Logistics</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="marketing">Marketing</option>
                  <option value="media">Media</option>
                  <option value="music">Music</option>
                  <option value="nonprofit">Nonprofit</option>
                  <option value="outsourcing">Outsourcing</option>
                  <option value="pharmaceuticals">Pharmaceuticals</option>
                  <option value="photography">Photography</option>
                  <option value="public relations">Public Relations</option>
                  <option value="publishing">Publishing</option>
                  <option value="real estate">Real Estate</option>
                  <option value="recruitment">Recruitment</option>
                  <option value="retail">Retail</option>
                  <option value="sales">Sales</option>
                  <option value="science">Science</option>
                  <option value="security">Security</option>
                  <option value="social media">Social Media</option>
                  <option value="software development">
                    Software Development
                  </option>
                  <option value="sports">Sports</option>
                  <option value="telecom">Telecom</option>
                  <option value="telecommunications">Telecommunications</option>
                  <option value="transportation">Transportation</option>
                  <option value="travel">Travel</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <h3>Experience Level</h3>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                >
                  <option value="">Select Experience Level</option>
                  <option value="entry-level">Entry-Level</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="senior-level">Senior-Level</option>
                </select>
              </div>
              <div>
                <h3>Remote Work Options</h3>
                <select
                  value={remoteWorkOption}
                  onChange={(e) => setRemoteWorkOption(e.target.value)}
                >
                  <option value="">Select Remote Work Option</option>
                  <option value="remote">Remote Work</option>
                  <option value="in-person">In-Person Work</option>
                  <option value="both">Open to Both</option>
                </select>
              </div>
            </SharedContent>
            <SharedCreation>
              <PostButton
                onClick={(e) => {
                  props.createJobPosting(
                    props.user.userId,
                    postTitle,
                    postDescription,
                    props.jobPostings,
                    props.user.photoURL,
                    props.user.displayName,
                    mandatoryResume,
                    mandatoryCoverLetter,
                    isExternal,
                    {
                      jobType,
                      industry,
                      experienceLevel,
                      remoteWorkOption,
                    }
                  );
                  reset(e);
                }}
              >
                Post
              </PostButton>
            </SharedCreation>
          </Content>
        </Container>
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.userState.user,
    jobPostings: state.jobPostingsState.jobPostings,
  };
};

const mapDispatchToProps = (dispatch) => ({
  createJobPosting: (
    userId,
    postTitle,
    postDescription,
    currentPostingsList,
    userPhotoURL,
    displayName,
    mandatoryResume,
    mandatoryCoverLetter,
    isExternal,
    jobParameters
  ) =>
    dispatch(
      createJobPosting(
        userId,
        postTitle,
        postDescription,
        currentPostingsList,
        userPhotoURL,
        displayName,
        mandatoryResume,
        mandatoryCoverLetter,
        isExternal,
        jobParameters
      )
    ),
});

export default connect(mapStateToProps, mapDispatchToProps)(PostModal);

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  color: black;
  background-color: rgba(0, 0, 0, 0.8);
`;

const Content = styled.div`
  width: 100%;
  max-width: 552px;
  background-color: white;
  max-height: 90%;
  overflow: initial;
  border-radius: 5px;
  position: relative;
  display: flex;
  flex-direction: column;
  top: 32px;
  margin: 0 auto;
`;
const Header = styled.div`
  display: block;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  font-size: 16px;
  line-height: 1.5;
  color: rgba(0, 0, 0, 0.6);
  font-weight: 400;
  display: flex;
  justify-content: space-between;
  align-items: center;
  button {
    height: 40px;
    width: 40px;
    min-width: auto;
    color: rgba(0, 0, 0, 0.15);
    svg,
    img {
      pointer-events: none;
    }
  }
`;

const SharedContent = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow-y: auto;
  vertical-align: baseline;
  background: transparent;
  padding: 8px 12px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 24px;
  svg,
  img {
    width: 48px;
    height: 48px;
    background-clip: content-box;
    border: 2px solid transparent;
    border-radius: 50%;
  }
  span {
    font-weight: 600;
    font-size: 16px;
    line-height: 1.5;
    margin-left: 5px;
  }
`;

const SharedCreation = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 24px 12px 16px;
`;

const PostButton = styled.div`
  min-width: 60px;
  border-radius: 20px;
  padding-left: 16px;
  padding-right: 16px;
  background: #0a66c2;
  color: white;
  &:hover {
    background: #004182;
  }
`;

const Editor = styled.div`
  display: flex;
  align-items: column;
`;
