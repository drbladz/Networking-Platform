import React from 'react';
import { shallow } from 'enzyme';
import { GroupPostModal } from '../components/GroupPostModal';
import Enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-18';

Enzyme.configure({ adapter: new Adapter() });

describe('GroupPostModal', () => {
  const defaultProps = {
    showModal: 'open',
    jobPostings: [],
    user: { displayName: 'User', photoURL: '/images/user.svg' },
    handleClick: jest.fn(),
  };

  it.only('renders without crashing', () => {
    shallow(<GroupPostModal {...defaultProps} />);
  });

  it('displays the create job posting form when showModal is open', () => {
    const wrapper = shallow(<GroupPostModal {...defaultProps} />);
    expect(wrapper.find('h2').text()).toEqual('Create Job Posting');
  });

  it('updates the post title when input is changed', () => {
    const wrapper = shallow(<GroupPostModal {...defaultProps} />);
    const input = wrapper.find('input[type="text"]');
    input.simulate('change', { target: { value: 'Post Title' } });
    expect(wrapper.find('input[type="text"]').prop('value')).toEqual('Post Title');
  });

  it('updates the post description when input is changed', () => {
    const wrapper = shallow(<GroupPostModal {...defaultProps} />);
    const input = wrapper.find('textarea');
    input.simulate('change', { target: { value: 'Post Description' } });
    expect(wrapper.find('textarea').prop('value')).toEqual('Post Description');
  });

  it('updates the mandatory resume state when checkbox is clicked', () => {
    const wrapper = shallow(<GroupPostModal {...defaultProps} />);
    const checkbox = wrapper.find('input[type="checkbox"]').at(0);
    checkbox.simulate('change');
    expect(wrapper.find('input[type="checkbox"]').at(0).prop('checked')).toEqual(true);
  });

  it('updates the mandatory cover letter state when checkbox is clicked', () => {
    const wrapper = shallow(<GroupPostModal {...defaultProps} />);
    const checkbox = wrapper.find('input[type="checkbox"]').at(1);
    checkbox.simulate('change');
    expect(wrapper.find('input[type="checkbox"]').at(1).prop('checked')).toEqual(true);
  });

  it('updates the is external state when checkbox is clicked', () => {
    const wrapper = shallow(<GroupPostModal {...defaultProps} />);
    const checkbox = wrapper.find('input[type="checkbox"]').at(2);
    checkbox.simulate('change');
    expect(wrapper.find('input[type="checkbox"]').at(2).prop('checked')).toEqual(true);
  });

  it('updates the job type state when select is changed', () => {
    const wrapper = shallow(<GroupPostModal {...defaultProps} />);
    const select = wrapper.find('select').at(0);
    select.simulate('change', { target: { value: 'full-time' } });
    expect(wrapper.find('select').at(0).prop('value')).toEqual('full-time');
  });

  it('updates the industry state when select is changed', () => {
    const wrapper = shallow(<GroupPostModal {...defaultProps} />);
    const select = wrapper.find('select').at(1);
    select.simulate('change', { target: { value: 'accounting' } });
    expect(wrapper.find('select').at(1).prop('value')).toEqual('accounting');
  });

});