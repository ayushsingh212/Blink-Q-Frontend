import React, { useEffect, useState } from "react";
import { useComments } from "../../ContextAPI/ContextComments";
import CommentCard from "./CommentCard";

export default function AllComments() {

    const { comments,
        ownComments,
        otherComments,
    } = useComments();

    useEffect(()=>{
        console.log("here are own",ownComments);
        console.log("here are other",otherComments);
    })

    return (
        <div className="flex flex-col gap-3">
            {comments.length === 0 ? (
                <p className="text-gray-400">No comments yet. Be the first!</p>
            ) : (
                <div>
                    {ownComments.map((comment) => (
                        <CommentCard key={comment._id} comment={comment} commentId={comment._id} edit={true}/>
                    ))}
                    {otherComments.map((comment) => (
                        <CommentCard key={comment._id} comment={comment} commentId={comment._id} edit={false}/>
                    ))}
                </div>
            )}
        </div>
    );
}