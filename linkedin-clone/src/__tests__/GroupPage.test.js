import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GroupPage from "../components/GroupPage";
import { useParams, useHistory } from "react-router-dom";
import { collection, doc } from "firebase/firestore";
import { useCollectionData, getDoc } from "react-firebase-hooks/firestore";
import { auth, db } from "../firebase";

// Mocking useParams and useHistory hooks
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
  useHistory: jest.fn(),
}));

// Mocking useCollectionData hook
jest.mock("react-firebase-hooks/firestore", () => ({
  ...jest.requireActual("react-firebase-hooks/firestore"),
  useCollectionData: jest.fn(),
  getDoc: jest.fn(),
}));

// Mocking auth and db objects
jest.mock("../firebase", () => ({
  ...jest.requireActual("../firebase"),
  auth: {
    currentUser: {
      uid: "123",
    },
  },
  db: {
    ...jest.requireActual("../firebase").db,
    collection: jest.fn(),
    doc: jest.fn(),
    getDoc: jest.fn(),
    setDoc: jest.fn(),
    updateDoc: jest.fn(),
    deleteDoc: jest.fn(),
  },
}));

describe("GroupPage", () => {
  const mockGroupId = "abc123";
  const mockGroupName = "Mock Group Name";
  const mockGroupDescription = "Mock group description.";
  const mockAdminName = "Mock Admin Name";
  const mockGroupMembers = ["user1", "user2"];
  const mockCurrentUser = {
    uid: "123",
  };
  const mockGroupRef = doc(db, "Groups", mockGroupId);
  const mockGroupDoc = {
    data: () => ({
      groupName: mockGroupName,
      groupDescription: mockGroupDescription,
      adminName: mockAdminName,
      createdBy: mockCurrentUser.uid,
      groupMembers: mockGroupMembers,
    }),
  };

  beforeEach(() => {
    useParams.mockReturnValue({ groupId: mockGroupId });
    useCollectionData.mockReturnValue([
      {
        id: "job1",
        title: "Mock Job Title",
        description: "Mock job description.",
      },
    ]);
    getDoc.mockResolvedValue(mockGroupDoc);
    db.collection.mockReturnValue({
      doc: jest.fn().mockReturnValue(mockGroupRef),
      add: jest.fn(),
      get: jest.fn(),
      where: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders group name, description and job postings", async () => {
    render(<GroupPage currentUser={mockCurrentUser} />);
    expect(screen.getByText(mockGroupName)).toBeInTheDocument();
    expect(screen.getByText(mockGroupDescription)).toBeInTheDocument();
    expect(
      await screen.findByText("Mock Job Title")
    ).toBeInTheDocument();
  });

  test("renders edit form when edit button is clicked", async () => {
    render(<GroupPage currentUser={mockCurrentUser} />);
    const editButton = screen.getByText("Edit Group");
    userEvent.click(editButton);
    expect(await screen.findByText("Save")).toBeInTheDocument();
  });
});