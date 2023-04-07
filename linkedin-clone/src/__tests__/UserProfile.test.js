/*import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { MemoryRouter, Route } from 'react-router-dom';
import { UserProfile } from '../components/UserProfile';
import { addConnectionById, acceptRequest, declineRequest } from '../actions';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('UserProfile', () => {
  let store;
  let wrapper;

  const user = {
    userId: 1,
    displayName: 'John Doe',
    works: [{ title: 'Software Engineer', location: 'Montreal, QC' }],
  };

  beforeEach(() => {
    store = mockStore({
      user: {
        userId: 2,
        connections: [{ id: 1 }],
        requests: [{ id: 3 }],
      },
    });

    store.dispatch = jest.fn();

    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: '/user', state: user }]}>
          <Route path="/user" component={UserProfile} />
        </MemoryRouter>
      </Provider>,
    );
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('should dispatch addConnectionById action when the Connect button is clicked', () => {
    const connectButton = wrapper.find('.buttonc');
    connectButton.simulate('click');

    expect(store.dispatch).toHaveBeenCalledWith(addConnectionById(user.userId));
  });

  it('should dispatch acceptRequest action when the Accept button is clicked', () => {
    const acceptButton = wrapper.find('.accept');
    acceptButton.simulate('click');

    expect(store.dispatch).toHaveBeenCalledWith(acceptRequest(user.userId));
  });

  it('should dispatch declineRequest action when the Decline button is clicked', () => {
    const declineButton = wrapper.find('.decline');
    declineButton.simulate('click');

    expect(store.dispatch).toHaveBeenCalledWith(declineRequest(user.userId));
  });
});
*/

import React from 'react';
import { shallow } from 'enzyme';
import { UserProfile } from '../components/UserProfile';

describe('UserProfile component', () => {
  const user = {
    userId: '123',
    displayName: 'John Doe',
    photoURL: 'https://example.com/image.jpg',
    bio: 'I am a software engineer.',
    works: [
      {
        title: 'Software Engineer',
        company: 'Acme Inc.',
        location: 'Montreal, QC',
        startDate: '2019-01-01',
        endDate: '2021-12-31',
        description: 'Developed new features and maintained existing codebase.',
      },
    ],
    educations: [
      {
        school: 'University of Montreal',
        program: 'Computer Science',
        startDate: '2015-09-01',
        endDate: '2019-05-31',
      },
    ],
    skills: ['JavaScript', 'React', 'Node.js'],
    courses: [
      {
        title: 'React Fundamentals',
        school: 'Pluralsight',
      },
    ],
    projects: [
      {
        title: 'React App',
        startDate: '2022-01-01',
        endDate: '2022-01-31',
        description: 'Built a simple React app.',
      },
    ],
  };

  const props = {
    user: {
      userId: '456',
      connections: [{ id: '123' }],
    },
    addConnectionById: jest.fn(),
    acceptRequest: jest.fn(),
    declineRequest: jest.fn(),
  };

  it('renders the user profile container', () => {
    const wrapper = shallow(<UserProfile {...props} />, {
      context: { router: { location: { state: user } } },
    });

    expect(wrapper.find('.profile-container')).toHaveLength(1);
  });

  it('redirects to home if user is not logged in', () => {
    const wrapper = shallow(<UserProfile {...props} />, {
      context: { router: { location: { state: user } } },
    });

    wrapper.setProps({ user: null });

    expect(wrapper.find('Redirect')).toHaveLength(1);
    expect(wrapper.find('Redirect').prop('to')).toEqual('/');
  });

  it('renders user photo if available', () => {
    const wrapper = shallow(<UserProfile {...props} />, {
      context: { router: { location: { state: user } } },
    });

    expect(wrapper.find('img').prop('src')).toEqual(user.photoURL);
  });

  it('renders default user photo if photo is not available', () => {
    const userWithoutPhoto = { ...user, photoURL: null };
    const wrapper = shallow(<UserProfile {...props} />, {
      context: { router: { location: { state: userWithoutPhoto } } },
    });

    expect(wrapper.find('img').prop('src')).toEqual('/images/user.svg');
  });

  it('renders user display name', () => {
    const wrapper = shallow(<UserProfile {...props} />, {
      context: { router: { location: { state: user } } },
    });

    expect(wrapper.find('h1').text()).toEqual(user.displayName);
  });

  it('renders user job title if available', () => {
    const wrapper = shallow(<UserProfile {...props} />, {
      context: { router: { location: { state: user } } },
    });

    expect(wrapper.find('h3').at(0).text()).toEqual(user.works[0].title);
  });
})