import styled from "styled-components";
import { removeConnectionById } from "../actions";
import { connect } from "react-redux";

const UpdateConnections = (props) => {
  return (
    <ConnectionsContainer>
      <ConnectionsHeader>Connections</ConnectionsHeader>
      <ConnectionsList>
        {props.user && props.user.connections.map((connection) => (
          <ConnectionItem key={connection.id}>
            {connection.photoURL ? <ConnectionPhoto src={connection.photoURL} alt=""/> : <ConnectionPhoto src="/images/user.svg" alt=""/>}
            <ConnectionName>{connection.name}</ConnectionName>
            <DeleteButton onClick={() => {
              props.removeConnectionById(connection.id);
            }}>
              Delete
            </DeleteButton>
          </ConnectionItem>
        ))}
      </ConnectionsList>
    </ConnectionsContainer>
  );
};

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

const ConnectionPhoto = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
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

const mapStateToProps = (state) =>{
  return {
    user: state.userState.user
  }
}

const mapDispatchToProps = (dispatch) => ({
  removeConnectionById: (id) => dispatch(removeConnectionById(id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(UpdateConnections)
