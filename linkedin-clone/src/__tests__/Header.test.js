/*import { render, screen } from '@testing-library/react';
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
  
});*/
import React from 'react';
import { shallow, mount } from 'enzyme';
import Header from '../components/Header';

describe('<Header />', () => {
  const mockProps = {
    user: {
      userId: '1',
    },
    jobPostings: [
      {
        id: 1,
        postTitle: 'Software Engineer',
        postDescription: 'We are looking for a software engineer to join our team.',
      },
      {
        id: 2,
        postTitle: 'Product Manager',
        postDescription: 'We are seeking a product manager to lead our team.',
      },
    ],
  };

  it('renders without crashing', () => {
    shallow(<Header />);
  });

  it('should render a logo with a link to /home', () => {
    const wrapper = mount(<Header />);
    const logo = wrapper.find('Logo');
    expect(logo.exists()).toBeTruthy();
    const link = logo.find('Link');
    expect(link.props().to).toEqual('/home');
    wrapper.unmount();
  });

  it('should render a search input and display search results for users and job postings', () => {
    const wrapper = mount(<Header {...mockProps} />);
    const searchInput = wrapper.find('input[type="text"]');
    expect(searchInput.exists()).toBeTruthy();
    searchInput.simulate('change', { target: { value: 'Software' } });
    expect(wrapper.find('DropdownRow').length).toEqual(1);
    expect(wrapper.find('DropdownRow Link').props().to.pathname).toEqual('/job-posting/1');
    wrapper.unmount();
  });

  it('should toggle search preferences on button click', () => {
    const wrapper = mount(<Header {...mockProps} />);
    const toggleButton = wrapper.find('ToggleButton');
    expect(toggleButton.text()).toEqual(' Search All Jobs');
    toggleButton.simulate('click');
    expect(wrapper.find('ToggleButton').props().usePreferences).toBeTruthy();
    expect(toggleButton.text()).toEqual(' Search with Preferences');
    wrapper.unmount();
  });
});
