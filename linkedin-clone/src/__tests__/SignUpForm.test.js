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
    expect(screen.getByPlaceholderText("Full Name")).toBeInTheDocument();
    expect(screen.getByText("Sign Up")).toBeInTheDocument();
  });

  it("updates state on input change", () => {
    const { getByPlaceholderText } = render(
      <Provider store={store}>
        <SignUpForm />
      </Provider>
    );
    const emailInput = getByPlaceholderText("Email");
    const fullNameInput = getByPlaceholderText("Full Name");
    const passwordInput = getByPlaceholderText("Password");
    fireEvent.change(emailInput, { target: { value: "test@test.com" } });
    fireEvent.change(fullNameInput, { target: { value: "John Smith" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    expect(emailInput.value).toBe("test@test.com");
    expect(fullNameInput.value).toBe("John Smith");
    expect(passwordInput.value).toBe("password123");
  });

  it("submits form on button click", () => {
    const mockSignUp = jest.fn();
    const { getByPlaceholderText, getByText } = render(
      <Provider store={store}>
        <SignUpForm SignUp={mockSignUp} />
      </Provider>
    );
    const emailInput = getByPlaceholderText("Email");
    const fullNameInput = getByPlaceholderText("Full Name");
    const passwordInput = getByPlaceholderText("Password");
    const signUpButton = getByText("Sign Up");
    fireEvent.change(emailInput, { target: { value: "test@test.com" } });
    fireEvent.change(fullNameInput, { target: { value: "John Smith" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(signUpButton);
    expect(mockSignUp).toHaveBeenCalledWith(
      "test@test.com",
      "password123",
      "John Smith"
    );
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