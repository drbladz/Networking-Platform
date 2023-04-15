import React from "react";
import { shallow } from "enzyme";
import { Redirect } from "react-router-dom";
import Home from "../components/Home";
import Leftside from "../components/Leftside";
import Main from "../components/Main";
import Rightside from "../components/Rightside";

describe("<Home />", () => {
  const props = {
    user: { name: "John Doe" },
  };

  it("should redirect to login page if user is not logged in", () => {
    const propsWithoutUser = {};
    const wrapper = shallow(<Home {...propsWithoutUser} />);
    expect(wrapper.find(Redirect)).toHaveLength(1);
  });

  it("should render Leftside, Main, and Rightside components", () => {
    const wrapper = shallow(<Home {...props} />);
    expect(wrapper.find(Leftside)).toHaveLength(1);
    expect(wrapper.find(Main)).toHaveLength(1);
    expect(wrapper.find(Rightside)).toHaveLength(1);
  });
});
