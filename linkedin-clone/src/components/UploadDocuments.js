import { storage, db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import {
  ref,
  uploadBytes,
  listAll,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { useState, useEffect } from "react";
import { updateDocuments } from "../actions";

/*
import { updateDocuments } from "../actions";
import { connect } from "react-redux";
*/
import styled from "styled-components";

const UploadDocuments = (props) => {
  const [selectedResume, setSelectedResume] = useState(null);
  const [selectedCoverLetter, setSelectedCoverLetter] = useState(null);

  const [resumeList, setResumeList] = useState([]);
  const resumeListRef = ref(storage, `${props.userId}/storedUserResume/`);

  const [coverLetterList, setCoverLetterList] = useState([]);
  const coverLetterListRef = ref(
    storage,
    `${props.userId}/storedUserCoverLetter/`
  );

  const uploadResume = async () => {
    if (!selectedResume) return;
    const resumeFolderRef = ref(
      storage,
      `${props.userId}/storedUserResume/${selectedResume.name}`
    );
    try {
      await uploadBytes(resumeFolderRef, selectedResume);
      const resumeUrl = await getDownloadURL(resumeFolderRef);

      // Update user document with resumeURL
      const userDocumentRef = doc(db, `Users/${props.userId}`);
      await updateDoc(userDocumentRef, {
        resumeURL: resumeUrl,
      });
      /*
      props.user.resumeURL = resumeUrl;

      const updatedUser = {};
      for (let property in props.user) {
        updatedUser[property] = props.user[property];
      }
      props.updateDocuments(updatedUser);
      */
    } catch (err) {
      console.error(err);
    }
  };

  const uploadCoverLetter = async () => {
    if (!selectedCoverLetter) return;
    const coverLetterFolderRef = ref(
      storage,
      `${props.userId}/storedUserCoverLetter/${selectedCoverLetter.name}`
    );

    try {
      await uploadBytes(coverLetterFolderRef, selectedCoverLetter);

      const letterUrl = await getDownloadURL(coverLetterFolderRef);

      // Update user document with coverLetterURL
      const userDocumentRef = doc(db, `Users/${props.userId}`);
      await updateDoc(userDocumentRef, {
        coverLetterURL: letterUrl,
      });
      /*
      props.user.coverLetterURL = letterUrl;
      const updatedUser = {};
      for (let property in props.user) {
        updatedUser[property] = props.user[property];
      }
      props.updateDocuments(updatedUser);
      */
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    console.log("single");
    listAll(resumeListRef).then((response) => {
      if (response.items.length === 0) {
        return; // handle the case where the list is empty
      }
      const resumeItem = response.items[response.items.length - 1];
      getDownloadURL(resumeItem).then((url) => {
        const resumeName = resumeItem.name;
        setResumeList([resumeName]);
      });
    });

    listAll(coverLetterListRef).then((response) => {
      if (response.items.length === 0) {
        return; // handle the case where the list is empty
      }
      const letterItem = response.items[response.items.length - 1];
      getDownloadURL(letterItem).then((url) => {
        const letterName = letterItem.name;
        setCoverLetterList([letterName]);
      });
    });
  }, []);

  const deleteResume = async (resumeName) => {
    const resumeFolderRef = ref(
      storage,
      `${props.userId}/storedUserResume/${resumeName}`
    );

    try {
      // Delete file from storage
      await deleteObject(resumeFolderRef);

      // Remove deleted file from the resume list
      setResumeList((prev) => prev.filter((name) => name !== resumeName));

      // Remove resumeURL from user document
      const userDocumentRef = doc(db, `Users/${props.userId}`);
      await updateDoc(userDocumentRef, {
        resumeURL: "",
      });
    } catch (err) {
      console.error(err);
    }
  };

  const deleteCoverLetter = async (letterName) => {
    const coverLetterFolderRef = ref(
      storage,
      `${props.userId}/storedUserCoverLetter/${letterName}`
    );

    try {
      // Delete file from storage
      await deleteObject(coverLetterFolderRef);

      // Remove deleted file from the cover letter list
      setCoverLetterList((prev) => prev.filter((name) => name !== letterName));

      // Remove coverLetterURL from user document
      const userDocumentRef = doc(db, `Users/${props.userId}`);
      await updateDoc(userDocumentRef, {
        coverLetterURL: "",
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DocumentTable>
      <h1>MY DOCUMENTS</h1>
      <div>
        <label>Resume</label>
        <input
          type="file"
          onChange={(e) => setSelectedResume(e.target.files[0])}
        />
        <button onClick={uploadResume}>Upload</button>
      </div>

      <div>
        <label>Cover Letter</label>
        <input
          type="file"
          onChange={(e) => setSelectedCoverLetter(e.target.files[0])}
        />
        <button onClick={uploadCoverLetter}>Upload</button>
      </div>

      <table>
        <tbody>
          {resumeList.map((resumeName, index) => {
            return (
              <tr key={index}>
                <td>Resume</td>
                <td>{resumeName}</td>
                <td>
                  <button onClick={() => deleteResume(resumeName)}>
                    Delete Resume
                  </button>
                </td>
              </tr>
            );
          })}
          {coverLetterList.map((letterName, index) => {
            return (
              <tr key={index}>
                <td>Cover Letter</td>
                <td>{letterName}</td>
                <td>
                  <button onClick={() => deleteCoverLetter(letterName)}>
                    Delete Cover Letter
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </DocumentTable>
  );
};

/*
const mapStateToProps = (state) => {
  return {
    user: state.userState.user,
  };
};

const mapDispatchToProps = (dispatch) => ({
  updateDocuments: (currentUser) => dispatch(updateDocuments(currentUser)),
});
*/

export default UploadDocuments;

const DocumentTable = styled.div`
  div {
    text-align: center;
  }
  h1 {
    font-size: 30px;
    text-align: center;
    text-decoration: underline;
    color: #257cd3;
    padding-bottom: 60px;
  }
  table {
    border-collapse: collapse;
    width: 100%;
    margin-top: 16px;

    th,
    td {
      border: 1px solid black;
      padding: 8px;
      text-align: center;
    }

    tbody tr:nth-child(even) {
      background-color: #f2f2f2;
    }

    td:first-child {
      font-weight: bold;
    }
  }
`;
