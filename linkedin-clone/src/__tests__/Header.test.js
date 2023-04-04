import { render, screen } from '@testing-library/react';
import Header from '../components/Header';
import {Provider} from "react-redux"
import store from "../store"
// Begin test case
test('renders the Header component', () => {
    // Render Header component with Provider and store
  render(
    <Provider store={store}>
    <Header />);
  </Provider>);
    // Assert that the text "Notifications" appears in the rendered component  
  const linkElement = screen.getByText("Notifications");
  expect(linkElement).toBeInTheDocument();
  
});
