import React, { useState } from 'react';
import { getFirestore, doc, setDoc, addDoc, collection} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import db from '../firebase';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { createPage } from '../actions';


const CreatePageForm = () => {
  const [pageName, setPageName] = useState('');
  const [pageDescription, setPageDescription] = useState('');
  const [pageImage, setPageImage] = useState(null); // Change the state name to pageImage

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createPage(pageName, pageDescription, pageImage); // Change the argument to pageImage
    setPageName('');
    setPageDescription('');
    setPageImage(null);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '60px' }}>
      <label>
        Page Name:
        <input type="text" value={pageName} onChange={(e) => setPageName(e.target.value)} required />
      </label>
      <label>
        Page Description:
        <textarea value={pageDescription} onChange={(e) => setPageDescription(e.target.value)} required></textarea>
      </label>
      <label>
        Image (optional):
        <input type="file" onChange={(e) => setPageImage(e.target.files[0])} />
      </label>
      <button type="submit">Create Page</button>
    </form>
  );
};

export default CreatePageForm;