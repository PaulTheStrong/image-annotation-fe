import React, {useEffect, useState} from "react";
import axios, {toFormData} from "axios";
import {HOST} from "../../util/constants";
import {useNavigate} from "react-router-dom";

interface LoginPageProps {
}

export const LoginPage: React.FC<LoginPageProps> = () => {

    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("token")) navigate("/projects");
    })

    return (
        <div className="centeredContainer">
            <div className="form-container width-half">
                <button onClick={() => navigate("/register")} className="btn">Register</button>
                <button onClick={() => navigate("/auth")} className="btn">Sign in</button>
            </div>
        </div>
    );
}