import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import Project from "../../data/Project";
import {ProjectSelectCard} from "./ProjectSelectCard";
import {PROJECTS_BASE_URL} from "../../util/constants";
import addPrjButtonImg from "../../assets/addPrjButton.svg";
import axios from "axios";

interface ProjectSelectPageProps {
}

export const ProjectSelectPage: React.FC<ProjectSelectPageProps> = () => {

    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        axios.get<Project[]>(PROJECTS_BASE_URL).then(res => setProjects(res.data))
    }, [])

    return (
        <div className="projectSelectPage">
            <Link to="/projects/new">
                <div className="projectSelectCard createProjectCard">
                    <img src={addPrjButtonImg} alt="Create new project"/>
                    <h2>Add project</h2>
                </div>
            </Link>
            {projects.map(project => (
                <Link to={`/projects/${project.id}`} key={project.id}>
                    <ProjectSelectCard project={project} key={project.id}/>
                </Link>)
            )}
        </div>
    );


}
