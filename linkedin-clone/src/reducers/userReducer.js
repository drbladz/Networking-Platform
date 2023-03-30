import { SET_USER } from "../actions/actionType";
// Set an initial state with a single property called "user"
const INITIAL_STATE = {
  user: null,
};
// Define a userReducer function that takes a state object and an action object as arguments
const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
   // If the action type is SET_USER, update the state with the new user data
    case SET_USER:
      console.log(action);
      return {
        ...state,
        user: action.user,
      };
  // If the action type does not match the above case, return the current state object
    default:
      return state;
  }
};
// Export the userReducer function to be used in other parts of the application
export default userReducer;
