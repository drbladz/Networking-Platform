/*import { render, screen } from '@testing-library/react';
import Leftside from '../components/Leftside';
import {Provider} from "react-redux"
import store from "../store"
// Begin test case
test('renders the Leftside component', () => {
    // Render Leftside component with Provider and store
  render(
    <Provider store={store}>
      <Leftside />);
    </Provider>);
  // Assert that the text "Grow your network" appears in the rendered component
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
import Adapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme';
import { fireEvent, render } from "@testing-library/react";
jest.mock('react-redux', () => ({
  connect: () => (ReactComponent) => ReactComponent,
}));

Enzyme.configure({ adapter: new Adapter() })

// NOTE: Need Proper Dummy Data
describe("Leftside", () => {
  // const user = {
  //   photoURL: "https://example.com/photo.jpg",
  //   displayName: "John Doe",
  //   bio: "This is my bio",
  //   contactInfo: "123-456-7890",
  //   educations: "Bachelor's degree in Computer Science",
  //   works: "Software Engineer",
  //   skills: "JavaScript, React, Node.js",
  //   languages: "English, Spanish",
  //   courses: "Full Stack Web Development",
  //   projects: "Personal Website",
  //   volunteerings: "Red Cross",
  //   awards: "Best Student Award",
  //   recommendations: "Great to work with",
  // };

  const user = {
    "works": [],
    "pending": [
      "1VtYx8Nk51XYmcDmbfAGTAMrhJc2",
      "1ra4laQyOkNUTIGCYkbRe1vfiWL2",
      "Tla3CmXbgPT6NSSqd61qDXAevwz1",
      "9SAKagxM8bY7WGILgFcYEnPKUnB2",
      "DnQ3ZPdr72MSQI6PetakyVNedGW2",
      "Fc8SA7LLpbaC6iJCwqBhYvqepoS2",
      "HgFOKYaFhQaBrozGMWWLuYnAdlZ2",
      "OJxdd1cC5tZ83mu6naku3tiYJdo2",
      "TainxNRnx5a0GQ1IDnvfOyd68ae2",
      "ZWx7fTaLFrYJICCtv9jnGWgBTt82",
      "efLT5SqHFkN7PcaoaPPsJa2qWLm1"
    ],
    "educations": [
      {
        "program": "",
        "school": "test",
        "endDate": "",
        "startDate": ""
      }
    ],
    "contactInfo": "",
    "volunteerings": [],
    "notifications": [
      {
        "photoURL": "",
        "viewed": false,
        "notification": "Test_User applied to your job: test Job",
        "date": {
          "seconds": 1681804751,
          "nanoseconds": 804000000
        }
      },
      {
        "photoURL": "",
        "date": {
          "seconds": 1681804792,
          "nanoseconds": 624000000
        },
        "viewed": false,
        "notification": "Test_User applied to your job: test Job"
      },
      {
        "photoURL": "",
        "notification": "Test_User applied to your job: test Job",
        "viewed": false,
        "date": {
          "seconds": 1681804903,
          "nanoseconds": 144000000
        }
      },
      {
        "viewed": false,
        "date": {
          "seconds": 1681804903,
          "nanoseconds": 148000000
        },
        "notification": "Test_User applied to your job: test Job",
        "photoURL": ""
      },
      {
        "notification": "Test_User applied to your job: test Job",
        "date": {
          "seconds": 1681804939,
          "nanoseconds": 203000000
        },
        "photoURL": "",
        "viewed": false
      },
      {
        "photoURL": "",
        "date": {
          "seconds": 1682002837,
          "nanoseconds": 119000000
        },
        "notification": "Keyur wants to connect.",
        "viewed": false
      }
    ],
    "mail": "keyur01@yopmail.com",
    "courses": [],
    "projects": [],
    "bio": "",
    "requests": [],
    "savedJobs": [],
    "photoURL": "",
    "displayName": "Keyur P",
    "userId": "dypmxIlR8yTGpB4DzuNXwe21DrA3",
    "recommendations": [],
    "languages": [],
    "awards": [],
    "searchingPreferences": {
      "jobType": "",
      "industry": "",
      "remoteWorkOption": "",
      "experienceLevel": ""
    },
    "connections": [
      {
        "photoURL": "",
        "id": "tC3NGOXjIEZLjcx1flvvkxv5QKm2",
        "name": "Keyur"
      }
    ],
    "skills": []
  }

  it("renders without crashing", () => {

    render(<Leftside user={user} />);

  });

  it("opens the photo modal when the Add a photo button is clicked", () => {
    const wrapper = render(<Leftside user={user} />);
    const button = wrapper.getByText("Change Profile Picture")
    fireEvent.click(button)
    expect(wrapper.getByRole('dialog', { hidden: true })).toBeInTheDocument()
    // const button = wrapper.find("AddPhotoText");
    // button.simulate("click");
    // expect(wrapper.find("CustomModal").prop("isOpen")).toBe(true);
  });

  it("opens the edit modal when the Edit button is clicked", () => {
    const wrapper = render(<Leftside user={user} />);
    const button = wrapper.getByAltText("Edit Icon");
    // button.simulate("click");
    // expect(wrapper.find('[role="dialog"]')).toBeInTheDocument();
    fireEvent.click(button)
    expect(wrapper.getByRole('dialog', { hidden: true })).toBeInTheDocument()
  });

  it("opens the connections modal when the Connections button is clicked", () => {
    const wrapper = render(<Leftside user={user} />);
    const button = wrapper.getByText("View Connections")
    fireEvent.click(button)
    expect(wrapper.getByRole('dialog', { hidden: true })).toBeInTheDocument()
    // const wrapper = shallow(<Leftside user={user} />);
    // const button = wrapper.find("ReviewConnections");
    // button.simulate("click");
    // expect(wrapper.find("CustomModal3").prop("isOpen")).toBe(true);
  });

  // it("renders the photo modal when showPhotoModal is true", () => {
  //   const wrapper = render(<Leftside user={user} />);
  //   wrapper.setState({ showPhotoModal: true });
  //   expect(wrapper.find(UpdatePhoto)).toHaveLength(1);
  // });

  // it("renders the edit modal when showEditModal is true", () => {
  //   const wrapper = render(<Leftside user={user} />);
  //   wrapper.setState({ showEditModal: true });
  //   expect(wrapper.find(EditForm)).toHaveLength(1);
  // });
})
