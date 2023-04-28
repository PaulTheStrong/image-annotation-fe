import React, {useState} from "react";
import Tag from "./Tag";
import {HexColorPicker} from "react-colorful";
import cross from "../assets/cross.png"

interface TagProps {
    tag: Tag;
    onClick?: (tag: Tag) => void;
    onUpdateColor?: (newColor: string) => void;
    onTagRemove?: (tag: Tag) => void;
    mode: TagLabelMode;
    isPicked: boolean;
}

export enum TagLabelMode {ANNOTATING, EDITING}

export const TagLabel: React.FC<TagProps> = ({tag, onClick, mode, onUpdateColor, onTagRemove, isPicked}) => {

    const colorPadWrapperRef = React.createRef<HTMLDivElement>();
    const [color, setColor] = useState(tag.color);

    let opacity = isPicked || mode === TagLabelMode.EDITING ? "FF" : "30";
    let textColor = isPicked || mode === TagLabelMode.EDITING ? "white" : "black";
    let borderRadius = 3;

    const toggleHover = () => {
        if (mode === TagLabelMode.ANNOTATING) {
            colorPadWrapperRef.current?.classList?.toggle("tagColorPadHover");
            colorPadWrapperRef.current?.classList?.toggle("tagColorPadNonHover");
        }
    }

    const handleOnClick = () => {
        if (onClick) onClick(tag);
    }

    const handleSetColor = (newColor: string) => {
        setColor(newColor);
    }

    const tagOuterStyle = {
        display: "flex",
        borderRadius: borderRadius,
        backgroundColor: tag.color + opacity,
        fontSize: 16,
        borderWidth: 1,
        height: 24,
        color: textColor
    };

    const colorPadStyle = {
        height: "inherit",
        backgroundColor: tag.color,
        borderTopLeftRadius: borderRadius,
        borderBottomLeftRadius: borderRadius
    };

    return (
        <div style={{margin: 5, position: "relative"}}>
            {isPicked && mode === TagLabelMode.EDITING && (
                <HexColorPicker
                    color={color}
                    onChange={handleSetColor}
                    style={{position: "absolute", top: 30, left: 20, zIndex: 2}}
                    onBlur={() => { if (onUpdateColor) onUpdateColor(color); }}/>
            )}
            <div style={tagOuterStyle} onMouseEnter={toggleHover} onMouseLeave={toggleHover}>
                <div ref={colorPadWrapperRef} style={colorPadStyle} className="tagColorPadNonHover"></div>
                <div className="tag"
                     style={{
                         paddingLeft: 10,
                         paddingRight: 10
                     }}
                     onClick={handleOnClick}>
                    {tag.name}
                </div>
                <div style={{paddingRight: 8}}>
                    {tag.id}
                </div>
                {mode === TagLabelMode.EDITING && (
                    <img style={{width: "inherit"}} src={cross} onClick={() => { if (onTagRemove) onTagRemove(tag)}}  alt=""/>
                )}
            </div>
        </div>
    );
};