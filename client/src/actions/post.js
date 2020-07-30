import axios from "axios";
import { setAlert } from "./alert";
import {
  GET_POSTS,
  GET_POST,
  POST_ERROR,
  UPDATE_LIKES,
  UPDATE_LIKES_ERROR,
  DELETE_POST,
  ADD_POST,
  REMOVE_COMMENT,
  ADD_COMMENT,
} from "./types";

// Get Posts
export const getPosts = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/v1/posts");

    dispatch({
      type: GET_POSTS,
      payload: res.data.data,
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response.data.message,
        status: err.response.data.status,
      },
    });
  }
};

// Get Post
export const getPost = (postId) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/v1/posts/${postId}`);

    dispatch({
      type: GET_POST,
      payload: res.data.data,
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response.data.message,
        status: err.response.data.status,
      },
    });
  }
};

// Add like
export const addLike = (postId) => async (dispatch) => {
  try {
    const res = await axios.patch(`/api/v1/posts/like/${postId}`);

    dispatch({
      type: UPDATE_LIKES,
      payload: {
        postId,
        likes: res.data.likes,
      },
    });
  } catch (err) {
    dispatch({
      type: UPDATE_LIKES_ERROR,
      payload: {
        msg: `Could not perform like`,
      },
    });
  }
};

// Remove like
export const removeLike = (postId) => async (dispatch) => {
  try {
    const res = await axios.patch(`/api/v1/posts/unlike/${postId}`);

    dispatch({
      type: UPDATE_LIKES,
      payload: {
        postId,
        likes: res.data.likes,
      },
    });
  } catch (err) {
    dispatch({
      type: UPDATE_LIKES_ERROR,
      payload: {
        msg: `Could not perform unlike`,
      },
    });
  }
};

// DELETE POST
export const deletePost = (postId) => async (dispatch) => {
  try {
    await axios.delete(`/api/v1/posts/${postId}`);

    dispatch({
      type: DELETE_POST,
      payload: postId,
    });

    dispatch(setAlert("Post Removed", "success"));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: `Could not perform delete post`,
    });
  }
};

// Add POST
export const addPost = (formData) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await axios.post(`/api/v1/posts/`, formData, config);

    dispatch({
      type: ADD_POST,
      payload: res.data.data,
    });

    dispatch(setAlert("New Post Created", "success"));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: `Could not perform delete post`,
    });
  }
};

// Add Comment
export const addComment = (postId, formData) => async (dispatch) => {

  
  try {

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const res = await axios.post(
      `/api/v1/posts/comments/${postId}`,
      JSON.stringify(formData),
      config
    );

    dispatch({
      type: ADD_COMMENT,
      payload: res.data.post,
    });

    dispatch(setAlert("Comment added", "success"));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: `Could not perform Add Comment`,
    });
  }
};

// Delete Comment
export const deleteComment = (postId, commentId) => async (dispatch) => {
  try {
    const res = await axios.delete(
      `/api/v1/posts/uncomment/${postId}/${commentId}`
    );

    dispatch({
      type: REMOVE_COMMENT,
      payload: commentId,
    });

    dispatch(setAlert("Comment deleted", "success"));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: `Could not perform delete Comment`,
    });
  }
};
