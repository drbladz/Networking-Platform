import { render, screen } from '@testing-library/react';
import Rightside from '../components/Rightside';

test('renders the Rightside component', () => {
  render(
    <Rightside />);
  const linkElement = screen.getByText("Add to your feed");
  expect(linkElement).toBeInTheDocument();
});