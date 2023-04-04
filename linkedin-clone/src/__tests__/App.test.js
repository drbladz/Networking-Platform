import { render, screen } from '@testing-library/react';
import App from '../App';
import {Provider} from "react-redux"
import store from "../store"
// Define a test case to render the App component
test('renders the App component', () => {
     // Render the App component and its child components with the Provider and store using ReactDOM
  render(<Provider store={store}>
    <App />
  </Provider>);
        // Get the element that contains the specified text and assert that it is in the document
  const linkElement = screen.getByText("Welcome to your professional community");
  expect(linkElement).toBeInTheDocument();
});
