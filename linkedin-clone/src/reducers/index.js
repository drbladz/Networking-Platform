import {combineReducers} from "redux"
import jobPostingsReducer from "./jobPostingsReducer.js"
import userReducer from "./userReducer.js"

const rootReducer = combineReducers({
  userState: userReducer,
  jobPostingsState: jobPostingsReducer
})

export default rootReducer