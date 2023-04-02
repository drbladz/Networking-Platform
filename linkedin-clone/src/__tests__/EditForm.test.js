import styled from "styled-components";
import { useState } from "react";
import db from "../firebase";
import { updateUserProfile } from "../actions";
import { connect } from "react-redux";

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { getStorage } from "firebase/storage";
import store from "../store"
import { render, screen, fireEvent } from '@testing-library/react';
import EditForm from "../components/EditForm";

describe('EditForm', () => {
  const mockUpdateUserProfile = jest.fn();
  const mockUser = {
    id: 'abc123',
    educations: 'Some education',
    works: 'Some work',
    contactInfo: 'Some contact info',
    connections: 'Some connections',
    bio: 'Some bio',
    volunteerings: 'Some volunteerings',
    skills: 'Some skills',
    recommendations: 'Some recommendations',
    courses: 'Some courses',
    projects: 'Some projects',
    awards: 'Some awards',
    languages: 'Some languages',
  };

  beforeEach(() => {
    render(<EditForm user={mockUser} userId={mockUser.id} updateUserProfile={mockUpdateUserProfile} />);
  });

  it('should update the state when the user types in the input fields', () => {
    const educationInput = screen.getByRole("input",{name: /educations/i});
    fireEvent.change(educationInput, { target: { value: 'New education' } });
    expect(educationInput.value).toBe('New education');
  });


  

 it('should call updateUserProfile function with the updated user data when the form is submitted', () => {
    const saveButton = screen.getByRole('button', { name: /save changes/i });
    fireEvent.click(saveButton);

    expect(mockUpdateUserProfile).toHaveBeenCalledTimes(1);
    expect(mockUpdateUserProfile).toHaveBeenCalledWith(
      mockUser.id,
      {
        educations: '',
        works: '',
        contactInfo: '',
        connections: '',
        bio: '',
        volunteerings: '',
        skills: '',
        recommendations: '',
        courses: '',
        projects: '',
        awards: '',
        languages: '',
      },
      mockUser
    );
  });
});