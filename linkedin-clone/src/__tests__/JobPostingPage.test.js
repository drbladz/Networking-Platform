import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import JobPostingPage from '../components/JobPostingPage';
import { db } from '../firebase';

jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
}));

jest.mock('../firebase', () => ({
  db: {
    // Provide any mock data needed for the tests
  },
}));

describe('JobPostingPage', () => {
  beforeEach(() => {
    useParams.mockReturnValue({ id: '123' });
    doc.mockReturnValue({
      // Provide any mock data needed for the tests
    });
    getDoc.mockResolvedValue({
      exists: jest.fn(() => true),
      data: jest.fn(() => ({
        // Provide any mock data needed for the tests
      })),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('displays the job posting data', async () => {
    // Set up initial state and render the component
    const { getByText, getByLabelText } = render(<JobPostingPage />);
    
    // Wait for the data to be fetched from the database
    await waitFor(() => expect(getByText('Loading...')).not.toBeInTheDocument());

    // Assert that the correct data is displayed
    expect(getByText('Job title')).toBeInTheDocument();
    expect(getByText('Job description')).toBeInTheDocument();
    expect(getByLabelText('Email*')).toBeInTheDocument();
    expect(getByLabelText('First Name*')).toBeInTheDocument();
    expect(getByLabelText('Last Name*')).toBeInTheDocument();
    // Assert more fields as needed
  });

  it('handles form submission', async () => {
    // Set up initial state and render the component
    const { getByLabelText, getByText } = render(<JobPostingPage />);
    
    // Wait for the data to be fetched from the database
    await waitFor(() => expect(getByText('Loading...')).not.toBeInTheDocument());

    // Fill the form fields
    fireEvent.change(getByLabelText('Email*'), { target: { value: 'test@example.com' } });
    fireEvent.change(getByLabelText('First Name*'), { target: { value: 'John' } });
    fireEvent.change(getByLabelText('Last Name*'), { target: { value: 'Doe' } });
    // Fill more fields as needed

    // Submit the form
    fireEvent.submit(getByText('Submit'));}
  )
    // Assert that the form submission is handled correctly
    //expect(mockUploadFile
  })