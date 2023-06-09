import React from "react";
import "../../../style/Tag.css"
import Tag from "../../../data/Tag";
import {TagLabel, TagLabelMode} from "./TagLabel";

interface TagListProps {
    onTagClick: (tag: Tag) => void;
    tags: Tag[];
    currentTagId: number | undefined;
}

export const TagList: React.FC<TagListProps> = ({onTagClick, tags, currentTagId}) => {

    let showId = 0;

    return (
        <div style={{display: "flex", flexWrap: "wrap", flexDirection: "row"}}>
            {tags.map((tag) => {
                return (
                    <TagLabel
                        key={tag.color}
                        tag={tag}
                        onClick={onTagClick}
                        mode={TagLabelMode.ANNOTATING}
                        isPicked={currentTagId === tag.id}
                        showId={++showId}
                    />
                )
            })}
        </div>
    );
};