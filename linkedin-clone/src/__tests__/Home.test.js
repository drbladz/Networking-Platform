import React from "react";
import Enzyme, { mount, render, shallow, } from "enzyme";
import { Redirect } from "react-router-dom";
import Home, { Layout } from "../components/Home";
import Leftside from "../components/Leftside";
import Main from "../components/Main";
import Rightside from "../components/Rightside";
import Adapter from 'enzyme-adapter-react-16';
import { Provider } from "react-redux";
import store from "../store";

Enzyme.configure({ adapter: new Adapter() })

jest.mock('react-redux', () => ({
  connect: () => (ReactComponent) => ReactComponent,
}));

describe("<Home />", () => {
  const props = {
    user: { name: "John Doe" },
  };

  it("should redirect to login page if user is not logged in", () => {
    const propsWithoutUser = {};
    const wrapper = shallow(
      <Home {...propsWithoutUser} />
    );
    console.log(wrapper.debug())
    expect(wrapper.find(Redirect)).toHaveLength(1);
  });

  it("should render Leftside, Main, and Rightside components", () => {
    const wrapper = shallow(<Home {...props} />);
    expect(wrapper.find(Leftside)).toHaveLength(1);
    expect(wrapper.find(Main)).toHaveLength(1);
    expect(wrapper.find(Rightside)).toHaveLength(1);
  });
});
