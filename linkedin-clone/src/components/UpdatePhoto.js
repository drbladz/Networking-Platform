import { connect } from "react-redux";
import { useState, useEffect } from "react";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { db, storage } from "../firebase";
import { updateProfilePicture } from "../actions";
import { setUser } from "../actions";
import styled from "styled-components";
// Component for updating profile picture
const UpdatePhoto = (props) => {
  //File Upload State
  const [selectedFile, setSelectedFile] = useState(null);
  const [lastImageUrl, setLastImageUrl] = useState(null);
  // Reference to images folder in Firebase storage
  const imagesFolderRef = ref(storage, `images/`);
  // Function to upload file to Firebase storage and update user document in Firestore
  const uploadFile = async (dispatch) => {
    if (!selectedFile) return;
    const imageRef = ref(imagesFolderRef, selectedFile.name);
    try {
      await uploadBytes(imageRef, selectedFile);
      const url = await getDownloadURL(imageRef);
      setLastImageUrl(url);

      // Update user document with photo URL
      const userDocumentRef = doc(db, `Users/${props.userId}`);
      await updateDoc(userDocumentRef, {
        photoURL: url,
      });
      props.user.photoURL = url;
      // Update Redux store with updated user object
      console.log("yaya");
      const updatedUser = {};
      for (let property in props.user) {
        updatedUser[property] = props.user[property];
      }
      props.updateProfilePicture(updatedUser);
    } catch (err) {
      console.log(err);
    }
  };
  // useEffect hook to set last image URL state variable when component mounts
  useEffect(() => {
    listAll(imagesFolderRef).then((response) => {
      if (response.items.length === 0) return;
      const firstImageRef = response.items[0];
      getDownloadURL(firstImageRef).then((url) => {
        setLastImageUrl(url);
      });
    });
  }, []);
  // JSX for rendering component
  return (
    <div>
      <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
      <button onClick={uploadFile}>Update Photo</button>

      {/* {lastImageUrl && <img src={lastImageUrl} />} */}
    </div>
  );
};
// Function to map Redux store state to component props
const mapStateToProps = (state) => {
  return {
    user: state.userState.user,
  };
};
// Function to map Redux store dispatch to component props
const mapDispatchToProps = (dispatch) => ({
  updateProfilePicture: (currentUser) =>
    dispatch(updateProfilePicture(currentUser)),
});
// Export component after connecting to Redux store
export default connect(mapStateToProps, mapDispatchToProps)(UpdatePhoto);

/*const handleUpload = async () => {
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
*/
// CSS-in-JS using styled-components library
styled.img`
  box-shadow: none;
  background-image: url("/images/photo.svg");
  width: 72px;
  height: 72px;
  box-sizing: border-box;
  background-clip: content-box;
  background-color: white;
  background-position: center;
  background-size: 60%;
  background-repeat: no-repeat;
  border: 2px solid white;
  margin: -38px auto 12px;
  border-radius: 50%;
`;
