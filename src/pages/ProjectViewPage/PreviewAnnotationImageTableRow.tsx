import AnnotationImage from "../../data/AnnotationImage";
import React, {useEffect, useState} from "react";
import {PROJECT_IMAGES_BASE_URL} from "../../util/constants";
import {useParams} from "react-router-dom";

interface PreviewAnnotationImageTableProps {
    imageData: AnnotationImage;
    onImageRowClick?: (annotationImage: string) => void;
    onImageCheck?: (id: string, name: string, isChecked: boolean) => void;
    selectedInitialValue: boolean | null;
}

export const PreviewAnnotationImageTableRow: React.FC<PreviewAnnotationImageTableProps> = (
    {
        imageData,
        onImageRowClick,
        onImageCheck,
        selectedInitialValue
    }) => {

    const projectId = Number(useParams<{ projectId: string }>().projectId);

    const imageSrc = PROJECT_IMAGES_BASE_URL.replace("{projectId}", projectId.toString()) + "/" + imageData.id + "/downloadPreview";
    const [isChecked, setIsChecked] = useState(false);

    const handleImageCheck = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
        e.stopPropagation();
        setIsChecked(prev => !prev);
        onImageCheck?.(imageData.id!, imageData.fileName, !isChecked);
    }

    useEffect(() => {
        if (selectedInitialValue != null) {
            setIsChecked(selectedInitialValue);
        }
    }, [selectedInitialValue])

    return (
        <div className="imageTableRow" onClick={() => {
            if (onImageRowClick && imageData.id) onImageRowClick(imageData.id)
        }}>
            <div className="imageTableCheckBox" onClick={handleImageCheck}>
                <input type="checkbox" checked={isChecked} readOnly={true}/>
            </div>
            <div className="imageTableId">{imageData.id}</div>
            <div className="imageTableCompletedAt"></div>
            <div className="imageTableCompletedBy"></div>
            <div className="imageTablePreview">
                <img src={imageSrc} alt={imageData.fileName} className="annotationImagePreview"/>
            </div>
            <div className="imageTableFileName">{imageData.fileName}</div>
        </div>
    );
}