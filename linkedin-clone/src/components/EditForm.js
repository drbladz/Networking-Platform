import styled from "styled-components";
import { useState } from "react";
import { updateUserProfile } from "../actions";
import { connect } from "react-redux";
import './EditForm.css';

const EditForm = (props) => {

  const [contactInfo, setContactInfo] = useState("");
  const [bio, setBio] = useState("");
  const [connections, setConnections] = useState([]);
  const [works, setWorkExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [volunteering, setVolunteering] = useState([]);
  const [skills, setSkills] = useState([]);
  const [courses, setCourses] = useState([]);
  const [projects, setProjects] = useState([]);
  const [awards, setAwards] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updateUserData = {
      educations: education,
      works: works,
      contactInfo: contactInfo,
      connections: connections,
      bio: bio,
      volunteerings: volunteering,
      skills: skills,
      recommendations: recommendations,
      courses: courses,
      projects: projects,
      awards: awards,
      languages: languages,
    };
    props.updateUserProfile(props.userId, updateUserData, props.user);
    console.log("updated");
  };

  const handleAddWorkExperience = () => {
    setWorkExperience([...works, { title: '', company: '', startDate: '', endDate: '', location: '', description: '' }]);
  }

  const handleRemoveWorkExperience = (index) => {
    const updatedWorkExperience = [...works];
    updatedWorkExperience.splice(index, 1);
    setWorkExperience(updatedWorkExperience);
  }

  const handleWorkExperienceChange = (event, index) => {
    const { name, value } = event.target;
    const updatedWorkExperience = [...works];
    updatedWorkExperience[index][name] = value;
    setWorkExperience(updatedWorkExperience);
  }

  const handleAddEducation = () => {
    setEducation([...education, { school: '', program: '', startDate: '', endDate: '' }]);
  }

  const handleRemoveEducation = (index) => {
    const updatedEducation = [...education];
    updatedEducation.splice(index, 1);
    setEducation(updatedEducation);
  }

  const handleEducationChange = (event, index) => {
    const { name, value } = event.target;
    const updatedEducation = [...education];
    updatedEducation[index][name] = value;
    setEducation(updatedEducation);
  }

  const handleAddVolunteering = () => {
    setVolunteering([...volunteering, { title: '', company: '', startDate: '', endDate: '', description: '' }]);
  }

  const handleRemoveVolunteering = (index) => {
    const updatedVolunteering = [...volunteering];
    updatedVolunteering.splice(index, 1);
    setVolunteering(updatedVolunteering);
  }

  const handleVolunteeringChange = (event, index) => {
    const { name, value } = event.target;
    const updatedVolunteering = [...volunteering];
    updatedVolunteering[index][name] = value;
    setVolunteering(updatedVolunteering);
  }

  const handleAddSkill = () => {
    setSkills([...skills, '']);
  }

  const handleRemoveSkill = (index) => {
    const updatedSkills = [...skills];
    updatedSkills.splice(index, 1);
    setSkills(updatedSkills);
  }

  const handleSkillChange = (event, index) => {
    const updatedSkills = [...skills];
    updatedSkills[index] = event.target.value;
    setSkills(updatedSkills);
  }

  const handleAddCourse = () => {
    setCourses([...courses, { title: '', school: '' }]);
  }

  const handleRemoveCourse = (index) => {
    const updatedCourses = [...courses];
    updatedCourses.splice(index, 1);
    setCourses(updatedCourses);
  }

  const handleCourseChange = (event, index) => {
    const { name, value } = event.target;
    const updatedCourses = [...courses];
    updatedCourses[index][name] = value;
    setCourses(updatedCourses);
  }

  const handleAddProject = () => {
    setProjects([...projects, { title: '', startDate: '', endDate: '', description: '' }]);
  }

  const handleRemoveProject = (index) => {
    const updatedProjects = [...projects];
    updatedProjects.splice(index, 1);
    setProjects(updatedProjects);
  }

  const handleProjectChange = (event, index) => {
    const { name, value } = event.target;
    const updatedProjects = [...projects];
    updatedProjects[index][name] = value;
    setProjects(updatedProjects);
  }

  const handleAddAward = () => {
    setAwards([...awards, { title: '', issuer: '', date: '', description: '' }]);
  }

  const handleRemoveAward = (index) => {
    const updatedAwards = [...awards];
    updatedAwards.splice(index, 1);
    setAwards(updatedAwards);
  }

  const handleAwardChange = (event, index) => {
    const { name, value } = event.target;
    const updatedAwards = [...awards];
    updatedAwards[index][name] = value;
    setAwards(updatedAwards);
  }

  const handleAddLanguage = () => {
    setLanguages([...languages, '']);
  }

  const handleRemoveLanguage = (index) => {
    const updatedLanguages = [...languages];
    updatedLanguages.splice(index, 1);
    setLanguages(updatedLanguages);
  }

  const handleLanguageChange = (event, index) => {
    const updatedLanguages = [...languages];
    updatedLanguages[index] = event.target.value;
    setLanguages(updatedLanguages);
  }

  const handleAddRecommendation = () => {
    setRecommendations([...recommendations, '']);
  }

  const handleRemoveRecommendation = (index) => {
    const updatedRecommendations = [...recommendations];
    updatedRecommendations.splice(index, 1);
    setRecommendations(updatedRecommendations);
  }

  const handleRecommendationChange = (event, index) => {
    const updatedRecommendations = [...recommendations];
    updatedRecommendations[index] = event.target.value;
    setRecommendations(updatedRecommendations);
  }

  return (
    <form>
      <h2>About</h2>
      <div>
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
          Bio:
          <textarea
            id="bio"
            name="bio"
            onChange={(e) => setBio(e.target.value)}
          />
        </label>

        <br />
      </div>

      <h2>Work Experience</h2>
      {works.map((work, index) => (
        <div key={index}>
          <label>Title:</label>
          <input type="text" name="title" value={work.title} onChange={(event) => handleWorkExperienceChange(event, index)} />
          <br />
          <label>Company:</label>
          <input type="text" name="company" value={work.company} onChange={(event) => handleWorkExperienceChange(event, index)} />
          <br />
          <label>Start Date:</label>
          <input type="text" name="startDate" value={work.startDate} onChange={(event) => handleWorkExperienceChange(event, index)} />
          <br />
          <label>End Date:</label>
          <input type="text" name="endDate" value={work.endDate} onChange={(event) => handleWorkExperienceChange(event, index)} />
          <br />
          <label>Location:</label>
          <input type="text" name="location" value={work.location} onChange={(event) => handleWorkExperienceChange(event, index)} />
          <br />
          <label>Description:</label>
          <textarea name="description" value={work.description} onChange={(event) => handleWorkExperienceChange(event, index)} />
          <br />
          <button type="button" className="remove-button" onClick={() => handleRemoveWorkExperience(index)}>Remove Work Experience</button>
        </div>
      ))}
      <button type="button" className="add-button" onClick={handleAddWorkExperience}>Add Work Experience</button>

      <h2>Education</h2>
      {education.map((school, index) => (
        <div key={index}>
          <label>School Name:</label>
          <input type="text" name="school" value={school.school} onChange={(event) => handleEducationChange(event, index)} />
          <br />
          <label>Program:</label>
          <input type="text" name="program" value={school.program} onChange={(event) => handleEducationChange(event, index)} />
          <br />
          <label>Start Date:</label>
          <input type="text" name="startDate" value={school.startDate} onChange={(event) => handleEducationChange(event, index)} />
          <br />
          <label>End Date:</label>
          <input type="text" name="endDate" value={school.endDate} onChange={(event) => handleEducationChange(event, index)} />
          <br />
          <button type="button" className="remove-button" onClick={() => handleRemoveEducation(index)}>Remove Education</button>
        </div>
      ))}
      <button type="button" className="add-button" onClick={handleAddEducation}>Add Education</button>

      <h2>Volunteering</h2>
      {volunteering.map((volunteer, index) => (
        <div key={index}>
          <label>Title:</label>
          <input type="text" name="title" value={volunteer.title} onChange={(event) => handleVolunteeringChange(event, index)} />
          <br />
          <label>Company:</label>
          <input type="text" name="company" value={volunteer.company} onChange={(event) => handleVolunteeringChange(event, index)} />
          <br />
          <label>Start Date:</label>
          <input type="text" name="startDate" value={volunteer.startDate} onChange={(event) => handleVolunteeringChange(event, index)} />
          <br />
          <label>End Date:</label>
          <input type="text" name="endDate" value={volunteer.endDate} onChange={(event) => handleVolunteeringChange(event, index)} />
          <br />
          <label>Description:</label>
          <textarea name="description" value={volunteer.description} onChange={(event) => handleVolunteeringChange(event, index)} />
          <br />
          <button type="button" className="remove-button" onClick={() => handleRemoveVolunteering(index)}>Remove Volunteering Experience</button>
        </div>
      ))}
      <button type="button" className="add-button" onClick={handleAddVolunteering}>Add Volunteering Experience</button>

      <h2>Skills</h2>
      {skills.map((skill, index) => (
        <div key={index}>
          <input type="text" name="skill" value={skill} onChange={(event) => handleSkillChange(event, index)} />
          <button type="button" className="remove-button" onClick={() => handleRemoveSkill(index)}>Remove Skill</button>
        </div>
      ))}
      <button type="button" className="add-button" onClick={handleAddSkill}>Add Skill</button>

      <h2>Courses</h2>
      {courses.map((course, index) => (
        <div key={index}>
          <label>Title:</label>
          <input type="text" name="title" value={course.title} onChange={(event) => handleCourseChange(event, index)} />
          <br />
          <label>School:</label>
          <input type="text" name="school" value={course.school} onChange={(event) => handleCourseChange(event, index)} />
          <br />
          <button type="button" className="remove-button" onClick={() => handleRemoveCourse(index)}>Remove Course</button>
        </div>
      ))}
      <button type="button" className="add-button" onClick={handleAddCourse}>Add Course</button>

      <h2>Projects</h2>
      {projects.map((project, index) => (
        <div key={index}>
          <label>Title:</label>
          <input type="text" name="title" value={project.title} onChange={(event) => handleProjectChange(event, index)} />
          <br />
          <label>Start Date:</label>
          <input type="text" name="startDate" value={project.startDate} onChange={(event) => handleProjectChange(event, index)} />
          <br />
          <label>End Date:</label>
          <input type="text" name="endDate" value={project.endDate} onChange={(event) => handleProjectChange(event, index)} />
          <br />
          <label>Description:</label>
          <textarea name="description" value={project.description} onChange={(event) => handleProjectChange(event, index)} />
          <br />
          <button type="button" className="remove-button" onClick={() => handleRemoveProject(index)}>Remove Project</button>
        </div>
      ))}
      <button type="button" className="add-button" onClick={handleAddProject}>Add Project</button>

      <h2>Awards</h2>
      {awards.map((award, index) => (
        <div key={index}>
          <label>Title:</label>
          <input type="text" name="title" value={award.title} onChange={(event) => handleAwardChange(event, index)} />
          <br />
          <label>Issuer:</label>
          <input type="text" name="issuer" value={award.issuer} onChange={(event) => handleAwardChange(event, index)} />
          <br />
          <label>Date:</label>
          <input type="text" name="date" value={award.date} onChange={(event) => handleAwardChange(event, index)} />
          <br />
          <label>Description:</label>
          <textarea name="description" value={award.description} onChange={(event) => handleAwardChange(event, index)} />
          <br />
          <button type="button" className="remove-button" onClick={() => handleRemoveAward(index)}>Remove Award</button>
        </div>
      ))}
      <button type="button" className="add-button" onClick={handleAddAward}>Add Award</button>

      <h2>Languages</h2>
      {languages.map((language, index) => (
        <div key={index}>
          <input type="text" name="language" value={language} onChange={(event) => handleLanguageChange(event, index)} />
          <button type="button" className="remove-button" onClick={() => handleRemoveLanguage(index)}>Remove Language</button>
        </div>
      ))}
      <button type="button" className="add-button" onClick={handleAddLanguage}>Add Language</button>

      <h2>Recommendations</h2>
      {recommendations.map((recommendation, index) => (
        <div key={index}>
          <label>Recommendation:</label>
          <input type="text" name="recommendation" value={recommendation} onChange={(event) => handleRecommendationChange(event, index)} />
          <button type="button" className="remove-button" onClick={() => handleRemoveRecommendation(index)}>Remove Recommendation</button>
        </div>
      ))}
      <button type="button" className="add-button" onClick={handleAddRecommendation}>Add Recommendation</button>
      <br />
      <Button type="submit" onClick={handleSubmit}>Save Changes</Button>
    </form>
  );
};

const Button = styled.button`
  padding: 10px 20px;
  margin: 30px;
  font-size: 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s ease;

  &:hover {
    background-color: #0062cc;
  }
`;

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


