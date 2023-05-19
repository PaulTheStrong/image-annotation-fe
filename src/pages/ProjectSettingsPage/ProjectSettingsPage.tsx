import React, {useEffect, useState} from "react";
import axios from "axios";
import Tag from "../../data/Tag";
import {PROJECT_IMAGES_BASE_URL, PROJECT_TAGS_BASE_URL, PROJECTS_BASE_URL, replaceRefs} from "../../util/constants";
import Project from "../../data/Project";
import {TagListEditor} from "../AnnotatingWorkingArea/DrawingArea/TagListEditor";
import {useNavigate, useParams} from "react-router-dom";

interface ProjectSettingsPageProps {
    isNew: boolean
}

export const ProjectSettingsPage: React.FC<ProjectSettingsPageProps> = ({isNew}) => {

    const navigate = useNavigate();

    const projectId = Number(useParams<{ projectId: string }>().projectId);
    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [files, setFiles] = useState<FileList | null>()


    const project = new Project(projectName, projectDescription, projectId);

    const [tags, setTags] = useState<Tag[]>([]);
    const [tagId, setTagId] = useState(0);

    useEffect(() => {
        if (!isNew) {
            axios.get<Project>(`${PROJECTS_BASE_URL}/${projectId}`)
                .then(res => {
                    setProjectName(res.data.name ?? '');
                    setProjectDescription(res.data.description ?? '');
                });
            axios.get<Tag[]>(PROJECT_TAGS_BASE_URL.replace("{projectId}", projectId.toString()))
                .then(res => setTags(res.data))
        }
    }, [isNew, projectId]);

    const handleTagRemove = async (removedTag: Tag) => {
        if (!isNew) {
            await axios.delete(PROJECT_TAGS_BASE_URL.replace("{projectId}", projectId.toString()) + "/" + removedTag.id);
        }
        setTags(prevState => prevState.filter(tag => removedTag.id !== tag.id));
    };

    const handleTagAdd = async (newTag: Tag) => {
        if (isNew) {
            setTags(oldValue => [...oldValue, {...newTag, id: tagId + 1}]);
            setTagId(prev => prev + 1);
        } else {
            let res = await axios.post(PROJECT_TAGS_BASE_URL.replace("{projectId}", projectId.toString()), newTag);
            setTags(oldValue => [...oldValue, res.data]);
        }
    };

    const handleTagUpdate = async (tag: Tag) => {
        if (isNew) {
            setTags(oldValue => oldValue.map(prevTag => prevTag.id === tag.id ? tag : prevTag))
        } else {
            let res = await axios.patch<Tag>(PROJECT_TAGS_BASE_URL.replace("{projectId}", projectId.toString()) + "/" + tag.id, tag);
            setTags(oldValue => oldValue.map(prevTag => prevTag.id === tag.id ? res.data : prevTag));
        }
    };

    const handleProjectSave = async () => {
        if (files) {
            for (const file of Array.from(files)) {
                const formData = new FormData();
                formData.append("file", file);
                await axios.post(
                    replaceRefs(PROJECT_IMAGES_BASE_URL, {projectId}),
                    formData,
                    {headers: {"Content-Type": "multipart/form-data"}})
            }
        }
        if (isNew) {
            await axios.post(PROJECTS_BASE_URL, {project, tags})
            await navigate("/projects");
        } else {
            const res = await axios.put<Project>(`${PROJECTS_BASE_URL}/${projectId}`, {project})
            setProjectName(res.data.name);
            setProjectDescription(res.data.description ?? '');
            setFiles(undefined);
        }
    }

    const handleDeleteProject = async () => {
        await axios.delete(`${PROJECTS_BASE_URL}/${projectId}`);
        navigate("/projects");
    }

    return (
        <div className="projectSettingsPage">
            <div className="form-container">
                <h1>{isNew ? "Create new project" : project?.name}</h1>
                <div>
                    <label htmlFor="projectNameInput">Project Name</label>
                    <input type="text" id="projectNameInput" placeholder="Enter project name" value={project?.name}
                           className="input-text"
                           onChange={(e) => setProjectName(e.target.value)}/>
                </div>
                <div>
                    <label htmlFor="projectDescriptionInput">Project Description</label>
                    <input type="text" id="projectDescriptionInput" placeholder="Enter project description"
                           className="input-text"
                           value={project?.description}
                           onChange={(e) => setProjectDescription(e.target.value)}/>
                </div>
                <TagListEditor onTagAdd={handleTagAdd} onTagUpdate={handleTagUpdate}
                               onTagRemove={handleTagRemove} tags={tags}/>
                {!isNew && <label>Upload images</label>}
                {!isNew && (
                    <div className="fileInput">
                        <input type="file" multiple={true} accept=".png,.jpg,.jpeg" className="fileInput" content="Pick your file"
                               onChange={e => setFiles(e.target.files)}/>
                        {files && Array.from(files).map(file => <p>{file.name}</p>)}
                    </div>
                )}
                <button onClick={handleProjectSave}
                        className="btn">{isNew ? "Create new project" : "Save Project"}</button>
                {!isNew && <button onClick={handleDeleteProject} className="btn-error">Delete project</button>}
            </div>
        </div>
    );


}