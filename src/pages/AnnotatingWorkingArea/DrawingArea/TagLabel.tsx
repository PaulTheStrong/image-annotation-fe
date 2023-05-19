import React from "react";
import Tag from "../../../data/Tag";
import cross from "../../../assets/cross.png"

interface TagProps {
    tag: Tag;
    onClick?: (tag: Tag) => void;
    onTagRemove?: (tag: Tag) => void;
    mode: TagLabelMode;
    isPicked: boolean;
    showId: number;
}

export enum TagLabelMode {ANNOTATING, EDITING}

export const TagLabel: React.FC<TagProps> = ({tag, onClick, mode, onTagRemove, isPicked, showId}) => {

    const colorPadWrapperRef = React.createRef<HTMLDivElement>();

    let opacity = isPicked || mode === TagLabelMode.EDITING ? "FF" : "30";
    let textColor = isPicked || mode === TagLabelMode.EDITING ? "white" : "black";
    let borderRadius = 3;

    const toggleHover = () => {
        colorPadWrapperRef.current?.classList?.toggle("tagColorPadHover");
        colorPadWrapperRef.current?.classList?.toggle("tagColorPadNonHover");
    }

    const handleOnClick = () => {
        if (onClick) onClick(tag);
    }

    const tagOuterStyle = {
        backgroundColor: tag.color + opacity,
        color: textColor
    };

    const colorPadStyle = {
        height: "inherit",
        backgroundColor: tag.color,
        borderTopLeftRadius: borderRadius,
        borderBottomLeftRadius: borderRadius
    };

    return (
        <div style={{position: "relative", marginBottom: 10}}>
            <div className="tagOuter" onMouseEnter={toggleHover} onMouseLeave={toggleHover} style={tagOuterStyle}>
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
                    {showId}
                </div>
                {mode === TagLabelMode.EDITING && (
                    <img style={{height: "inherit"}} src={cross} onClick={() => {
                        if (onTagRemove) onTagRemove(tag)
                    }} alt=""/>
                )}
            </div>
        </div>
    );
};