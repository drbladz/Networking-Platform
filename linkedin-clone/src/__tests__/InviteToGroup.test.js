import { shallow } from "enzyme";
import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import InviteToGroup from "../components/InviteToGroup";

const mockStore = configureStore([]);

describe("InviteToGroup", () => {
  let store;
  let wrapper;

  beforeEach(() => {
    store = mockStore({
      userState: {
        user: {
          connections: [
            { id: "123", name: "John Doe", photoURL: "http://example.com" },
            { id: "456", name: "Jane Doe", photoURL: null },
          ],
        },
      },
    });

    wrapper = shallow(
      <Provider store={store}>
        <InviteToGroup />
      </Provider>
    ).dive();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render the component properly", () => {
    expect(wrapper.find(InviteToGroup)).toHaveLength(1);
  });

  it("should render the list of connections", () => {
    expect(wrapper.find("ConnectionsList").children()).toHaveLength(2);
  });

  it("should render the name of the connections", () => {
    expect(wrapper.find("ConnectionName").at(0).text()).toEqual("John Doe");
    expect(wrapper.find("ConnectionName").at(1).text()).toEqual("Jane Doe");
  });

  it("should render the photo of the connections", () => {
    expect(wrapper.find("ConnectionPhoto").at(0).prop("src")).toEqual(
      "http://example.com"
    );
    expect(wrapper.find("ConnectionPhoto").at(1).prop("src")).toEqual(
      "/images/user.svg"
    );
  });

  it("should call handleInvite when the Invite button is clicked", () => {
    const handleInvite = jest.spyOn(
      wrapper.find(InviteToGroup).dive().instance(),
      "handleInvite"
    );
    wrapper.find("InviteButton").at(0).simulate("click");
    expect(handleInvite).toHaveBeenCalledTimes(1);
  });

  it("should display the success message when an invite is sent successfully", () => {
    const instance = wrapper.find(InviteToGroup).dive().instance();
    const handleInviteSpy = jest.spyOn(instance, "handleInvite");
    instance.handleInvite("456");
    expect(wrapper.find("Alert").text()).toContain(
      "Jane Doe has been invited to the group!"
    );
    expect(handleInviteSpy).toHaveBeenCalled();
  });
});
