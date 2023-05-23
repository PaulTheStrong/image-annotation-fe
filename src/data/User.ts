import License from "./License";

export default interface User {

    id: number;
    email: string;
    name: string;
    surname: string;
    licenses: License[];

}