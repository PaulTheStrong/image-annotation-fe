import React, {useEffect, useState} from "react";
import axios, {toFormData} from "axios";
import {HOST} from "../../util/constants";
import {useNavigate} from "react-router-dom";

interface RegisterPageProps {
}

export const RegisterPage: React.FC<RegisterPageProps> = () => {

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVerification, setPasswordVerification] = useState('');

    const [passError, setPassError] = useState('');

    useEffect(() => {
        if (localStorage.getItem("token")) navigate("/projects");
    })

    const handleRegistration = async () => {
        if (email.trim() === '' || password.trim() === '') return;
        if (password !== passwordVerification) {
            setPassError("Password and verification must be equal!");
            return;
        }
        let data = {email, password, name, surname};
        await axios.post(`${HOST}/register`, data);
        let res = await axios.post(`${HOST}/token`, {email, password});
        let token = res.data;
        localStorage.setItem("token", token.access_token);
        navigate("/projects");
    }

    return (
        <div className="centeredContainer">
            <div className="form-container width-half">
                <h1>Register</h1>
                <div>
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" placeholder="Enter your email"
                           className="input-text"
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}/>
                </div>
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
                    {passError !== '' && <div style={{width: "100%", fontSize: 18, backgroundColor: "#aa1010", color: "white"}}>{passError}</div>}
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" placeholder="Enter your password"
                           className="input-text"
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <div>
                    <label htmlFor="passwordVerification">Password verification</label>
                    <input type="password" id="passwordVerification" placeholder="Verify your password"
                           className="input-text"
                           value={passwordVerification}
                           onChange={(e) => setPasswordVerification(e.target.value)}/>
                </div>
                <button onClick={handleRegistration} className="btn">Register</button>
                <button onClick={() => navigate("/")} className="btn">Back</button>
            </div>
        </div>
    );
}