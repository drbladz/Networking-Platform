import { ADD_POST, SET_USER } from "../actions/actionType";

const INITIAL_STATE ={
  user: null,
}

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type){
    case SET_USER:
      return {
        ...state,
        user:action.user
      }
    default: 
      return state;
  }
}

const postingReducer = (state = INITIAL_STATE, action) => {
  switch (action.type){
    case ADD_POST:
      return {
        ...state,
        posting:action.posting
      }
    default: 
      return state;
  }
}

export default userReducer