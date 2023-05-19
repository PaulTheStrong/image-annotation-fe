import React, {useState} from "react";
import "../../../style/Tag.css"
import Tag from "../../../data/Tag";
import {TagLabel, TagLabelMode} from "./TagLabel";
import {HexColorPicker} from "react-colorful";

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
    const [currentTag, setCurrentTag] = useState<Tag | undefined>();

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
        if (currentTag == null || currentTag.id !== tag.id) {
            setCurrentTag(tag);
        } else {
            setCurrentTag(undefined);
        }
        if (onTagClick) onTagClick(tag);
    }

    const handleSetColor = (newColor: string) => {
        setCurrentTag(prev => new Tag(prev!.name, newColor, prev?.id));
    }

    const handleTagRemove = (tag: Tag) => {
        if (currentTag?.id === tag.id) setCurrentTag(undefined);
        onTagRemove(tag);
    }

    let showId = 0;
    return (
        <div className="tagListEditor">
            <label>Add tags to your project</label>
            <div style={{display: "flex", overflowY: "scroll", columnGap: "5px"}}>
                <div style={{
                    display: "flex",
                    alignContent: "stretch",
                    flexDirection: "column",
                    maxHeight: "200px",
                    width: "100%",
                }}>
                    {
                        tags.map((tag) =>
                            <TagLabel key={tag.color} tag={tag} onClick={handleTagClick} mode={TagLabelMode.EDITING}
                                      onTagRemove={handleTagRemove}
                                      isPicked={currentTag?.id === tag.id}
                                      showId={++showId}/>
                        )
                    }
                </div>
                {currentTag !== undefined && (
                    <div style={{position: "relative"}}>
                        <input type="text" className="input-text" value={currentTag.name} onChange={(e) => setCurrentTag(new Tag(e.target.value, currentTag?.color, currentTag?.id))}/>
                        <HexColorPicker color={currentTag.color} onChange={handleSetColor}/>
                        <button className="btn" onClick={() => {
                            onTagUpdate(currentTag);
                        }}>Set color
                        </button>
                    </div>
                )}
            </div>
            <div className="tag-add">
                <input type="text" placeholder="Enter new tag name" value={newTagName} className="input-text"
                       onChange={(e) => setNewTagName(e.target.value)}/>
                <button onClick={handleAddTag} className="btn">Add new tag</button>
            </div>
        </div>
    );
};