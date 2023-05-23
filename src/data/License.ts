export default interface License {
    id: number;
    ownerId: number;
    licenseType: string;
    licenseStart: Date;
    licenseEnd: Date;
}