import AnnotationImage from "../../data/AnnotationImage";
import React from "react";
import {PROJECT_IMAGES_BASE_URL} from "../../util/constants";
import {useParams} from "react-router-dom";

interface PreviewAnnotationImageTableProps {
    imageData: AnnotationImage;
    onImageRowClick?: (annotationImage: string) => void;
}

export const PreviewAnnotationImageTableRow: React.FC<PreviewAnnotationImageTableProps> = ({imageData, onImageRowClick}) => {

    const projectId = Number(useParams<{projectId: string}>().projectId);

    const imageSrc = PROJECT_IMAGES_BASE_URL.replace("{projectId}", projectId.toString()) + "/" + imageData.id + "/downloadPreview";

    return (
        <div className="imageTableRow" onClick={() => { if (onImageRowClick && imageData.id) onImageRowClick(imageData.id)}}>
            <div className="imageTableCheckBox">
                <input type="checkbox"/>
            </div>
            <div className="imageTableId">{imageData.id}</div>
            <div className="imageTableCompletedAt"> </div>
            <div className="imageTableCompletedBy"> </div>
            <div className="imageTablePreview">
                <img src={imageSrc} alt={imageData.fileName} className="annotationImagePreview"/>
            </div>
            <div className="imageTableFileName">{imageData.fileName} </div>

        </div>
    );
}