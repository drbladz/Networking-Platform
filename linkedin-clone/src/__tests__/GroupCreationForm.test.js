import React from "react";
import { render, fireEvent } from "@testing-library/react";
import GroupCreationForm from "../components/GroupCreationForm";

describe("GroupCreationForm", () => {
  it("should render the form", () => {
    const { getByLabelText, getByText } = render(<GroupCreationForm />);
    const groupNameInput = getByLabelText(/group name/i);
    const groupDescriptionInput = getByLabelText(/group description/i);
    
    const createButton = getByText(/create/i);
    expect(groupNameInput).toBeInTheDocument();
    expect(groupDescriptionInput).toBeInTheDocument();
    expect(createButton).toBeInTheDocument();
  });

  it("should update the group name when the input changes", () => {
    const { getByLabelText } = render(<GroupCreationForm />);
    const groupNameInput = getByLabelText(/group name/i);
    fireEvent.change(groupNameInput, { target: { value: "My Group" } });
    expect(groupNameInput.value).toBe("My Group");
  });

  it("should update the group description when the input changes", () => {
    const { getByLabelText } = render(<GroupCreationForm />);
    const groupDescriptionInput = getByLabelText(/group description/i);
    fireEvent.change(groupDescriptionInput, {
      target: { value: "This is my group" },
    });
    expect(groupDescriptionInput.value).toBe("This is my group");
  });

  // it("should update the group location when the input changes", () => {
  //   const { getByLabelText } = render(<GroupCreationForm />);
  //   const groupLocationInput = getByLabelText(/group location/i);
  //   fireEvent.change(groupLocationInput, {
  //     target: { value: "New York, NY" },
  //   });
  //   expect(groupLocationInput.value).toBe("New York, NY");
  // });

  // it("should update the group rules when the input changes", () => {
  //   const { getByLabelText } = render(<GroupCreationForm />);
  //   const groupRulesInput = getByLabelText(/group rules/i);
  //   fireEvent.change(groupRulesInput, {
  //     target: { value: "Be kind and respectful" },
  //   });
  //   expect(groupRulesInput.value).toBe("Be kind and respectful");
  // });

  /*it("should call handleSubmit when the form is submitted", () => {
    const handleSubmitMock = jest.fn();
    const { getByText } = render(
      <GroupCreationForm onSubmit={handleSubmitMock} />
    );
    const createButton = getByText(/create/i);
    fireEvent.click(createButton);
    expect(handleSubmitMock).toHaveBeenCalledTimes(1);
  });*/
});
