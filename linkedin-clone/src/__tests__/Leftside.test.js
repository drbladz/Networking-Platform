import { render, screen } from '@testing-library/react';
import Leftside from '../components/Leftside';

test('renders learn react link', () => {
  render(
    <Leftside />);
  const linkElement = screen.getByText("Add a photo");
  expect(linkElement).toBeInTheDocument();
});
