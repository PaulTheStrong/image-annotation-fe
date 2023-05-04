import React, {useState} from "react";
import "../../../style/Tag.css"
import Tag from "../../../data/Tag";
import {TagLabel, TagLabelMode} from "./TagLabel";

interface TagListEditorProps {
    onTagClick?: (tag: Tag) => void;
    onTagAdd: (tag: Tag) => void;
    onTagUpdate: (tag: Tag) => void;
    onTagRemove: (tag: Tag) => void;
    tags: Tag[];
}

export const TagListEditor: React.FC<TagListEditorProps> = (
    {
        onTagClick,
        onTagAdd,
        onTagUpdate,
        onTagRemove,
        tags,
    }) => {
    const [newTagName, setNewTagName] = useState('');
    const [currentTagId, setCurrentTagId] = useState<number>();

    const handleAddTag = () => {
        if (newTagName.trim() === '') return;
        const r = ("00" + Math.floor(Math.random() * 150).toString(16)).slice(-2);
        const g = ("00" + Math.floor(Math.random() * 150).toString(16)).slice(-2);
        const b = ("00" + Math.floor(Math.random() * 150).toString(16)).slice(-2);
        const newTag = new Tag(newTagName, '#' + r + g + b);
        onTagAdd(newTag);
        setNewTagName('');
    };

    const handleTagClick = (tag: Tag) => {
        setCurrentTagId(tag.id);
        if (onTagClick) onTagClick(tag);
    }

    let showId = 0;
    return (
        <div style={{margin: 10}}>
            <div style={{display: "flex", flexWrap: "wrap", alignContent: "stretch", flexDirection: "column"}}>
                {
                    tags.map((tag) => {
                    return (
                        <TagLabel key={tag.color} tag={tag} onClick={handleTagClick} mode={TagLabelMode.EDITING}
                                  onUpdateColor={(newColor) => {
                                      tag.color = newColor;
                                      onTagUpdate(tag);
                                  }}
                                  onTagRemove={onTagRemove}
                                  isPicked={currentTagId === tag.id}
                                  showId={++showId}/>
                    )
                })}
            </div>
            <div className="tag-add">
                <input type="text" placeholder="Название тэга" value={newTagName}
                       onChange={(e) => setNewTagName(e.target.value)}/>
                <button onClick={handleAddTag}>Добавить</button>
            </div>
        </div>
    );
};