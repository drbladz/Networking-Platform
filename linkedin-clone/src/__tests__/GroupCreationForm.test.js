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
});
