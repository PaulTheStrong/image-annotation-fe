export default class AnnotationImage {
    id?: number;
    projectId: number;
    fileName: string;

    constructor(projectId: number, imageName: string, id?: number) {
        this.id = id;
        this.projectId = projectId;
        this.fileName = imageName;
    }
}