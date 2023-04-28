import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import { auth, db } from '../firebase';
import Notifications from '../components/Notifications';

import firebase from '../firebase';

jest.mock('firebase');

// Mock the current user to test notifications
const mockAuth = {
  currentUser: {
    uid: '123',
  },
};
jest.mock('firebase/auth', () => ({
  get auth() {
    return mockAuth;
  },
}));

// Mock the collection data for notifications
const mockNotifications = [
  {
    date: {
      seconds: 1645868400,
      nanoseconds: 0,
    },
    notification: 'Test notification 1',
    viewed: false,
  },
  {
    date: {
      seconds: 1645868460,
      nanoseconds: 0,
    },
    notification: 'Test notification 2',
    viewed: false,
  },
];

const mockUseCollectionData = jest.fn(() => [mockNotifications, false, null]);
jest.mock('react-firebase-hooks/firestore', () => ({
  useCollectionData: jest.fn(),
}));

describe('Notifications', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renders the notifications', async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/notifications']}>
          <Route path="/notifications">
            <Notifications user={true} />
          </Route>
        </MemoryRouter>
      );
    });

    expect(mockUseCollectionData).toHaveBeenCalled();

    // Check that the notifications are rendered
    const notification1 = await waitFor(() => screen.getByText('Test notification 1'));
    expect(notification1).toBeInTheDocument();
    const notification2 = await waitFor(() => screen.getByText('Test notification 2'));
    expect(notification2).toBeInTheDocument();
  });

  it('marks a notification as viewed', async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/notifications']}>
          <Route path="/notifications">
            <Notifications user={true} />
          </Route>
        </MemoryRouter>
      );
    });

    expect(mockUseCollectionData).toHaveBeenCalled();

    // Click the "Mark as Viewed" button on the first notification
    const markAsViewedButton = await waitFor(() => screen.getAllByText('Mark as Viewed')[0]);
    fireEvent.click(markAsViewedButton);

    // Check that the notification is marked as viewed
    expect(mockNotifications[0].viewed).toBe(true);
  });

  
});
