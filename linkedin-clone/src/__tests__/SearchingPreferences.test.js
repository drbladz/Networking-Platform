import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import SearchingPreferences from '../components/SearchingPreferences';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

describe('SearchingPreferences component', () => {
  let firestore;
  let currentUser;

  beforeAll(async () => {
    // Initialize Firebase app with testing credentials
    const app = initializeApp({
      apiKey: '...',
      authDomain: '...',
      projectId: '...',
      storageBucket: '...',
      messagingSenderId: '...',
      appId: '...',
    });

    // Authenticate with testing credentials
    const auth = getAuth(app);
    const email = 'test@example.com';
    const password = 'password';
    await signInWithEmailAndPassword(auth, email, password);

    // Get Firestore instance with testing credentials
    firestore = getFirestore(app);
    currentUser = auth.currentUser;
  });

  afterAll(async () => {
    // Clean up test data
    const userDocRef = doc(firestore, 'Users', currentUser.uid);
    await setDoc(userDocRef, {
      searchingPreferences: {
        jobType: '',
        industry: '',
        experienceLevel: '',
        remoteWorkOption: '',
      },
    }, { merge: true });

    // Sign out user and delete testing credentials
    await getAuth().signOut();
  });

  test('should allow user to set and clear searching preferences', async () => {
    const { getByTestId, getByLabelText, getByText } = render(
      <SearchingPreferences />
    );

    // Fill out search preferences form and submit
    fireEvent.change(getByLabelText('Job Type'), { target: { value: 'Software Engineer' } });
    fireEvent.change(getByLabelText('Industry'), { target: { value: 'Technology' } });
    fireEvent.change(getByLabelText('Experience Level'), { target: { value: 'Entry Level' } });
    fireEvent.change(getByLabelText('Remote Work Option'), { target: { value: 'Yes' } });

    await act(async () => {
      fireEvent.submit(getByTestId('search-form'));
    });

    // Check that preferences were saved and displayed
    const currentPreferencesText = getByTestId('current-preferences-text');
    expect(currentPreferencesText).toHaveTextContent('Software Engineer');
    expect(currentPreferencesText).toHaveTextContent('Technology');
    expect(currentPreferencesText).toHaveTextContent('Entry Level');
    expect(currentPreferencesText).toHaveTextContent('Yes');

    // Clear preferences
    fireEvent.click(getByText('Clear Preferences'));

    // Check that preferences were cleared and displayed
    expect(currentPreferencesText).toHaveTextContent('No preferences set.');
  });
});
