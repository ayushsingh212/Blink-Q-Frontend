import React, { useState } from "react";
import { useComments } from "../../ContextAPI/ContextComments";
import { useSelector } from "react-redux";

export default function CommentCard({ comment, edit, commentId }) {

    const user = useSelector((state) => state.auth.user);
    const { replyMode, commentMode, sending, setEditComment, setSending, setReplying, setCommentId, setEditable, editable } = useComments();
    const [viewReply, setViewReply] = useState(false);

    const handleView = () => {
        setViewReply((prev) => !prev);
    }

    const handleReply = () => {
        replyMode(commentId, null);
    }

    const handleComment = () => {
        commentMode();
    }

    const handleEdit = () => {
        setEditable(true);
        setSending(false);
        setReplying(false);
        setEditComment(comment.comment);
        setCommentId(comment._id);
    }

    const cancelEdit = () =>{
        setEditable(false);
        setSending(true);
        setReplying(false);
        setEditComment("");
        setCommentId("");
    }

    return (
        <div className="p-2 border-b border-gray-700">
            <div className="flex gap-3 mb-3">
                <div className="overflow-hidden">
                    <img src={comment.userOfComment.avatar} alt="User Avatar"
                        className="h-8 w-8 object-cover rounded-full" />
                </div>
                <div className="text-xl font-semibold">
                    {comment.userOfComment.fullName}
                </div>
            </div>
            <div className="flex ml-11 justify-between">
                <div className="text-lg">{comment.comment}</div>
                <div className=" ">
                    <div className="text-sm">
                        <i class="ri-heart-line"></i>
                    </div>
                    <div className="text-sm ml-1">
                        {comment.likes.length}
                    </div>
                </div>
            </div>
            <div className="ml-[10vw] text-sm">
                {sending ? (
                    <button onClick={handleReply} className="ml-5">
                        Reply
                    </button>
                ) : (
                    <button onClick={handleComment} className="ml-5">
                        Reply Off
                    </button>
                )}
                <button className="ml-5" onClick={handleView}>
                    {viewReply ? ("Hide Replies") : ("View Replies")}
                </button>
                {edit && (
                    <>
                        {editable ? (
                            <button className="ml-5" onClick={cancelEdit} >
                                Edit Off
                            </button>
                        ) : (
                            <button className="ml-5" onClick={handleEdit} >
                                Edit
                            </button>
                        )}
                        <button className="ml-5">
                            Delete
                        </button>
                    </>
                )}
            </div>
            {viewReply && (
                comment.replies.map((comment) => (
                    <div className=" ml-[10vw] mt-7">
                        <div className="flex gap-3 mb-1">
                            <div className="overflow-hidden">
                                <img src={comment.userOfComment.avatar} alt="User Avatar"
                                    className="h-6 w-6 object-cover rounded-full" />
                            </div>
                            <div className="text-lg font-semibold">
                                {comment.userOfComment.fullName}
                            </div>
                        </div>
                        <div className="flex ml-11 justify-between">
                            <div className="text-base">{comment.comment}</div>
                            <div className=" ">
                                <div className="text-sm">
                                    <i class="ri-heart-line"></i>
                                </div>
                                <div className="text-sm ml-1">
                                    {comment.likes.length}
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
