import React, {useState} from "react";

interface ProjectEditFormProps {
}

export const ProjectEditForm: React.FC<ProjectEditFormProps> = () => {
    const [projectName, setProjectName] = useState<string>();
    const [projectDescription, setProjectDescription] = useState<string>();

    return (
        <>

        </>
    )
}