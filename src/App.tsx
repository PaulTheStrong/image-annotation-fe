import "./style/App.css";
import "./style/AnnotatingWorkingArea.css"
import "./style/ProjectSelectPage.css"
import "./style/ProjectSettingsPage.css"
import "./style/TagList.css"
import "./style/AppHeader.css"
import "./style/AuthPage.css"
import "./style/UserPage.css"
import "./style/PurchaseLicensePage.css"
import "./style/Stripe.css"

import {ProjectViewPage} from "./pages/ProjectViewPage/ProjectViewPage";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {ProjectSettingsPage} from "./pages/ProjectSettingsPage/ProjectSettingsPage";
import {ProjectSelectPage} from "./pages/ProjectSelectPage/ProjectSelectPage";
import {AuthPage} from "./pages/Login/AuthPage";
import {RegisterPage} from "./pages/Login/RegisterPage";
import {LoginPage} from "./pages/Login/LoginPage";
import {UserPage} from "./pages/UserPage/UserPage";
import {PurchaseLicensePage} from "./pages/PurchaseLicensePage/PurchaseLicensePage";
import AccessDeniedPage from "./pages/AccessDeniedPage";

const router = createBrowserRouter([
    {
        path: "/projects/:projectId", element: <ProjectViewPage/>
    },
    {
        path: "/projects", element: <ProjectSelectPage/>
    },
    {
        path: "/projects/new", element: <ProjectSettingsPage isNew={true}/>
    },
    {
        path: "/projects/:projectId/settings", element: <ProjectSettingsPage isNew={false}/>
    },
    {
        path: "/auth", element: <AuthPage />
    },
    {
        path: "/register", element: <RegisterPage />
    },
    {
        path: "/", element: <LoginPage />
    },
    {
        path: "/me", element: <UserPage/>
    },
    {
        path: "/purchase", element: <PurchaseLicensePage />
    },
    {
        path: "/access-denied", element: <AccessDeniedPage />
    }
])

export default function App() {
    return (
        <div className="App">
            <RouterProvider router={router}/>
        </div>
    );
}