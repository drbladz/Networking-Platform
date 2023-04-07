import { render, screen } from '@testing-library/react';
import Leftside from '../components/Leftside';
import {Provider} from "react-redux"
import store from "../store"
// Begin test case
test('renders the Leftside component', () => {
    // Render Leftside component with Provider and store
  render(
    <Provider store={store}>
      <Leftside />);
    </Provider>);
  // Assert that the text "Grow your network" appears in the rendered component
  const linkElement = screen.getByText("Grow your network");
  expect(linkElement).toBeInTheDocument();
});
