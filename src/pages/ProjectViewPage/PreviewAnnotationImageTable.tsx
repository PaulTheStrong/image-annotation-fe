import React from "react";
import AnnotationImage from "../../data/AnnotationImage";
import {PreviewAnnotationImageTableRow} from "./PreviewAnnotationImageTableRow";

interface PreviewAnnotationImageTableProps {
    annotationImages: AnnotationImage[];
    onImageRowClick?: (annotationImage: string) => void;
    onImageCheck: (id: string, name: string, isChecked: boolean) => void;
    onSelectAll: () => void;
    selectedInitialValue: boolean | null;
}

export const PreviewAnnotationImageTable: React.FC<PreviewAnnotationImageTableProps> = (
    {
        annotationImages,
        onImageRowClick,
        onImageCheck,
        onSelectAll,
        selectedInitialValue
    }) => {

    return (
        <div className="imageTable">
            <div className="imageTableHeader imageTableRow">
                <div className="imageTableCheckBox"><input defaultChecked={selectedInitialValue ?? false} type="checkbox" onClick={e => {
                    e.stopPropagation();
                    onSelectAll();
                }}/></div>
                <div className="imageTableId">Name</div>
                <div className="imageTableCompletedAt">Status</div>
                <div className="imageTableCompletedBy">Annotated by</div>
                <div className="imageTablePreview">Image</div>
            </div>
            {annotationImages.map(image => (
                <PreviewAnnotationImageTableRow imageData={image} onImageRowClick={onImageRowClick} key={image.id}
                                                onImageCheck={onImageCheck}
                                                selectedInitialValue={selectedInitialValue}/>
            ))}
        </div>
    );
}