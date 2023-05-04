import React, {useContext, useEffect, useState} from "react";
import ProjectContext from "../../context/ProjectContext";
import axios from "axios";
import Tag from "../../data/Tag";
import {PROJECT_IMAGES_BASE_URL, PROJECT_TAGS_BASE_URL, PROJECTS_BASE_URL} from "../../util/constants";
import Project from "../../data/Project";
import {TagListEditor} from "../AnnotatingWorkingArea/DrawingArea/TagListEditor";

interface ProjectSettingsPageProps {
}

export const ProjectSettingsPage: React.FC<ProjectSettingsPageProps> = () => {

    const projectId = useContext(ProjectContext);
    const [project, setProject] = useState<Project>();
    const [tags, setTags] = useState<Tag[]>([]);

    useEffect(() => {
        axios.get<Tag[]>(PROJECT_TAGS_BASE_URL.replace("{projectId}", projectId.toString()))
            .then(res => setTags(res.data))
    }, [projectId]);

    useEffect(() => {
        axios.get<Project>(PROJECTS_BASE_URL.replace("{projectId}", projectId.toString()))
            .then(res => setProject(res.data))
    }, [projectId]);

    const handleTagRemove = (removedTag: Tag) => {
        axios.delete(PROJECT_TAGS_BASE_URL.replace("{projectId}", projectId.toString()) + "/" + removedTag.id)
            .then((res) => {
                setTags(prevState => prevState.filter(tag => removedTag.id !== tag.id));
            });
    };

    const handleTagAdd = (newTag: Tag) => {
        axios.post(PROJECT_TAGS_BASE_URL.replace("{projectId}", projectId.toString()), newTag)
            .then((res) => {
                setTags(oldValue => [...oldValue, res.data]);
            });
    };

    const handleTagUpdate = (tag: Tag) => {
        axios.put<Tag>(PROJECT_TAGS_BASE_URL.replace("{projectId}", projectId.toString()) + "/" + tag.id, tag)
            .then(res => {
                setTags(oldValue => oldValue.map(prevTag => prevTag.id === tag.id ? res.data : prevTag));
            });
    };

    return (
        <div className="projectSettingsPage">

            <TagListEditor onTagAdd={handleTagAdd} onTagUpdate={handleTagUpdate}
                           onTagRemove={handleTagRemove} tags={tags}/>
        </div>
    )

}