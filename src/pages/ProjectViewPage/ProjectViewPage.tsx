import React, {createRef, useContext, useEffect, useRef, useState} from "react";
import AnnotationImage from "../../data/AnnotationImage";
import {PreviewAnnotationImageTable} from "./PreviewAnnotationImageTable";
import axios from "axios";
import {PROJECT_IMAGES_BASE_URL} from "../../util/constants";
import ProjectContext from "../../context/ProjectContext";
import {BoundingBoxCanvas} from "../../annotations/BoundingBoxCanvas";
import {AnnotatingWorkingArea} from "../AnnotatingWorkingArea/AnnotatingWorkingArea";

interface ProjectViewPageProps {
}

export const ProjectViewPage: React.FC<ProjectViewPageProps> = () => {

    const projectId = useContext(ProjectContext);
    const [annotationImages, setAnnotationImages] = useState<AnnotationImage[]>([]);
    const [currentImageId, setCurrentImageId] = useState<number>();

    const previewAnnotationImageTableRef = useRef<HTMLDivElement>(null);
    const drawAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        axios.get<AnnotationImage[]>(PROJECT_IMAGES_BASE_URL.replace("{projectId}", projectId.toString()))
            .then(res => setAnnotationImages(res.data));
    }, [projectId])

    const onCurrentImageChange = (newImageId: number) => {
        if (currentImageId == null) {
            setCurrentImageId(newImageId);
            previewAnnotationImageTableRef?.current?.classList.add("previewAnnotationImageTableImagePicked");
            drawAreaRef?.current?.classList.add("drawAreaCanvasPicked");
            drawAreaRef?.current?.classList.remove("drawAreaCanvasNonPicked")
        } else if (currentImageId === newImageId) {
            setCurrentImageId(undefined);
            drawAreaRef?.current?.classList.add("drawAreaCanvasNonPicked")
            previewAnnotationImageTableRef?.current?.classList.remove("previewAnnotationImageTableImagePicked");
            drawAreaRef?.current?.classList.remove("drawAreaCanvasPicked");

        } else {
            setCurrentImageId(newImageId)
        }
    }

    return (
        <div className="projectViewPage">
            <div ref={previewAnnotationImageTableRef} className="previewAnnotationImageTableImageNonPicked">
                <PreviewAnnotationImageTable annotationImages={annotationImages} onImageRowClick={onCurrentImageChange}/>
            </div>
            <div ref={drawAreaRef} className="drawAreaCanvasNonPicked">
                {currentImageId && <AnnotatingWorkingArea key={currentImageId} imageId={currentImageId!} />}
            </div>
        </div>
    );
}