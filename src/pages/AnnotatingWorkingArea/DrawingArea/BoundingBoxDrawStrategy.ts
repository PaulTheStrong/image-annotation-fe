import {CanvasState, StateStrategy} from "./StateStrategy";
import {BoundingBox} from "./BoundingBox";
import Point from "../../../data/Point";

class BoundingBoxStateStrategy implements StateStrategy<BoundingBox> {

    private startPoint: Point | undefined;
    private endPoint: Point | undefined;
    private currentState: CanvasState = CanvasState.EMPTY_STATE;

    getAnnotation(): BoundingBox {
        return new BoundingBox(0, 0, 0, 0, 0, 'sad')
    }

    handleMouseEvent(e: React.MouseEvent<HTMLCanvasElement>): CanvasState {
        return CanvasState.EMPTY_STATE;
    }

}