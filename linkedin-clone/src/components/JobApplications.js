import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from '../firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import Header from "./Header";
import '../JobApplications.css';
import {connect } from "react-redux";
import { signOutAPI } from "../actions";

function JobApplications() {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [expandedApplications, setExpandedApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jobTitle, setJobTitle] = useState('');

  useEffect(() => {
    const getJobTitle = async () => {
      try {
        const jobRef = doc(db, 'JobPostings', jobId);
        const jobDoc = await getDoc(jobRef);
        setJobTitle(jobDoc.data().postTitle);
      } catch (error) {
        setError(error);
      }
    };
    getJobTitle();
  }, [jobId]);

  useEffect(() => {
    const getApplications = async () => {
      try {
        const applicationsRef = collection(db, 'Applications');
        const applicationsQuery = query(applicationsRef, where('jobId', '==', jobId));
        const querySnapshot = await getDocs(applicationsQuery);
        const results = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setApplications(results);
        setIsLoading(false);
      } catch (error) {
        setError(error);
      }
    };
    getApplications();
  }, [jobId]);

  const toggleApplicationExpand = (applicationId) => {
    if (expandedApplications.includes(applicationId)) {
      setExpandedApplications(
        expandedApplications.filter((id) => id !== applicationId)
      );
    } else {
      setExpandedApplications([...expandedApplications, applicationId]);
    }
  };

  const handleExpandAll = () => {
    const allApplicationIds = applications.map((application) => application.id);
    setExpandedApplications(allApplicationIds);
  };
  const handleCollapseAll = () => {
    setExpandedApplications([]);
  };
  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    return <h2>Error: {error.message}</h2>;
  }

  return (
    <div className="job-applications">
      <Header />
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

export default JobApplications;