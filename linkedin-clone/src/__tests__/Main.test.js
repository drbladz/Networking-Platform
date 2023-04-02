import { render, screen } from '@testing-library/react';

import Main from '../components/Main';
import {Provider} from "react-redux"
import store from "../store"

describe('Main', () => {
  const mockJobPostings = [
    { id: 1, postTitle: 'Job 1', displayName: 'John Doe', photoURL: '/images/user1.jpg', postDescription: 'Description for job 1' },
    { id: 2, postTitle: 'Job 2', displayName: 'Jane Doe', photoURL: '/images/user2.jpg', postDescription: 'Description for job 2' }
  ];

  beforeEach(() => {
    render(
    <Provider store={store}><Main jobPostings={mockJobPostings} /></Provider>
    
    );
  });

  it('renders the post title and description for each job posting', () => {
    const postTitles = screen.getAllByText(/Job \d/);
    const postDescriptions = screen.getAllByText(/Description for job \d/);

    expect(postTitles.length).toBe(2);
    expect(postDescriptions.length).toBe(2);
  });

  it('renders the "Apply!" button for each job posting', () => {
    const applyButtons = screen.getAllByText('Apply!');

    expect(applyButtons.length).toBe(2);
  });
});