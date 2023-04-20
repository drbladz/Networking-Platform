import React, { useState } from 'react';
import { getFirestore, doc, setDoc, addDoc, collection} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import db from '../firebase';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { createPage } from '../actions';
import styled from 'styled-components';

const CreatePageForm = () => {
  const [pageName, setPageName] = useState('');
  const [pageDescription, setPageDescription] = useState('');
  const [pageImage, setPageImage] = useState(null); 
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createPage(pageName, pageDescription, pageImage); 
    setPageName('');
    setPageDescription('');
    setPageImage(null);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <ConfirmationWrapper>
        <h2>Page created successfully!</h2>
        <p>Your new page has been created. Go ahead and share it with others!</p>
        <StyledButton onClick={() => setIsSubmitted(false)}>Create another page</StyledButton>
      </ConfirmationWrapper>
    );
  }


  return (
    <StyledForm onSubmit={handleSubmit}>
      <h1 style={{textAlign: "center"}}>Create A Page</h1>
      <Label>
        Page Name:
        <StyledInput type="text" value={pageName} onChange={(e) => setPageName(e.target.value)} required />
      </Label>
      <Label>
        Page Description:
        <StyledTextarea value={pageDescription} onChange={(e) => setPageDescription(e.target.value)} required></StyledTextarea>
      </Label>
      <Label>
          Image (optional):
          <StyledInput key={isSubmitted} type="file" onChange={(e) => setPageImage(e.target.files[0])} />
        </Label>
      <StyledButton type="submit">Create Page</StyledButton>
    </StyledForm>
  );
};

const ConfirmationWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: center;
  align-items: center;
  margin-top: 60px;
  width: 50%;
  margin-left: auto;
  margin-right: auto;
`;
const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 60px;
  width: 50%;
  margin-left: auto;
  margin-right: auto;
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  font-size: 1.1rem;
`;

const StyledInput = styled.input`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 1rem;
  margin-top: 8px;
`;

const StyledTextarea = styled.textarea`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 1rem;
  resize: vertical;
  margin-top: 8px;
`;

const StyledButton = styled.button`
  background-color: #0d6efd;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 1rem;
  font-weight: 500;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0056b3;
  }
`;

export default CreatePageForm;