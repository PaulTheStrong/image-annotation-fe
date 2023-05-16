import React, {useEffect, useRef, useState} from "react";
import AnnotationImage from "../../data/AnnotationImage";
import {PreviewAnnotationImageTable} from "./PreviewAnnotationImageTable";
import axios from "axios";
import {PROJECT_IMAGES_BASE_URL} from "../../util/constants";
import {AnnotatingWorkingArea} from "../AnnotatingWorkingArea/AnnotatingWorkingArea";
import {useParams} from "react-router-dom";

interface ProjectViewPageProps {
}

export const ProjectViewPage: React.FC<ProjectViewPageProps> = () => {

    const projectId = Number(useParams<{projectId: string}>().projectId);
    const [annotationImages, setAnnotationImages] = useState<Map<string, AnnotationImage>>(new Map());
    const [currentImageId, setCurrentImageId] = useState<string>();

    const previewAnnotationImageTableRef = useRef<HTMLDivElement>(null);
    const drawAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        axios.get<AnnotationImage[]>(PROJECT_IMAGES_BASE_URL.replace("{projectId}", projectId.toString()))
            .then(res => setAnnotationImages(
                new Map(res.data.map(img => [img.id!, img]))
            ));
    }, [projectId])

    const onCurrentImageChange = (newImageId: string) => {
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
                <PreviewAnnotationImageTable annotationImages={Array.from(annotationImages.values())}
                                             onImageRowClick={onCurrentImageChange}/>
            </div>
            <div ref={drawAreaRef} className="drawAreaCanvasNonPicked">
                {currentImageId && (<AnnotatingWorkingArea key={currentImageId} currentImage={annotationImages.get(currentImageId)!} />)}
            </div>
        </div>
    );
}