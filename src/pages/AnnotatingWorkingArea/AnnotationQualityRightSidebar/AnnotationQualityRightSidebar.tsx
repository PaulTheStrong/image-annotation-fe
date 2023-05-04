import React from "react";
import Comment from "../../../data/Comment";
import {CommentList} from "./CommentList";
import CommentForm from "./CommentForm";

interface AnnotationQualityRightSidebarProps {
    comments: Comment[];
    onCommentAdd: (comment: Comment) => void;
    onStatusChange: (comment: Comment) => void;
}

export const AnnotationQualityRightSidebar: React.FC<AnnotationQualityRightSidebarProps> = ({comments, onCommentAdd, onStatusChange}) => {

    return (
        <div className="annotationQualityRightSidebar">
            <CommentForm onCommentAdd={onCommentAdd}/>
            <CommentList comments={comments} onStatusChange={onStatusChange}/>
        </div>
    )
}
