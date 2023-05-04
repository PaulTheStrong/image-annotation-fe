import Annotation from "../../../data/Annotation";
import {AnnotationType} from "../../../data/AnnotatoinType";
import Dimension2D from "../../../data/Dimension2D";

export class BoundingBox implements Annotation {
    id?: number;

    tagId: number;
    color: string;

    annotationType: AnnotationType;
    data: {
        xStart: number,
        yStart: number,
        xEnd: number,
        yEnd: number
    };

    constructor(xStart: number, yStart: number, xEnd: number, yEnd: number, tagId: number, color: string, id?: number) {
        this.id = id;
        this.data = {
            xStart: xStart,
            yStart: yStart,
            xEnd: xEnd,
            yEnd: yEnd
        };
        this.tagId = tagId;
        this.color = color;
        this.annotationType = AnnotationType.BOUNDING_BOX;
    }

    isPointInside(ptX: number, ptY: number) {
        let data = this.data;
        let up = Math.min(data.yStart, data.yEnd);
        let down = Math.max(data.yStart, data.yEnd);
        let left = Math.min(data.xStart, data.xEnd);
        let right = Math.max(data.xStart, data.xEnd);

        return ptX > left && ptX < right && ptY > up && ptY < down;
    }

    moveFigure(deltaX: number, deltaY: number) {
        return new BoundingBox(
            this.data.xStart + deltaX,
            this.data.yStart + deltaY,
            this.data.xEnd + deltaX,
            this.data.yEnd + deltaY,
            this.tagId,
            this.color,
            this.id
        )
    }

    drawFigure(context: CanvasRenderingContext2D, canvasSize: Dimension2D, imageSize: Dimension2D, isPicked: boolean) {

        const canvasWidth = canvasSize.width;
        const canvasHeight = canvasSize.height;

        const imageWidth = imageSize.width;
        const imageHeight = imageSize.height;

        let color = this.color;
        let width = Math.abs(this.data.xEnd - this.data.xStart) / imageWidth * canvasWidth;
        let height = Math.abs(this.data.yEnd - this.data.yStart) / imageHeight * canvasHeight;
        let x = Math.min(this.data.xStart, this.data.xEnd) / imageWidth * canvasWidth;
        let y = Math.min(this.data.yStart, this.data.yEnd) / imageHeight * canvasHeight;

        context.globalAlpha = 1;
        context.strokeStyle = color;
        context.lineWidth = isPicked ? 2 : 1;
        context.strokeRect(x, y, width, height);

        context.fillStyle = color;
        context.globalAlpha = 0.2;
        context.fillRect(x, y, width, height);
    }
}
