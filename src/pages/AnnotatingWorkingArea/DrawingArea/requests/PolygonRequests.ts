import Tag from "../../../../data/Tag";
import Annotation from "../../../../data/Annotation";
import axios from "axios";
import {POLYGON_ANNOTATIONS_BASE_URL} from "../../../../util/constants";
import {PolygonAnnotation} from "../../../../data/PolygonAnnotation";
import Point from "../../../../data/Point";

export const createPolygonFromData = (data: any, tags: Tag[]) => {
    return new PolygonAnnotation(
        data.polygon as Point[],
        data.annotationTagId,
        tags.filter(tag => tag.id === data.annotationTagId)[0].color,
        data.annotationId);
}

export const handlePolygonAddReq = async (polygon: PolygonAnnotation, imageId: string): Promise<Annotation> => {
    const res = await axios.post(`${POLYGON_ANNOTATIONS_BASE_URL}/${imageId}`, {
        annotationTagId: polygon.tagId,
        polygon: polygon.data.points
    });
    const data = await res.data;
    return new PolygonAnnotation(data.polygon, data.annotationTagId, polygon.color, data.annotationId);
};

export const sendPolygonUpdateReq = async (polygon: PolygonAnnotation, imageId: string): Promise<Annotation> => {
    const res = await axios.put(`${POLYGON_ANNOTATIONS_BASE_URL}/${imageId}/${polygon.id}`, {
        polygon: polygon.data.points
    });
    const data = await res.data;
    return new PolygonAnnotation(data.polygon, data.annotationTagId, polygon.color, data.annotationId);
}