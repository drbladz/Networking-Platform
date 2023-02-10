import { render, screen } from '@testing-library/react';
import Main from '../components/Main';

test('renders the Main component', () => {
  render(
    <Main />);
  const linkElement = screen.getByText("temp for test");
  expect(linkElement).toBeInTheDocument();
});