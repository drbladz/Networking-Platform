import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import SignUpForm from '../components/SignUpForm';

const mockStore = configureStore([]);

describe('SignUpForm', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      userState: {
        user: null,
      },
    });
  });

  it('renders email and password inputs', () => {
    render(
      <Provider store={store}>
        <SignUpForm />
      </Provider>
    );

    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  });

  /*it('dispatches sign up action on form submission', () => {
    const signUpMock = jest.fn();
    const email = 'test@example.com';
    const password = 'password123';

    render(
      <Provider store={store}>
        <SignUpForm SignUp={signUpMock} />
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: email },
    });

    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: password },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    expect(SignUp).toHaveBeenCalledWith(email, password);
  });*/
});