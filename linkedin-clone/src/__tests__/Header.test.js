import { render, screen } from '@testing-library/react';
import Header from '../components/Header';
import {Provider} from "react-redux"
import store from "../store"

test('renders the Header component', () => {
  render(
    <Provider store={store}>
    <Header />);
  </Provider>);
    
  const linkElement = screen.getByText("Notifications");
  expect(linkElement).toBeInTheDocument();
});
