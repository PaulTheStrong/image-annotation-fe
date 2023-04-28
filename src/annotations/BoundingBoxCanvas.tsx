import React, {useContext, useEffect, useRef, useState} from "react";
import {BoundingBox} from "./BoundingBox";
import Tag from "./Tag";
import {PROJECT_IMAGES_BASE_URL, PROJECT_TAGS_BASE_URL} from "../util/constants";
import axios from "axios";
import {TagList} from "./TagList";
import ProjectContext from "../context/ProjectContext";

enum CanvasState {
    EMPTY_STATE,
    DRAWING,
    PICKED_ITEM,
    DRAGGING_ITEM
}

interface BoundingBoxCanvasProps {
    imageId: number;
}

export const BoundingBoxCanvas: React.FC<BoundingBoxCanvasProps> = ({imageId}) => {

    const projectId = useContext<number>(ProjectContext);

    const backgroundImageUrl = PROJECT_IMAGES_BASE_URL.replace("{projectId}", projectId.toString()) + "/" + imageId + "/download";

    const [canvasState, setCanvasState] = useState<CanvasState>(CanvasState.EMPTY_STATE);
    const [startPoint, setStartPoint] = useState({x: 0, y: 0});
    const [endPoint, setEndPoint] = useState({x: 0, y: 0});
    const [boundingBoxes, setBoundingBoxes] = useState<BoundingBox[]>([]);
    const [currentTagId, setCurrentTagId] = useState<number>();
    const [pickedBoundingBoxId, setPickedBoundingBoxId] = useState<number>();
    const [boxId, setBoxId] = useState<number>(0);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [tags, setTags] = useState<Tag[]>([]);
    const [bgImageSize, setBgImageSize] = useState({width: -1, height: -1});

    useEffect(() => {
        axios.get<Tag[]>(PROJECT_TAGS_BASE_URL)
            .then((res) => {
                setTags(res.data);
                console.log(JSON.stringify(res.data))
            })
    }, []);

    const handleTagClick = (tag: Tag) => {
        if (currentTagId === tag.id) {
            setCurrentTagId(undefined);
        } else {
            setCurrentTagId(tag.id);
        }
    };

    const getTagColor = (tagId: number): string => {
        return tags.filter(tag => tag.id === tagId).map(tag => tag.color).pop() ?? "#000000";
    }

    const getPicketBoundingBox = (boxId: number): BoundingBox => {
        return boundingBoxes.filter(box => box.id === boxId).pop()!;
    }

    const handleMouseClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();

        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;

        let isPicked = false;

        switch (canvasState) {
            case CanvasState.EMPTY_STATE:
                for (let box of boundingBoxes) {
                    if (box.isPointInside(x, y)) {
                        isPicked = true;
                        setPickedBoundingBoxId(box.id);
                        setCanvasState(CanvasState.PICKED_ITEM)
                        break;
                    }
                }

                if (!isPicked && currentTagId) {
                    setCanvasState(CanvasState.DRAWING);
                    setStartPoint({x, y});
                    setEndPoint({x, y});
                }
                break;

            case CanvasState.DRAWING:
                const width = Math.abs(endPoint.x - startPoint.x);
                const height = Math.abs(endPoint.y - startPoint.y);

                if (width > 0 && height > 0) {
                    const currentTag = tags.filter(tag => tag.id === currentTagId)[0]!;
                    const newBoundingBox = new BoundingBox(
                        boxId,
                        Math.min(startPoint.x, endPoint.x),
                        Math.min(startPoint.y, endPoint.y),
                        Math.max(startPoint.x, endPoint.x),
                        Math.max(startPoint.y, endPoint.y),
                        currentTag!.id!);
                    setBoxId((prevState) => prevState + 1)
                    setBoundingBoxes(prevState => [...prevState, newBoundingBox]);
                }
                setCanvasState(CanvasState.EMPTY_STATE);
                setCurrentTagId(undefined);
                break;

            case CanvasState.PICKED_ITEM:
                if (getPicketBoundingBox(pickedBoundingBoxId!).isPointInside(x, y)) {
                    setCanvasState(CanvasState.DRAGGING_ITEM);
                    setStartPoint({x, y});
                    setEndPoint({x, y});
                    return;
                }
                isPicked = false;
                for (let box of boundingBoxes) {
                    if (box.isPointInside(x, y)) {
                        isPicked = true;
                        setPickedBoundingBoxId(box.id);
                        setCanvasState(CanvasState.PICKED_ITEM)
                        break;
                    }
                }
                if (!isPicked) {
                    setPickedBoundingBoxId(undefined);
                    setCanvasState(CanvasState.EMPTY_STATE);
                }
                break;

            case CanvasState.DRAGGING_ITEM:
                setCanvasState(CanvasState.PICKED_ITEM);
                break;
        }
    }

    const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();

        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;

        console.log(x, y);

        switch (canvasState) {
            case CanvasState.DRAWING:
                setEndPoint({x, y});
                break;

            case CanvasState.DRAGGING_ITEM:
                let deltaX = x - startPoint.x;
                let deltaY = y - startPoint.y;

                setBoundingBoxes(prevState => prevState.map(
                    box =>
                        box.id === pickedBoundingBoxId
                            ? new BoundingBox(
                                box.id,
                                box.xStart + deltaX,
                                box.yStart + deltaY,
                                box.xEnd + deltaX,
                                box.yEnd + deltaY,
                                box.tagId)
                            : box
                ));
                setStartPoint({x, y});
                break;
        }
    }

    const drawBox = (context: CanvasRenderingContext2D, boundingBox: BoundingBox) => {
        const canvasWidth = canvasRef?.current?.width ?? 0;
        const canvasHeight = canvasRef?.current?.height ?? 0;
        let color = getTagColor(boundingBox.tagId);
        let width = Math.abs(boundingBox.xEnd - boundingBox.xStart) * canvasWidth;
        let height = Math.abs(boundingBox.yEnd - boundingBox.yStart) * canvasHeight;
        let x = Math.min(boundingBox.xStart, boundingBox.xEnd) * canvasWidth;
        let y = Math.min(boundingBox.yStart, boundingBox.yEnd) * canvasHeight;
        context.globalAlpha = 1;
        context.strokeStyle = color;
        context.lineWidth = boundingBox.id === pickedBoundingBoxId ? 3 : 1;
        context.strokeRect(x, y, width, height);
        context.fillStyle = color;
        context.globalAlpha = 0.2;
        context.fillRect(x, y, width, height);
    }

    React.useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        context.clearRect(0, 0, canvas.width, canvas.height);

        for (const boundingBox of boundingBoxes) {
            drawBox(context, boundingBox);
        }
        if (canvasState === CanvasState.DRAWING) {
            drawBox(context, new BoundingBox(-1, startPoint.x, startPoint.y, endPoint.x, endPoint.y, currentTagId!))
        }

    }, [boundingBoxes, canvasState, currentTagId, endPoint, startPoint, pickedBoundingBoxId]);

    const onTagUpdate = (tag: Tag) => {
        setBoundingBoxes([...boundingBoxes]);
    }

    const onTagRemove = (removedTag: Tag) => {
        axios.delete(PROJECT_TAGS_BASE_URL + "/" + removedTag.id)
            .then((res) => {
                setTags(prevState => prevState.filter(tag => removedTag.id !== tag.id));
                setBoundingBoxes(prevBoxes => prevBoxes.filter(box => box.tagId !== removedTag.id));
                if (currentTagId && removedTag?.id === currentTagId) {
                    setCurrentTagId(undefined);
                    setCanvasState(CanvasState.EMPTY_STATE);
                }
            });
    }

    const handleTagAdd = (newTag: Tag) => {
        axios.post(PROJECT_TAGS_BASE_URL, newTag)
            .then((res) => {
                setTags(oldValue => [...oldValue, res.data]);
            });
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        const backgroundImage = new Image();
        backgroundImage.src = backgroundImageUrl;
        backgroundImage.onload = () => {
            let initialWidth = canvas!.width;
            let initialHeight = canvas!.height;

            canvas!.width = backgroundImage.width > canvas!.parentElement!.clientWidth
                ? canvas!.parentElement!.clientWidth
                : backgroundImage.width;

            canvas!.height = backgroundImage.width > canvas!.parentElement!.clientWidth
                ? backgroundImage.height * (initialWidth / backgroundImage.width)
                : initialHeight;
        }
    }, [backgroundImageUrl]);

    return (
        <div className="annotationWorkingAreaCanvasContainer">
            <canvas
                ref={canvasRef}
                onMouseMove={handleMouseMove}
                onClick={handleMouseClick}
                style={{
                    backgroundImage: "url(" + backgroundImageUrl + ")"
                }}
            />
            <TagList onTagClick={handleTagClick} tags={tags} currentTagId={currentTagId}/>
            {/*<TagListEditor onAddTag={handleTagAdd} onTagUpdate={onTagUpdate}*/}
            {/*               onTagRemove={onTagRemove} tags={tags} currentTagId={currentTagId}/>*/}

        </div>
    );
};