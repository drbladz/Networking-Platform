/*import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import EditPostModal from '../components/EditPostModal';

const mockStore = configureStore([]);

describe('EditPostModal', () => {
  let store;
  let component;

  beforeEach(() => {
    const job = {
      id: '123',
      postTitle: 'Test Post',
      postDescription: 'This is a test post',
      mandatoryResume: false,
      mandatoryCoverLetter: true,
      isExternal: true,
      displayName: 'Test User',
      userId: '456',
      photoURL: 'https://example.com/test.jpg',
      timeStamp: 123456789,
    };
    const initialState = {
      userState: {
        user: {
          displayName: 'Test User',
          photoURL: 'https://example.com/test.jpg',
        },
      },
      jobPostingsState: {
        jobPostings: [job],
      },
    };
    store = mockStore(initialState);

    component = render(
      <Provider store={store}>
        <EditPostModal job={job} />
      </Provider>
    );
  });

  it('should display the correct job title', () => {
    const { getByText } = component;
    const titleElement = getByText(`Edit Test Post`);
    expect(titleElement).toBeInTheDocument();
  });

  it('should update the post title field when user types in it', () => {
    const { getByPlaceholderText } = component;
    const postTitleInput = getByPlaceholderText('Test Post');
    fireEvent.change(postTitleInput, { target: { value: 'New Test Post' } });
    expect(postTitleInput.value).toBe('New Test Post');
  });

  it('should update the post description field when user types in it', () => {
    const { getByPlaceholderText } = component;
    const postDescriptionInput = getByPlaceholderText('This is a test post');
    fireEvent.change(postDescriptionInput, { target: { value: 'This is a new test post' } });
    expect(postDescriptionInput.value).toBe('This is a new test post');
  });

  it('should update the mandatoryResume field when user clicks on the checkbox', () => {
    const { getByLabelText } = component;
    const mandatoryResumeCheckbox = getByLabelText('Resume');
    fireEvent.click(mandatoryResumeCheckbox);
    expect(mandatoryResumeCheckbox.checked).toBe(true);
  });

  it('should update the mandatoryCoverLetter field when user clicks on the checkbox', () => {
    const { getByLabelText } = component;
    const mandatoryCoverLetterCheckbox = getByLabelText('Cover Letter');
    fireEvent.click(mandatoryCoverLetterCheckbox);
    expect(mandatoryCoverLetterCheckbox.checked).toBe(false);
  });

  it('should update the isExternal field when user clicks on the checkbox', () => {
    const { getByLabelText } = component;
    const isExternalCheckbox = getByLabelText('Is External');
    fireEvent.click(isExternalCheckbox);
    expect(isExternalCheckbox.checked).toBe(false);
  });

  it('should call the editJobPosting action when user clicks on the Apply Change button', () => {
    const { getByText } = component;
    const applyChangeButton = getByText('Apply Change');
    fireEvent.click(applyChangeButton);
    const actions = store.getActions();
    expect(actions[0].type).toBe('EDIT_JOB_POSTING');
  });

})
*/
import React from 'react';
import { shallow } from 'enzyme';
import EditPostModal from '../components/EditPostModal';


describe('EditPostModal', () => {
  const defaultProps = {
    job: {
      id: '123',
      postTitle: 'Test Job Posting',
      postDescription: 'This is a test job posting',
      mandatoryResume: false,
      mandatoryCoverLetter: true,
      isExternal: true,
      displayName: 'Test User',
      userId: '456',
      photoURL: '/images/user.png',
      timeStamp: Date.now()
    },
    showEditPostModal: true,
    handleClick: jest.fn(),
    user: {
      displayName: 'Test User',
      photoURL: '/images/user.png'
    },
    jobPostings: []
  };

  it('renders without crashing', () => {
    shallow(<EditPostModal {...defaultProps} />);
  });

  it('renders the job post title in the header', () => {
    const wrapper = shallow(<EditPostModal {...defaultProps} />);
    const header = wrapper.find('Header h2');
    expect(header.text()).toEqual(`Edit ${defaultProps.job.postTitle}`);
  });

  it('updates the state when the user enters a new post title', () => {
    const wrapper = shallow(<EditPostModal {...defaultProps} />);
    const input = wrapper.find('Editor input');
    const newPostTitle = 'New Test Job Posting';
    input.simulate('change', { target: { value: newPostTitle } });
    expect(wrapper.state('postTitle')).toEqual(newPostTitle);
  });

  it('calls the editJobPosting function with the updated job data when the "Apply Change" button is clicked', () => {
    const editJobPosting = jest.fn();
    const wrapper = shallow(<EditPostModal {...defaultProps} editJobPosting={editJobPosting} />);
    const button = wrapper.find('EditButton');
    button.simulate('click');
    expect(editJobPosting).toHaveBeenCalledWith(
      {
        id: defaultProps.job.id,
        postTitle: wrapper.state('postTitle'),
        postDescription: wrapper.state('postDescription'),
        mandatoryResume: wrapper.state('mandatoryResume'),
        mandatoryCoverLetter: wrapper.state('mandatoryCoverLetter'),
        isExternal: wrapper.state('isExternal'),
        displayName: defaultProps.job.displayName,
        userId: defaultProps.job.userId,
        photoURL: defaultProps.user.photoURL,
        timeStamp: defaultProps.job.timeStamp,
      },
      defaultProps.jobPostings
    );
  });

  it('calls the deleteJobPosting function when the "Delete Post" button is clicked', () => {
    const deleteJobPosting = jest.fn();
    const wrapper = shallow(<EditPostModal {...defaultProps} deleteJobPosting={deleteJobPosting} />);
    const button = wrapper.find('DeleteButton');
    button.simulate('click');
    expect(deleteJobPosting).toHaveBeenCalledWith(defaultProps.job.id, defaultProps.job.userId, defaultProps.jobPostings);
  });

  it('calls the handleClick function when the "X" button is clicked', () => {
    const handleClick = jest.fn();
    const wrapper = shallow(<EditPostModal {...defaultProps} handleClick={handleClick} />);
    const button = wrapper.find('Header button');
    button.simulate('click');
    expect(handleClick).toHaveBeenCalled();
  });
});
