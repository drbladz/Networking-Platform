import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import PostModal from '../components/PostModal';

describe('PostModal component', () => {
  const mockStore = configureStore([]);
  const initialState = {
    userState: {
      user: {
        userId: '1',
        photoURL: 'https://example.com/user.jpg',
        displayName: 'John Doe',
      },
    },
    jobPostingsState: {
      jobPostings: [],
    },
  };
  let store, component;

  beforeEach(() => {
    store = mockStore(initialState);
    component = render(
      <Provider store={store}>
        <PostModal showModal="open" />
      </Provider>
    );
  });

  it('renders the component', () => {
    const { getByText } = component;
    expect(getByText('Create Job Posting')).toBeInTheDocument();
  });

  it('updates the post title when the user types in the input field', () => {
    const { getByPlaceholderText } = component;
    const input = getByPlaceholderText('Title');
    fireEvent.change(input, { target: { value: 'Software Engineer' } });
    expect(input.value).toBe('Software Engineer');
  });

  it('updates the post description when the user types in the textarea', () => {
    const { getByPlaceholderText } = component;
    const textarea = getByPlaceholderText('Job Description');
    fireEvent.change(textarea, { target: { value: 'We are looking for a software engineer to join our team.' } });
    expect(textarea.value).toBe('We are looking for a software engineer to join our team.');
  });

  it('updates the mandatory resume checkbox when clicked', () => {
    const { getByLabelText } = component;
    const checkbox = getByLabelText('Resume');
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
  });

  it('updates the mandatory cover letter checkbox when clicked', () => {
    const { getByLabelText } = component;
    const checkbox = getByLabelText('Cover Letter');
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
  });

  /*it('dispatches a createJobPosting action when the Post button is clicked', () => {
    const { getByText } = component;
    const postButton = getByText('Post');
    fireEvent.click(postButton);
    const actions = store.getActions();
    expect(actions).toEqual([
      {
        type: 'CREATE_JOB_POSTING',
        payload: {
          userId: '1',
          postTitle: '',
          postDescription: '',
          currentPostingsList: [],
          userPhotoURL: 'https://example.com/user.jpg',
          displayName: 'John Doe',
          mandatoryResume: false,
          mandatoryCoverLetter: false,
        },
      },
    ]);
  });*/
});