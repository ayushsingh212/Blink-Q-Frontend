import axios from "axios";
import React, { useEffect, useState } from "react";
import { useComments } from "../../ContextAPI/ContextComments";
import { useSelector } from "react-redux";

export default function CommentInput({ videoId }) {

    const { InputComment, ReplyComment, sending, replying, loading, commentId, editable, editComment, editCommentAPI } = useComments();
    const [comment, setComment] = useState("");
    const user = useSelector((state)=> state.auth.user);
    const [restrict, setRestrict] = useState(false);

    const handleSendComment = () => {
        if (!comment.trim()) return;
        InputComment(comment, videoId);
        setComment("");
    };

    const handleReplyComment = () => {
        if (!comment.trim()) return;
        ReplyComment(comment, commentId);
        setComment("");
    };

    const handleEditComment = () => {
        if (!comment.trim()) return;
        editCommentAPI(comment, commentId);
        setComment("");
    }

    useEffect(() => {
        if(editComment){
            setComment(editComment);
        } else {
            setComment("");
        }
        if(user){
            setRestrict(false);  
        } else {
            setRestrict(true);
        }
    },[editComment, user]);


    return (
        <div>
            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    maxLength={300}
                    placeholder="Add a comment"
                    minLength={1}
                    disabled={restrict}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="flex-1 text-black px-3 py-2 rounded border focus:outline-none"
                />
                {editable && (
                    <button
                        onClick={handleEditComment}
                        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                    >
                        {loading ? "Editing..." : "Save"}
                    </button>
                )}
                {replying && (
                    <button
                        onClick={handleReplyComment}
                        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                    >
                        {loading ? "Replying..." : "Reply"}
                    </button>
                )}
                {sending && (
                    <button
                        onClick={handleSendComment}
                        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                    >
                        {loading ? "Sending..." : "Send"}
                    </button>
                )}
            </div>
        </div >
    )
}