import { render, screen } from '@testing-library/react';
import Rightside from '../components/Rightside';
import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme';
jest.mock('react-redux', () => ({
  connect: () => (ReactComponent) => ReactComponent,
}));

Enzyme.configure({ adapter: new Adapter() })
test('renders the Rightside component', () => {
  const component = render(<Rightside />);
  const linkElement = component.getByText("Add to your feed");
  expect(linkElement).toBeInTheDocument();
});
