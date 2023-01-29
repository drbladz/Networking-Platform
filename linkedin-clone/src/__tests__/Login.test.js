import { render, screen } from '@testing-library/react';
import {Provider} from "react-redux"
import store from "../store"
import Login from "../components/Login"

test('renders learn react link', () => {
  render(<Provider store={store}>
    <Login />
  </Provider>);
  const linkElement = screen.getByText("Welcome to your professional community");
  expect(linkElement).toBeInTheDocument();
});
