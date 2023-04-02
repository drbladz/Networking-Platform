import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Login from '../components/Login';
import userEvent from '@testing-library/user-event'
import {Router} from 'react-redux';

const mockStore = configureStore([]);

describe('Login', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      userState: {
        user: null,
      },
    });
  });

  it('renders login and sign up buttons', () => {
    render(
      <Provider store={store}>
        <Login />
      </Provider>
    );

    expect(screen.getByRole('button', { value: /login/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { value: /sign up/i })).toBeInTheDocument();
  });

  it('shows the sign up form when "Sign Up" button is clicked', () => {
    render(
      <Provider store={store}>
        <Login />
      </Provider>
    );

    userEvent.click(screen.getByRole('button', { value: /sign up/i }));

    expect(screen.getByRole('heading', { value: /sign up/i })).toBeInTheDocument();
  });

  it('shows the login form when "Login" button is clicked', () => {
    render(
      <Provider store={store}>
        <Login />
      </Provider>
    );

    userEvent.click(screen.getByRole('button', { value: /login/i }));

    expect(screen.getByRole('heading', { value: /login/i })).toBeInTheDocument();
  });

  /*it.only('redirects to home page if user is logged in', () => {
    store = mockStore({
      userState: {
        user: { name: 'test user' },
      },
    });

    render(
      <Router><Provider store={store}>
      <Login />
    </Provider>
    </Router>
      
    );

    expect(screen.getByRole('heading', { value: /welcome to your professional community/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { value: /login/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { value: /sign up/i })).not.toBeInTheDocument();
    expect(screen.getByText(/test user/i)).toBeInTheDocument();
  });*/
});
