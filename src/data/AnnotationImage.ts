import Comment from "./Comment";

export default class AnnotationImage {
    id?: string;
    projectId: number;
    fileName: string;
    width?: number;
    height?: number;
    comments: Comment[];
    status: number;
    annotatedBy?: string;

    constructor(projectId: number, imageName: string, comments: Comment[], status: number, annotatedBy?: string, id?: string) {
        this.id = id;
        this.comments = comments;
        this.projectId = projectId;
        this.fileName = imageName;
        this.status = status;
        this.annotatedBy = annotatedBy;
    }
}