import React from 'react'
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

const UserProfile = () => {
    const location = useLocation();
  return (
    <Container><h1>{location.state.displayName}</h1></Container>
  )
}

const Container = styled.div`
  padding-top: 72px;
  max-width: 100%;
`;

export default UserProfile