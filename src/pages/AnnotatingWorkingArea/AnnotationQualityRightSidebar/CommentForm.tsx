import Comment from "../../../data/Comment";
import React, {useState} from "react";

interface CommentFormProps {
    onCommentAdd: (comment: Comment) => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ onCommentAdd }) => {

    const [text, setText] = useState("");

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (text.trim().length === 0) return;
        const newComment = new Comment(text);
        onCommentAdd(newComment);
        setText("");
    };

    return (
        <form onSubmit={handleSubmit} className="commentForm">
            <label>
                Add your comment:
            </label>
            <input
                type="text"
                value={text}
                onChange={handleInputChange}
                placeholder="Enter your comment"
            />
            <button type="submit">Add comment</button>
        </form>
    );
};

export default CommentForm;