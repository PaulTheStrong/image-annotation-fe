export default class Tag {
    id?: number;
    name: string;
    color: string;


    constructor(name: string, color: string, id?: number) {
        this.id = id;
        this.name = name;
        this.color = color;
    }

}
