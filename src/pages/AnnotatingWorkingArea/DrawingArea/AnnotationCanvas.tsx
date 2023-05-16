import React, {useContext, useEffect, useRef, useState} from "react";
import {BoundingBox} from "../../../data/BoundingBox";
import Tag from "../../../data/Tag";
import {PROJECT_IMAGES_BASE_URL} from "../../../util/constants";
import Dimension2D from "../../../data/Dimension2D";
import Point from "../../../data/Point";
import Annotation from "../../../data/Annotation";
import ImageContext from "../../../context/ImageContext";
import {useParams} from "react-router-dom";
import {AnnotationType} from "../../../data/AnnotatoinType";
import {CanvasState} from "./CanvasState";
import {PolygonAnnotation} from "../../../data/PolygonAnnotation";

interface AnnotationCanvasProps {
    annotations: Annotation[];
    currentTag?: Tag;
    currentAnnotationType?: AnnotationType;

    onAnnotationUpdate: (annotation: Annotation) => Promise<any>;
    onAnnotationAdd: (annotation: Annotation) => Promise<any>;
    onAnnotationRemove: (annotation: Annotation) => Promise<any>;

    onAnnotationPick: (annotation?: Annotation) => void;
}

enum MouseEventType {
    CLICK, MOVE
}

export const AnnotationCanvas: React.FC<AnnotationCanvasProps> = ({
        annotations,
        currentTag,
        currentAnnotationType,
        onAnnotationAdd,
        onAnnotationUpdate,
        onAnnotationRemove,
        onAnnotationPick
    }) => {

    const projectId = Number(useParams<{ projectId: string }>().projectId);
    const imageId = useContext<string | undefined>(ImageContext);

    const imageDataUrl = PROJECT_IMAGES_BASE_URL.replace("{projectId}", projectId.toString()) + "/" + imageId;
    const backgroundImageUrl = imageDataUrl + "/download";

    const [canvasState, setCanvasState] = useState<CanvasState>(CanvasState.EMPTY_STATE);
    const [pickedAnnotation, setPickedAnnotation] = useState<Annotation>();
    const [imageSize, setImageSize] = useState<Dimension2D>({width: 0, height: 0});
    const [canvasSize, setCanvasSize] = useState<Dimension2D>({width: 0, height: 0});
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [startPoint, setStartPoint] = useState<Point>({x: 0, y: 0});
    const [endPoint, setEndPoint] = useState<Point>({x: 0, y: 0});

    const [polygonPoints, setPolygonPoints] = useState<Point[]>([]);

    const [pickedPoint, setPickedPoint] = useState<number>()

    useEffect(() => {
        if (!currentAnnotationType) {
            setPolygonPoints([]);
            setStartPoint({x: 0, y: 0});
            setEndPoint({x: 0, y: 0});
        }
    }, [canvasState, pickedAnnotation, currentAnnotationType])

    const handleBBoxMouseEvent = (event: React.MouseEvent<HTMLCanvasElement>, eventType: MouseEventType) => {
        const canvas = canvasRef.current!;
        const rect = canvas.getBoundingClientRect();

        const x = (event.clientX - rect.left) / rect.width * imageSize.width;
        const y = (event.clientY - rect.top) / rect.height * imageSize.height;

        switch (canvasState) {
            case CanvasState.EMPTY_STATE:
                if (eventType === MouseEventType.CLICK) {
                    if (currentTag) {
                        setCanvasState(CanvasState.DRAWING);
                        setStartPoint({x, y});
                        setEndPoint({x, y});
                    }
                }
                break;
            case CanvasState.DRAGGING_ITEM:
                if (eventType === MouseEventType.MOVE) {
                    let deltaX = (x - startPoint.x);
                    let deltaY = (y - startPoint.y);
                    if (pickedPoint) {
                        setPickedAnnotation(pickedAnnotation?.movePoint(deltaX, deltaY, pickedPoint));
                    } else {
                        setPickedAnnotation(pickedAnnotation?.moveFigure(deltaX, deltaY));
                    }
                    setStartPoint({x, y});
                } else if (eventType === MouseEventType.CLICK) {
                    onAnnotationUpdate(pickedAnnotation!).then(() => {
                        setCanvasState(CanvasState.PICKED_ITEM);
                        setPickedPoint(undefined);
                    });
                }
                break;
            case CanvasState.PICKED_ITEM:
                if (eventType === MouseEventType.CLICK) {
                    let pt = pickedAnnotation!.getPoint(x, y);
                    if (pt !== undefined) {
                        setPickedPoint(pt);
                        setCanvasState(CanvasState.DRAGGING_ITEM);
                        setStartPoint({x, y});
                    }
                    else if (pickedAnnotation!.isPointInside(x, y)) {
                        setCanvasState(CanvasState.DRAGGING_ITEM);
                        setStartPoint({x, y});
                        return;
                    } else {
                        handleDefaultMouseEvent(event, eventType);
                    }
                }
                break;
            case CanvasState.DRAWING:
                if (eventType === MouseEventType.CLICK) {
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
                } else if (eventType === MouseEventType.MOVE) {
                    setEndPoint({x, y});
                }

                break;
        }
    }

    const handlePolygonMouseEvent = async (event: React.MouseEvent<HTMLCanvasElement>, eventType: MouseEventType) => {
        const canvas = canvasRef.current!;
        const rect = canvas.getBoundingClientRect();

        const x = (event.clientX - rect.left) / rect.width * imageSize.width;
        const y = (event.clientY - rect.top) / rect.height * imageSize.height;

        switch (canvasState) {
            case CanvasState.EMPTY_STATE:
                if (eventType === MouseEventType.CLICK) {
                    if (currentTag) {
                        setCanvasState(CanvasState.DRAWING);
                        setPolygonPoints(prev => [{x, y}]);
                        setEndPoint({x, y});
                    }
                }
                break;

            case CanvasState.DRAGGING_ITEM:
                if (eventType === MouseEventType.MOVE) {
                    let deltaX = (x - startPoint.x);
                    let deltaY = (y - startPoint.y);
                    if (pickedPoint) {
                        setPickedAnnotation(pickedAnnotation?.movePoint(deltaX, deltaY, pickedPoint));
                    } else {
                        setPickedAnnotation(pickedAnnotation?.moveFigure(deltaX, deltaY));
                    }
                    setStartPoint({x, y});
                } else if (eventType === MouseEventType.CLICK) {
                    await onAnnotationUpdate(pickedAnnotation!);
                    setCanvasState(CanvasState.PICKED_ITEM);
                    setPickedPoint(undefined);
                }
                break;

            case CanvasState.PICKED_ITEM:
                if (eventType === MouseEventType.CLICK) {
                    let pt = pickedAnnotation!.getPoint(x, y);
                    if (pt !== undefined) {
                        setPickedPoint(pt);
                        setCanvasState(CanvasState.DRAGGING_ITEM);
                        setStartPoint({x, y});
                    }
                    else if (pickedAnnotation!.isPointInside(x, y)) {
                        setCanvasState(CanvasState.DRAGGING_ITEM);
                        setStartPoint({x, y});
                        return;
                    } else {
                        handleDefaultMouseEvent(event, eventType);
                    }
                }
                break;

            case CanvasState.DRAWING:
                if (eventType === MouseEventType.CLICK) {
                    if (event.button === 0) {
                        if (polygonPoints.length > 2 && Math.abs(x - polygonPoints[0].x) < 5 && Math.abs(y - polygonPoints[0].y) < 5) {
                            await onAnnotationAdd(new PolygonAnnotation(polygonPoints, currentTag!.id!, currentTag!.color));
                            setPolygonPoints([]);
                            setCanvasState(CanvasState.EMPTY_STATE);
                        } else {
                            setPolygonPoints(prev => [...prev, endPoint]);
                        }
                    } else if (event.button === 2) {
                        setPolygonPoints(prev => prev.slice(0, prev.length - 1));
                    }
                } else if (eventType === MouseEventType.MOVE) {
                    setEndPoint({x, y});
                }

                break;
        }
    }

    const handleDefaultMouseEvent = (event: React.MouseEvent<HTMLCanvasElement>, eventType: MouseEventType) => {
        event.preventDefault();
        const canvas = canvasRef.current!;
        const rect = canvas.getBoundingClientRect();

        const x = (event.clientX - rect.left) / rect.width * imageSize.width;
        const y = (event.clientY - rect.top) / rect.height * imageSize.height;

        switch (canvasState) {
            case CanvasState.EMPTY_STATE:
                if (eventType === MouseEventType.CLICK) {
                    for (let annotation of annotations) {
                        if (annotation.isPointInside(x, y)) {
                            setPickedAnnotation(annotation);
                            setCanvasState(CanvasState.PICKED_ITEM)
                            onAnnotationPick(annotation);
                            break;
                        }
                    }
                }
                break;
            case CanvasState.PICKED_ITEM:
                if (eventType === MouseEventType.CLICK) {
                    let isPicked = false;
                    for (let annotation of annotations) {
                        if (annotation.isPointInside(x, y)) {
                            isPicked = true;
                            setPickedAnnotation(annotation);
                            onAnnotationPick(annotation);
                            setCanvasState(CanvasState.PICKED_ITEM)
                            break;
                        }
                    }
                    if (!isPicked) {
                        setPickedAnnotation(undefined);
                        onAnnotationPick(undefined);
                        setCanvasState(CanvasState.EMPTY_STATE);
                    }
                }
                break;
        }
    }

    const handleMouseEvent = (event: React.MouseEvent<HTMLCanvasElement>, eventType: MouseEventType) => {
        event.preventDefault();
        switch (currentAnnotationType) {
            case AnnotationType.BOUNDING_BOX:
                handleBBoxMouseEvent(event, eventType);
                break;
            case AnnotationType.POLYGON:
                handlePolygonMouseEvent(event, eventType);
                break;
            case undefined:
                handleDefaultMouseEvent(event, eventType);
                break;
            default:
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
            switch (currentAnnotationType) {
                case AnnotationType.BOUNDING_BOX:
                    new BoundingBox(startPoint.x, startPoint.y, endPoint.x, endPoint.y, currentTag!.id!, currentTag!.color)
                        .drawFigure(context, canvasSize, imageSize, true);
                    break;
                case AnnotationType.POLYGON:
                    new PolygonAnnotation([...polygonPoints, endPoint], currentTag!.id!, currentTag!.color)
                        .drawFigure(context, canvasSize, imageSize, true);
            }

        }

    }, [annotations, canvasState, currentAnnotationType, currentTag, endPoint, imageSize, pickedAnnotation, polygonPoints, startPoint]);

    const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
        const { naturalWidth, naturalHeight } = event.currentTarget;
        const imageWidth = naturalWidth;
        const imageHeight = naturalHeight;

        const canvas = canvasRef.current;
        const clientWidth = canvas!.parentElement!.clientWidth;

        const canvasWidth = imageWidth > clientWidth
            ? clientWidth
            : imageWidth;
        const canvasHeight = imageHeight * (canvasWidth / imageWidth)

        console.log(clientWidth);
        setCanvasSize({width: canvasWidth, height: canvasHeight});
        setImageSize({width: imageWidth, height: imageHeight})
    }

    return (
        <div style={{width: "100%"}}>
            <img src={backgroundImageUrl} onLoad={handleImageLoad} style={{display: "none"}}/>
            <canvas
                ref={canvasRef}
                onMouseMove={e => handleMouseEvent(e, MouseEventType.MOVE)}
                onClick={e => handleMouseEvent(e, MouseEventType.CLICK)}
                onContextMenu={e => handleMouseEvent(e, MouseEventType.CLICK)}
                width={canvasSize.width}
                height={canvasSize.height}
                style={{
                    backgroundImage: "url(" + backgroundImageUrl + ")"
                }}
            />
        </div>
    );
};