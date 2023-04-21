import styled from "styled-components";
import { getAllJobPostings, savePost, unsavePost } from "../actions";
import { connect } from "react-redux";
import PostModal from "./PostModal";
import EditPostModal from "./EditPostModal";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { useEffect } from "react";
import { Link} from "react-router-dom";
import "./translate.css"
const Main = (props) => {

  const googleTranslateElementInit = () => {
    new window.google.translate.TranslateElement(
      {
        pageLanguage: "en",
        autoDisplay: false
        
      },
      "google_translate_element"
    );
  };




  const [showModal, setShowModal] = useState("close");
  const [showEditPostModal, setShowEditPostModal] = useState(false);
  const [showMyJobs, setShowMyJobs] = useState(false);
  const [view, setView] = useState("feedJobs");
  const [jobToEdit, setJobToEdit] = useState({});
  const handleClick = (e) => {
    console.log("herrr");
    e.preventDefault();
    if (e.target !== e.currentTarget) {
      return;
    }
    switch (showModal) {
      case "open":
        setShowModal("close");
        break;
      case "close":
        setShowModal("open");
        break;
      default:
        setShowModal("close");
        break;
    }
  };

  const handleJobEditOpen = (job) => {
    setJobToEdit(job);
    setShowEditPostModal(true);
  };

  const handleJobEditClose = () => {
    console.log("close");
    setJobToEdit({});
    setShowEditPostModal(false);
  };
  console.log(props.userJobPostings);

  const history = useHistory();

  // const handleApply = (jobPostingId) => {
  //   history.push(`/job-posting/${jobPostingId}`);
  // };
  useEffect(() => {
    var addScript = document.createElement("script");
    addScript.setAttribute(
      "src",
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
    );
    document.body.appendChild(addScript);
    window.googleTranslateElementInit = googleTranslateElementInit;
  }, []);



  return (
    <Container>
      
      <button onClick={() => setView("feedJobs") }>Job List</button>
      <button onClick={() => setView("userJobs")}>My Job Postings</button>
      <button onClick={() => setView("savedJobs")}>Saved Jobs</button>
      <Sharebox>
        <div>
          {props.user && props.user.photoURL ? (
            <img src={props.user.photoURL} referrerPolicy="no-referrer" />
          ) : (
            <img src="/images/user.svg" alt="" />
          )}
          <button onClick={handleClick}>Post Job</button>
        </div>
      </Sharebox>
      {view == "feedJobs" ? (
        <div>
          <Articles>
            {props.jobPostings ? (
              props.jobPostings
                .filter((job) => !job.groupId)
                .map((job) => {
                  let saved = [];
                  if (props.user && props.user.savedJobs) {
                    saved = props.user.savedJobs.find(
                      (savedJob) => savedJob == job.id
                    );
                  }
                  return (
                    <div key={job.id}>
                      <SharedActor>
                        <a>
                          {job.photoURL ? (
                            <img src={job.photoURL} />
                          ) : (
                            <img src="/images/user.svg" />
                          )}
                          <div>
                            <span>{job.postTitle}</span>
                            <span className="notranslate">{job.displayName}</span>
                            <span>{Date(job.timeStamp)}</span>
                          </div>
                        </a>
                        {saved ? (
                          <BsBookmarkFill
                            onClick={() => {
                              props.handleUnsavePost(job.id, props.user);
                            }}
                          />
                        ) : (
                          <BsBookmark
                            onClick={() => {
                              props.handleSavePost(job.id, props.user);
                            }}
                          />
                        )}
                      </SharedActor>
                      <Description>
                        {job.isExternal
                          ? "Be redirected with the Apply button !"
                          : job.postDescription}
                      </Description>
                      {/*
                  <SocialCounts>
                    <button>
                      <a>44 Applicants</a>
              </button> 
                  </SocialCounts> */}
                      <SocialActions>
                        {/* <button onClick={() => handleApply(job.id)}>

          </button> */}
                        {job.isExternal ? (
                          <a href={`${job.postDescription}`} target="_blank">
                            <button>
                              <img src="/images/apply.svg" />
                              <span>Apply!</span>
                            </button>
                          </a>
                        ) : (
                          <Link to={`/job-posting/${job.id}`} >
                            <button>
                              <img src="/images/apply.svg" />
                              <span>Apply!</span>
                            </button>
                          </Link>
                        )}
                      </SocialActions>
                    </div>
                  );
                })
            ) : (
              <>None</>
            )}
          </Articles>
        </div>
      ) : view == "userJobs" ? (
        <div>
          <Articles>
            {props.userJobPostings ? (
              props.userJobPostings
                .filter((job) => !job.groupId)
                .map((job) => {
                  return (
                    <div key={job.id}>
                      <SharedActor>
                        <a>
                          <img src={job.photoURL} />
                          <div>
                            <span>{job.postTitle}</span>
                            <span className="notranslate">{job.displayName}</span>
                            <span>{Date(job.timeStamp)}</span>
                          </div>
                        </a>
                        <button onClick={() => handleJobEditOpen(job)}>
                          <img src="/images/ellipsis.svg" />
                        </button>
                      </SharedActor>
                      <Description>
                        {/* {" "} */}
                        {job.isExternal && (
                          <a href={`${job.postDescription}`} target="_blank">
                            Go to external job
                          </a>
                        )}
                      </Description>
                      {/*
                  <SocialCounts>
                    <button>
                      <a>44 Applicants</a>
              </button> 
                  </SocialCounts> */}
                      <SocialActions>
                        {/* <button onClick={() => handleApply(job.id)}>

          </button> */}
                        {!job.isExternal && (
                          <Link to={`/job-applications/job/${job.id}`}>
                            <button>
                              <span>View Applications</span>
                            </button>
                          </Link>
                        )}
                      </SocialActions>
                    </div>
                  );
                })
            ) : (
              <>None</>
            )}
          </Articles>
        </div>
      ) : (
        <div>
          <Articles>
            {props.user.savedJobs ? (
              props.user.savedJobs.map((savedJob) => {
                const post = props.jobPostings.find((postEle) => {
                  if (postEle.id == savedJob) {
                    console.log(postEle);
                  }
                  return postEle.id == savedJob;
                });
                console.log(savedJob);
                if (typeof post == "undefined") {
                  return;
                }
                return (
                  <div key={savedJob.id}>
                    <SharedActor>
                      <a>
                        <img src={post.photoURL} />
                        <div>
                          <span>{post.postTitle}</span>
                          <span className="notranslate">{post.displayName}</span>
                          <span>{Date(post.timeStamp)}</span>
                        </div>
                      </a>
                      {
                        <BsBookmarkFill
                          onClick={() => {
                            props.handleUnsavePost(post.id, props.user);
                          }}
                        />
                      }
                    </SharedActor>
                    <Description>
                      {post.isExternal
                        ? "Be redirected with the Apply button !"
                        : post.postDescription}
                    </Description>
                    {/*
                  <SocialCounts>
                    <button>
                      <a>44 Applicants</a>
              </button> 
                  </SocialCounts> */}
                    <SocialActions>
                      {/* <button onClick={() => handleApply(job.id)}>

          </button> */}
                      {post.isExternal ? (
                        <a href={`${post.postDescription}`} target="_blank" >
                          <button>
                            <img src="/images/apply.svg" />
                            <span>Apply!</span>
                          </button>
                        </a>
                      ) : (
                        <Link to={`/job-posting/${post.id}`}>  
                          <button>
                            <img src="/images/apply.svg" />
                            <span>Apply!</span>
                          </button>
                        </Link>
                      )}
                    </SocialActions>
                  </div>
                );
              })
            ) : (
              <>None</>
            )}
          </Articles>
        </div>
      )}

      <PostModal showModal={showModal} handleClick={handleClick} />
      <EditPostModal
        job={jobToEdit}
        showEditPostModal={showEditPostModal}
        handleClick={handleJobEditClose}
      ></EditPostModal>
    </Container>
  );
};

const Container = styled.div`
  grid-area: main;
`;

const CommonCard = styled.div`
  text-align: center;
  overflow: hidden;
  margin-bottom: 8px;
  background-color: #fff;
  border-radius: 5px;
  position: relative;
  border: none;
  box-shadow: 0 0 0 1px rgb(0 0 0 / 15%), 0 0 0 rgb(0 0 0 / 20%);
`;

const Sharebox = styled(CommonCard)`
  display: flex;
  flex-direction: column;
  color: #958b7b;
  margin: 0 0 8px;
  background: white;
  div {
    button {
      outline: none;
      color: rgba(0, 0, 0, 0.6);
      font-size: 14px;
      line-height: 1.5;
      min-height: 48px;
      background: transparent;
      border: none;
      display: flex;
      align-items: center;
      font-weight: 600;
    }
    &:first-child {
      display: flex;
      align-items: center;
      padding: 8px 16px 0px 16px;
      img {
        width: 48px;
        border-radius: 50%;
        margin-right: 8px;
      }
      button {
        margin: 4px 0;
        flex-grow: 1;
        border-radius: 35px;
        padding-left: 16px;
        border: 1px solid rgba(0, 0, 0, 0.15);
        background-color: white;
        text-align: left;
      }
    }
  }
`;

const Articles = styled(CommonCard)`
  padding: 0;
  margin: 0 0 8px;
  overflow: visible;
`;
const SharedActor = styled.div`
  padding-right: 40px;
  flex-wrap: nowrap;
  padding: 12px 16px 0;
  margin-bottom: 8px;
  align-items: center;
  display: flex;
  a {
    margin-right: 12px;
    flex-grow: 1;
    overflow: hidden;
    display: flex;
    text-decoration: none;

    img {
      width: 48px;
      height: 48px;
      border-radius: 50%;
    }
    & > div {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      flex-basis: 0;
      margin-left: 8px;
      overflow: hidden;
      span {
        text-align: left;
        &:first-child {
          font-size: 14px;
          font-weight: 700;
          color: rgba(0, 0, 0, 1);
        }
        &:nth-child(n + 1) {
          font-size: 12px;
          color: rgba(0, 0, 0, 0.6);
        }
      }
    }
  }
  button {
    right: 12px;
    top: 0;
    background: transparent;
    border: none;
    outline: none;
  }
`;

const Description = styled.div`
  padding: 0 16px;
  overflow: hidden;
  color: rgba(0, 0, 0, 0.9);
  font-size: 14px;
  text-align: left;
`;

const SocialCounts = styled.div`
  line-height: 1.3;
  display: flex;
  align-items: flex-start;
  overflow: auto;
  margin: 0 16px;
  padding: 8px 0;
  border-bottom: 1px solid #e9e5df;
  list-style: none;
  li {
    margin-right: 5px;
    font-size: 12px button {
      display: flex;
    }
  }
`;

const SocialActions = styled.div`
  align-items: center;
  display: flex;
  justify-content: flex-start;
  margin: 0;
  min-height: 40px;
  padding: 4px 8px;
  button {
    display: inline-flex;
    align-items: center;
    padding: 8px;
    color: #0a66c2;

    @media (min-width: 468px) {
      span {
        margin-left: 8px;
      }
    }
  }
`;

const mapStateToProps = (state) => {
  console.log(state);
  return {
    user: state.userState.user,
    jobPostings: state.jobPostingsState.jobPostings,
    userJobPostings: state.jobPostingsState.userJobPostings,
  };
};

const mapDispatchToProps = (dispatch) => ({
  // getAllJobPostings: () => dispatch(getAllJobPostings())
  handleSavePost: (postId, userData) => dispatch(savePost(postId, userData)),
  handleUnsavePost: (postId, userData) =>
    dispatch(unsavePost(postId, userData)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Main);
