import React, { useEffect, useState } from 'react'
import CommentInput from './CommentComponents/CommentInput';
import { useComments } from '../ContextAPI/ContextComments'
import AllComments from './CommentComponents/AllComments';


export default function CommentsSection({ id }) {

    const { fetchcomment, comments } = useComments();

    useEffect(()=>{
        fetchcomment({id});
    },[id]);

    return (
        <div className="mt-6">
            <CommentInput videoId={id} />
            <AllComments />
        </div>
    )
}
