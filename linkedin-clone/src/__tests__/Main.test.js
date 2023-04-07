import { render, screen } from '@testing-library/react';
import Main from '../components/Main';
// Begin test case
test('renders the Main component', () => {
    // Render Main component
  render(
    <Main />);
      // Assert that the text "temp for test" appears in the rendered component
  const linkElement = screen.getByText("temp for test");
  expect(linkElement).toBeInTheDocument();
});
