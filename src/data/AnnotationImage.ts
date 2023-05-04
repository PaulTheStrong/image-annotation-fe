import Comment from "./Comment";

export default class AnnotationImage {
    id?: number;
    projectId: number;
    fileName: string;
    width?: number;
    height?: number;
    comments: Comment[];

    constructor(projectId: number, imageName: string, comments: Comment[], id?: number) {
        this.id = id;
        this.comments = comments;
        this.projectId = projectId;
        this.fileName = imageName;
    }
}