export default class Invitation {
    id?: number;
    email: string;
    roles: number[];

    constructor(email: string, roleIds: number[], id?: number) {
        this.id = id;
        this.email = email;
        this.roles = roleIds;
    }
}