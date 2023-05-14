import React from "react";
import Annotation from "../../../data/Annotation";

export enum CanvasState {
    EMPTY_STATE,
    DRAWING,
    PICKED_ITEM,
    DRAGGING_ITEM
}

export interface StateStrategy<T extends Annotation> {

    handleMouseEvent(e: React.MouseEvent<HTMLCanvasElement>): CanvasState;
    getAnnotation(): T;

}