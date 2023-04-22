import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import InviteToGroup from '../components/InviteToGroup';
import styled from "styled-components";
import { useState } from "react";
import { connect } from "react-redux";
import { storage, db, auth } from "../firebase";
import { useParams } from "react-router-dom";
import {
  doc,
  updateDoc,
  setDoc,
  collection,
  addDoc,
  getDoc,
  arrayUnion,
} from "firebase/firestore";

describe('InviteToGroup component', () => {
  const mockStore = configureStore([]);
  const initialState = {
    userState: {
      user: { 
        connections: [
          {
            id: 'connection1',
            name: 'Connection 1',
            photoURL: '',
          },
          {
            id: 'connection2',
            name: 'Connection 2',
            photoURL: '',
          },
        ],
      },
    },
  };
  let store;
  beforeEach(() => {
    store = mockStore(initialState);
  });

  it.only('renders ConnectionsHeader and ConnectionsList', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <InviteToGroup />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByText('Connections')).toBeInTheDocument();
    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  it('invokes handleInvite function on clicking InviteButton', () => {
    const handleInviteMock = jest.fn();
    const connectionId = 'connection1';
    render(
      <Provider store={store}>
        <BrowserRouter>
          <InviteToGroup />
        </BrowserRouter>
      </Provider>
    );
    const inviteButton = screen.getByRole('button', { name: 'Invite' });
    fireEvent.click(inviteButton);
    expect(handleInviteMock).toHaveBeenCalled();
  });
});
