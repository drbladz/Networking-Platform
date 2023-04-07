/*import React from 'react';
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
*/
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import '../firebase';
import { getFirestore, collection, doc, getDoc, setDoc, updateDoc, deleteField } from 'firebase/firestore';

import SearchingPreferences from '../components/SearchingPreferences';

// Use mock data for authenticated user
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({
    currentUser: {
      uid: 'testUid'
    }
  }))
}));

// Use mock data for Firestore
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(() => ({
    doc: jest.fn(() => ({
      set: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      get: jest.fn(() => ({
        exists: true,
        data: jest.fn(() => ({
          searchingPreferences: {
            jobType: 'full-time',
            industry: 'technology',
            experienceLevel: 'senior',
            remoteWorkOption: 'yes'
          }
        }))
      }))
    }))
  }))
}));

describe('SearchingPreferences', () => {
  test('renders the component with no preferences set', () => {
    render(<SearchingPreferences />);

    const preferencesText = screen.getByText('No preferences set.');
    expect(preferencesText).toBeInTheDocument();
  });

  test('renders the component with existing preferences', async () => {
    render(<SearchingPreferences />);

    await waitFor(() => {
      const jobType = screen.getByText('Job Type:');
      const industry = screen.getByText('Industry / Sector:');
      const experienceLevel = screen.getByText('Experience Level:');
      const remoteWorkOption = screen.getByText('Remote Work Options:');

      expect(jobType).toHaveTextContent('full-time');
      expect(industry).toHaveTextContent('technology');
      expect(experienceLevel).toHaveTextContent('senior');
      expect(remoteWorkOption).toHaveTextContent('yes');
    });
  });

  test('updates preferences and shows success message', async () => {
    render(<SearchingPreferences />);

    // Set up form with new preferences
    const jobTypeInput = screen.getByLabelText('Job Type');
    const industryInput = screen.getByLabelText('Industry / Sector');
    const experienceLevelInput = screen.getByLabelText('Experience Level');
    const remoteWorkOptionInput = screen.getByLabelText('Remote Work Options');

    fireEvent.change(jobTypeInput, { target: { value: 'part-time' } });
    fireEvent.change(industryInput, { target: { value: 'finance' } });
    fireEvent.change(experienceLevelInput, { target: { value: 'entry-level' } });
    fireEvent.change(remoteWorkOptionInput, { target: { value: 'no' } });

    // Submit form and wait for success message
    fireEvent.submit(screen.getByRole('button', { name: 'Save Preferences' }));

    const successMessage = await screen.findByText('Searching preferences updated!');
    expect(successMessage).toBeInTheDocument();

    // Check that new preferences are displayed
    await waitFor(() => {
      const jobType = screen.getByText('Job Type:');
      const industry = screen.getByText('Industry / Sector:');
      const experienceLevel = screen.getByText('Experience Level:');
      const remoteWorkOption = screen.getByText('Remote Work Options:');

      expect(jobType).toHaveTextContent('part-time');
      expect(industry).toHaveTextContent('finance');
      expect(experienceLevel).toHaveTextContent('entry-level');
      expect(remoteWorkOption).toHaveTextContent('no');
    });
  });

})