import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
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

const checkIfApplicationExists = async (jobId, userId) => {
  const applicationsRef = collection(db, 'Applications');
  const applicationsQuery = query(applicationsRef, where('jobId', '==', jobId), where('userId', '==', userId));
  const querySnapshot = await getDocs(applicationsQuery);
  return !querySnapshot.empty;
};

const JobPostingPage = () => {

  const auth = getAuth();


  const { id } = useParams();

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






  const uploadFile = async (file, path) => {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
  
    return downloadURL;
  };





  const handleRemoveApplication = async () => {
    const userId = auth.currentUser.uid;
    const applicationsRef = collection(db, 'Applications');
    const querySnapshot = await getDocs(query(applicationsRef, where('jobId', '==', id), where('userId', '==', userId)));
    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
      setAlreadyApplied(false); // add this line
      alert('Application removed successfully!');
    });
  };

  const handleApply = async (e) => {
    e.preventDefault();
    const userId = auth.currentUser.uid;
    
    const resumeRequired = jobPosting?.mandatoryResume;
    const coverLetterRequired = jobPosting?.mandatoryCoverLetter;
    
    console.log('Resume option:', resumeOption); // Debug log
    console.log('Stored resume URL:', storedResumeUrl); // Debug log
    
    if (resumeRequired && resumeInputStatus === 'none' && !storedResumeUrl) {
      alert('Please upload a resume or choose a stored resume.');
      return;
    }
    
    if (coverLetterRequired && coverLetterInputStatus === 'none' && !storedCoverLetterUrl) {
      alert('Please upload a cover letter or choose a stored cover letter.');
      return;
    }
    
    const applicationExists = await checkIfApplicationExists(id, userId);
    if (applicationExists) {
      setApplied(true);
      setAlreadyApplied(true);
      return;
    }
    
    let resumeUrl = '';
    let coverLetterUrl = '';
    const resumePath = `resumes/${userId}_${resume?.name}`;
    const coverLetterPath = `coverLetters/${userId}_${coverLetter?.name}`;
    
    if (resumeOption === 'stored' && storedResumeUrl) {
      resumeUrl = storedResumeUrl;
    } else if (resume) {
      resumeUrl = await uploadFile(resume, resumePath);
    } else if (resumeRequired) {
      alert('Please upload a resume or choose a stored resume.');
      return;
    }
    
    if (coverLetterOption === 'stored' && storedCoverLetterUrl) {
      coverLetterUrl = storedCoverLetterUrl;
    } else if (coverLetter) {
      coverLetterUrl = await uploadFile(coverLetter, coverLetterPath);
    } else if (coverLetterRequired) {
      alert('Please upload a cover letter or choose a stored cover letter.');
      return;
    }
    
    const applicationData = {
      jobId: id,
      userId: userId,
      applicantName: `${firstName} ${lastName}`,
      applicantEmail: email,
      applicantPhone: phone,
      resumeUrl: resumeUrl,
      coverLetterUrl: coverLetterUrl
    };
    
    const applicationsRef = collection(db, 'Applications');
    await addDoc(applicationsRef, applicationData);
    
    setAlreadyApplied(true);
    alert('Application submitted successfully!');
  };

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

  useEffect(() => {
    async function fetchJobPosting() {
      const jobPostingDoc = doc(db, 'JobPostings', id);
      // console.log(jobPostingDoc);
      const docSnap = await getDoc(jobPostingDoc);
      // console.log(docSnap.exists());
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
    const fetchJobPostingAndUserData = async () => {
      console.log('Running fetchJobPostingAndUserData'); // Debug log
  
      if (!auth.currentUser) {
        console.log('No auth.currentUser'); // Debug log
        return;
      }
  
      const userId = auth.currentUser.uid;
  
      // Fetch job posting data from database using the ID
      const jobPostingDoc = doc(db, 'JobPostings', id);
      const docSnap = await getDoc(jobPostingDoc);
  
      if (docSnap.exists()) {
        setJobPosting(docSnap.data());
  
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
        console.log('User data:', userData); // Debug log
  
        setStoredResumeUrl(userData.resumeURL || '');
        setStoredCoverLetterUrl(userData.coverLetterURL || '');
  
        if (userData.resumeRef) {
          getDownloadURL(ref(storage, userData.resumeRef))
            .then(url => {
              setStoredResumeUrl(url);
              console.log('Stored resume URL:', storedResumeUrl); // Debug log
            })
            .catch(error => console.log('Error fetching resume URL:', error)); // Debug log
        }
  
        if (userData.coverLetterRef) {
          getDownloadURL(ref(storage, userData.coverLetterRef))
            .then(url => {
              setStoredCoverLetterUrl(url);
            })
            .catch(error => console.log('Error fetching cover letter URL:', error)); // Debug log
        }
      }
    };
  
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchJobPostingAndUserData();
      }
    });
  
    return () => {
      unsubscribe();
    };
  }, [id]);

  if (!jobPosting) {
    return <div>Loading...</div>;
  }


  const resumeRequired = jobPosting?.mandatoryResume;
  const coverLetterRequired = jobPosting?.mandatoryCoverLetter;

  const resumeInputLabel = `Resume${resumeRequired ? '*' : ''}`;
  const coverLetterInputLabel = `Cover Letter${coverLetterRequired ? '*' : ''}`;
  const experienceLevel = jobPosting.jobParameters?.experienceLevel;
  const industry = jobPosting.jobParameters?.industry;
  const jobType = jobPosting.jobParameters?.jobType;
  const remoteWorkOption = jobPosting.jobParameters?.remoteWorkOption;

  return (
    
    <div>
      {console.log('Stored resume URL:', storedResumeUrl)}
      <Header />

  <div style={{ marginTop: '80px' }} className='jobPostingContainer'>
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
        <form onSubmit={(e) => handleApply(e)}>
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
        <div className='formControl'>
          <label className='label' htmlFor="phone">Phone</label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        {/* <div className='formControl'>
        <label className='label' htmlFor="resume">Resume{resumeRequired && '*'}</label>
          <input
            type="file"
            id="resume"
            accept=".pdf,.doc,.docx"
            onChange={handleResumeUpload}
            required={resumeRequired}
          />
        </div> */}
        {/* <div className='formControl'>
        <label className='label' htmlFor="coverLetter">Cover Letter{coverLetterRequired && '*'}</label>
          <input
            type="file"
            id="coverLetter"
            accept=".pdf,.doc,.docx"
            onChange={handleCoverLetterUpload}
            required={coverLetterRequired}
          />
        </div> */}

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











{/* <div className='formControl'>
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



</div> */}






        <button type="submit" disabled={alreadyApplied} className={`submitButton ${alreadyApplied ? "disabledButton" : ""}`}>
  {alreadyApplied ? "Application Already Submitted" : "Submit Application"}
</button>
      {alreadyApplied && <button className='deleteButton' onClick={handleRemoveApplication}>Remove Application</button>}
      </form>
    </div>
    </div>


  );
}

export default JobPostingPage;
