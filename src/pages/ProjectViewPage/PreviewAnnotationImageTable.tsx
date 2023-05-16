import React from "react";
import AnnotationImage from "../../data/AnnotationImage";
import {PreviewAnnotationImageTableRow} from "./PreviewAnnotationImageTableRow";

interface PreviewAnnotationImageTableProps {
    annotationImages: AnnotationImage[];
    onImageRowClick?: (annotationImage: string) => void;
}

export const PreviewAnnotationImageTable: React.FC<PreviewAnnotationImageTableProps> = ({
        annotationImages, onImageRowClick
    }) => {

    return (
        <div className="imageTable">
            <div className="imageTableHeader imageTableRow">
                <div className="imageTableCheckBox"><input type="checkbox"/></div>
                <div className="imageTableId">ID</div>
                <div className="imageTableCompletedAt">Completed</div>
                <div className="imageTableCompletedBy">Annotated by</div>
                <div className="imageTablePreview">Image</div>
                <div className="imageTablePreview">Name</div>
            </div>
            {annotationImages.map(image => (
                <PreviewAnnotationImageTableRow imageData={image} onImageRowClick={onImageRowClick} key={image.id}/>
            ))}
        </div>
    );
}