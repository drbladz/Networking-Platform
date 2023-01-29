import { render, screen } from '@testing-library/react';
import Home from '../components/Home';

//ToDo: work on test for this component

test('renders learn react link', () => {
  render(
    <Home />);
  const linkElement = screen.getByText(" Find talented pros in record time with Upwork and keep business moving.");
  expect(linkElement).toBeInTheDocument();
});
