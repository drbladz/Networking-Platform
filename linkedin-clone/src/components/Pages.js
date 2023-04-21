import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {db} from '../firebase';
import { getAuth } from 'firebase/auth';
import { collection, getDocs} from 'firebase/firestore';
import { Link } from 'react-router-dom';

const Pages = () => {
  const [myPages, setMyPages] = useState([]);
  const [allPages, setAllPages] = useState([]);

  const userId = getAuth().currentUser;

  useEffect(() => {
    if(userId) {
      const fetchPages = async () => {
        try {
          const pagesRef = collection(db, 'Pages');
          const pagesSnapshot = await getDocs(pagesRef);
          const pagesData = pagesSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
  
          const myPagesData = pagesData.filter((page) => page.pageOwnerId === userId.uid);
          const allPagesData = pagesData.filter((page) => page.pageOwnerId !== userId.uid);
  
          setMyPages(myPagesData);
          setAllPages(allPagesData);
        } catch (error) {
          console.error("Error fetching pages:", error);
        }
      };
      fetchPages();
    }


   
  }, [userId]);

  return (
    <Container>
      {/* <h1>Pages</h1> */}

      <Section>
        <h2>My Pages</h2>
        <Row>
          {myPages.map((page) => (
            <Card key={page.id}>
              <PageImage src={page.pageImageURL || "/images/default-page-image.jpg"} alt="Page" />
              <h3 className="notranslate">{page.pageName}</h3>
              <Link to={`/page/${page.id}`} style={{ textDecoration: "none" }}>
                <Button>Visit Page</Button>
              </Link>
            </Card>
          ))}
        </Row>
      </Section>

      <Section>
        <h2>All Pages</h2>
        <Row>
          {allPages.map((page) => (
            <Card key={page.id}>
              <PageImage src={page.pageImageURL || "./images/default-page-image.jpg"} alt="Page" />
              <h3 className="notranslate">{page.pageName}</h3>
              <Link to={`/page/${page.id}`} style={{ textDecoration: "none" }}>
                <Button>Visit Page</Button>
              </Link>
            </Card>
          ))}
        </Row>
      </Section>
    </Container>
  );
};

const Container = styled.div`
  padding: 50px;
`;

const Section = styled.div`
  margin-bottom: 30px;
`;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
`;

const Card = styled.div`
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 200px;
`;

const PageImage = styled.img`
  height: 100px;
  width: 100px;
  object-fit: cover;
  border-radius: 50%;
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
  margin-top: 10px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0056b3;
  }
`;

export default Pages;