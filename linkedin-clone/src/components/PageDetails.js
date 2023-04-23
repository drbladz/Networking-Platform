import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';
import { collection, getDoc, getDocs, addDoc, doc, updateDoc, deleteDoc, onSnapshot, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const storage = getStorage();

const EditPostForm = ({ post, onUpdate, onClose }) => {
  const [postTitle, setPostTitle] = useState(post.postTitle);
  const [postDescription, setPostDescription] = useState(post.postDescription);
  const [postImage, setPostImage] = useState(null);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setPostImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let postImageURL = post.postImageURL;

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

    onUpdate(post.id, {
      postTitle,
      postDescription,
      postImageURL,
    });

    onClose();
  };

  return (
    <Modal>
      <ModalContent>
        <Form onSubmit={handleSubmit}>
          <h1>Edit Post</h1>
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
          <Button type="submit">Save Changes</Button>
          <Button onClick={onClose}>Cancel</Button>
        </Form>
      </ModalContent>
    </Modal>
  );
};

const PostLikes = ({ postId, userId }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const { id } = useParams();

  useEffect(() => {
    if (userId) {
      const postLikesRef = collection(doc(db, 'Pages', id), 'Posts', postId, 'Likes');

      const unsubscribe = onSnapshot(postLikesRef, (snapshot) => {
        let userLiked = false;
        let count = 0;
        snapshot.forEach((doc) => {
          if (doc.id === userId.uid) {
            userLiked = true;
          }
          count++;
        });
        setLiked(userLiked);
        setLikesCount(count);
      });

      return () => {
        unsubscribe();
      };
    }
  }, [id, postId, userId]);

  const handleLike = async () => {
    const postLikeRef = doc(doc(db, 'Pages', id), 'Posts', postId, 'Likes', userId.uid);
    if (liked) {
      await deleteDoc(postLikeRef);
    } else {
      await setDoc(postLikeRef, {});
    }
  };

  return (
    <div onClick={handleLike} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
      {liked ? <FaHeart style={{ color: 'red' }} /> : <FaRegHeart />}
      <span style={{ marginLeft: '4px' }}>{likesCount}</span>
    </div>
  );
};
















const EditPostButton = ({ onClick }) => {
  return (
    <StyledButton onClick={onClick}>
      Edit
    </StyledButton>
  );
};

const DeletePostButton = ({ onClick }) => {
  const handleClick = () => {
    if (window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      onClick();
      // Show a confirmation message
      alert("The post has been deleted successfully.");
      // Reload the page
      window.location.reload();
    }
  };
  return (
    <StyledButton style={{backgroundColor: "red"}} onClick={handleClick}>
      Delete
    </StyledButton>
  );
};

const PageDetails = () => {
  const { id } = useParams();
  const [page, setPage] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isUserPage, setIsUserPage] = useState(false);
  const userId = getAuth().currentUser;
  const [isEditing, setIsEditing] = useState(false);
  const [updatedPosts, setUpdatedPosts] = useState([]);

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

  const handlePageEdit = async (updatedPage) => {
    try {
      const pageRef = doc(db, 'Pages', id);
      await updateDoc(pageRef, updatedPage);
      setPage({ ...page, ...updatedPage });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating page:', error);
    }
  };


  const handlePageDelete = async () => {
    if (window.confirm("Are you sure you want to delete this page? This action cannot be undone.")) {
      try {
        const pageRef = doc(db, 'Pages', id);
        await deleteDoc(pageRef);
        // Show a confirmation message
        alert("The page has been deleted successfully.");
        // Redirect to the home page
        window.location.href = "/";
      } catch (error) {
        console.error('Error deleting page:', error);
      }
    }
  };

  const handlePostUpdate = async (postId, updatedPost) => {
    try {
      const postRef = doc(doc(db, 'Pages', id), 'Posts', postId);
      await updateDoc(postRef, updatedPost);
  
      const newPosts = posts.map((post) => (post.id === postId ? { ...post, ...updatedPost } : post));
      setUpdatedPosts(newPosts);
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
      {isUserPage && (
        <>
          {!isEditing && (
            <div>
              <StyledButton onClick={() => setIsEditing(true)}>Edit Page</StyledButton>
              <StyledButton style={{backgroundColor: "red"}} onClick={handlePageDelete}>Delete Page</StyledButton>
            </div>
          )}
          {isEditing && <EditPageForm page={page} onSubmit={handlePageEdit} onCancel={() => setIsEditing(false)} />}
        </>
      )}
      <PostsList
        posts={updatedPosts.length > 0 ? updatedPosts : posts}
        isUserPage={isUserPage}
        onUpdate={handlePostUpdate}
        onDelete={handlePostDelete}
      />
    </Container>
  );
};
const EditPageForm = ({ page, onSubmit, onCancel }) => {
  const [pageName, setPageName] = useState(page.pageName);
  const [pageDescription, setPageDescription] = useState(page.pageDescription);
  const [pageImage, setPageImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let updatedPage = {
      pageName,
      pageDescription,
    };

    if (pageImage) {
      const storageRef = ref(storage, `page-images/${pageImage.name}`);
      const uploadTask = uploadBytesResumable(storageRef, pageImage);

      await new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {},
          (error) => {
            console.error('Error uploading image:', error);
            reject();
          },
          async () => {
            const pageImageURL = await getDownloadURL(uploadTask.snapshot.ref);
            updatedPage.pageImageURL = pageImageURL;
            resolve();
          }
        );
      });
    }

    onSubmit(updatedPage);
  };
  return (
    <Form onSubmit={handleSubmit}>
      <h1>Edit Page</h1>
      <Input type="text" value={pageName} onChange={(e) => setPageName(e.target.value)} required />
      <Textarea value={pageDescription} onChange={(e) => setPageDescription(e.target.value)} required />
      <Input type="file" accept="image/*" onChange={(e) => setPageImage(e.target.files[0])} />
  <div>
    <Button style={{marginRight: "10px"}} type="submit">Save Changes</Button>
    <Button onClick={onCancel}>Cancel</Button>
  </div>
</Form>
);
};
const StyledButton = styled.button`
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
margin-right: 10px;
margin-top: 6px;
cursor: pointer;
transition: background-color 0.2s;

&:hover {
background-color: #0056b3;
}
`;
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
      <h1>Add a new Post</h1>
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
  const [isEditPostModalOpen, setIsEditPostModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const userId = getAuth().currentUser;

  const handleEditClick = (post) => {
    setSelectedPost(post);
    setIsEditPostModalOpen(true);
  };

  const handleEditPostModalClose = () => {
    setIsEditPostModalOpen(false);
  };
 return (
    <PostListContainer>
      {posts.map((post) => (
        <Post key={post.id}>
          <PostHeader style={{ textAlign: 'center' }}>
            <h2 style={{ textAlign: 'center' }}>{post.postTitle}</h2>
          </PostHeader>
          <PostContent>
            <PostDescription>{post.postDescription}</PostDescription>
            {post.postImageURL && <PostImage src={post.postImageURL} alt={post.postTitle} />}
          </PostContent>
          <PostActions>
            <PostLikes postId={post.id} userId={userId} />
            {isUserPage && (
              <>
                <EditPostButton onClick={() => handleEditClick(post)} />
                <DeletePostButton onClick={() => onDelete(post.id)} />
              </>
            )}
          </PostActions>
        </Post>
      ))}
      {isEditPostModalOpen && (
        <EditPostForm
          post={selectedPost}
          onUpdate={onUpdate}
          onClose={handleEditPostModalClose}
        />
      )}
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
const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;
const ModalContent = styled.div`
  background-color: #ffffff;
  padding: 20px;
  border-radius: 4px;
  width: 80%;
  max-width: 500px;
`;
export default PageDetails;