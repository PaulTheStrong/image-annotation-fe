import Tag from "../../../../data/Tag";
import {BoundingBox} from "../../../../data/BoundingBox";
import Annotation from "../../../../data/Annotation";
import axios from "axios";
import {BBOX_ANNOTATIONS_BASE_URL} from "../../../../util/constants";

export const createBBoxFromData = (data: any, tags: Tag[]) => {
    return new BoundingBox(
        data.boundingBox.x1,
        data.boundingBox.y1,
        data.boundingBox.x2,
        data.boundingBox.y2,
        data.annotationTagId,
        tags.filter(tag => tag.id === data.annotationTagId)[0].color,
        data.annotationId);
}

export const handleBBoxAddReq = async (bbox: BoundingBox, imageId: string): Promise<Annotation> => {
    const res = await axios.post(`${BBOX_ANNOTATIONS_BASE_URL}/${imageId}`, {
        annotationTagId: bbox.tagId,
        boundingBox: {
            x1: bbox.data.xStart,
            y1: bbox.data.yStart,
            x2: bbox.data.xEnd,
            y2: bbox.data.yEnd
        }
    });
    const data = await res.data;
    return new BoundingBox(data.boundingBox.x1, data.boundingBox.y1, data.boundingBox.x2, data.boundingBox.y2, data.annotationTagId, bbox.color, data.annotationId);
};

export const sendBboxUpdateReq = async (bbox: BoundingBox, imageId: string): Promise<Annotation> => {
    const res = await axios.put(`${BBOX_ANNOTATIONS_BASE_URL}/${imageId}/${bbox.id}`, {
        boundingBox: {
            x1: bbox.data.xStart,
            y1: bbox.data.yStart,
            x2: bbox.data.xEnd,
            y2: bbox.data.yEnd
        }
    });
    const data = await res.data;
    return new BoundingBox(data.boundingBox.x1, data.boundingBox.y1, data.boundingBox.x2, data.boundingBox.y2, data.annotationTagId, bbox.color, data.annotationId);
}