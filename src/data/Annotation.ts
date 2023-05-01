import {AnnotationType} from "./AnnotatoinType";


export default interface Annotation {

    id?: number;
    annotationType: AnnotationType;
    tagId: number;
    data: any;

}