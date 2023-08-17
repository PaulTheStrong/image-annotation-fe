import React from "react";
import LicenseType from "../../data/LicenseType";

interface LicenseTypeCardProps {
    isActive?: boolean;
    licenseType: LicenseType;
    onBuy: (licenseTypeId: number) => void;
}

export const LicenseTypeCard: React.FC<LicenseTypeCardProps> = ({licenseType, onBuy, isActive}) => {

    return (
        <div className={`licenseTypeCard ${isActive ? 'licenseTypeCardActive' : ''}`}>
            <h3>{licenseType.name}</h3>
            <p>Duration: {licenseType.duration} days</p>
            <p>Max file size: {licenseType.fileSizeRestriction / 1000000}MB</p>
            <p>Price: {licenseType.price} BYN</p>
            <button type="submit" className="btn" onClick={() => onBuy(licenseType.id)}>Purchase</button>
        </div>
    )
}