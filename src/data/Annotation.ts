import {AnnotationType} from "./AnnotatoinType";
import Dimension2D from "./Dimension2D";


export default interface Annotation {

    id?: number;
    annotationType: AnnotationType;
    tagId: number;
    data: any;

    isPointInside(x: number, y: number): boolean;
    moveFigure(deltaX: number, deltaY: number): Annotation;
    drawFigure(context: CanvasRenderingContext2D, canvasSize: Dimension2D, imageSize: Dimension2D, isPicked: boolean): void;
    getPoint(x: number, y: number): number | undefined;
    movePoint(deltaX: number, deltaY: number, point: number): Annotation;
}