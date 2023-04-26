import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getAuth } from 'firebase/auth';
import db from '../firebase';
import 'firebase/firestore';
import { collection, doc, getDoc,setDoc, updateDoc, deleteField } from 'firebase/firestore';

const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-top: 20px;
  margin-bottom: 40px;
  @media (max-width: 768px) {
    margin-top: 0;
    margin-bottom: 10px;
  }
`;
const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 600px;
  min-height: 450px;
  margin: 0 auto;
  padding: 30px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
  justify-content: center;
  align-items: center;
  position: relative;

  @media (max-width: 768px) {
    padding: 20px;
    margin-top: 0px; 
  }
`;
const FieldContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Label = styled.label`
  margin-bottom: 5px;
  margin-right: 10px;
  display: inline-block;
  width: 200px;
`;

const Input = styled.input`
  margin-bottom: 15px;
  width: 100%;
  box-sizing: border-box;
  flex: 1;
  margin-right: 10px;
`;
const Select = styled.select`
  margin-bottom: 15px;
  flex: 1;
  margin-right: 10px;
  background-color: #f5f5f5;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  font-size: 16px;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px 0;
  background-color: ${({clearButton}) => clearButton ? 'red' : '#2979ff'};
  color: white;
  border: none;
  border-radius: 5px;
  margin-top: 10px;
  cursor: pointer;
`;

const SuccessMessage = styled.div`
  background-color: green;
  color: white;
  padding: 10px;
  margin-top: 10px;
  border-radius: 5px;
  position: fixed; // Changed from absolute to fixed
  bottom: 30px; // Updated bottom value
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000; // Added z-index to ensure it is on top
`;

const CurrentPreferences = styled.div`
  background-color: #f5f5f5;
  color: #555;
  padding: 10px;
  margin-top: 10px;
  border-radius: 5px;
  display: flex;
  flex-direction: column; 
  justify-content: center;
  align-items: center;
  min-height: 120px; 
`;
const Bold = styled.span`
  font-weight: bold;
  display: block; 
  min-width: 180px;
`;
const CurrentPreferencesText = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: start;
  flex-direction: column;
`;
const FieldWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-right: 10px;
  
`;


const ResponsiveWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;
const SearchingPreferences = () => {
  const [preferences, setPreferences] = useState({
    // location: '',
    jobType: '',
    industry: '',
    experienceLevel: '',
    remoteWorkOption: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [currentPreferencesText, setCurrentPreferencesText] = useState('');
  const [currentPreferences, setCurrentPreferences] = useState(
    <CurrentPreferences>
      No preferences set.
    </CurrentPreferences>
  );
  const handleChange = (event) => {
    setPreferences((prevPreferences) => ({
      ...prevPreferences,
      [event.target.name]: event.target.value,
    }));
  };
  const handleClearPreferences = async () => {
    const currentUser = getAuth().currentUser;
  
    const confirmClear = window.confirm('Are you sure you want to clear your preferences? This action cannot be undone.');
  
    if (!confirmClear) {
      return;
    }
  
    try {
      const userDocRef = doc(db, 'Users', currentUser.uid);
  
      const emptyPreferences = {
        jobType: '',
        industry: '',
        experienceLevel: '',
        remoteWorkOption: '',
      };
  
      await setDoc(userDocRef, {
        searchingPreferences: emptyPreferences,
      }, { merge: true });
  
      setSuccessMessage('Preferences cleared successfully!');
      setPreferences(emptyPreferences);
      console.log('Preferences cleared successfully!');
      setCurrentPreferencesText('No preferences set.');
  
    } catch (error) {
      console.error('Error clearing preferences:', error);
    }
  };
//   const handleLocationSelect = (event) => {
//     setPreferences({
//       ...preferences,
//       location: event.label,
//     });
//   };
// console.log(db)
const handleSubmit = async (event) => {
  event.preventDefault();

  const currentUser = getAuth().currentUser;

  console.log('Current user ID:', currentUser.uid);
  const userDocRef = doc(db, 'Users', currentUser.uid);
  console.log('userDocRef:', userDocRef);
  try {
    await setDoc(userDocRef, {
      searchingPreferences: preferences,
    }, { merge: true });
    setSuccessMessage('Searching preferences updated!');
    console.log('Search preferences updated successfully!');

    setCurrentPreferencesText(
      <>
        <FieldWrapper>
          <Bold>Job Type:</Bold> {preferences.jobType || 'Not set'}
        </FieldWrapper>
        <FieldWrapper>
          <Bold>Industry / Sector:</Bold> {preferences.industry || 'Not set'}
        </FieldWrapper>
        <FieldWrapper>
          <Bold>Experience Level:</Bold> {preferences.experienceLevel || 'Not set'}
        </FieldWrapper>
        <FieldWrapper>
          <Bold>Remote Work Options:</Bold> {preferences.remoteWorkOption || 'Not set'}
        </FieldWrapper>
      </>
    );

  } catch (error) {
    console.error('Error updating search preferences:', error);
  }
};

useEffect(() => {
  const unsubscribe = getAuth().onAuthStateChanged(user => {
    if (user) {
      const userDocRef = doc(db, 'Users', user.uid);

      getDoc(userDocRef)
        .then((docSnapshot) => {
          if (docSnapshot.exists()) {
            const userDocData = docSnapshot.data();
            const preferencesFromDB = userDocData.searchingPreferences || {};
            setPreferences(preferencesFromDB);

            setCurrentPreferencesText(
              <>
                <FieldWrapper>
                  <Bold>Job Type:</Bold> {preferencesFromDB.jobType || 'Not set'}
                </FieldWrapper>
                <FieldWrapper>
                  <Bold>Industry / Sector:</Bold> {preferencesFromDB.industry || 'Not set'}
                </FieldWrapper>
                <FieldWrapper>
                  <Bold>Experience Level:</Bold> {preferencesFromDB.experienceLevel || 'Not set'}
                </FieldWrapper>
                <FieldWrapper>
                  <Bold>Remote Work Options:</Bold> {preferencesFromDB.remoteWorkOption || 'Not set'}
                </FieldWrapper>
              </>
            );
          } else {
            console.log('No such document!');
          }
        })
        .catch((error) => {
          console.error('Error getting document:', error); // add error handling here
        });
    } else {
      console.log("NO USER");
    }
  });

  return () => {
    unsubscribe();
  };
}, []);




return (
  <div style={{ marginTop: '80px' }}>
    <Title>Searching Preferences</Title>
    <FormContainer>
    <ResponsiveWrapper>
    <form onSubmit={handleSubmit}>
  <FieldContainer>
    <Label htmlFor="jobType">Job Type</Label>
    <Select name="jobType" id="jobType" value={preferences.jobType} onChange={handleChange}>
      <option value="">Select a job type</option>
      <option value="full-time">Full-Time</option>
      <option value="part-time">Part-Time</option>
      <option value="contract">Contract</option>
    </Select>
  </FieldContainer>

  <FieldContainer>
    <Label htmlFor="industry">Industry / Sector</Label>
    <Select name="industry" id="industry" value={preferences.industry} onChange={handleChange}>
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
<option value="software development">Software Development</option>
<option value="sports">Sports</option>
<option value="telecom">Telecom</option>
<option value="telecommunications">Telecommunications</option>
<option value="transportation">Transportation</option>
<option value="travel">Travel</option>
<option value="other">Other</option>
    </Select>
  </FieldContainer>

  <FieldContainer>
    <Label htmlFor="experienceLevel">Experience Level</Label>
    <Select name="experienceLevel" id="experienceLevel" value={preferences.experienceLevel} onChange={handleChange}>
      <option value="">Select an experience level</option>
      <option value="entry-level">Entry-Level</option>
      <option value="intermediate">Intermediate</option>
      <option value="senior-level">Senior-Level</option>
    </Select>
  </FieldContainer>

  <FieldContainer>
    <Label htmlFor="remoteWork">Remote Work Options</Label>
    <Select name="remoteWorkOption" id="remoteWork" value={preferences.remoteWork} onChange={handleChange}>
      <option value="">Select a remote work option</option>
      <option value="remote">Remote Work</option>
      <option value="in-person">In-Person Work</option>
      <option value="both">Open to Both</option>
    </Select>
  </FieldContainer>

        <Button type="submit">Set Preferences</Button>
        <Button type="button" onClick={handleClearPreferences} clearButton>Clear Preferences</Button>

        <CurrentPreferences>
          <CurrentPreferencesText>
            {currentPreferencesText}
          </CurrentPreferencesText>
        </CurrentPreferences>
{successMessage && (
  <SuccessMessage>
    {successMessage}
  </SuccessMessage>
)}
      </form>
    </ResponsiveWrapper>
    </FormContainer>
  </div>
);





};

export default SearchingPreferences;