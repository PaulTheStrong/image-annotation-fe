import AnnotationImage from "../../data/AnnotationImage";
import React from "react";
import Project from "../../data/Project";

interface ApplicationHeaderProps {
    project: Project;
}

export const ApplicationHeader: React.FC<ApplicationHeaderProps> = ({project}) => {


    return (
      <header className="appHeader">
          <button className="Settings" value="Settings">Settings</button>
          <div>{project.name}</div>
      </header>
    );
}