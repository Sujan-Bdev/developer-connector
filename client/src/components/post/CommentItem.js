import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Moment from "react-moment";
import { deleteComment } from "../../actions/post";
import defaultUser from "../../img/defaultUser.jpg";

const CommentItem = ({
  postId,
  comment: { _id, comment, commenter, createdAt, name,photo },
  auth,
  deleteComment,
}) => (
  <div className="post bg-white p-1 my-1">
    <div>
      <Link to={`/profile/${commenter._id}`}>
        <img className="round-img" src={`/img/users/${photo}`} alt="" />
        <h4>{name}</h4>
      </Link>
    </div>
    <div>
      <p className="my-1">{comment}</p>
      <p className="post-date">
        Posted on
        <Moment format="YYYY/MM/DD ">{createdAt}</Moment>
      </p>
      {!auth.loading && commenter === auth.user._id && (
        <button onClick={(e) => deleteComment(postId, _id)} type = "button" className ={"btn btn-danger"} >
            <i className="fas fa-times"></i>
        </button>
      )}
    </div>
  </div>
);

CommentItem.propTypes = {
  postId: PropTypes.number.isRequired,
  comment: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  deleteComment: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { deleteComment })(CommentItem);
