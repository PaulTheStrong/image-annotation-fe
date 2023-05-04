export default class Comment {
    id?: number;
    authorEmail?: number;
    createdAt?: string;
    isResolved?: boolean;
    text: string;
    constructor(text: string, id?: number, authorEmail?: number, createdAt?: string, isResolved?: boolean) {
        this.id = id;
        this.authorEmail = authorEmail;
        this.createdAt = createdAt;
        this.isResolved = isResolved;
        this.text = text;
    }
}