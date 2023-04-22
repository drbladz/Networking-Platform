import { render, fireEvent, screen } from "@testing-library/react";
import EditGroupPostModal from "../components/EditGroupPostModal";
import { Provider } from "react-redux";

describe("EditGroupPostModal", () => {
  const job = {
    id: "1",
    postTitle: "Test Job Title",
    postDescription: "Test Job Description",
    mandatoryResume: true,
    mandatoryCoverLetter: false,
    isExternal: false,
    jobParameters: {
      jobType: "full-time",
      industry: "IT",
      experienceLevel: "Senior",
      remoteWorkOption: true,
    },
    userId: "user123",
  };

  const mockDeleteGroupJobPosting = jest.fn();
  const mockHandleClick = jest.fn();
  const mockProps = {
    job,
    user: { photoURL: "/test.png", displayName: "Test User" },
    showEditGroupPostModal: true,
    jobPostings: [],
    deleteGroupJobPosting: mockDeleteGroupJobPosting,
    handleClick: mockHandleClick,
  };

  beforeEach(() => {
    render(<Provider><EditGroupPostModal {...mockProps} /></Provider>);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should update state variables when input fields change", () => {
    const postTitleInput = screen.getByPlaceholderText(job.postTitle);
    fireEvent.change(postTitleInput, { target: { value: "New Title" } });
    expect(postTitleInput.value).toBe("New Title");

    const postDescriptionInput = screen.getByPlaceholderText(
      job.postDescription
    );
    fireEvent.change(postDescriptionInput, {
      target: { value: "New Description" },
    });
    expect(postDescriptionInput.value).toBe("New Description");

    const mandatoryResumeCheckbox = screen.getByLabelText("Resume");
    fireEvent.click(mandatoryResumeCheckbox);
    expect(mandatoryResumeCheckbox.checked).toBe(false);

    const mandatoryCoverLetterCheckbox = screen.getByLabelText("Cover Letter");
    fireEvent.click(mandatoryCoverLetterCheckbox);
    expect(mandatoryCoverLetterCheckbox.checked).toBe(true);

    const isExternalCheckbox = screen.getByLabelText("Is External");
    fireEvent.click(isExternalCheckbox);
    expect(isExternalCheckbox.checked).toBe(true);

    const jobTypeSelect = screen.getByLabelText("Job Type");
    fireEvent.change(jobTypeSelect, { target: { value: "part-time" } });
    expect(jobTypeSelect.value).toBe("part-time");
  });

})