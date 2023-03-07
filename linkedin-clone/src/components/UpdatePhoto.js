import { connect } from "react-redux";
import { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "../firebase";
import { updateProfilePicture } from "../actions";

const UpdatePhoto = (props) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileInputChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (selectedFile) {
      const storageRef = ref(db, `users/${props.userId}/profilePicture`);
      const snapshot = await uploadBytes(storageRef, selectedFile);
      const downloadURL = await getDownloadURL(snapshot.ref);

      const updatedPicture = {
        profilePicture: downloadURL,
      };
      props.updateProfilePicture(props.userId, updatedPicture);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileInputChange} />
      <button onClick={handleUpload}>Update Photo</button>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.userState.user,
  };
};

const mapDispatchToProps = (dispatch) => ({
  updateProfilePicture: (userId, updatedPicture) =>
    dispatch(updateProfilePicture(userId, updatedPicture)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UpdatePhoto);
