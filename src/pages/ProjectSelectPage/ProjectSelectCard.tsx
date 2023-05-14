import React from "react";
import Project from "../../data/Project";

interface ProjectSelectCardProps {
    project: Project;
}

export const ProjectSelectCard: React.FC<ProjectSelectCardProps> = ({project}) => {

    return (
        <div className="projectSelectCard">
            <h2>{project.name}</h2>
            <hr/>
            <p>{project.description}</p>
            <button value="Delete project"></button>
        </div>
    )
}
