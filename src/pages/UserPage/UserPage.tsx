import React, {useEffect, useState} from "react";
import {HOST} from "../../util/constants";
import License from "../../data/License";
import User from "../../data/User";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {ApplicationHeader} from "../Header/ApplicationHeader";

interface UserPageProps {
}

export const UserPage: React.FC<UserPageProps> = () => {

    let navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVerification, setPasswordVerification] = useState('');
    const [licenses, setLicenses] = useState<License[]>([]);

    const [passError, setPassError] = useState('');

    const [isEditing, setIsEditing] = useState(false);
    useEffect(() => {
        const loadMe = async () => {
            let res = await axios.get<User>(`${HOST}/me`);
            setEmail(res.data.email);
            setName(res.data.name ?? '');
            setSurname(res.data.surname ?? '');
            setLicenses(res.data.licenses ?? []);
        }

        loadMe();
    }, [])

    function timestampToDuration(timestamp: number) {
        // Extract the hours, minutes, and seconds from the duration
        const days = Math.floor(timestamp / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timestamp % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timestamp % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timestamp % (1000 * 60)) / 1000);

        // Return the duration as an object
        return {days, hours, minutes, seconds};
    }

    const handleEditProfileBtn = async () => {
        if (isEditing) {
            if (password !== '' && password !== passwordVerification) {
                setPassError("Password and verification must be equal!");
                return;
            }
            let res = await axios.post<User>(`${HOST}/me`, {name, surname, password});
            setName(res.data.name);
            setSurname(res.data.surname);
            setPassword('');
            setPasswordVerification('');
        }
        setIsEditing(prev => !prev);
    }

    return (
        <>
            <ApplicationHeader links={[
                {text: "Projects", uri: "/projects"}
            ]} headerText="Profile"/>
            <div className="centeredWidthContainer">
                <div className="form-container width-half">
                    <h1>Your data</h1>
                    <h2>Email: {email}</h2>
                    <h2>Your name: {(name ?? "") + " " + (surname ?? "")}</h2>
                    {licenses.length > 0 && (
                        <>
                            <h2>Your licenses</h2>
                            <div className="licensesContainer">
                                {licenses.map(license => {
                                    const expired = new Date(Date.now()).getTime() > Date.parse(license.licenseEnd.toString());
                                    let duration = timestampToDuration(new Date(Date.parse(license.licenseEnd.toString())).getTime() - new Date(Date.now()).getTime());
                                    return (
                                        <div
                                            className={"license " + (expired ? "license-expired" : "license-non-expired")}>
                                            <h2>{license.licenseType}</h2>
                                            {!expired && (<>
                                                <h4>Expires in: {duration.days} days {duration.hours} hours</h4>
                                            </>)}
                                            {expired && <h4>Expired</h4>}
                                        </div>
                                    )
                                })}
                            </div>
                        </>
                    )}
                    {isEditing && (<>
                            <div>
                                <label htmlFor="name">Name</label>
                                <input type="name" id="name" placeholder="Enter your name"
                                       className="input-text"
                                       value={name}
                                       onChange={(e) => setName(e.target.value)}/>
                            </div>
                            <div>
                                <label htmlFor="surname">Surname</label>
                                <input type="surname" id="surname" placeholder="Enter your surname"
                                       className="input-text"
                                       value={surname}
                                       onChange={(e) => setSurname(e.target.value)}/>
                            </div>
                            <div>
                                {passError !== '' && <div style={{
                                    width: "100%",
                                    fontSize: 18,
                                    backgroundColor: "#aa1010",
                                    color: "white"
                                }}>{passError}</div>}
                                <label htmlFor="password">Password</label>
                                <input type="password" id="password" placeholder="New password"
                                       className="input-text"
                                       value={password}
                                       onChange={(e) => setPassword(e.target.value)}/>
                            </div>
                            <div>
                                <label htmlFor="passwordVerification">Verify new password</label>
                                <input type="password" id="passwordVerification" placeholder="Verify your password"
                                       className="input-text"
                                       value={passwordVerification}
                                       onChange={(e) => setPasswordVerification(e.target.value)}/>
                            </div>
                        </>
                    )}

                    <button className="btn" onClick={handleEditProfileBtn}>
                        {isEditing ? "Save" : "Edit data"}
                    </button>

                    { licenses.filter(license => new Date(Date.now()).getTime() < Date.parse(license.licenseEnd.toString())).length == 0 &&

                    <button className="btn" onClick={() => {
                        navigate("/purchase");
                    }}>
                        Purchase license
                    </button>
                    }

                    <button className="btn" onClick={() => {
                        localStorage.clear();
                        navigate("/");
                    }}>
                        Log out
                    </button>

                </div>
            </div>
        </>
    );
}