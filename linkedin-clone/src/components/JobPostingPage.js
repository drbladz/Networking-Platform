import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import React, { useState, useEffect } from 'react';
import '../JobPostingPageStyles.css';

const JobPostingPage = () => {
  const { id } = useParams();
  
  const [jobPosting, setJobPosting] = useState(null);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState(null);


  const handleApply = async (e) => {
    e.preventDefault();
    // Upload the files to Firebase Storage
    // Then submit the form data to the database


    if (jobPosting.mandatoryResume && !resume) {
        alert('Resume is required!');
        return;
      }
    
      // Check if the mandatoryCoverLetter field is set to true
      if (jobPosting.mandatoryCoverLetter && !coverLetter) {
        alert('Cover letter is required!');
        return;
      }
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
        console.log("JOB DATA " ,docSnap.data())
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
        <h2>{jobPosting.postTitle}</h2>
        <p>{jobPosting.postDescription}</p>
        <form onSubmit={handleApply}>
        <div>
          <label htmlFor="email">Email*</label>
          <input
            type="email"
            id="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className='fullName'>
        <div>
          <label htmlFor="firstName">First Name*</label>
          <input
            type="text"
            id="firstName"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="lastName">Last Name*</label>
          <input
            type="text"
            id="lastName"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        </div>
        <div>
          <label htmlFor="phone">Phone</label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div>
        <label htmlFor="resume">Resume{resumeRequired && '*'}</label>
          <input
            type="file"
            id="resume"
            accept=".pdf,.doc,.docx"
            onChange={handleResumeUpload}
            required={resumeRequired}
          />
        </div>
        <div>
        <label htmlFor="coverLetter">Cover Letter{coverLetterRequired && '*'}</label>
          <input
            type="file"
            id="coverLetter"
            accept=".pdf,.doc,.docx"
            onChange={handleCoverLetterUpload}
            required={coverLetterRequired}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default JobPostingPage;