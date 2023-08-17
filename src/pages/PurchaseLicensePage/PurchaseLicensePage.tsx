import React, {useEffect, useState} from "react";
import {ApplicationHeader} from "../Header/ApplicationHeader";
import LicenseType from "../../data/LicenseType";
import {LicenseTypeCard} from "./LicenseTypeCard";
import {Elements} from "@stripe/react-stripe-js";
import {loadStripe} from "@stripe/stripe-js";
import {HOST} from "../../util/constants";
import axios from "axios";
import {CheckoutForm} from "./CheckoutForm";

interface PurchaseLicensePageProps {
}

const stripePromise = loadStripe("pk_test_51MxXxKDn9IcXEBBE2pFSS3PvHvtD1gFyR05EXh6jDKyXbcUUFGdumTXeTYKmuKTj3ptkrERnHugrpr0oH3OJqCIz00Qk9fItVM");

export const PurchaseLicensePage: React.FC<PurchaseLicensePageProps> = () => {

    const [licenseTypes, setLicenseTypes] = useState<LicenseType[]>([]);
    const [clientSecret, setClientSecret] = useState("");
    const [currentLicenseType, setCurrentLicenseType] = useState<number | null>(null);

    useEffect(() => {
        const loadLicenses = async () => {
            let response = await axios.get<LicenseType[]>(`${HOST}/licenseTypes`);
            setLicenseTypes(response.data);
        }

        loadLicenses();
    }, [])

    const handlePickClick = (licenseTypeId: number) => {
        axios.post<any>(`${HOST}/purchase/intent/${licenseTypeId}`, {
            method: "POST",
        })
        .then((res) => res.data)
        .then((data) => setClientSecret(data.clientSecret))
        .then(() => setCurrentLicenseType(licenseTypeId));
    }

    const handlePurchaseClick = (licenseTypeId: number) => {
        axios.post<any>(`${HOST}/purchase/${licenseTypeId}`, {
            method: "POST",
        })
    }

    return (
        <>
            <ApplicationHeader links={[
                {text: "Account", uri: "/me"}
            ]}/>
            <div className="purchaseLicensePage">
                <h1>Purchase a new license</h1>
                <div className="licenseTypesContainer">
                    {licenseTypes.map(licenseType => <LicenseTypeCard licenseType={licenseType} key={licenseType.id} onBuy={handlePickClick} isActive={currentLicenseType === licenseType.id}/>)}
                </div>
                {clientSecret && (
                    <Elements options={{clientSecret: clientSecret}} stripe={stripePromise}>
                        <CheckoutForm onBuy={() => handlePurchaseClick(currentLicenseType!)}/>
                    </Elements>
                )}
            </div>
        </>
    );
}