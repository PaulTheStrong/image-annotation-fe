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

    let [isDone, setIdDone] = useState(Math.ceil(Math.random() * 2)  === 1);

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

    const getStatusTag = () => {
        switch (imageData.status) {
            case 0:
                return <div className="imageTableCompletedAt" style={{color: "blue"}}>In Progress</div>
            case 1:
                return  <div className="imageTableCompletedAt" style={{color: "red"}}>Done</div>
            case 2:
                return  <div className="imageTableCompletedAt" style={{color: "green"}}>Approved</div>
            default:
                return <div></div>
        }
    }

    return (
        <div className="imageTableRow" onClick={() => {
            if (onImageRowClick && imageData.id) onImageRowClick(imageData.id)
        }}>
            <div className="imageTableCheckBox" onClick={handleImageCheck}>
                <input type="checkbox" checked={isChecked} readOnly={true}/>
            </div>
            <div className="imageTableId">{imageData.fileName}</div>
            {getStatusTag()}
            <div className="imageTableCompletedBy">{imageData.annotatedBy}</div>
            <div className="imageTablePreview">
                <img src={imageSrc} alt={imageData.fileName} className="annotationImagePreview"/>
            </div>
        </div>
    );
}