import React, {useState} from "react";
import Comment from "../../../data/Comment";

interface CommentListItemProps {
    comment: Comment;
    onStatusChange: (comment: Comment) => void;
}

export const CommentListItem: React.FC<CommentListItemProps> = ({comment, onStatusChange}) => {

    const [isResolved, setResolved] = useState(comment.isResolved ?? false);

    const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        comment.isResolved = e.target.checked;
        onStatusChange(comment);
        setResolved(e.target.checked);
    }

    return (
        <div className="annotationComment" style={
            {backgroundColor: (comment.isResolved ? "#65D06A" : "#D06565") + "30"}
        }>
            <div>
                <div className="commentEmail">{comment.authorEmail}</div>
                <div>{comment.text}</div>
                <div className="commentDate">{new Date(Date.parse(comment.createdAt!)).toUTCString()}</div>
            </div>
            <div>
                <input type="checkbox" checked={isResolved} onChange={handleStatusChange}/>
            </div>
        </div>
    )
}
