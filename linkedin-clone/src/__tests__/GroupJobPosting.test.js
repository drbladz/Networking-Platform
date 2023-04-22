import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import GroupJobPostings from "../components/GroupJobPostings";

describe("GroupJobPostings component", () => {
  const mockJobPostings = [    {      id: 1,      groupId: 1,      photoURL: "https://picsum.photos/200",      postTitle: "Title 1",      displayName: "User 1",      timeStamp: Date.now(),      isExternal: false,      postDescription: "Description 1",    },    {      id: 2,      groupId: 1,      photoURL: "https://picsum.photos/200",      postTitle: "Title 2",      displayName: "User 2",      timeStamp: Date.now(),      isExternal: true,      postDescription: "http://example.com",    },  ];
  const mockUser = {
    uid: "user123",
    photoURL: "https://picsum.photos/200",
  };
  const mockStore = {
    getState: () => ({
      auth: { user: mockUser },
      jobPostings: mockJobPostings,
    }),
    subscribe: () => {},
    dispatch: () => {},
  };

  it("should render component with default props", () => {
    render(
      <Provider store={mockStore}>
        <BrowserRouter>
          <GroupJobPostings />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText("My Job Postings")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Post Job" })).toBeInTheDocument();
  });

  it("should open modal when 'Post Job' button is clicked", () => {
    render(
      <Provider store={mockStore}>
        <BrowserRouter>
          <GroupJobPostings />
        </BrowserRouter>
      </Provider>
    );

    const postJobButton = screen.getByRole("button", { name: "Post Job" });

    fireEvent.click(postJobButton);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("should display job postings correctly", () => {
    render(
      <Provider store={mockStore}>
        <BrowserRouter>
          <GroupJobPostings />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText("None")).toBeInTheDocument();

    const job1 = screen.getByText("Title 1");
    const job2 = screen.getByText("Title 2");

    expect(job1).toBeInTheDocument();
    expect(job2).toBeInTheDocument();
    expect(screen.getByText("Description 1")).toBeInTheDocument();
    expect(screen.getByText("http://example.com")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Apply!" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "View Applications" })).toBeInTheDocument();
  });

  /*it("should filter job postings correctly based on 'My Job Postings' button", () => {
    render(
      <Provider store={mockStore}>
        <BrowserRouter>
          <GroupJobPostings />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText("None")).toBeInTheDocument();

    const myJobPostingsButton = screen.getByRole("button", { name: "My Job Postings" });

    fireEvent.click(myJobPostingsButton);

    const job1 = screen.getByText("Title 1");
    const job2 = screen.queryByText("Title 2");

    expect(job1).toBeInTheDocument();
    expect(job2).not.toBeInTheDocument();
    expect(screen.getByText("Description 1")).toBeInTheDocument();
    expect(screen.getByRole
    */ })