import styled from "styled-components";
import { useState } from "react";
import { createJobPosting } from "../actions"; 
import { connect } from "react-redux";

const PostModal = (props) =>{
  console.log(props.jobPostings)
  const [postTitle, setPostTitle] = useState("")
  const [postDescription, setPostDescription] = useState("")
  const [mandatoryResume, setMandatoryResume] = useState(false);
  const [mandatoryCoverLetter, setMandatoryCoverLetter] = useState(false);
  const reset = (e)=>{
    setPostDescription("")
    setPostTitle("")
    props.handleClick(e)
  }
  
  return(
  <>
  { props.showModal === "open" && (
   <Container>
      <Content>
        <Header>
          <h2>Create Job Posting</h2>
          <button onClick={(e) => reset(e)}>
            <img src="/images/close-icon.svg"/>
          </button>
        </Header>
        <SharedContent>
          <UserInfo>
           {props.user && props.user.photoURL ? <img src={props.user.photoURL}/>
           : <img src="/images/user.svg"/>}
           {props.user && props.user.displayName ? <span>{props.user.displayName}</span>
           : <span>User</span> }
          </UserInfo>
          <Editor>
          <input 
          type="text"
          placeholder="Title"
          onChange={(e) => setPostTitle(e.target.value)}/>
          <textarea
          value={postDescription}
          placeholder="Job Description"
          onChange={(e) => setPostDescription(e.target.value)}/>



          </Editor>
          <div>
            <label>
              <input type="checkbox" checked={mandatoryResume} onChange={() => setMandatoryResume(!mandatoryResume)} />
                Resume
            </label>
            <label>
              <input type="checkbox" checked={mandatoryCoverLetter} onChange={() => setMandatoryCoverLetter(!mandatoryCoverLetter)} />
                Cover Letter
            </label>
          </div>
        </SharedContent>
        <SharedCreation>
          <PostButton onClick={(e)=>{
            props.createJobPosting(props.user.userId, postTitle, postDescription, props.jobPostings,props.user.photoURL, props.user.displayName, mandatoryResume, mandatoryCoverLetter)
            reset(e)
            }}>
            Post
          </PostButton>
        </SharedCreation>
      </Content>
    </Container>)
}
  </>)
}

const mapStateToProps = (state) => {
  return {
    user: state.userState.user,
    jobPostings: state.jobPostingsState.jobPostings
  }
}

const mapDispatchToProps = (dispatch) => ({
  createJobPosting: (userId, postTitle, postDescription, currentPostingsList, userPhotoURL,displayName, mandatoryResume, mandatoryCoverLetter) => dispatch(createJobPosting(userId, postTitle, postDescription, currentPostingsList, userPhotoURL,displayName, mandatoryResume, mandatoryCoverLetter))
})

export default connect(mapStateToProps, mapDispatchToProps)(PostModal)

const Container = styled.div`
position: fixed;
top: 0;
left: 0;
right: 0;
bottom: 0;
z-index: 9999;
color: black;
background-color: rgba(0, 0, 0, 0.8);
`;

const Content = styled.div`
width: 100%;
max-width: 552px;
background-color: white;
max-height: 90%;
overflow: initial;
border-radius: 5px;
position: relative;
display: flex;
flex-direction: column;
top: 32px;
margin: 0 auto;
`;
const Header = styled.div`
display: block;
padding: 16px 20px;
border-bottom: 1px solid rgba(0, 0, 0, 0.15);
font-size: 16px;
line-height: 1.5;
color: rgba(0, 0, 0, 0.6);
font-weight: 400;
display: flex;
justify-content: space-between;
align-items: center;
button {
  height: 40px;
  width: 40px;
  min-width: auto;
  color: rgba(0, 0, 0, 0.15);
  svg, img {
  pointer-events: none;
  }
}
`;

const SharedContent = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow-y: auto;
  vertical-align: baseline;
  background: transparent;
  padding: 8px 12px;
  `;

const UserInfo =  styled.div`
  display: flex;
  align-items: center;
  padding: 12px 24px;
  svg,
  img {
    width: 48px;
    height: 48px;
    background-clip: content-box;
    border: 2px solid transparent;
    border-radius: 50%;
  }
  span {
    font-weight: 600;
    font-size:16px;
    line-height: 1.5;
    margin-left: 5px
  }
`;

const SharedCreation = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 24px 12px 16px;
  `

  const PostButton = styled.div`
  min-width: 60px;
  border-radius: 20px;
  padding-left: 16px;
  padding-right: 16px;
  background: #0a66c2;
  color: white;
  &:hover {
    background: #004182
  }
  `;

  const Editor = styled.div`
    display: flex;
    align-items: column;`