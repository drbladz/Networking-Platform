import { render, screen, fireEvent } from "@testing-library/react";
import GroupPage from "../components/GroupPage";

describe("GroupPage", () => {
  test("renders the group name and description", async () => {
    const { getByText } = render(<GroupPage groupId="groupId123" />);
    await screen.findByText("Loading...");

    expect(getByText("Example Group")).toBeInTheDocument();
    expect(
      getByText(
        "This is an example group description. Lorem ipsum dolor sit amet, consectetur adipiscing elit."
      )
    ).toBeInTheDocument();
  });

  test("renders the list of group members", async () => {
    const { getByText } = render(<GroupPage groupId="groupId123" />);
    await screen.findByText("Loading...");

    expect(getByText("John Doe")).toBeInTheDocument();
    expect(getByText("Jane Smith")).toBeInTheDocument();
    expect(getByText("Bob Johnson")).toBeInTheDocument();
  });

  test("shows the edit form when the edit button is clicked", async () => {
    const { getByText, getByLabelText } = render(
      <GroupPage groupId="groupId123" currentUser={{ uid: "user123" }} />
    );
    await screen.findByText("Loading...");

    fireEvent.click(getByText("Edit"));
    expect(getByLabelText("Group Name")).toBeInTheDocument();
    expect(getByLabelText("Group Description")).toBeInTheDocument();
  });

  test("shows the connection modal when the add connection button is clicked", async () => {
    const { getByText } = render(<GroupPage groupId="groupId123" />);
    await screen.findByText("Loading...");

    fireEvent.click(getByText("Add Connection"));
    expect(screen.getByText("Invite Members")).toBeInTheDocument();
  });

  test("allows the user to quit the group when the quit button is clicked", async () => {
    const { getByText } = render(
      <GroupPage groupId="groupId123" currentUser={{ uid: "user123" }} />
    );
    await screen.findByText("Loading...");

    fireEvent.click(getByText("Quit Group"));
    expect(getByText("Are you sure you want to quit this group?")).toBeInTheDocument();
    fireEvent.click(getByText("Yes"));
    expect(getByText("You have successfully quit the group.")).toBeInTheDocument();
  });
});
