import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {db} from '../firebase';
import { getAuth } from 'firebase/auth';
import { collection, getDocs} from 'firebase/firestore';

const Pages = () => {
  const [myPages, setMyPages] = useState([]);
  const [allPages, setAllPages] = useState([]);

  // Replace this with the actual user ID
  const userId = getAuth().currentUser;

  useEffect(() => {
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
  }, [userId]);

  return (
    <Container>
      <h1>Pages</h1>

      <Section>
        <h2>My Pages</h2>
        <PageList>
          {myPages.map((page) => (
            <PageItem key={page.id}>{page.pageName}</PageItem>
          ))}
        </PageList>
      </Section>

      <Section>
        <h2>All Pages</h2>
        <PageList>
          {allPages.map((page) => (
            <PageItem key={page.id}>{page.pageName}</PageItem>
          ))}
        </PageList>
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

const PageList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const PageItem = styled.li`
  margin-bottom: 10px;
`;

export default Pages;