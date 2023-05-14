import React, {useEffect, useState} from "react";
import Project from "../../data/Project";
import {Link, useParams} from "react-router-dom";
import axios from "axios";
import {PROJECTS_BASE_URL} from "../../util/constants";

interface ApplicationHeaderProps {
    headerText?: String
}

export const ApplicationHeader: React.FC<ApplicationHeaderProps> = ({headerText}) => {

    const projectId = Number(useParams<{ projectId: string }>().projectId);
    const [project, setProject] = useState<Project>();

    useEffect(() => {
        if (projectId) {
            axios.get<Project>(`${PROJECTS_BASE_URL}/${projectId}`)
                .then(res => setProject(res.data))
        }
    }, [projectId])

    return (
        <header className="appHeader">
            {projectId
                ? <>
                    <Link to="/projects">
                        <button className="headerBtn btn">Projects</button>
                    </Link>
                    <h2>Project "{project?.name}"</h2>
                    <div></div>
                    <Link to={`/projects/${projectId}/settings`}>
                        <button className="headerBtn btn">Settings</button>
                    </Link>
                    <Link to="/profile">
                        <button className="headerBtn btn">Profile</button>
                    </Link>
                </>
                : <>
                    <div />
                    <h2>{headerText ?? ""}</h2>
                    <div />
                    <div />
                    <Link to="/profile">
                        <button className="headerBtn">Profile</button>
                    </Link>
                </>}
        </header>
    );
}