import React from "react";
import { shallow } from "enzyme";
import GroupPostModal from "../components/GroupPostModal";

describe("GroupPostModal", () => {
  const defaultProps = {
    showModal: "open",
    user: {
      photoURL: "test-url",
      displayName: "Test User"
    },
    handleClick: jest.fn(),
    jobPostings: []
  };

  const setup = (props = {}) => {
    const setupProps = { ...defaultProps, ...props };
    return shallow(<GroupPostModal {...setupProps} />);
  };

  test("renders without error", () => {
    const wrapper = setup();
    const component = wrapper.find(".group-post-modal");
    expect(component.length).toBe(1);
  });

  test("calls handleClick function when close button is clicked", () => {
    const handleClickMock = jest.fn();
    const wrapper = setup({ handleClick: handleClickMock });
    const closeButton = wrapper.find(".close-button");
    closeButton.simulate("click");
    expect(handleClickMock).toHaveBeenCalled();
  });

  test("updates postTitle state when input value changes", () => {
    const wrapper = setup();
    const titleInput = wrapper.find('input[type="text"]');
    titleInput.simulate("change", { target: { value: "Test Title" } });
    expect(wrapper.state("postTitle")).toBe("Test Title");
  });

  test("updates postDescription state when textarea value changes", () => {
    const wrapper = setup();
    const descriptionTextarea = wrapper.find("textarea");
    descriptionTextarea.simulate("change", { target: { value: "Test Description" } });
    expect(wrapper.state("postDescription")).toBe("Test Description");
  });

  test("updates mandatoryResume state when Resume checkbox is checked", () => {
    const wrapper = setup();
    const resumeCheckbox = wrapper.find('input[type="checkbox"]').at(0);
    resumeCheckbox.simulate("change");
    expect(wrapper.state("mandatoryResume")).toBe(true);
  });

  test("updates mandatoryCoverLetter state when Cover Letter checkbox is checked", () => {
    const wrapper = setup();
    const coverLetterCheckbox = wrapper.find('input[type="checkbox"]').at(1);
    coverLetterCheckbox.simulate("change");
    expect(wrapper.state("mandatoryCoverLetter")).toBe(true);
  });

  test("updates isExternal state when Is External checkbox is checked", () => {
    const wrapper = setup();
    const externalCheckbox = wrapper.find('input[type="checkbox"]').at(2);
    externalCheckbox.simulate("change");
    expect(wrapper.state("isExternal")).toBe(true);
  });

  test("updates jobType state when job type is selected", () => {
    const wrapper = setup();
    const jobTypeSelect = wrapper.find('select').at(0);
    jobTypeSelect.simulate("change", { target: { value: "full-time" } });
    expect(wrapper.state("jobType")).toBe("full-time");
  });

  test("updates industry state when industry is selected", () => {
    const wrapper = setup();
    const industrySelect = wrapper.find('select').at(1);
    industrySelect.simulate("change", { target: { value: "accounting" } });
    expect(wrapper.state("industry")).toBe("accounting");
  });
});
