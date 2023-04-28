import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from '../firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import Header from "./Header";
import '../JobApplications.css';
import {connect } from "react-redux";
import { signOutAPI } from "../actions";

// Functional Component for displaying job applications
function JobApplications() {
     // Use the useParams() hook from react-router-dom to retrieve the job ID from the URL
  const { jobId } = useParams();
   // Initialize the state variables for the list of applications, the list of expanded applications,
  // the loading status, the error status, and the job title
  const [applications, setApplications] = useState([]);
  const [expandedApplications, setExpandedApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jobTitle, setJobTitle] = useState('');
// Get the job title from Firestore
  useEffect(() => {
    const getJobTitle = async () => {
      try {
         // Create a reference to the job posting document in Firestore
        const jobRef = doc(db, 'JobPostings', jobId);
        // Get the job posting document from Firestore
        const jobDoc = await getDoc(jobRef);
        // Set the job title state variable to the title of the job posting
        setJobTitle(jobDoc.data().postTitle);
      } catch (error) {
        setError(error);
      }
    };
    getJobTitle();
  }, [jobId]);
  
  // Get the job applications from Firestore
  useEffect(() => {
        // Create a reference to the 'Applications' collection in Firestore
    const getApplications = async () => {
      try {
        const applicationsRef = collection(db, 'Applications');
           // Create a query to get the applications for the current job
        const applicationsQuery = query(applicationsRef, where('jobId', '==', jobId));
            // Get the query snapshot from Firestore
        const querySnapshot = await getDocs(applicationsQuery);
            // Map the query snapshot documents to an array of application objects
        const results = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
           // Set the applications state variable to the array of application objects
        setApplications(results);  
         // Set the isLoading state variable to false to indicate that the data has been loaded
        setIsLoading(false);
      } catch (error) {
        setError(error);
      }
    };
    getApplications();
  }, [jobId]);
 // Function to expand or collapse an application's details
  const toggleApplicationExpand = (applicationId) => {
    if (expandedApplications.includes(applicationId)) {
      // If the application is already expanded, remove it from the expandedApplications array
      setExpandedApplications(
        expandedApplications.filter((id) => id !== applicationId)
      );
    } else {
        // If the application is not expanded, add it to the expandedApplications array
      setExpandedApplications([...expandedApplications, applicationId]);
    }
  };
 // Function to expand all applications' details
  const handleExpandAll = () => {
    const allApplicationIds = applications.map((application) => application.id);
    setExpandedApplications(allApplicationIds);
  };
  // Function to collapse all applications' details
  const handleCollapseAll = () => {
    setExpandedApplications([]);
  };
   // Display a loading message while the data is being loaded
  if (isLoading) {
    return <h2>Loading...</h2>;
  }
// Display an error message if there was an error fetching the data
  if (error) {
    return <h2>Error: {error.message}</h2>;
  }

  return (
    <div className="job-applications">
      <div>
        <h1>Job Applications for {jobTitle}</h1>
        <button onClick={handleExpandAll}>Expand All</button>
        <button onClick={handleCollapseAll}>Collapse All</button>
        {applications.map((application) => {
          const isExpanded = expandedApplications.includes(application.id);
          return (
            <div className="application">
            <div className="application-header">
              <h2>{application.applicantName}</h2>
              <button onClick={() => toggleApplicationExpand(application.id)}>
                {isExpanded ? "Hide Details" : "Show Details"}
              </button>
            </div>
            {isExpanded && (
              <div className="application-details">
                <div className="contact-details">
                  <div className="detail">
                    <label>Email:</label>
                    <p>{application.applicantEmail}</p>
                  </div>
                  <div className="detail">
                    <label>Phone:</label>
                    <p style={{margin: "0"}}>{application.applicantPhone}</p>
                  </div>
                </div>
                {application.resumeUrl && (
                  <div className="file-details">
                    <div className="detail">
                      <label>Resume:</label>
                      <a href={application.resumeUrl} download>
                        Download Resume
                      </a>
                    </div>
                  </div>
                )}
                {application.coverLetterUrl && (
                  <div className="file-details">
                    <div className="detail">
                      <label>Cover Letter:</label>
                      <a href={application.coverLetterUrl} download>
                        Download Cover Letter
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          );
        })}
      </div>
    </div>
  );
}
// Connect to Redux store and export component
export default JobApplications;
