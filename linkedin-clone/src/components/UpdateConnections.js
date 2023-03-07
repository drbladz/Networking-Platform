import styled from "styled-components";
import { useState } from "react";

const UpdateConnections = () => {
  const [connections, setConnections] = useState([
    { id: 1, name: "Momo" },
    { id: 2, name: "Diane" },
  ]);

  const handleDeleteConnection = (id) => {
    setConnections((prevConnections) =>
      prevConnections.filter((connection) => connection.id !== id)
    );
  };

  return (
    <ConnectionsContainer>
      <ConnectionsHeader>Connections</ConnectionsHeader>
      <ConnectionsList>
        {connections.map((connection) => (
          <ConnectionItem key={connection.id}>
            <ConnectionName>{connection.name}</ConnectionName>
            <DeleteButton onClick={() => handleDeleteConnection(connection.id)}>
              Delete
            </DeleteButton>
          </ConnectionItem>
        ))}
      </ConnectionsList>
    </ConnectionsContainer>
  );
};

export default UpdateConnections;

const ConnectionsContainer = styled.div`
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  padding: 16px;
  margin-top: 16px;
`;

const ConnectionsHeader = styled.h3`
  font-size: 20px;
  margin-bottom: 16px;
`;

const ConnectionsList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const ConnectionItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #ccc;

  &:last-of-type {
    border-bottom: none;
  }
`;

const ConnectionName = styled.p`
  margin: 0;
  font-size: 16px;
`;

const DeleteButton = styled.button`
  background-color: #f44336;
  color: #fff;
  border: none;
  padding: 8px 16px;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #d32f2f;
  }

  &:active {
    background-color: #b71c1c;
  }
`;
