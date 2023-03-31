import { render, screen } from '@testing-library/react';
import {Provider} from "react-redux"
import store from "../store"
import Login from "../components/Login"
// Begin test case
test('renders the Login component', () => {
    // Render Login component with Provider and store
  render(<Provider store={store}>
    <Login />
  </Provider>);
       // Assert that the text "Welcome to your professional community" appears in the rendered component
  const linkElement = screen.getByText("Welcome to your professional community");
  expect(linkElement).toBeInTheDocument();
});
