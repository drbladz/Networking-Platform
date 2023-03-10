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
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState(null);
  const [applied, setApplied] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const uploadFile = async (file, path) => {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
  
    return downloadURL;
  };
  // const handleApply = async (e) => {
  //   const userId = auth.currentUser.uid;
  //   e.preventDefault();
  
  //   if (jobPosting.mandatoryResume && !resume) {
  //     alert('Resume is required!');
  //     return;
  //   }
  
  //   if (jobPosting.mandatoryCoverLetter && !coverLetter) {
  //     alert('Cover letter is required!');
  //     return;
  //   }
  
  //   const resumeRequired = jobPosting.mandatoryResume;
  //   const coverLetterRequired = jobPosting.mandatoryCoverLetter;
  
  //   let resumeUrl = '';
  //   let coverLetterUrl = '';
  //   const resumePath = `resumes/${userId}_${resume.name}`;
  // const coverLetterPath = `coverLetters/${userId}_${coverLetter.name}`;
  //   if (resume) {
  //     resumeUrl = await uploadFile(resume, resume.name);
  //   }
  
  //   if (coverLetter) {
  //     coverLetterUrl = await uploadFile(coverLetter, coverLetter.name);
  //   }

  //   const applicationData = {
  //     jobId: id,
  //     userId: userId,
  //     applicantName: `${firstName} ${lastName}`,
  //     applicantEmail: email,
  //     applicantPhone: phone,
  //     resumeUrl,
  //     coverLetterUrl
  //   };
  
  //   const applicationsRef = collection(db, 'Applications');
  //   await addDoc(applicationsRef, applicationData);
  
  //   alert('Application submitted successfully!');
  // };

  // const handleApply = async (e) => {
  //   const userId = auth.currentUser.uid;
  //   e.preventDefault();


  // const applicationExists = await checkIfApplicationExists(id, userId);
  // if (applicationExists) {
  //   setApplied(true);
  //   return;
  // }
  
  //   if (jobPosting.mandatoryResume && !resume) {
  //     alert('Resume is required!');
  //     return;
  //   }
  
  //   if (jobPosting.mandatoryCoverLetter && !coverLetter) {
  //     alert('Cover letter is required!');
  //     return;
  //   }
  
  //   const resumeRequired = jobPosting.mandatoryResume;
  //   const coverLetterRequired = jobPosting.mandatoryCoverLetter;
  
  //   let resumeUrl = '';
  //   let coverLetterUrl = '';
  //   const resumePath = `resumes/${userId}_${resume?.name}`;
  //   const coverLetterPath = `coverLetters/${userId}_${coverLetter?.name}`;
  //   if (resume) {
  //     resumeUrl = await uploadFile(resume, resumePath);
  //   }
  
  //   if (coverLetter) {
  //     coverLetterUrl = await uploadFile(coverLetter, coverLetterPath);
  //   }
  
  //   const applicationData = {
  //     jobId: id,
  //     userId: userId,
  //     applicantName: `${firstName} ${lastName}`,
  //     applicantEmail: email,
  //     applicantPhone: phone,
  //     resumeUrl,
  //     coverLetterUrl
  //   };
  
  //   const applicationsRef = collection(db, 'Applications');
  //   await addDoc(applicationsRef, applicationData);
  
  //   alert('Application submitted successfully!');
  // };




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
    const userId = auth.currentUser.uid;
    e.preventDefault();
  
    const applicationExists = await checkIfApplicationExists(id, userId);
    if (applicationExists) {
      setApplied(true);
      setAlreadyApplied(true); // add this line
      return;
    }
    
    if (jobPosting.mandatoryResume && !resume) {
      alert('Resume is required!');
      return;
    }
    
    if (jobPosting.mandatoryCoverLetter && !coverLetter) {
      alert('Cover letter is required!');
      return;
    }
    
    const resumeRequired = jobPosting.mandatoryResume;
    const coverLetterRequired = jobPosting.mandatoryCoverLetter;
    
    let resumeUrl = '';
    let coverLetterUrl = '';
    const resumePath = `resumes/${userId}_${resume?.name}`;
    const coverLetterPath = `coverLetters/${userId}_${coverLetter?.name}`;
    if (resume) {
      resumeUrl = await uploadFile(resume, resumePath);
    }
    
    if (coverLetter) {
      coverLetterUrl = await uploadFile(coverLetter, coverLetterPath);
    }
    
    const applicationData = {
      jobId: id,
      userId: userId,
      applicantName: `${firstName} ${lastName}`,
      applicantEmail: email,
      applicantPhone: phone,
      resumeUrl,
      coverLetterUrl
    };
    
    const applicationsRef = collection(db, 'Applications');
    await addDoc(applicationsRef, applicationData);
  
    setAlreadyApplied(true); // add this line
    alert('Application submitted successfully!');
  };


  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    setResume(file);
  };

  const handleCoverLetterUpload = (e) => {
    const file = e.target.files[0];
    setCoverLetter(file);
  };

  useEffect(() => {
    async function fetchJobPosting() {
      const jobPostingDoc = doc(db, 'JobPostings', id);
      console.log(jobPostingDoc);
      const docSnap = await getDoc(jobPostingDoc);
      console.log(docSnap.exists());
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

  if (!jobPosting) {
    return <div>Loading...</div>;
  }
  // Fetch job posting data from database using the ID

  const resumeRequired = jobPosting.mandatoryResume;
  const coverLetterRequired = jobPosting.mandatoryCoverLetter;

  const resumeInputLabel = `Resume${resumeRequired ? '*' : ''}`;
  const coverLetterInputLabel = `Cover Letter${coverLetterRequired ? '*' : ''}`;


  return (
    
    <div>
      <Header />

  <div style={{ marginTop: '80px' }} className='jobPostingContainer'>
        <h2 style={{ textAlign: "center" }}>{jobPosting.postTitle}</h2>
        <p>{jobPosting.postDescription}</p>
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
        <div className='formControl'>
        <label className='label' htmlFor="resume">Resume{resumeRequired && '*'}</label>
          <input
            type="file"
            id="resume"
            accept=".pdf,.doc,.docx"
            onChange={handleResumeUpload}
            required={resumeRequired}
          />
        </div>
        <div className='formControl'>
        <label className='label' htmlFor="coverLetter">Cover Letter{coverLetterRequired && '*'}</label>
          <input
            type="file"
            id="coverLetter"
            accept=".pdf,.doc,.docx"
            onChange={handleCoverLetterUpload}
            required={coverLetterRequired}
          />
        </div>
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