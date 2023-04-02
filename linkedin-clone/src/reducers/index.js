import { combineReducers } from "redux";
import jobPostingsReducer from "./jobPostingsReducer.js";
import userReducer from "./userReducer.js";
// Create a rootReducer by combining two different reducers called "userReducer" and "jobPostingsReducer"
const rootReducer = combineReducers({
  userState: userReducer,
  jobPostingsState: jobPostingsReducer,
});
// Export the rootReducer to be used in other parts of the application
export default rootReducer;
