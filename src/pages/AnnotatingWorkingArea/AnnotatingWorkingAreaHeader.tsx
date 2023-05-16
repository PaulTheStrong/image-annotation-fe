import React from "react";
import cross from "../../assets/cross.png"
import cursor from "../../assets/cursor.png"
import bbox from "../../assets/bbox.png"
import keypoints from "../../assets/keypoints.png"
import polygon from "../../assets/polygon.png"
import {AnnotationType} from "../../data/AnnotatoinType";


interface AnnotatingWorkingAreaHeaderProps {
    currentAnnotationType?: AnnotationType;

    onAnnotationTypeChange: (type?: AnnotationType) => void;
    onDelete?: () => void;
}

export const AnnotatingWorkingAreaHeader: React.FC<AnnotatingWorkingAreaHeaderProps> = ({
    currentAnnotationType,
    onAnnotationTypeChange,
    onDelete
}) => {

    return (
        <div className="annotatingWorkingAreaHeader">
            <div
                className={`${!currentAnnotationType ? 'headerBtnActive' : ''} headerBtn`}
                onClick={() => onAnnotationTypeChange(undefined)}>
                <img src={cursor} alt=""/>
            </div>
            <div className="headerBtn" onClick={onDelete}>
                <img src={cross} alt=""/>
            </div>
            <div
                className={`${currentAnnotationType === AnnotationType.BOUNDING_BOX ? 'headerBtnActive' : ''} headerBtn`}
                onClick={() => onAnnotationTypeChange(AnnotationType.BOUNDING_BOX)}>
                <img src={bbox} alt=""/>
            </div>
            <div className={`${currentAnnotationType === AnnotationType.POLYGON ? 'headerBtnActive' : ''} headerBtn`}
                 onClick={() => onAnnotationTypeChange(AnnotationType.POLYGON)}>
                <img src={polygon} alt=""/>
            </div>
            <div className={`${currentAnnotationType === AnnotationType.KEY_POINTS ? 'headerBtnActive' : ''} headerBtn`}
                 onClick={() => onAnnotationTypeChange(AnnotationType.KEY_POINTS)}>
                <img src={keypoints} alt=""/>
            </div>
        </div>
    )
}
