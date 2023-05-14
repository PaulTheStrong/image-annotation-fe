import React, {useContext} from "react";
import Annotation from "../../../data/Annotation";
import {AnnotationType} from "../../../data/AnnotatoinType";
import {BoundingBox} from "../DrawingArea/BoundingBox";
import {BoundingBoxAnnotationListItem} from "./BoundingBoxAnnotationListItem";
import CurrentAnnotationContext from "../../../context/CurrentAnnotationContext";

interface AnnotationListSideBarProps {
    annotations: Annotation[];
}

export const AnnotationListSideBar: React.FC<AnnotationListSideBarProps> = ({annotations}) => {

    const pickedAnnotation = useContext<Annotation | undefined>(CurrentAnnotationContext);
    let id = 0;

    return (
        <div className="annotationListSideBar">
            {annotations.map(annotation => {
                switch (annotation.annotationType) {
                    case AnnotationType.BOUNDING_BOX:
                        return <BoundingBoxAnnotationListItem bbox={annotation as BoundingBox} isActive={pickedAnnotation?.id === annotation.id} showId={++id} key={annotation.id}/>
                }
                throw new Error(`Annotation type ${annotation.annotationType} is not supported`);
            })}
        </div>
    )

}
