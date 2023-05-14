import React, {useContext, useEffect, useRef, useState} from "react";
import {BoundingBox} from "./BoundingBox";
import Tag from "../../../data/Tag";
import {PROJECT_IMAGES_BASE_URL} from "../../../util/constants";
import axios from "axios";
import AnnotationImage from "../../../data/AnnotationImage";
import Dimension2D from "../../../data/Dimension2D";
import Point from "../../../data/Point";
import Annotation from "../../../data/Annotation";
import ImageContext from "../../../context/ImageContext";
import {useParams} from "react-router-dom";
import {AnnotationType} from "../../../data/AnnotatoinType";
import {CanvasState} from "./StateStrategy";

interface AnnotationCanvasProps {
    annotations: Annotation[];
    currentTag?: Tag;
    currentAnnotationType?: AnnotationType;

    onAnnotationUpdate: (annotation: Annotation) => Promise<any>;
    onAnnotationAdd: (annotation: Annotation) => Promise<any>;
    onAnnotationRemove: (annotation: Annotation) => Promise<any>;

    onAnnotationPick: (annotation?: Annotation) => void;
}

export const AnnotationCanvas: React.FC<AnnotationCanvasProps> = (
    {
        annotations,
        currentTag,
        currentAnnotationType,
        onAnnotationAdd,
        onAnnotationUpdate,
        onAnnotationRemove,
        onAnnotationPick
    }) => {

    const projectId = Number(useParams<{projectId: string}>().projectId);
    const imageId = useContext<number | undefined>(ImageContext);

    const imageDataUrl = PROJECT_IMAGES_BASE_URL.replace("{projectId}", projectId.toString()) + "/" + imageId;
    const backgroundImageUrl = imageDataUrl + "/download";

    const [canvasState, setCanvasState] = useState<CanvasState>(CanvasState.EMPTY_STATE);
    const [startPoint, setStartPoint] = useState<Point>({x: 0, y: 0});
    const [endPoint, setEndPoint] = useState<Point>({x: 0, y: 0});
    const [pickedAnnotation, setPickedAnnotation] = useState<Annotation>();
    const [imageSize, setImageSize] = useState<Dimension2D>({width: 0, height: 0})
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleBBoxMouseEvent = (event: React.MouseEvent<HTMLCanvasElement>) => {

    }

    const handleMouseEvent = (event: React.MouseEvent<HTMLCanvasElement>) => {
        switch (currentAnnotationType) {
            case AnnotationType.BOUNDING_BOX:
                handleBBoxMouseEvent(event);
                break;
            case AnnotationType.POLYGON:

                break;
            default:
                break;
        }
    }

    const handleMouseClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();

        const x = (event.clientX - rect.left) / rect.width * imageSize.width;
        const y = (event.clientY - rect.top) / rect.height * imageSize.height;

        let isPicked = false;

        switch (canvasState) {
            case CanvasState.EMPTY_STATE:
                for (let box of annotations) {
                    if (box.isPointInside(x, y)) {
                        isPicked = true;
                        setPickedAnnotation(box);
                        onAnnotationPick(box);
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
                    onAnnotationAdd(new BoundingBox(
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
                if (pickedAnnotation!.isPointInside(x, y)) {
                    setCanvasState(CanvasState.DRAGGING_ITEM);
                    setStartPoint({x, y});
                    setEndPoint({x, y});
                    return;
                }
                isPicked = false;
                for (let box of annotations) {
                    if (box.isPointInside(x, y)) {
                        isPicked = true;
                        setPickedAnnotation(box);
                        onAnnotationPick(box);
                        setCanvasState(CanvasState.PICKED_ITEM)
                        break;
                    }
                }
                if (!isPicked) {
                    setPickedAnnotation(undefined);
                    onAnnotationPick(undefined);
                    setCanvasState(CanvasState.EMPTY_STATE);
                }
                break;

            case CanvasState.DRAGGING_ITEM:
                onAnnotationUpdate(pickedAnnotation!).then(() => setCanvasState(CanvasState.PICKED_ITEM));
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
                setPickedAnnotation(pickedAnnotation?.moveFigure(deltaX, deltaY));
                setStartPoint({x, y});
                break;
        }
    }

    React.useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        const canvasWidth = canvasRef?.current?.width ?? 0;
        const canvasHeight = canvasRef?.current?.height ?? 0;
        const canvasSize = {width: canvasWidth, height: canvasHeight};

        context.clearRect(0, 0, canvas.width, canvas.height);

        for (const annotation of annotations) {
            if (annotation.id !== pickedAnnotation?.id) {
                annotation.drawFigure(context, canvasSize, imageSize, false);
            } else {
                pickedAnnotation!.drawFigure(context, canvasSize, imageSize, true);
            }
        }

        if (canvasState === CanvasState.DRAWING) {
            new BoundingBox(startPoint.x, startPoint.y, endPoint.x, endPoint.y, currentTag!.id!, currentTag!.color)
                .drawFigure(context, canvasSize, imageSize, true);
        }

    }, [annotations, canvasState, pickedAnnotation, startPoint, endPoint, currentTag, imageSize.width, imageSize.height, imageSize]);

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