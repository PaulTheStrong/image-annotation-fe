import Comment from "./Comment";

export default class AnnotationImage {
    id?: string;
    projectId: number;
    fileName: string;
    width?: number;
    height?: number;
    comments: Comment[];

    constructor(projectId: number, imageName: string, comments: Comment[], id?: string) {
        this.id = id;
        this.comments = comments;
        this.projectId = projectId;
        this.fileName = imageName;
    }
}