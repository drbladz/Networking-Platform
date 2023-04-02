/*import { render, screen } from '@testing-library/react';
import Leftside from '../components/Leftside';
import {Provider} from "react-redux"
import store from "../store"

test('renders the Leftside component', () => {
  render(
    <Provider store={store}>
      <Leftside />);
    </Provider>);
  const linkElement = screen.getByText("Grow your network");
  expect(linkElement).toBeInTheDocument();
});
*/
import React from "react";
import { shallow } from "enzyme";
import Leftside from "../components/Leftside";
import UpdatePhoto from "../components/UpdatePhoto";
import EditForm from "../components/EditForm";
import Modal from "react-modal";


//Modal.setAppElement("#root");
import { configure } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

configure({ adapter: new Adapter() });

Enzyme.configure({ adapter: new Adapter() });

describe("Leftside", () => {
  const user = {
    photoURL: "https://example.com/photo.jpg",
    displayName: "John Doe",
    bio: "This is my bio",
    contactInfo: "123-456-7890",
    educations: "Bachelor's degree in Computer Science",
    works: "Software Engineer",
    skills: "JavaScript, React, Node.js",
    languages: "English, Spanish",
    courses: "Full Stack Web Development",
    projects: "Personal Website",
    volunteerings: "Red Cross",
    awards: "Best Student Award",
    recommendations: "Great to work with",
  };

  it("renders without crashing", () => {
    
    render(<div id={'root'}>
      <Leftside user={user} />
      </div>
    );

  });

  it("opens the photo modal when the Add a photo button is clicked", () => {
    const wrapper = shallow(<Leftside user={user} />);
    const button = wrapper.find("AddPhotoText");
    button.simulate("click");
    expect(wrapper.find("CustomModal").prop("isOpen")).toBe(true);
  });

  it("opens the edit modal when the Edit button is clicked", () => {
    const wrapper = shallow(<Leftside user={user} />);
    const button = wrapper.find("img[alt='']");
    button.simulate("click");
    expect(wrapper.find("CustomModal2").prop("isOpen")).toBe(true);
  });

  it("opens the connections modal when the Connections button is clicked", () => {
    const wrapper = shallow(<Leftside user={user} />);
    const button = wrapper.find("ReviewConnections");
    button.simulate("click");
    expect(wrapper.find("CustomModal3").prop("isOpen")).toBe(true);
  });

  it("renders the photo modal when showPhotoModal is true", () => {
    const wrapper = shallow(<Leftside user={user} />);
    wrapper.setState({ showPhotoModal: true });
    expect(wrapper.find(UpdatePhoto)).toHaveLength(1);
  });

  it("renders the edit modal when showEditModal is true", () => {
    const wrapper = shallow(<Leftside user={user} />);
    wrapper.setState({ showEditModal: true });
    expect(wrapper.find(EditForm)).toHaveLength(1);
  });})