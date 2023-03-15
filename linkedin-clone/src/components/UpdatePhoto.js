import { connect } from "react-redux";
import { useState, useEffect } from "react";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { db, storage } from "../firebase";
import { updateProfilePicture } from "../actions";
import { setUser } from "../actions";
import styled from "styled-components";

const UpdatePhoto = (props) => {
  //File Upload State
  const [selectedFile, setSelectedFile] = useState(null);
  const [lastImageUrl, setLastImageUrl] = useState(null);

  const imagesFolderRef = ref(storage, `images/`);

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

  useEffect(() => {
    listAll(imagesFolderRef).then((response) => {
      if (response.items.length === 0) return;
      const firstImageRef = response.items[0];
      getDownloadURL(firstImageRef).then((url) => {
        setLastImageUrl(url);
      });
    });
  }, []);

  return (
    <div>
      <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
      <button onClick={uploadFile}>Update Photo</button>

      {lastImageUrl && <img src={lastImageUrl} />}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.userState.user,
  };
};

const mapDispatchToProps = (dispatch) => ({
  updateProfilePicture: (currentUser) =>
    dispatch(updateProfilePicture(currentUser)),
});

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
