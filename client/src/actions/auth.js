import axios from "axios";
import { setAlert } from "./alert";
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
  CLEAR_PROFILE
} from "./types";
import setAuthToken from '../utils/setAuthToken'

// load user
export const loadUser = () =>async dispatch => {
  if(localStorage.token){
    setAuthToken(localStorage.token)
  }

  try {
    const res = await axios.get('/api/v1/users');
    
    dispatch({
      type: USER_LOADED,
      payload: res.data.user
    })
    
  } catch (err) {
      dispatch({
        type: AUTH_ERROR
      })
    
  }
}

// REGISTER USER
export const register = ({ name, email, password, passwordConfirm }) => async (
  dispatch
) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify({ name, email, password, passwordConfirm });

    const response = await axios.post("/api/v1/users/signup", body, config);
    //  const val = await response.data
    // console.log(`checking the response portion ${response.data.token}`)
    dispatch({
      type: REGISTER_SUCCESS,
      payload: response.data,
    });

    dispatch(loadUser())


  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: REGISTER_FAIL,
    });
  }
};


// login user
export const login = ( email, password) => async (
  dispatch
) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify({ email, password });

    const response = await axios.post("/api/v1/users/login", body, config);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: response.data,
    });

    dispatch(loadUser())


  } catch (err) {
    const error = err.response.data.message;

    if (error) {
      dispatch(setAlert(error, "danger"));
    }
    dispatch({
      type: LOGIN_FAILURE,
    });
  }
};

// logout /clear profile
export const logout  = () => dispatch => {
  dispatch({
    type: CLEAR_PROFILE
  })
  dispatch({
    type: LOGOUT
  })
}