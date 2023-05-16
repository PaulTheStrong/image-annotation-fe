import React, {useContext} from "react";
import {BoundingBox} from "../../../data/BoundingBox";
import TagsContext from "../../../context/TagsContext";

interface BoundingBoxAnnotationListItemProps {
    bbox: BoundingBox;
    isActive: boolean;
    showId: number;
}

export const BoundingBoxAnnotationListItem: React.FC<BoundingBoxAnnotationListItemProps> = ({bbox, isActive, showId}) => {

    const tagsMap = useContext(TagsContext);

    return (
        <div className="boundingBoxAnnotationListItem" style={{backgroundColor: bbox.color + (isActive ? "70": "30")}}>
            <div className="bboxListItemImage" style={{backgroundColor: tagsMap.get(bbox.tagId)?.color }}></div>
            <div>{showId}</div>
            <div>{tagsMap.get(bbox.tagId)?.name}</div>
        </div>
    )


}
