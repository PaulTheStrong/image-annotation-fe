import Comment from "../../../data/Comment";
import React from "react";

interface CommentFormProps {
    onStatusChange: (status: number) => void;
    status: number;
}

export const StatusEditor: React.FC<CommentFormProps> = ({ onStatusChange, status }) => {

    return <div className="statusEditor">
        <button className="btn" style={{backgroundColor: "blue", color: "white"}} onClick={() => {if (status !== 0) onStatusChange(0)}}>In Progress</button>
        <button className="btn" style={{backgroundColor: "red", color: "white"}} onClick={() => {if (status !== 1) onStatusChange(1)}}>Done</button>
        <button className="btn" style={{backgroundColor: "green", color: "white"}} onClick={() => {if (status !== 2) onStatusChange(2)}}>Approved</button>
    </div>

}