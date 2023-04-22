import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import LoginForm from '../components/LoginForm';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme';
import React from "react";
jest.mock('react-redux', () => ({
  connect: () => (ReactComponent) => ReactComponent,
}));
Enzyme.configure({ adapter: new Adapter() })

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
    render(<LoginForm />);

    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  });

  it('dispatches login action on form submission', () => {
    const loginMock = jest.fn();
    const email = 'test@example.com';
    const password = 'password123';

    render(<LoginForm login={loginMock} />);

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: email },
    });

    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: password },
    });

    fireEvent.click(screen.getByText("Login"));

    expect(loginMock).toHaveBeenCalledWith(email, password);
  });
});
