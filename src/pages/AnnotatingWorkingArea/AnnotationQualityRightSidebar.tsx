import React from "react";

interface AnnotationQualityRightSidebarProps {
    imageId: number;
}

export const AnnotationQualityRightSidebar: React.FC<AnnotationQualityRightSidebarProps> = ({imageId}) => {

    return (
        <div className="annotationQualityRightSidebar">Quality Section</div>
    )
}
