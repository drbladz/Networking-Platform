import React from "react";
import { render, shallow } from "enzyme";
import Network from "../components/Network";
import Adapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme'
import { BrowserRouter } from 'react-router-dom';
jest.mock('react-redux', () => ({
  connect: () => (ReactComponent) => ReactComponent,
}));
Enzyme.configure({ adapter: new Adapter() })

describe("Network component", () => {
  let props;
  let mountedComponent;

  const network = () => {
    if (!mountedComponent) {
      mountedComponent = shallow(<Network {...props} />);
    }
    return mountedComponent;
  };

  beforeEach(() => {
    props = {
      user: null,
      addConnectionById: jest.fn(),
      acceptRequest: jest.fn(),
      declineRequest: jest.fn(),
    };
    mountedComponent = undefined;
  });

  it("should redirect to the home page if there is no user", () => {
    props.user = null;
    expect(network().find("Redirect").exists()).toBe(true);
  });

  it("should render requests when there are requests", () => {
    props.user = { requests: [{ id: 1, name: "John" }] };
    expect(network().find(".reqRow").length).toBe(1);
  });

  it("should not render requests when there are no requests", () => {
    props.user = { requests: [] };
    expect(network().find(".reqRow").exists()).toBe(false);
  });

  it("should render users when there are users", () => {
    const users = [
      {
        userId: 1,
        photoURL: "https://example.com/user1.jpg",
        displayName: "John",
      },
      {
        userId: 2,
        photoURL: "https://example.com/user2.jpg",
        displayName: "Jane",
      },
    ];
    props.user = {
      userId: 3,
      requests: [],
      connections: [],
      pending: [],
    };
    const stateSetter = jest.fn()
    jest.spyOn(React, 'useState').mockImplementation(stateValue => [stateValue = users, stateSetter])
    network().setState({ users });
    expect(network().find(".card").length).toBe(2);
  });

  it("should not render users when there are no users", () => {
    props.user = {
      userId: 3,
      requests: [],
      connections: [],
      pending: [],
    };
    expect(network().find(".card").exists()).toBe(false);
  });

  it("should call addConnectionById on click of connect button", () => {
    const user = {
      userId: 1,
      photoURL: "https://example.com/user1.jpg",
      displayName: "John",
    };
    props.user = {
      userId: 2,
      requests: [],
      connections: [],
      pending: [],
    };
    network().setState({ users: [user] });
    network().find(".buttonc").simulate("click");
    expect(props.addConnectionById).toHaveBeenCalledWith(user.userId);
  });

  it("should call acceptRequest on click of accept button", () => {
    const request = { id: 1, name: "John" };
    props.user = { requests: [request] };
    network().find(".accept").simulate("click");
    expect(props.acceptRequest).toHaveBeenCalledWith(request.id);
  });

  it("should call declineRequest on click of decline button", () => {
    const request = { id: 1, name: "John" };
    props.user = { requests: [request] };
    network().find(".decline").simulate("click");
    expect(props.declineRequest).toHaveBeenCalledWith(request.id);
  });
});
