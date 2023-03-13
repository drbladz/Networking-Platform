import { SET_JOB_POSTINGS, SET_USER_JOB_POSTINGS } from "../actions/actionType";

const INITIAL_STATE ={
  userJobPostings: null,
  jobPostings: null,
}

const jobPostingsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type){
    case SET_JOB_POSTINGS:
      //console.log(action)
      return {
        ...state,
        jobPostings:action.jobPostings
      }
    case SET_USER_JOB_POSTINGS:
      console.log(action)
      return {
        ...state,
        userJobPostings:action.userJobPostings
      }
    default: 
      return state;
  }
}

export default jobPostingsReducer