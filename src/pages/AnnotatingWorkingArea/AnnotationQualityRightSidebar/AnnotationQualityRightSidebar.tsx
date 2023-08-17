import React from "react";
import Comment from "../../../data/Comment";
import {CommentList} from "./CommentList";
import CommentForm from "./CommentForm";
import {StatusEditor} from "./StatusEditor";

interface AnnotationQualityRightSidebarProps {
    comments: Comment[];
    onCommentAdd: (comment: Comment) => void;
    onCommentStatusChange: (comment: Comment) => void;
    onStatusChange: (statusId: number) => void;
    currentStatus: number;
}

export const AnnotationQualityRightSidebar: React.FC<AnnotationQualityRightSidebarProps> = ({comments, onCommentAdd, onCommentStatusChange, onStatusChange, currentStatus}) => {

    return (
        <div className="annotationQualityRightSidebar">
            <StatusEditor onStatusChange={onStatusChange} status={currentStatus}/>
            <CommentForm onCommentAdd={onCommentAdd}/>
            <CommentList comments={comments} onStatusChange={onCommentStatusChange}/>
        </div>
    )
}
