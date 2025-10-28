import { useContext, createContext, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../Config";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import toast from "react-hot-toast";

const CommentsContext = createContext();

export const CommentsProvider = ({ children }) => {
  const user = useSelector((state) => state.auth.user);

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(true);
  const [replying, setReplying] = useState(false);
  const [commentId, setCommentId] = useState("");
  const [editable, setEditable] = useState(false);
  const [editComment, setEditComment] = useState("");

  const ownComments = useMemo(
    () => comments.filter((c) => c.userOfComment?._id === user?._id),
    [comments, user]
  );

  const otherComments = useMemo(
    () => comments.filter((c) => c.userOfComment?._id !== user?._id),
    [comments, user]
  );

  const fetchcomment = async ({ id }) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/comment/videos/${id}`, {
        withCredentials: true,
      });
      console.log(res);
      setComments(res.data.data);
      return res;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const addComment = (newComment) => {
    setComments((prev) => [...prev, newComment]);
  };

  const addReply = (newReply) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment._id === newReply.parentComment
          ? { ...comment, replies: [...(comment.replies || []), newReply] }
          : comment
      )
    );
  };

  const InputComment = async (comment, videoId) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${API_BASE_URL}/comment/videos/${videoId}`,
        { comment },
        { withCredentials: true }
      );
      console.log(res);
      toast.success(res.data.message);
      addComment(res.data.data);
      return res;
    } catch (error) {
      console.log("Failed to post error", error);
    } finally {
      setLoading(false);
    }
  };

  const ReplyComment = async (comment, commentId) => {
    setLoading(true);
    if (!commentId) {
      console.warn("Missing commentId for reply");
      return;
    }
    try {
      const res = await axios.post(
        `${API_BASE_URL}/comment/replies/${commentId}`,
        { comment },
        { withCredentials: true }
      );
      console.log(res);
      toast.success(res.data.message);
      addReply(res.data.data);
      return res;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setReplying(false);
      setSending(true);
    }
  };

  const editCommentAPI = async (comment, commentId) => {
    setLoading(true);
    try {
      const res = await axios.put(
        `${API_BASE_URL}/comment/${commentId}`,
        { comment },
        { withCredentials: true }
      );

      toast.success(res.data.message);

      setComments((prev) =>
        prev.map((c) =>
          c._id === commentId ? { ...c, comment: res.data.data.comment } : c
        )
      );

      setEditable(false);
      setReplying(false);
      setEditComment("");
      setCommentId("");
      setSending(true);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteComment = async (Id) => {
    setLoading(true);
    try {
      const res = await axios.delete(`${API_BASE_URL}/comment/${Id}`, {
        withCredentials: true,
      });
      console.log(res);
    } catch (error) {
      console.log("error deleting", error);
    } finally {
      setLoading(false);
    }
  };

  const replyMode = (commentId) => {
    setSending(false);
    setReplying(true);
    setEditable(false);
    setCommentId(commentId);
  };

  const commentMode = () => {
    setSending(true);
    setEditable(false);
    setReplying(false);
    setCommentId("");
  };

  return (
    <CommentsContext.Provider
      value={{
        comments,
        setComments,
        ownComments,
        otherComments,
        loading,
        sending,
        fetchcomment,
        addComment,
        addReply,
        InputComment,
        ReplyComment,
        replyMode,
        commentMode,
        replying,
        commentId,
        editable,
        setEditable,
        setSending,
        setReplying,
        setCommentId,
        editComment,
        setEditComment,
        editCommentAPI,
        deleteComment,
      }}
    >
      {children}
    </CommentsContext.Provider>
  );
};

export const useComments = () => useContext(CommentsContext);
