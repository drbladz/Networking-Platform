/*import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import JobApplications from '../components/JobApplications';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const mockApplications = [
  {
    id: '1',
    applicantName: 'John Smith',
    applicantEmail: 'john@example.com',
    applicantPhone: '555-555-5555',
    resumeUrl: 'https://example.com/resume',
    coverLetterUrl: 'https://example.com/cover-letter',
    jobId: 'job1',
  },
  {
    id: '2',
    applicantName: 'Jane Doe',
    applicantEmail: 'jane@example.com',
    applicantPhone: '555-555-5555',
    resumeUrl: 'https://example.com/resume',
    coverLetterUrl: null,
    jobId: 'job1',
  },
];

describe('JobApplications', () => {
  let db;
  let store;

  beforeAll(() => {
    const firebaseConfig = {
      //Add firebase configuration
    };
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  });

  beforeEach(async () => {
    store = mockStore({});

    await addDoc(collection(db, 'JobPostings'), {
      postTitle: 'Test Job Title',
    });

    await Promise.all(mockApplications.map((application) =>
      addDoc(collection(db, 'Applications'), application)
    ));
  });

  afterEach(() => {
    store.clearActions();
  });

  it('renders loading message when data is being fetched', async () => {
    render(
      <MemoryRouter initialEntries={['/jobs/job1']}>
        <Provider store={store}>
          <Route path="/jobs/:jobId">
            <JobApplications />
          </Route>
        </Provider>
      </MemoryRouter>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText(/job applications for/i)).toBeInTheDocument());
  });

  it('renders error message when data fetching fails', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});

    const error = new Error('test error');
    jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.reject(error)
    );

    render(
      <MemoryRouter initialEntries={['/jobs/job1']}>
        <Provider store={store}>
          <Route path="/jobs/:jobId">
            <JobApplications />
          </Route>
        </Provider>
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText(/error/i)).toBeInTheDocument());

    expect(screen.getByText(/test error/i)).toBeInTheDocument();
  });

  it('renders job applications when data fetching succeeds', async () => {
    render(
      <MemoryRouter initialEntries={['/jobs/job1']}>
        <Provider store={store}>
          <Route path="/jobs/:jobId">
            <JobApplications />
          </Route>
        </Provider>
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText(/job applications for/i)).toBeInTheDocument());

    expect(screen.getByText(/John Smith/i)).toBeInTheDocument();
    expect(screen.getByText(/Jane Doe/i)).toBeInTheDocument();
  });
});
*/
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { Provider } from 'react-redux';
import store from '../store';
import JobApplications from '../components/JobApplications';
import { firebaseConfig } from '../firebase';



jest.mock('react-redux', () => ({
  connect: () => (ReactComponent) => ReactComponent,
}));

// jest.mock('firebase/firestore', () => ({
//   doc: jest.fn(() => Promise.resolve()),
//   getDoc: jest.fn(() => Promise.resolve()),
// }));

// jest.mock('../firebase', () => ({
//   db: {
//     // Provide any mock data needed for the tests
//   },
// }));

// Initialize Firebase app and connect to Firestore emulator
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
connectFirestoreEmulator(db, 'localhost', 8080);

describe('JobApplications', () => {
  it('renders the loading message while data is being loaded', async () => {
    // Render component with job ID param
    render(
      <MemoryRouter initialEntries={['/jobs/abc123/applications']}>
        <Route path="/jobs/:jobId/applications">
          <JobApplications />
        </Route>
      </MemoryRouter>
    );
    // Assert that loading message is displayed
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    // Wait for data to load and verify that loading message is removed
    await waitFor(() => expect(screen.queryByText('Loading...')).toBeNull());
  });

  // NOTE: Firebase test
  // it('renders an error message if there was an error fetching the data', async () => {
  //   // Mock error in Firestore query
  //   const getDocsMock = jest.fn().mockRejectedValue(new Error('Firestore error'));
  //   jest.spyOn(JobApplications.prototype, 'getApplications').mockImplementationOnce(() => getDocsMock());
  //   // Render component with job ID param
  //   render(
  //     <Provider store={store}>
  //       <MemoryRouter initialEntries={['/jobs/abc123/applications']}>
  //         <Route path="/jobs/:jobId/applications">
  //           <JobApplications />
  //         </Route>
  //       </MemoryRouter>
  //     </Provider>
  //   );
  //   // Wait for error message to be displayed
  //   await waitFor(() => expect(screen.getByText('Error: Firestore error')).toBeInTheDocument());
  // });

})
