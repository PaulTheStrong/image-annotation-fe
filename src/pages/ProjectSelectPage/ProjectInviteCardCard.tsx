import React from "react";
import Project from "../../data/Project";

interface ProjectInviteCardProps {
    project: Project;
    onAccept: (project: Project) => any;
    onDeny: (project: Project) => any;
}

export const ProjectInviteCard: React.FC<ProjectInviteCardProps> = ({project, onAccept, onDeny}) => {

    return (
        <div className="projectInviteCard">
            <div>
                <h2>{project.name}</h2>
                <hr/>
            </div>
            <div>
                <p>{project.description}</p>
            </div>
            <div className="invite-btns">
                <button className="btn" onClick={() => onAccept(project)}>Accept Invite</button>
                <button className="btn btn-error" onClick={() => onDeny(project)}>Deny Invite</button>
            </div>
        </div>
    )
}
