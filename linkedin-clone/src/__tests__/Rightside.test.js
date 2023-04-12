import { render, screen } from '@testing-library/react';
import Rightside from '../components/Rightside';
import { shallow } from "enzyme";
import { Provider } from 'react-redux';

import configureStore from 'redux-mock-store';

/*test('renders the Rightside component', () => {
  render(
    <Rightside />);
  const linkElement = screen.getByText("Add to your feed");
  expect(linkElement).toBeInTheDocument();
});*/

describe('Rightside component', () => {
  const mockStore = configureStore([]);
  const store = mockStore({
    userState: {
      user: {
        name: 'Test User',
        email: 'test@test.com',
      },
    },
  });

  beforeEach(() => {
    render(
      <Provider store={store}>
        <Rightside />
      </Provider>
    );
  });

  test('renders feed list', () => {
    const feedListElement = screen.getByText('#Jobshare');
    expect(feedListElement).toBeInTheDocument();
  });

  test('renders banner image', () => {
    const bannerImageElement = screen.getByText('#Video');
    expect(bannerImageElement).toBeInTheDocument();
  });
});