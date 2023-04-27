import React from 'react';
import { shallow } from 'enzyme';
import { EditGroupPostModal, mapDispatchToProps } from '../components/EditGroupPostModal';

describe('EditGroupPostModal', () => {
  let wrapper;

  beforeEach(() => {
    const mockProps = {
      user: {
        userId: '123',
        displayName: 'John Doe',
        photoURL: 'https://example.com/image.jpg'
      },
      jobPostings: [],
      editGroupJobPosting: jest.fn(),
      deleteGroupJobPosting: jest.fn(),
      createGroupJobPosting: jest.fn()
    };

    wrapper = shallow(<EditGroupPostModal {...mockProps} />);
  });

  it('should render EditGroupPostModal component', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render Header component', () => {
    expect(wrapper.find('Header').exists()).toBe(true);
  });

  it('should render UserInfo component', () => {
    expect(wrapper.find('UserInfo').exists()).toBe(true);
  });

  it('should render SharedCreation component', () => {
    expect(wrapper.find('SharedCreation').exists()).toBe(true);
  });

  it('should render SharedContent component', () => {
    expect(wrapper.find('SharedContent').exists()).toBe(true);
  });

  it('should render Editor component', () => {
    expect(wrapper.find('Editor').exists()).toBe(true);
  });

  describe('mapDispatchToProps', () => {
    const dispatch = jest.fn();

    it('should call editGroupJobPosting action', () => {
      const { editGroupJobPosting } = mapDispatchToProps(dispatch);
      editGroupJobPosting({});
      expect(dispatch).toHaveBeenCalled();
    });

    it('should call deleteGroupJobPosting action', () => {
      const { deleteGroupJobPosting } = mapDispatchToProps(dispatch);
      deleteGroupJobPosting('1', '2', '3', []);
      expect(dispatch).toHaveBeenCalled();
    });

    it('should call createGroupJobPosting action', () => {
      const { createGroupJobPosting } = mapDispatchToProps(dispatch);
      createGroupJobPosting('1', '2', '3', [], '4', '5', true, false, {});
      expect(dispatch).toHaveBeenCalled();
    });
  });
});
