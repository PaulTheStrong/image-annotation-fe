import React from "react";

interface AnnotationListSideBarProps {
    imageId: number;
}

export const AnnotationListSideBar: React.FC<AnnotationListSideBarProps> = ({imageId}) => {

    return (
        <div className="annotationListSideBar">
            Annotations side bar
        </div>
    )

}
