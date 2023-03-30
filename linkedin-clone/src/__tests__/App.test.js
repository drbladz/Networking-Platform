/*import { render, screen } from '@testing-library/react';
import App from '../App';
import {Provider} from "react-redux"
import store from "../store"

test('renders the App component', () => {
  render(<Provider store={store}>
    <App />
  </Provider>);
  const linkElement = screen.getByText("Welcome to your professional community");
  expect(linkElement).toBeInTheDocument();
});
*/
import React from 'react';
import {Provider} from "react-redux"
import store from "../store"
import { shallow } from 'enzyme';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import App from '../App';
import Header from '../components/Header';
import Home from '../components/Home';
import Login from '../components/Login';
import JobPostingPage from '../components/JobPostingPage';
import Adapter from 'enzyme-adapter-react-15';

describe('App component', () => {
  const props = {
    user: null,
    jobPostings: [],
    getUserAuth: jest.fn()
  };

  it('should render without throwing an error', () => {
    const wrapper = shallow(<App {...props} />);
    expect(wrapper.exists()).toBe(true);
  });

  it('should render a Router component', () => {
    const wrapper = shallow(<App {...props} />);
    expect(wrapper.find(Router).exists()).toBe(true);
  });

  it('should render a Switch component', () => {
    const wrapper = shallow(<App {...props} />);
    expect(wrapper.find(Switch).exists()).toBe(true);
  });

  it('should render a Login component', () => {
    const wrapper = shallow(<App {...props} />);
    expect(wrapper.find(Login).exists()).toBe(true);
  });

  it('should render a Header component when on the Home page', () => {
    const wrapper = shallow(<App {...props} />);
    wrapper.find(Route).at(1).props().render();
    expect(wrapper.find(Header).exists()).toBe(true);
  });

  it('should render a Home component when on the Home page', () => {
    const wrapper = shallow(<App {...props} />);
    wrapper.find(Route).at(1).props().render();
    expect(wrapper.find(Home).exists()).toBe(true);
  });

  it('should render a JobPostingPage component when on the job-posting page', () => {
    const wrapper = shallow(<App {...props} />);
    const jobPostingId = '123';
    wrapper.find(Route).at(2).props().render({ match: { params: { id: jobPostingId } } });
    expect(wrapper.find(JobPostingPage).exists()).toBe(true);
  });
});