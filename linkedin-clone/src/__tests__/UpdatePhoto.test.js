import { render, screen, fireEvent } from "@testing-library/react";
import UpdatePhoto from "../components/UpdatePhoto";
import { Provider } from "react-redux";

describe("UpdatePhoto component", () => {
  test.only("renders file input and button", () => {
    render(<UpdatePhoto />);
    const fileInput = screen.getByLabelText(/file upload/i);
    expect(fileInput).toBeInTheDocument();
    const uploadButton = screen.getByRole("button", { name: /update photo/i });
    expect(uploadButton).toBeInTheDocument();
  });

  test("updates user profile picture on button click", async () => {
    const mockDispatch = jest.fn();
    const mockUser = {
      uid: "test-user-id",
      photoURL: "https://example.com/test.jpg",
    };
    const { getByLabelText, getByRole } = render(
      <UpdatePhoto
        user={mockUser}
        updateProfilePicture={mockDispatch}
        userId="test-user-id"
      />
    );

    const file = new File(["(⌐□_□)"], "test.jpg", { type: "image/jpeg" });
    fireEvent.change(getByLabelText(/file upload/i), { target: { files: [file] } });
    fireEvent.click(getByRole("button", { name: /update photo/i }));

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "UPDATE_PROFILE_PICTURE",
      payload: { uid: "test-user-id", photoURL: expect.any(String) },
    });
  });
});

