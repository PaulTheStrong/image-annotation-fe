import React, {useContext, useState} from "react";
import ProjectContext from "../../context/ProjectContext";
import {BoundingBoxCanvas} from "../../annotations/BoundingBoxCanvas";
import {AnnotatingWorkingAreaHeader} from "./AnnotatingWorkingAreaHeader";
import {AnnotatingWorkingAreaFooter} from "./AnnotatingWorkingAreaFooter";
import {AnnotationListSideBar} from "./AnnotationListSideBar";
import {AnnotationQualityRightSidebar} from "./AnnotationQualityRightSidebar";

interface AnnotatingWorkingAreaProps {
    imageId: number;
}

export const AnnotatingWorkingArea: React.FC<AnnotatingWorkingAreaProps> = ({imageId}) => {

    const projectId = useContext<number>(ProjectContext);
    const [isShowQualitySection, setIsShowQualitySection] = useState(true)

    return (
        <div className="annotationWorkingArea">
            <AnnotatingWorkingAreaHeader />
            <div className="annotationWorkingAreaBody">
                <AnnotationListSideBar imageId={imageId}/>
                <BoundingBoxCanvas imageId={imageId} />
                {isShowQualitySection && <AnnotationQualityRightSidebar imageId={imageId}/>}
            </div>
            <AnnotatingWorkingAreaFooter />
        </div>
    )
}