import {TagList} from "./TagList";
import {TagListEditor} from "./TagListEditor";
import React from "react";
import {BoundingBox} from "./BoundingBox";
import Tag from "../../../data/Tag";
import {BoundingBoxCanvas} from "./BoundingBoxCanvas";

interface AnnotatingAreaProps {
    imageId: number;
    boundingBoxes: BoundingBox[];
    tags: Tag[],
    currentTag?: Tag;

    onTagClick: (tag: Tag) => void;
    onTagAdd: (tag: Tag) => void;
    onTagUpdate: (tag: Tag) => void;
    onTagRemove: (tag: Tag) => void;

    onBoundingBoxUpdate: (bbox: BoundingBox) => Promise<any>;
    onBoundingBoxAdd: (bbox: BoundingBox) => Promise<any>;
    onBoundingBoxRemove: (bbox: BoundingBox) => Promise<any>;
}

export const AnnotatingArea: React.FC<AnnotatingAreaProps> = (
    {
        imageId,
        boundingBoxes,
        tags,
        currentTag,

        onTagClick,
        onTagAdd,
        onTagUpdate,
        onTagRemove,

        onBoundingBoxUpdate,
        onBoundingBoxAdd,
        onBoundingBoxRemove,
    }) => {

    return (
        <div className="annotationWorkingAreaCanvasContainer">
            <BoundingBoxCanvas imageId={imageId} boundingBoxes={boundingBoxes}
                               onBoundingBoxUpdate={onBoundingBoxUpdate}
                               onBoundingBoxRemove={onBoundingBoxRemove}
                                onBoundingBoxAdd={onBoundingBoxAdd}
                               currentTag={currentTag}
            />
            <TagList onTagClick={onTagClick} tags={tags} currentTagId={currentTag?.id}/>
            <TagListEditor onTagAdd={onTagAdd} onTagUpdate={onTagUpdate}
                           onTagRemove={onTagRemove} tags={tags} currentTagId={currentTag?.id}/>
        </div>
    )

}
