export default class AnnotationImage {
    id?: number;
    projectId: number;
    fileName: string;
    width?: number;
    height?: number;

    constructor(projectId: number, imageName: string, id?: number) {
        this.id = id;
        this.projectId = projectId;
        this.fileName = imageName;
    }
}