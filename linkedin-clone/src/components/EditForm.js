import styled from "styled-components";
import { useState } from "react";
import db from "../firebase";
import { updateUserProfile } from "../actions";
import { connect } from "react-redux";

const EditForm = (props) => {
  //Rajouter les autres useState
  //Comment merge sans override sur firebase
  //tester comment le overribe fonctionne
  const [educations, setEducations] = useState("");
  const [works, setWorks] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [connections, setConnections] = useState("");
  const [bio, setBio] = useState("");
  const [volunteerings, setVolunteerings] = useState("");
  const [skills, setSkills] = useState("");
  const [recommandations, setRecommandations] = useState("");
  const [courses, setCourses] = useState("");
  const [projects, setProjects] = useState("");
  const [awards, setAwards] = useState("");
  const [languages, setLanguages] = useState("");

  const handleSubmit = () => {
    console.log("im here");
    const updateUserData = {
      educations: educations,
      works: works,
      contactInfo: contactInfo,
      connections: connections,
      bio: bio,
      volunteerings: volunteerings,
      skills: skills,
      recommendations: recommandations,
      courses: courses,
      projects: projects,
      awards: awards,
      languages: languages,
    };
    console.log("here2");
    console.log("dddd", contactInfo);
    props.updateUserProfile(props.userId, updateUserData, props.user);
  };

  console.log(props.user);
  return (
    <Edit>
      <label>
        Education:
        <input
          type="text"
          id="educations"
          name="educations"
          onChange={(e) => setEducations(e.target.value)}
        />
      </label>
      <br />
      <label>
        Work:
        <input
          type="text"
          id="works"
          name="works"
          onChange={(e) => setWorks(e.target.value)}
        />
      </label>
      <br />
      <label>
        Contact Info:
        <input
          type="text"
          id="contactInfo"
          name="contactInfo"
          onChange={(e) => setContactInfo(e.target.value)}
        />
      </label>
      <br />
      <label>
        Connections:
        <input
          type="text"
          id="connections"
          name="connections"
          onChange={(e) => setConnections(e.target.value)}
        />
      </label>
      <br />
      <label>
        Bio:
        <textarea
          id="bio"
          name="bio"
          onChange={(e) => setBio(e.target.value)}
        />
      </label>
      <br />
      <label>
        Volunteering:
        <textarea
          id="volunteerings"
          name="volunteerings"
          onChange={(e) => setVolunteerings(e.target.value)}
        />
      </label>
      <br />
      <label>
        Skills:
        <input
          type="text"
          id="skills"
          name="skills"
          onChange={(e) => setSkills(e.target.value)}
        />
      </label>
      <br />
      <label>
        Recommendations:
        <textarea
          id="recommandations"
          name="recommendations"
          onChange={(e) => setRecommandations(e.target.value)}
        />
      </label>
      <br />
      <label>
        Courses:
        <input
          type="text"
          id="courses"
          name="courses"
          onChange={(e) => setCourses(e.target.value)}
        />
      </label>
      <br />
      <label>
        Projects:
        <textarea
          id="projects"
          name="projects"
          onChange={(e) => setProjects(e.target.value)}
        />
      </label>
      <br />
      <label>
        Awards:
        <input
          type="text"
          id="awards"
          name="awards"
          onChange={(e) => setAwards(e.target.value)}
        />
      </label>
      <br />
      <label>
        Languages:
        <input
          type="text"
          id="languages"
          name="languages"
          onChange={(e) => setLanguages(e.target.value)}
        />
      </label>
      <br />
      <button type="submit" onClick={handleSubmit}>Save Changes</button>
    </Edit>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.userState.user,
  };
};

const mapDispatchToProps = (dispatch) => ({
  updateUserProfile: (userId, updatedUserData, currentUserData) =>
    dispatch(updateUserProfile(userId, updatedUserData, currentUserData)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditForm);

const Edit = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const Input = styled.input`
  width: 100%;
  height: 40px;
  padding: 10px;
  margin-bottom: 20px;
  font-size: 16px;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 120px;
  padding: 10px;
  margin-bottom: 20px;
  font-size: 16px;
`;

const Label = styled.label`
  font-size: 20px;
  margin-bottom: 10px;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0062cc;
  }
`;
