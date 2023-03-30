import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import LoginForm from '../components/LoginForm';

const mockStore = configureStore([]);

describe('LoginForm', () => {
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
        <LoginForm />
      </Provider>
    );

    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  });

  /*it('dispatches login action on form submission', () => {
    const loginMock = jest.fn();
    const email = 'test@example.com';
    const password = 'password123';

    render(
      <Provider store={store}>
        <LoginForm login={loginMock} />
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: email },
    });

    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: password },
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(loginMock).toHaveBeenCalledWith(email, password);
  });*/
});