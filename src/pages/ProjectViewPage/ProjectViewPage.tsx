import React, {useEffect, useRef, useState} from "react";
import AnnotationImage from "../../data/AnnotationImage";
import {PreviewAnnotationImageTable} from "./PreviewAnnotationImageTable";
import axios from "axios";
import {HOST, PROJECT_IMAGES_BASE_URL} from "../../util/constants";
import {AnnotatingWorkingArea} from "../AnnotatingWorkingArea/AnnotatingWorkingArea";
import {useParams} from "react-router-dom";
import {ApplicationHeader} from "../Header/ApplicationHeader";
import Project from "../../data/Project";
import LinkDetails from "../../data/LinkDetails";
import ExportModal from "./ExportModal";
import ImageIdName from "./ImageIdName";

interface ProjectViewPageProps {
}

export const ProjectViewPage: React.FC<ProjectViewPageProps> = () => {

    const projectId = Number(useParams<{ projectId: string }>().projectId);
    const [annotationImages, setAnnotationImages] = useState<Map<string, AnnotationImage>>(new Map());
    const [currentImageId, setCurrentImageId] = useState<string>();
    const [projectName, setProjectName] = useState('');
    const [exportImageIds, setExportImageIds] = useState<ImageIdName[]>([])
    const [isExport, setIsExport] = useState(false);
    const [selectedInitialValue, setSelectedInitialValue] = useState<boolean | null>(null);

    const previewAnnotationImageTableRef = useRef<HTMLDivElement>(null);
    const drawAreaRef = useRef<HTMLDivElement>(null);


    const fetchImages = async () => {
        let imgResp = await axios.get<AnnotationImage[]>(PROJECT_IMAGES_BASE_URL.replace("{projectId}", projectId.toString()));
        setAnnotationImages(new Map(imgResp.data.map(img => [img.id!, img])));
        setCurrentImageId(undefined);
        setExportImageIds([]);
    }

    useEffect(() => {
        const fetchData = async () => {
            fetchImages();
            let prjResp = await axios.get<Project>(`${HOST}/projects/${projectId}`);
            setProjectName(prjResp.data.name);
        }

        fetchData();
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

    const handleAddImageId = (imageId: ImageIdName) => {
        setExportImageIds(prev => [...prev, imageId]);
        setSelectedInitialValue(null);
    }

    const handleRemoveImageId = (imageId: string) => {
        setExportImageIds(prev => prev.filter(id => id.id !== imageId));
        setSelectedInitialValue(null);
    }

    const handleSelectAll = () => {
        if (exportImageIds.length !== annotationImages.size) {
            setExportImageIds(
                [
                    ...Array.from(annotationImages.values()).map(img => {
                        return {id: img.id!, name: img.fileName}
                    })])
            setSelectedInitialValue(true);

        } else {
            setExportImageIds([]);
            setSelectedInitialValue(false);
        }
    }

    const handleDeleteImages = async () => {
        exportImageIds.forEach(async (data) => {
            await axios.delete(`${HOST}/projects/${projectId}/images/${data.id}`);
            annotationImages.delete(data.id);
        });
        setAnnotationImages(new Map(annotationImages));
    }

    const updateStatus = (updateImage: AnnotationImage) => {
        setAnnotationImages(annotationImages =>
            new Map(Array.from(annotationImages.entries()).map(entry => [entry[0], entry[0] === updateImage.id ? updateImage : entry[1]]))
        );
    }

    let links: LinkDetails[] = [
        {text: "Projects", uri: "/projects"},
        {text: "Settings", uri: `/projects/${projectId}/settings`},
        {text: "Profile", uri: "/me"}
    ];
    if (exportImageIds.length !== 0) {
        links = [{text: "Export", onClick: () => setIsExport(true)}, ...links]
        links = [...links, {text: "Delete", onClick: () => handleDeleteImages()}]
    }

    return (
        <>
            {isExport && <ExportModal imageIds={exportImageIds} onExit={() => setIsExport(false)}/>}
            <ApplicationHeader links={links} headerText={`Project "${projectName}"`}/>
            <div className="projectViewPage">
                <div ref={previewAnnotationImageTableRef} className="previewAnnotationImageTableImageNonPicked">
                    <PreviewAnnotationImageTable
                        annotationImages={Array.from(annotationImages.values())}
                        onImageRowClick={onCurrentImageChange}
                        onImageCheck={(id: string, name: string, isChecked: boolean) => isChecked ? handleAddImageId({id, name}) : handleRemoveImageId(id)}
                        onSelectAll={handleSelectAll}
                        selectedInitialValue={selectedInitialValue}
                    />
                </div>
                <div ref={drawAreaRef} className="drawAreaCanvasNonPicked">
                    {currentImageId && (<AnnotatingWorkingArea
                        onCurrentImageUpdated={updateStatus}
                        key={currentImageId}
                        currentImage={annotationImages.get(currentImageId)!}/>)}
                </div>
            </div>
        </>
    );
}