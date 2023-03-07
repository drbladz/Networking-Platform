import { SET_JOB_POSTINGS } from "../actions/actionType";

const INITIAL_STATE ={
  jobPostings: null,
}

const jobPostingsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type){
    case SET_JOB_POSTINGS:
      console.log(action)
      return {
        ...state,
        jobPostings:action.jobPostings
      }
    default: 
      return state;
  }
}

export default jobPostingsReducer