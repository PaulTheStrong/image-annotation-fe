import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import Project from "../../data/Project";
import {ProjectSelectCard} from "./ProjectSelectCard";
import {HOST, PROJECTS_BASE_URL} from "../../util/constants";
import addPrjButtonImg from "../../assets/addPrjButton.svg";
import axios from "axios";
import {ProjectInviteCard} from "./ProjectInviteCardCard";
import {ApplicationHeader} from "../Header/ApplicationHeader";

interface ProjectSelectPageProps {
}

export const ProjectSelectPage: React.FC<ProjectSelectPageProps> = () => {

    const [myProjects, setMyProjects] = useState<Project[]>([]);
    const [accessedProjects, setAccessedProjects] = useState<Project[]>([]);
    const [invitedProjects, setInvitedProjects] = useState<Project[]>([]);

    useEffect(() => {
        const fetchProjects = async () => {
            let res = await axios.get<Project[]>(PROJECTS_BASE_URL);
            setMyProjects(res.data);
            res = await axios.get<Project[]>(`${PROJECTS_BASE_URL}/accessed`);
            setAccessedProjects(res.data);
            res = await axios.get<Project[]>(`${PROJECTS_BASE_URL}/invited`);
            setInvitedProjects(res.data);
        }
        fetchProjects();
    }, [])

    return (
        <>
            <ApplicationHeader links={[
                {text: "Profile", uri: "/me"}
            ]} headerText="Projects"/>
            <div className="projectSelectPage">
                <h1>My projects</h1>
                <div className="projectsSection">
                    <Link to="/projects/new">
                        <div className="projectSelectCard createProjectCard">
                            <img src={addPrjButtonImg} alt="Create new project"/>
                            <h2>Add project</h2>
                        </div>
                    </Link>
                    {myProjects.map(project => <Link to={`/projects/${project.id}`} key={project.id}>
                            <ProjectSelectCard project={project} key={project.id}/>
                        </Link>
                    )}
                </div>
                <h1>Accessed projects</h1>
                <div className="projectsSection">
                    {accessedProjects.map(project =>
                        <Link to={`/projects/${project.id}`} key={project.id}>
                            <ProjectSelectCard project={project} key={project.id}/>
                        </Link>
                    )}
                </div>
                <h1>Invitations</h1>
                <div className="projectsSection">
                    {invitedProjects.map(project => {
                        let handleAccept = async (project: Project) => {
                            let axiosResponse = await axios.put(`${HOST}/projects/${project.id}/invitations/accept`);
                            if (axiosResponse.status === 200) {
                                setInvitedProjects(prev => prev.filter(prj => prj.id !== project.id));
                                setAccessedProjects(prev => [...prev, project])
                            }
                        };
                        let handleDeny = async (project: Project) => {
                            let axiosResponse = await axios.put(`${HOST}/projects/${project.id}/invitations/deny`);
                            if (axiosResponse.status === 200) {
                                setInvitedProjects(prev => prev.filter(prj => prj.id !== project.id));
                            }
                        };
                        return <ProjectInviteCard project={project} key={project.id} onAccept={handleAccept}
                                                  onDeny={handleDeny}/>;
                    })}
                </div>
            </div>
        </>
    );


}
