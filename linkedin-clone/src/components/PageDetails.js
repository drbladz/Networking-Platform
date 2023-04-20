import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';
import { collection, getDoc, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
const storage = getStorage();
const PageDetails = () => {
  const { id } = useParams();
  const [page, setPage] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isUserPage, setIsUserPage] = useState(false);
  const userId = getAuth().currentUser;



  useEffect(() => {
    const fetchPageDetails = async () => {
      try {
        const pageRef = doc(db, 'Pages', id);
        const pageSnapshot = await getDoc(pageRef);
        if (!pageSnapshot.exists()) {
          console.error('Page not found');
          return;
        }

        const pageData = {
          id: pageSnapshot.id,
          ...pageSnapshot.data(),
        };

        setPage(pageData);
        setIsUserPage(pageData.pageOwnerId === userId.uid);

        console.log('Page datAAAAAAAAAAAAAAAAAAAAA:', pageData);

        const postsRef = collection(pageRef, 'Posts');
        const postsSnapshot = await getDoc(postsRef);
        const postsData = postsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPosts(postsData);
      } catch (error) {
        console.error('Error fetching page details:', error);
      }
    };

    fetchPageDetails();
  }, [id, userId]);

  const handlePostSubmit = async (newPost) => {
    try {
      const postsRef = collection(doc(db, 'Pages', id), 'Posts');
      await addDoc(postsRef, newPost);
    } catch (error) {
      console.error('Error adding post:', error);
    }
  };

  const handlePostUpdate = async (postId, updatedPost) => {
    try {
      const postRef = doc(doc(db, 'Pages', id), 'Posts', postId);
      await updateDoc(postRef, updatedPost);
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handlePostDelete = async (postId) => {
    try {
      const postRef = doc(doc(db, 'Pages', id), 'Posts', postId);
      await deleteDoc(postRef);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  if (!page) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <h1>{page.pageName}</h1>
      <p>{page.pageDescription}</p>

      {isUserPage && <NewPostForm onSubmit={handlePostSubmit} />}

      {/* <PostsList
        posts={posts}
        isUserPage={isUserPage}
        onUpdate={handlePostUpdate}
        onDelete={handlePostDelete}
      /> */}
    </Container>
  );
};

// Add your NewPostForm component implementation here
const NewPostForm = ({ onSubmit }) => {
  const [postTitle, setPostTitle] = useState('');
  const [postDescription, setPostDescription] = useState('');
  const [postImage, setPostImage] = useState(null);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setPostImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let postImageURL = '';

    if (postImage) {
      const storageRef = ref(storage, `post-images/${postImage.name}`);
      const uploadTask = uploadBytesResumable(storageRef, postImage);

      await new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {},
          (error) => {
            console.error('Error uploading image:', error);
            reject();
          },
          async () => {
            postImageURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve();
          }
        );
      });
    }

    onSubmit({
      postTitle,
      postDescription,
      postImageURL,
      postTime: new Date().toISOString(),
    });

    setPostTitle('');
    setPostDescription('');
    setPostImage(null);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h1>PAGE</h1>
      <Input
        type="text"
        placeholder="Post Title"
        value={postTitle}
        onChange={(e) => setPostTitle(e.target.value)}
      />
      <Textarea
        placeholder="Post Description"
        value={postDescription}
        onChange={(e) => setPostDescription(e.target.value)}
      />
      <Input type="file" accept="image/*" onChange={handleImageChange} />
      <Button type="submit">Add Post</Button>
    </Form>
  );
};

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Input = styled.input`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 14px;
`;

const Textarea = styled.textarea`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 14px;
  resize: vertical;
`;

const Button = styled.button`
  background-color: #0d6efd;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0056b3;
  }
`;
// Add your PostsList component implementation here

const Container = styled.div`
  padding: 50px;
`;

export default PageDetails;