import { render, screen } from '@testing-library/react';
import Leftside from '../components/Leftside';
import {Provider} from "react-redux"
import store from "../store"

test('renders the Leftside component', () => {
  render(
    <Provider store={store}>
      <Leftside />);
    </Provider>);
  const linkElement = screen.getByText("Grow your network");
  expect(linkElement).toBeInTheDocument();
});
