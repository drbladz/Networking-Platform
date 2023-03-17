import styled from "styled-components";
import { useEffect, useState } from "react";
import { createJobPosting, deleteJobPosting, editJobPosting } from "../actions"; 
import { connect } from "react-redux";

const EditPostModal = (props) =>{
  console.log(props)
  const [postTitle, setPostTitle] = useState(props.job.postTitle)
  const [postDescription, setPostDescription] = useState(props.job.postDescription)
  const [mandatoryResume, setMandatoryResume] = useState(props.job.mandatoryResume);
  const [mandatoryCoverLetter, setMandatoryCoverLetter] = useState(props.job.mandatoryCoverLetter);
  const [isExternal, setIsExternal] = useState(props.job.isExternal)

  useEffect(() => {
    setPostTitle(props.job.postTitle)
    setPostDescription(props.job.postDescription)
    setMandatoryResume(props.job.mandatoryResume)
    setMandatoryCoverLetter(props.job.mandatoryCoverLetter)
    setIsExternal(props.job.isExternal)
  }, [props])

  const reset = () =>{
    props.handleClick()
  }
  
  return(
  <>
  {console.log(postTitle)}
  { props.showEditPostModal && (
   <Container>
      <Content>
        <Header>
          <h2>{`Edit ${props.job.postTitle}`}</h2>
          <button onClick={reset}>
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
          value={postTitle}
          type="text"
          placeholder={postTitle}
          onChange={(e) => setPostTitle(e.target.value)}/>
          <textarea
          value={postDescription}
          placeholder={postDescription}
          onChange={(e) => setPostDescription(e.target.value)}/>



          </Editor>
          <div>
            <h3>Required Documents (If Applicable)</h3>
            <label>
              <input type="checkbox" checked={mandatoryResume} onChange={() => setMandatoryResume(!mandatoryResume)} />
                Resume
            </label>
            <label>
              <input type="checkbox" checked={mandatoryCoverLetter} onChange={() => setMandatoryCoverLetter(!mandatoryCoverLetter)} />
                Cover Letter
            </label>
            <label>
              <input type="checkbox" checked={isExternal} onChange={() =>  setIsExternal(!isExternal)} />
                Is External
            </label>
          </div>
        </SharedContent>
        <SharedCreation>
          <EditButton onClick={()=>{
        
            props.editJobPosting({
              displayName: props.job.displayName,
              id: props.job.id,
              mandatoryCoverLetter: mandatoryCoverLetter,
              mandatoryResume: mandatoryResume,
              isExternal: isExternal,
              photoURL: props.user.photoURL,
              postDescription: postDescription,
              postTitle: postTitle,
              timeStamp: props.job.timeStamp,
              userId: props.job.userId
            },
            props.jobPostings)
            reset()
            }}>
            Apply Change
          </EditButton>
          <DeleteButton onClick={()=>{
        
        props.deleteJobPosting(props.job.id, props.job.userId ,props.jobPostings)
        reset()
        }} >Delete Post</DeleteButton>
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
  createJobPosting: (userId, postTitle, postDescription, currentPostingsList, userPhotoURL,displayName, mandatoryResume, mandatoryCoverLetter) => dispatch(createJobPosting(userId, postTitle, postDescription, currentPostingsList, userPhotoURL,displayName, mandatoryResume, mandatoryCoverLetter)),
  editJobPosting: (editedJobData, currentPostingsList) => dispatch(editJobPosting(editedJobData, currentPostingsList)),
  deleteJobPosting: (jobPostingId, userId ,currentPostingsList) => dispatch(deleteJobPosting(jobPostingId, userId , currentPostingsList)) 
})

export default connect(mapStateToProps, mapDispatchToProps)(EditPostModal)

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
  align-items: row;
  justify-content: space-between;
  padding: 12px 24px 12px 16px;
  `

  const EditButton = styled.div`
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

  const DeleteButton = styled.div`
  min-width: 60px;
  border-radius: 20px;
  padding-left: 16px;
  padding-right: 16px;
  background: red;
  color: white;
  `;

  const Editor = styled.div`
    display: flex;
    align-items: column;`