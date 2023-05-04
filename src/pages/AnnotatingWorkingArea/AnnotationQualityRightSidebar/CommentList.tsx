import React from "react";
import Comment from "../../../data/Comment";
import {CommentListItem} from "./CommentListItem";

interface CommentListProps {
    comments: Comment[];
    onStatusChange: (comment: Comment) => void;
}

export const CommentList: React.FC<CommentListProps> = ({comments, onStatusChange}) => {

    return (
        <div className="commentList">
            {comments.map(comment => <CommentListItem comment={comment} key={comment.id} onStatusChange={onStatusChange}/>)}
        </div>
    )
}
