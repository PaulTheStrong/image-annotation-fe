import {TagList} from "./TagList";
import React, {useContext} from "react";
import Tag from "../../../data/Tag";
import {AnnotationCanvas} from "./AnnotationCanvas";
import Annotation from "../../../data/Annotation";
import tagsContext from "../../../context/TagsContext";
import {AnnotationType} from "../../../data/AnnotatoinType";

interface AnnotatingAreaProps {
    annotations: Annotation[];
    currentTag?: Tag;
    currentAnnotationType?: AnnotationType;

    onTagClick: (tag: Tag) => void;

    onAnnotationUpdate: (annotation: Annotation) => Promise<any>;
    onAnnotationAdd: (annotation: Annotation) => Promise<any>;
    onAnnotationRemove: (annotation: Annotation) => Promise<any>;
    onAnnotationPick: (annotation?: Annotation) => void;
}

export const AnnotatingArea: React.FC<AnnotatingAreaProps> = (
    {
        annotations,
        currentTag,
        currentAnnotationType,

        onTagClick,

        onAnnotationUpdate,
        onAnnotationAdd,
        onAnnotationRemove,
        onAnnotationPick
    }) => {

    const tagsMap = useContext(tagsContext);

    return (
        <div className="annotationWorkingAreaCanvasContainer">
            <AnnotationCanvas annotations={annotations}
                              currentAnnotationType={currentAnnotationType}
                              onAnnotationUpdate={onAnnotationUpdate}
                              onAnnotationRemove={onAnnotationRemove}
                              onAnnotationAdd={onAnnotationAdd}
                              onAnnotationPick={onAnnotationPick}
                              currentTag={currentTag}
            />
            <TagList onTagClick={onTagClick} tags={Array.from(tagsMap.values())} currentTagId={currentTag?.id}/>
        </div>
    )

}
