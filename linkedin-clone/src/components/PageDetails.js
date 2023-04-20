import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';
import { collection, getDoc,getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
const storage = getStorage();
const PageDetails = () => {
  const { id } = useParams();
  const [page, setPage] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isUserPage, setIsUserPage] = useState(false);
  const userId = getAuth().currentUser;



  useEffect(() => {
    if (userId) {
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
  
          console.log('Page data:', pageData);
  
          const postsRef = collection(pageRef, 'Posts');
          const postsSnapshot = await getDocs(postsRef);
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
    }
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
      {page.pageImageURL && <PageImage src={page.pageImageURL} alt={page.pageName} />}
      <PageTitle>{page.pageName}</PageTitle>
      <PageDescription>{page.pageDescription}</PageDescription>

      {isUserPage && <NewPostForm onSubmit={handlePostSubmit} />}

      <PostsList
        posts={posts}
        isUserPage={isUserPage}
        onUpdate={handlePostUpdate}
        onDelete={handlePostDelete}
      />
    </Container>
  );
};

// NewPostForm component implementation
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
        required
      />
      <Textarea
        placeholder="Post Description"
        value={postDescription}
        onChange={(e) => setPostDescription(e.target.value)}
        required
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
  width: 50%;
  margin: 0 auto;
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
// PostsList component implementation
const PostsList = ({ posts, isUserPage, onUpdate, onDelete }) => {
  return (
    <PostListContainer>
      {posts.map((post) => (
        <Post key={post.id}>
          <PostHeader style={{textAlign: "center"}}>
            <h2 style={{textAlign: "center"}}>{post.postTitle}</h2>
          </PostHeader>
          <PostContent>
            <PostDescription >{post.postDescription}</PostDescription>
            {post.postImageURL && <PostImage src={post.postImageURL} alt={post.postTitle} />}
          </PostContent>
          {isUserPage && (
            <PostActions>
              {/* Add your update and delete buttons here */}
            </PostActions>
          )}
        </Post>
      ))}
    </PostListContainer>
  );
};
const Container = styled.div`
  padding: 50px;
  text-align: center;
`;

const PageImage = styled.img`
  // border-radius: 50%;
  width: 150px;
  height: 150px;
  object-fit: cover;
  margin-bottom: 20px;
`;

const PageTitle = styled.h1`
  font-size: 2.2rem;
  margin-bottom: 10px;
`;

const PageDescription = styled.p`
  font-size: 1.3rem;
  margin-bottom: 30px;
  
`;

const PostListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 15px;
`;

const Post = styled.div`
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 16px;
  
`;

const PostHeader = styled.div`
  display: flex;
  justify-content: center;
  font-size: 1.5rem;
  
`;

const PostContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  
`;

const PostDescription = styled.p`
  margin: 0;
  font-size: 1.2rem;
  text-align: start
`;

const PostImage = styled.img`
  max-width: 100%;
  max-height: 300px;
  min-width: 300px; 
  min-height: 100px; 
  object-fit: contain;
`;

const PostActions = styled.div`
  display: flex;
  gap: 8px;
`;
export default PageDetails;