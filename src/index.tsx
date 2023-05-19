import React from 'react';
import ReactDOM from 'react-dom/client';
import './style/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import axios, {InternalAxiosRequestConfig} from "axios";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

axios.interceptors.request.use((config: InternalAxiosRequestConfig<any>): InternalAxiosRequestConfig<any>  => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Redirect the user to the "/" URI
            window.location.href = '/';
        } else if (error.response && error.response.status === 403) {
            window.location.href = '/projects';
        }
        return Promise.reject(error);
    }
);

root.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
