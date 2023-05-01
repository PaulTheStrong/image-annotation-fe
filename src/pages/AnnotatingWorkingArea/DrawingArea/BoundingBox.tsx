import Annotation from "../../../data/Annotation";
import {AnnotationType} from "../../../data/AnnotatoinType";

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

}
