import axios from "axios";
import { setAlert } from "./alert";

import {
  GET_PROFILE,
  GET_PROFILES,
  PROFILE_ERROR,
  UPDATE_PROFILE,
  ACCOUNT_DELETED,
  CLEAR_PROFILE,

} from "./types";

// get current user profiles
export const getCurrentProfile = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/v1/profile/me");
    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: err.response.data.message,
        status: err.response.data.status,
      },
    });
  }
};


// get all profiles
export const getProfiles = () => async (dispatch) => {
  dispatch({
    type: CLEAR_PROFILE
  })
  try {
    const res = await axios.get("/api/v1/profile");
    dispatch({
      type: GET_PROFILES,
      payload: res.data.data,
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: err.response.data.message,
        status: err.response.data.status,
      },
    });
  }
};


// get  profile by ID
export const getProfileById = (userId) => async (dispatch) => {
  
  try {
    const res = await axios.get(`/api/v1/profile/${userId}`);

    dispatch({
      type: GET_PROFILE,
      payload: res.data.data,
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: err.response.data.message,
        status: err.response.data.status,
      },
    });
  }
};


// create or update profile
export const createProfile = (formData, history, edit = false) => async (
  dispatch
) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const res = await axios.post("/api/v1/profile/me", formData, config);

    dispatch({
      type: GET_PROFILE,
      payload: res.data.data,
    });

    dispatch(setAlert(edit ? "Profile Updated" : "Profile Created", "success"));

    if (!edit) {
      history.push("/dashboard");
    }
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: err.response.data.message,
        status: err.response.data.status,
      },
    });
  }
};

// ADD EDUCATION
export const addEducation = (formData, history) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const res = await axios.patch(
      "/api/v1/profile/education",
      formData,
      config
    );

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data.data,
    });

    dispatch(setAlert("Education  Added", "success"));

    history.push("/dashboard");
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: err.response.data.message,
        status: err.response.data.status,
      },
    });
  }
};

// ADD EXPERIENCE
export const addExperience = (formData, history) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const res = await axios.patch(
      "/api/v1/profile/experience",
      formData,
      config
    );

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data.data,
    });

    dispatch(setAlert("Experience Added", "success"));

    history.push("/dashboard");
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: err.response.data.message,
        status: err.response.data.status,
      },
    });
  }
};

// Delete Experience
export const deleteExperience = (id) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/v1/profile/experience/${id}`);

    dispatch(setAlert("Experience  Removed", "danger"));

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data.data,
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: err.response.data.message,
        status: err.response.data.status,
      },
    });
  }
};

// Delete Education
export const deleteEducation = (id) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/v1/profile/education/${id}`);

    dispatch(setAlert("Education  Removed", "danger"));

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data.data,
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: err.response.data.message,
        status: err.response.data.status,
      },
    });
  }
};

// Delete Account and Profile
export const deleteAccount = () => async (dispatch) => {
  if (window.confirm("Are You sure? This cannot be undone!")) {
    try {
      await axios.delete(`/api/v1/profile/me/`);


      dispatch({
        type: CLEAR_PROFILE,
      });

      dispatch({
        type: ACCOUNT_DELETED,
      });

      dispatch(setAlert("Your Account has been permanently Deleted", "danger"));


    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: {
          msg: err.response.data.message,
          status: err.response.data.status,
        },
      });
    }
  }
};
