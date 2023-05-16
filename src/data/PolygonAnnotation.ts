import Annotation from "./Annotation";
import {AnnotationType} from "./AnnotatoinType";
import Dimension2D from "./Dimension2D";
import Point from "./Point";

const TWO_PI = 2 * Math.PI;

export class PolygonAnnotation implements Annotation {
    id?: number;

    tagId: number;
    color: string;

    annotationType: AnnotationType;
    data: {
        points: Point[]
    };

    constructor(points: Point[], tagId: number, color: string, id?: number) {
        this.id = id;
        this.data = {points};
        this.tagId = tagId;
        this.color = color;
        this.annotationType = AnnotationType.POLYGON;
    }

    isPointInside(ptX: number, ptY: number) {
        let isInside = false;
        const polygon = this.data.points;
        const numVertices = polygon.length;

        for (let i = 0, j = numVertices - 1; i < numVertices; j = i++) {
            const vertexI = polygon[i];
            const vertexJ = polygon[j];

            if (
                (vertexI.y > ptY) !== (vertexJ.y > ptY) && ptX <
                ((vertexJ.x - vertexI.x) * (ptY - vertexI.y)) /
                (vertexJ.y - vertexI.y) +
                vertexI.x
            ) {
                isInside = !isInside;
            }
        }

        return isInside;
    }

    moveFigure(deltaX: number, deltaY: number) {
        const newPoints = this.data.points.map(pt => {return {x: pt.x + deltaX, y: pt.y + deltaY}});
        return new PolygonAnnotation(
            newPoints,
            this.tagId,
            this.color,
            this.id
        )
    }

    private readonly radius = 5;

    drawFigure(context: CanvasRenderingContext2D, canvasSize: Dimension2D, imageSize: Dimension2D, isPicked: boolean) {
        const canvasWidth = canvasSize.width;
        const canvasHeight = canvasSize.height;

        const imageWidth = imageSize.width;
        const imageHeight = imageSize.height;

        const canvasToImageWidthRation = 1 / imageWidth * canvasWidth;
        const canvasToImageHeightRation = 1 / imageHeight * canvasHeight;

        let color = this.color;

        const points = this.data.points.map(pt => {return {x: pt.x * canvasToImageWidthRation, y: pt.y * canvasToImageHeightRation}});

        context.globalAlpha = 1;
        context.strokeStyle = color;
        context.lineWidth = isPicked ? 2 : 1;
        context.beginPath();
        context.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            context.lineTo(points[i].x, points[i].y);
        }
        context.closePath();
        context.fillStyle = color;
        context.globalAlpha = 0.2;
        context.fill();
        context.globalAlpha = 1;
        context.stroke();

        points.forEach(pt => {
            context.beginPath();
            context.globalAlpha = 1;
            context.lineWidth = 1;
            context.arc(pt.x, pt.y, this.radius, 0, TWO_PI);
            context.stroke();
            context.globalAlpha = 0.2;
            context.fill();
            context.closePath();
        });
    }

    getPoint(x: number, y: number): number | undefined {
        for (let i = 0; i < this.data.points.length; i++) {
            if (Math.abs(this.data.points[i].x - x) < this.radius && Math.abs(this.data.points[i].y - y) < this.radius)
                return i;
        }
    }

    movePoint(deltaX: number, deltaY: number, point: number): Annotation {
        let points = this.data.points.map((pt, i) => i == point ? {x: pt.x + deltaX, y: pt.y + deltaY} : pt);
        return new PolygonAnnotation(points, this.tagId, this.color, this.id);
    }


}
