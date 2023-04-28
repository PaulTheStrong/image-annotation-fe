import Classifiable from "./Classifiable";

export class BoundingBox implements Classifiable {
    id: number;
    xStart: number;
    yStart: number;
    xEnd: number;
    yEnd: number;

    tagId: number;

    constructor(id: number, xStart: number, yStart: number, xEnd: number, yEnd: number, tagId: number) {
        this.id = id;
        this.xStart = xStart;
        this.yStart = yStart;
        this.xEnd = xEnd;
        this.yEnd = yEnd;
        this.tagId = tagId;
    }

    isPointInside(ptX: number, ptY: number) {
        let up = Math.min(this.yStart, this.yEnd);
        let down = Math.max(this.yStart, this.yEnd);
        let left = Math.min(this.xStart, this.xEnd);
        let right = Math.max(this.xStart, this.xEnd);

        return ptX > left && ptX < right && ptY > up && ptY < down;
    }
}
