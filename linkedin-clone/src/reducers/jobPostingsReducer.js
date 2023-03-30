import { SET_JOB_POSTINGS, SET_USER_JOB_POSTINGS } from "../actions/actionType";
// Set an initial state with two properties: userJobPostings and jobPostings
const INITIAL_STATE ={
  userJobPostings: null,
  jobPostings: null,
}
// Define a jobPostingsReducer function that takes a state object and an action object as arguments
const jobPostingsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type){
       // If the action type is SET_JOB_POSTINGS, update the state with the new job postings data
    case SET_JOB_POSTINGS:
      //console.log(action)
      return {
        ...state,
        jobPostings:action.jobPostings
      }
      // If the action type is SET_USER_JOB_POSTINGS, update the state with the new user job postings data
    case SET_USER_JOB_POSTINGS:
      console.log(action)
      return {
        ...state,
        userJobPostings:action.userJobPostings
      }
     // If the action type does not match any of the above cases, return the current state object
    default: 
      return state;
  }
}
// Export the jobPostingsReducer function to be used in other parts of the application
export default jobPostingsReducer
