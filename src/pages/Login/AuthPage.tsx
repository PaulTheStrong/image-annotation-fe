import React, {useEffect, useState} from "react";
import axios, {toFormData} from "axios";
import {HOST} from "../../util/constants";
import {useNavigate} from "react-router-dom";

interface AuthPageProps {
}

export const AuthPage: React.FC<AuthPageProps> = () => {

    const navigate = useNavigate();

    let [email, setEmail] = useState('');
    let [password, setPassword] = useState('');

    useEffect(() => {
        if (localStorage.getItem("token")) navigate("/projects");
    })

    const handleAuthentication = async () => {
        if (email.trim() === '' || password.trim() === '') return;
        let formData = {email, password};
        let res = await axios.post(`${HOST}/token`, formData);
        let tokens = res.data;
        localStorage.setItem("token", tokens.access_token);
        navigate("/projects");
    }

    return (
        <div className="centeredContainer">
            <div className="form-container width-half">
                <h1>Sign in</h1>
                <div>
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" placeholder="Enter your email"
                           className="input-text"
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" placeholder="Enter your password"
                           className="input-text"
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <button onClick={handleAuthentication} className="btn">Sign in</button>
                <button onClick={() => navigate("/")} className="btn">Back</button>
            </div>
        </div>
    );
}