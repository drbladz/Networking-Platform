// Import necessary libraries and components
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import React, { useState, useEffect } from 'react';
import '../JobPostingPageStyles.css';
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import { storage } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import { getDocs } from 'firebase/firestore';
import {  deleteDoc,query, where } from 'firebase/firestore';
import Header from './Header';

//function to check if the application already exists
const checkIfApplicationExists = async (jobId, userId) => {
  const applicationsRef = collection(db, 'Applications');
  const applicationsQuery = query(applicationsRef, where('jobId', '==', jobId), where('userId', '==', userId));
  const querySnapshot = await getDocs(applicationsQuery);
  return !querySnapshot.empty;
};

// Main JobPostingPage component
const JobPostingPage = () => {

  // Initialize Firebase authentication
  const auth = getAuth();

  // Get job posting ID from the URL
  const { id } = useParams();

  // Define state variables
  const [jobPosting, setJobPosting] = useState(null);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [applied, setApplied] = useState(false);
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState(null);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [storedResumeUrl, setStoredResumeUrl] = useState('');
  const [storedCoverLetterUrl, setStoredCoverLetterUrl] = useState('');
  const [resumeOption, setResumeOption] = useState('upload');
  const [coverLetterOption, setCoverLetterOption] = useState('upload');
  const [resumeInputStatus, setResumeInputStatus] = useState('none');
  const [coverLetterInputStatus, setCoverLetterInputStatus] = useState('none');





  // function to upload a file and get its download URL
  const uploadFile = async (file, path) => {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
  
    return downloadURL;
  };



  // Handle removal of an application
  const handleRemoveApplication = async () => {
    const userId = auth.currentUser.uid;
    const applicationsRef = collection(db, 'Applications');
    const querySnapshot = await getDocs(query(applicationsRef, where('jobId', '==', id), where('userId', '==', userId)));
    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
      setAlreadyApplied(false); 
      alert('Application removed successfully!');
    });
  };

  // Handle the submission of an application
  const handleApply = async (e) => {
    e.preventDefault(); // Prevents the default form submission behavior
    const userId = auth.currentUser.uid;
    // Check if a resume and/or cover letter is required for the job posting
    const resumeRequired = jobPosting?.mandatoryResume;
    const coverLetterRequired = jobPosting?.mandatoryCoverLetter;
    

    // Validate that a resume has been provided if it is required
    if (resumeRequired && resumeInputStatus === 'none' && !storedResumeUrl) {
      alert('Please upload a resume or choose a stored resume.');
      return;
    }
    // Validate that a cover letter has been provided if it is required
    if (coverLetterRequired && coverLetterInputStatus === 'none' && !storedCoverLetterUrl) {
      alert('Please upload a cover letter or choose a stored cover letter.');
      return;
    }

    // Check if the user has already applied for this job posting
    const applicationExists = await checkIfApplicationExists(id, userId);
    if (applicationExists) {
      setApplied(true);
      setAlreadyApplied(true);
      return;
    }
    // Initialize variables for the resume and cover letter URLs and paths
    let resumeUrl = '';
    let coverLetterUrl = '';
    const resumePath = `resumes/${userId}_${resume?.name}`;
    const coverLetterPath = `coverLetters/${userId}_${coverLetter?.name}`;

    // Determine the source of the resume file and upload it if necessary
    if (resumeOption === 'stored' && storedResumeUrl) {
      resumeUrl = storedResumeUrl;
    } else if (resume) {
      resumeUrl = await uploadFile(resume, resumePath);
    } else if (resumeRequired) {
      alert('Please upload a resume or choose a stored resume.');
      return;
    }
    // Determine the source of the cover letter file and upload it if necessary
    if (coverLetterOption === 'stored' && storedCoverLetterUrl) {
      coverLetterUrl = storedCoverLetterUrl;
    } else if (coverLetter) {
      coverLetterUrl = await uploadFile(coverLetter, coverLetterPath);
    } else if (coverLetterRequired) {
      alert('Please upload a cover letter or choose a stored cover letter.');
      return;
    }
    // Create an object with the application data
    const applicationData = {
      jobId: id,
      userId: userId,
      applicantName: `${firstName} ${lastName}`,
      applicantEmail: email,
      applicantPhone: phone,
      resumeUrl: resumeUrl,
      coverLetterUrl: coverLetterUrl
    };

    // Add the application data to the Firebase Firestore database
    const applicationsRef = collection(db, 'Applications');
    await addDoc(applicationsRef, applicationData);

    // Set the application status to "already applied" and display a success message
    setAlreadyApplied(true);
    alert('Application submitted successfully!');

    // Create notification for recruiter
    const currentUserDocumentRef = doc(db, `Users/${userId}`);
    const currentUserDocument = await getDoc(currentUserDocumentRef);

    updateDoc(doc(db,"Users",jobPosting.userId), {notifications: arrayUnion({
      notification: `${currentUserDocument.data().displayName} applied to your job: ${jobPosting.postTitle}`,
      photoURL: currentUserDocument.data().photoURL,
      date: new Date(),
      viewed: false
      })
    });
  };

  // This function handles the selection of a resume file by the user.
  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResume(file);
      setResumeOption('upload');
      setResumeInputStatus('uploaded');
    } else {
      setResume(null);
      setResumeOption('none');
      setResumeInputStatus('none');
    }
  };

  // This function handles the selection of a cover letter file by the user.
  const handleCoverLetterUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverLetter(file);
      setCoverLetterOption('upload');
      setCoverLetterInputStatus('uploaded');
    } else {
      setCoverLetter(null);
      setCoverLetterOption('none');
      setCoverLetterInputStatus('none');
    }
  };

  // This useEffect hook is used to fetch the job posting data from the Firestore database when the component mounts.
  useEffect(() => {
    async function fetchJobPosting() {
      const jobPostingDoc = doc(db, 'JobPostings', id);
      const docSnap = await getDoc(jobPostingDoc);
      if (docSnap.exists()) {
        setJobPosting(docSnap.data());

        const userId = auth.currentUser.uid;
        const applicationExists = await checkIfApplicationExists(id, userId);
        if (applicationExists) {
          setApplied(true);
          setAlreadyApplied(true); // add this line
        }
      }
    }
    fetchJobPosting();
  }, [id]);




  useEffect(() => {

    // Function to fetch job posting data and user data
    const fetchJobPostingAndUserData = async () => {

      // If there is no current user, return
      if (!auth.currentUser) {
        return;
      }
      
      // Get the user ID
      const userId = auth.currentUser.uid;
  
      // Fetch job posting data from database using the ID
      const jobPostingDoc = doc(db, 'JobPostings', id);
      const docSnap = await getDoc(jobPostingDoc);
  
      if (docSnap.exists()) {
        setJobPosting(docSnap.data());
        
        // Check if user has already applied to this job
        const applicationExists = await checkIfApplicationExists(id, userId);
        if (applicationExists) {
          setApplied(true);
          setAlreadyApplied(true);
        }
      }
  
      // Fetch user data
      const userDoc = doc(db, 'Users', userId);
      const userDocSnap = await getDoc(userDoc);
  
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
       
      // Set the stored resume and cover letter URLs
        setStoredResumeUrl(userData.resumeURL || '');
        setStoredCoverLetterUrl(userData.coverLetterURL || '');
        
        // If the user has a stored resume, fetch the URL and set it
        if (userData.resumeRef) {
          getDownloadURL(ref(storage, userData.resumeRef))
            .then(url => {
              setStoredResumeUrl(url);
              
            })
            .catch(error => console.log('Error fetching resume URL:', error)); // Debug log
        }
        
        // If the user has a stored cover letter, fetch the URL and set it
        if (userData.coverLetterRef) {
          getDownloadURL(ref(storage, userData.coverLetterRef))
            .then(url => {
              setStoredCoverLetterUrl(url);
            })
            .catch(error => console.log('Error fetching cover letter URL:', error)); // Debug log
        }
      }
    };
    
    // Subscribe to authentication state changes and fetch data if user is logged in
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchJobPostingAndUserData();
      }
    });
    
     // Unsubscribe when component unmounts
    return () => {
      unsubscribe();
    };
  }, [id]);

  // Check if job posting data is available, if not show a loading message
  if (!jobPosting) {
    return <div>Loading...</div>;
  }

// Check if a resume is required for this job postin
  const resumeRequired = jobPosting?.mandatoryResume;
  // Check if a cover letter is required for this job posting
  const coverLetterRequired = jobPosting?.mandatoryCoverLetter;
// Set the input label for the resume field to include an asterisk if it is required
  const resumeInputLabel = `Resume${resumeRequired ? '*' : ''}`;
  // Set the input label for the cover letter field to include an asterisk if it is required
  const coverLetterInputLabel = `Cover Letter${coverLetterRequired ? '*' : ''}`;
  // Get the experience level required for the job posting
  const experienceLevel = jobPosting.jobParameters?.experienceLevel;
  // Get the industry associated with the job posting
  const industry = jobPosting.jobParameters?.industry;
  // Get the job type associated with the job posting
  const jobType = jobPosting.jobParameters?.jobType;
  // Get the remote work option associated with the job posting
  const remoteWorkOption = jobPosting.jobParameters?.remoteWorkOption;

  return (
    
    <div>
      
      <Header />

  <div style={{ marginTop: '80px' }} className='jobPostingContainer'>
        {/* Display job posting details */}
        <h2 style={{ textAlign: "center" }}>{jobPosting.postTitle}</h2>
        <p>{jobPosting.postDescription}</p>
        {jobPosting.jobParameters && (
        <div className='parametersContainer'>
          <p className='jobParameter'><span>Experience Level:</span> {jobPosting.jobParameters.experienceLevel}</p>
          <p className='jobParameter'><span>Industry:</span> {jobPosting.jobParameters.industry}</p>
          <p className='jobParameter'><span>Job Type:</span> {jobPosting.jobParameters.jobType}</p>
          <p className='jobParameter'><span>Remote Work Option:</span> {jobPosting.jobParameters.remoteWorkOption}</p>
        </div>
      )}
        {/* Display application form */}
        <form onSubmit={(e) => handleApply(e)}>
        {/* Email input */}
        <div className='formControl'>
          <label className='label' htmlFor="email">Email*</label>
          <input
            type="email"
            id="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        {/* Full name input */}
        <div className='fullName'>
        <div className='formControl'>
          <label className='label' htmlFor="firstName">First Name*</label>
          <input
            type="text"
            id="firstName"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className='formControl'>
          <label className='label' htmlFor="lastName">Last Name*</label>
          <input
            type="text"
            id="lastName"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        </div>
        {/* Phone input */}
        <div className='formControl'>
          <label className='label' htmlFor="phone">Phone</label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
{/* Resume input */}
<div className='formControl'>
  <label className='label' htmlFor="resume">Resume{resumeRequired && '*'}</label>
  <div className="radioGroup">
    <label>
      <input
        type="radio"
        name="resumeOption"
        value="upload"
        checked={resumeOption === 'upload'}
        onChange={() => setResumeOption('upload')}
      />
      Upload new file
    </label>
    <label>
      <input
        type="radio"
        name="resumeOption"
        value="stored"
        checked={resumeOption === 'stored'}
        onChange={() => setResumeOption('stored')}
      />
      Use stored file
    </label>
  </div>
  {resumeOption === 'upload' && (
    <input
  type="file"
  id="resume"
  accept=".pdf,.doc,.docx"
  onChange={handleResumeUpload}
/>
  )}
  {resumeOption === 'stored' && storedResumeUrl && (
  <p>Current file: <a href={storedResumeUrl} target="_blank" rel="noopener noreferrer">Resume</a></p>
)}
{resumeOption === 'stored' && !storedResumeUrl && <p>No stored resume available.</p>}
</div>



{/* Cover letter input */}
<div className='formControl'>
  <label className='label' htmlFor="coverLetter">Cover Letter{coverLetterRequired && '*'}</label>
  <div className="radioGroup">
    <label>
      <input
        type="radio"
        name="coverLetterOption"
        value="upload"
        checked={coverLetterOption === 'upload'}
        onChange={() => setCoverLetterOption('upload')}
      />
      Upload new file
    </label>
    <label>
    <input
  type="radio"
  name="coverLetterOption"
  value="stored"
  checked={coverLetterOption === 'stored'}
  onChange={() => setCoverLetterOption('stored')}
/>
Use stored file
    </label>
  </div>
{coverLetterOption === 'upload' && (
  <input
  type="file"
  id="coverLetter"
  accept=".pdf,.doc,.docx"
  onChange={handleCoverLetterUpload}
/>
  )}
{coverLetterOption === 'stored' && storedCoverLetterUrl && (
  <p>Current file: <a href={storedCoverLetterUrl} target="_blank" rel="noopener noreferrer">Cover Letter</a></p>
)}
{coverLetterOption === 'stored' && !storedCoverLetterUrl && <p>No stored cover letter available.</p>}



</div>
        <button 
        // Disable button if application has already been submitted
        type="submit" disabled={alreadyApplied}  className={`submitButton ${alreadyApplied ? "disabledButton" : ""}`}>
          {/* Change button text based on whether application has already been submitted */}
  {alreadyApplied ? "Application Already Submitted" : "Submit Application"}
</button>
{/* Show "Remove Application" button only if application has already been submitted */}
      {alreadyApplied && <button className='deleteButton' onClick={handleRemoveApplication}>Remove Application</button>}
      </form>
    </div>
    </div>


  );
}

export default JobPostingPage;
