import styled from "styled-components";
import { useState } from "react";
import { updateUserProfile } from "../actions";
import { connect } from "react-redux";
import './EditForm.css';

const EditForm = (props) => {
// use useState hook to initialize states and their respective setter functions
  const [contactInfo, setContactInfo] = useState(props.userInfo.contactInfo);
  const [bio, setBio] = useState(props.userInfo.bio);
  const [works, setWorkExperience] = useState(props.userInfo.works);
  const [education, setEducation] = useState(props.userInfo.educations);
  const [volunteering, setVolunteering] = useState(props.userInfo.volunteerings);
  const [skills, setSkills] = useState(props.userInfo.skills);
  const [courses, setCourses] = useState(props.userInfo.courses);
  const [projects, setProjects] = useState(props.userInfo.projects);
  const [awards, setAwards] = useState(props.userInfo.awards);
  const [languages, setLanguages] = useState(props.userInfo.languages);
  const [recommendations, setRecommendations] = useState(props.userInfo.recommendations);
// create a function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // create an object to hold updated user data
    const updateUserData = {
      educations: education,
      works: works,
      contactInfo: contactInfo,
      bio: bio,
      volunteerings: volunteering,
      skills: skills,
      recommendations: recommendations,
      courses: courses,
      projects: projects,
      awards: awards,
      languages: languages,
    };
    // call the updateUserProfile action creator to update user profile with new data
    props.updateUserProfile(props.userId, updateUserData, props.user);
    console.log("updated");
    // display an alert to indicate successful update
    alert("Updated Successfully!");
  };
// create functions to handle adding and removing work experiences, and changing the values
  const handleAddWorkExperience = () => {
    setWorkExperience([...works, { title: '', company: '', startDate: '', endDate: '', location: '', description: '' }]);
  }
  // This function removes a work experience from the works array based on its index

  const handleRemoveWorkExperience = (index) => {
    const updatedWorkExperience = [...works];
    updatedWorkExperience.splice(index, 1);
    setWorkExperience(updatedWorkExperience);
  }
  // This function updates the value of a specific property in a work experience object inside the works array

  const handleWorkExperienceChange = (event, index) => {
    const { name, value } = event.target;
    const updatedWorkExperience = [...works];
    updatedWorkExperience[index][name] = value;
    setWorkExperience(updatedWorkExperience);
  }
  // create functions to handle adding and removing education, and changing the values

  const handleAddEducation = () => {
    setEducation([...education, { school: '', program: '', startDate: '', endDate: '' }]);
  }
  // This function removes an education item from the education array based on its index

  const handleRemoveEducation = (index) => {
    const updatedEducation = [...education];
    updatedEducation.splice(index, 1);
    setEducation(updatedEducation);
  }
  // This function updates the education array with the new values entered in the education form fields

  const handleEducationChange = (event, index) => {
    const { name, value } = event.target;
    const updatedEducation = [...education];
    updatedEducation[index][name] = value;
    setEducation(updatedEducation);
  }
  // create functions to handle adding and removing volunteering experiences, and changing the values

  const handleAddVolunteering = () => {
    setVolunteering([...volunteering, { title: '', company: '', startDate: '', endDate: '', description: '' }]);
  }
  // Define a function called handleRemoveVolunteering that takes an index as an argument

  const handleRemoveVolunteering = (index) => {
        // Create a copy of the volunteering array using the spread operator, and store it in updatedVolunteering
    const updatedVolunteering = [...volunteering];
        // Remove one element from updatedVolunteering starting at the index provided as an argument
    updatedVolunteering.splice(index, 1);
        // Update the state of the volunteering array with the modified copy
    setVolunteering(updatedVolunteering);
  }
  // This function updates a volunteering experience based on the user's input
  const handleVolunteeringChange = (event, index) => {
    const { name, value } = event.target;
    const updatedVolunteering = [...volunteering];
    updatedVolunteering[index][name] = value;
    setVolunteering(updatedVolunteering);
  }
  // This function adds an empty skill to the skills array
  const handleAddSkill = () => {
    setSkills([...skills, '']);
  }
  // This function removes a skill from the skills array based on its index
  const handleRemoveSkill = (index) => {
    const updatedSkills = [...skills];
    updatedSkills.splice(index, 1);
    setSkills(updatedSkills);
  }
  // This function updates a skill based on the user's input
  const handleSkillChange = (event, index) => {
    const updatedSkills = [...skills];
    updatedSkills[index] = event.target.value;
    setSkills(updatedSkills);
  }
  // This function adds an empty course to the courses array
  const handleAddCourse = () => {
    setCourses([...courses, { title: '', school: '' }]);
  }
  // This function removes a course from the courses array based on its index
  const handleRemoveCourse = (index) => {
    const updatedCourses = [...courses];
    updatedCourses.splice(index, 1);
    setCourses(updatedCourses);
  }
  // This function updates a course based on the user's input
  const handleCourseChange = (event, index) => {
    const { name, value } = event.target;
    const updatedCourses = [...courses];
    updatedCourses[index][name] = value;
    setCourses(updatedCourses);
  }
  // This function adds an empty project to the projects array
  const handleAddProject = () => {
    setProjects([...projects, { title: '', startDate: '', endDate: '', description: '' }]);
  }
  // This function removes a project from the projects array based on its index
  const handleRemoveProject = (index) => {
    const updatedProjects = [...projects];
    updatedProjects.splice(index, 1);
    setProjects(updatedProjects);
  }
  // This function updates a project based on the user's input
  const handleProjectChange = (event, index) => {
    const { name, value } = event.target;
    const updatedProjects = [...projects];
    updatedProjects[index][name] = value;
    setProjects(updatedProjects);
  }
  // This function adds an empty award to the awards array
  const handleAddAward = () => {
    setAwards([...awards, { title: '', issuer: '', date: '', description: '' }]);
  }
  // This function removes an award from the awards array based on its index
  const handleRemoveAward = (index) => {
    const updatedAwards = [...awards];
    updatedAwards.splice(index, 1);
    setAwards(updatedAwards);
  }
  // This function updates an award based on the user's input
  const handleAwardChange = (event, index) => {
    const { name, value } = event.target;
    const updatedAwards = [...awards];
    updatedAwards[index][name] = value;
    setAwards(updatedAwards);
  }
  // This function adds an empty language to the languages array
  const handleAddLanguage = () => {
    setLanguages([...languages, '']);
  }
  // This function removes a language from the languages array based on its index
  const handleRemoveLanguage = (index) => {
    const updatedLanguages = [...languages];
    updatedLanguages.splice(index, 1);
    setLanguages(updatedLanguages);
  }
  // This function updates the value of a specific language in the languages array based on its index
  const handleLanguageChange = (event, index) => {
    const updatedLanguages = [...languages];
    updatedLanguages[index] = event.target.value;
    setLanguages(updatedLanguages);
  }
  // This function adds an empty string to the end of the recommendations array
  const handleAddRecommendation = () => {
    setRecommendations([...recommendations, '']);
  }
  // This function removes a recommendation from the recommendations array based on its index
  const handleRemoveRecommendation = (index) => {
    const updatedRecommendations = [...recommendations];
    updatedRecommendations.splice(index, 1);
    setRecommendations(updatedRecommendations);
  }
  // This function updates the value of a specific recommendation in the recommendations array based on its index
  const handleRecommendationChange = (event, index) => {
    const updatedRecommendations = [...recommendations];
    updatedRecommendations[index] = event.target.value;
    setRecommendations(updatedRecommendations);
  }

  return (
    <form className="form">
      <h2>About</h2>
      <div>
        <label>
          Contact Info:
          <input
            type="text"
            id="contactInfo"
            name="contactInfo"
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
          />
        </label>
        <br />
        <label>
          Bio:
          <textarea
            id="bio"
            name="bio"
            value={bio}
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
// This function maps the state variables to the props of the component
const mapStateToProps = (state) => {
  return {
    user: state.userState.user,
  };
};
// This function maps the dispatch actions to the props of the component
const mapDispatchToProps = (dispatch) => ({
  updateUserProfile: (userId, updatedUserData, currentUserData) =>
    dispatch(updateUserProfile(userId, updatedUserData, currentUserData)),
});
// This function connects the EditForm component to the Redux store and passes the mapped props
export default connect(mapStateToProps, mapDispatchToProps)(EditForm);


