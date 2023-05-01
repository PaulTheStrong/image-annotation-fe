import React, {useContext, useEffect, useRef, useState} from "react";
import {BoundingBox} from "./BoundingBox";
import Tag from "../../../data/Tag";
import {PROJECT_IMAGES_BASE_URL} from "../../../util/constants";
import axios from "axios";
import ProjectContext from "../../../context/ProjectContext";
import AnnotationImage from "../../../data/AnnotationImage";

enum CanvasState {
    EMPTY_STATE,
    DRAWING,
    PICKED_ITEM,
    DRAGGING_ITEM
}

interface BoundingBoxCanvasProps {
    imageId: number;
    boundingBoxes: BoundingBox[];
    currentTag?: Tag;

    onBoundingBoxUpdate: (bbox: BoundingBox) => Promise<any>;
    onBoundingBoxAdd: (bbox: BoundingBox) => Promise<any>;
    onBoundingBoxRemove: (bbox: BoundingBox) => Promise<any>;
}

export const BoundingBoxCanvas: React.FC<BoundingBoxCanvasProps> = (
    {
        imageId,
        boundingBoxes,
        currentTag,
        onBoundingBoxAdd,
        onBoundingBoxUpdate,
        onBoundingBoxRemove
    }) => {

    const projectId = useContext<number>(ProjectContext);

    const imageDataUrl = PROJECT_IMAGES_BASE_URL.replace("{projectId}", projectId.toString()) + "/" + imageId;
    const backgroundImageUrl = imageDataUrl + "/download";

    const [canvasState, setCanvasState] = useState<CanvasState>(CanvasState.EMPTY_STATE);
    const [startPoint, setStartPoint] = useState({x: 0, y: 0});
    const [endPoint, setEndPoint] = useState({x: 0, y: 0});
    const [pickedBoundingBox, setPickedBoundingBox] = useState<BoundingBox>();
    const [imageSize, setImageSize] = useState({width: 0, height: 0})
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleMouseClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();

        const x = (event.clientX - rect.left) / rect.width * imageSize.width;
        const y = (event.clientY - rect.top) / rect.height * imageSize.height;

        let isPicked = false;

        switch (canvasState) {
            case CanvasState.EMPTY_STATE:
                for (let box of boundingBoxes) {
                    if (box.isPointInside(x, y)) {
                        isPicked = true;
                        setPickedBoundingBox(box);
                        setCanvasState(CanvasState.PICKED_ITEM)
                        break;
                    }
                }

                if (!isPicked && currentTag) {
                    setCanvasState(CanvasState.DRAWING);
                    setStartPoint({x, y});
                    setEndPoint({x, y});
                }
                break;

            case CanvasState.DRAWING:
                const width = Math.abs(endPoint.x - startPoint.x);
                const height = Math.abs(endPoint.y - startPoint.y);

                if (width > 0 && height > 0) {
                    onBoundingBoxAdd(new BoundingBox(
                        Math.min(startPoint.x, endPoint.x),
                        Math.min(startPoint.y, endPoint.y),
                        Math.max(startPoint.x, endPoint.x),
                        Math.max(startPoint.y, endPoint.y),
                        currentTag!.id!,
                        currentTag!.color,
                    )).then(() => setCanvasState(CanvasState.EMPTY_STATE));
                }
                break;

            case CanvasState.PICKED_ITEM:
                if (pickedBoundingBox!.isPointInside(x, y)) {
                    setCanvasState(CanvasState.DRAGGING_ITEM);
                    setStartPoint({x, y});
                    setEndPoint({x, y});
                    return;
                }
                isPicked = false;
                for (let box of boundingBoxes) {
                    if (box.isPointInside(x, y)) {
                        isPicked = true;
                        setPickedBoundingBox(box);
                        setCanvasState(CanvasState.PICKED_ITEM)
                        break;
                    }
                }
                if (!isPicked) {
                    setPickedBoundingBox(undefined);
                    setCanvasState(CanvasState.EMPTY_STATE);
                }
                break;

            case CanvasState.DRAGGING_ITEM:
                onBoundingBoxUpdate(pickedBoundingBox!).then(() => setCanvasState(CanvasState.PICKED_ITEM));
                break;
        }
    }

    const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();

        const x = (event.clientX - rect.left) / rect.width * imageSize.width;
        const y = (event.clientY - rect.top) / rect.height * imageSize.height;

        switch (canvasState) {
            case CanvasState.DRAWING:
                setEndPoint({x, y});
                break;

            case CanvasState.DRAGGING_ITEM:
                let deltaX = (x - startPoint.x);
                let deltaY = (y - startPoint.y);

                setPickedBoundingBox(prevBox =>
                    new BoundingBox(
                        prevBox!.data.xStart + deltaX,
                        prevBox!.data.yStart + deltaY,
                        prevBox!.data.xEnd + deltaX,
                        prevBox!.data.yEnd + deltaY,
                        prevBox!.tagId,
                        prevBox!.color,
                        prevBox?.id
                    )
                );
                setStartPoint({x, y});
                break;
        }
    }

    const drawBox = (context: CanvasRenderingContext2D, boundingBox: BoundingBox) => {
        const canvasWidth = canvasRef?.current?.width ?? 0;
        const canvasHeight = canvasRef?.current?.height ?? 0;

        const imageWidth = imageSize.width;
        const imageHeight = imageSize.height;

        let color = boundingBox.color;
        let width = Math.abs(boundingBox.data.xEnd - boundingBox.data.xStart) / imageWidth * canvasWidth;
        let height = Math.abs(boundingBox.data.yEnd - boundingBox.data.yStart) / imageHeight * canvasHeight;
        let x = Math.min(boundingBox.data.xStart, boundingBox.data.xEnd) / imageWidth * canvasWidth;
        let y = Math.min(boundingBox.data.yStart, boundingBox.data.yEnd) / imageHeight * canvasHeight;

        context.globalAlpha = 1;
        context.strokeStyle = color;
        context.lineWidth = boundingBox.id === pickedBoundingBox?.id ? 2 : 1;
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
            if (boundingBox.id !== pickedBoundingBox?.id) {
                drawBox(context, boundingBox);
            } else {
                drawBox(context, pickedBoundingBox!);
            }
        }
        if (canvasState === CanvasState.DRAWING) {
            drawBox(context, new BoundingBox(
                startPoint.x,
                startPoint.y,
                endPoint.x,
                endPoint.y,
                currentTag!.id!,
                currentTag!.color))
        }

    }, [boundingBoxes, canvasState, pickedBoundingBox, startPoint, endPoint, drawBox, currentTag, imageSize.width, imageSize.height]);

    useEffect(() => {
        axios.get<AnnotationImage>(imageDataUrl)
            .then(res => {
                const canvas = canvasRef.current;
                let initialWidth = canvas!.width;
                let initialHeight = canvas!.height;

                const imageWidth = res.data.width!;
                const imageHeight = res.data.height!;

                canvas!.width = imageWidth > canvas!.parentElement!.clientWidth
                    ? canvas!.parentElement!.clientWidth
                    : imageWidth;

                canvas!.height = imageWidth > canvas!.parentElement!.clientWidth
                    ? imageHeight * (initialWidth / imageWidth)
                    : initialHeight;
                setImageSize({width: imageWidth, height: imageHeight})
            });
    }, [imageDataUrl]);

    return (
        <canvas
            ref={canvasRef}
            onMouseMove={handleMouseMove}
            onClick={handleMouseClick}
            style={{
                backgroundImage: "url(" + backgroundImageUrl + ")"
            }}
        />
    );
};