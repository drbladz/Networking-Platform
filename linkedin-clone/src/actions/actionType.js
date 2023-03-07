export const SET_USER = "SET_USER";

export const SET_JOB_POSTINGS = "SET_JOB_POSTINGS"
export const ADD_POST = "ADD_POST";

export const updateProfilePictureError = (error) => ({
  type: "UPDATE_PROFILE_PICTURE_ERROR",
  payload: error,
});

export const updateProfilePictureSuccess = (photoURL) => ({
  type: "UPDATE_PROFILE_PICTURE_SUCCESS",
  payload: photoURL,
});
