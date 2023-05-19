import "./style/App.css";
import "./style/AnnotatingWorkingArea.css"
import "./style/ProjectSelectPage.css"
import "./style/ProjectSettingsPage.css"
import "./style/TagList.css"
import "./style/AppHeader.css"
import "./style/AuthPage.css"
import {ProjectViewPage} from "./pages/ProjectViewPage/ProjectViewPage";
import {ApplicationHeader} from "./pages/Header/ApplicationHeader";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {ProjectSettingsPage} from "./pages/ProjectSettingsPage/ProjectSettingsPage";
import {ProjectSelectPage} from "./pages/ProjectSelectPage/ProjectSelectPage";
import {AuthPage} from "./pages/Login/AuthPage";
import {RegisterPage} from "./pages/Login/RegisterPage";
import {LoginPage} from "./pages/Login/LoginPage";

function withHeader(element: JSX.Element, headerText?: string) {
    return <>
        <ApplicationHeader headerText={headerText}/>
        {element}
    </>;
}

const router = createBrowserRouter([
    {
        path: "/projects/:projectId", element: withHeader(<ProjectViewPage/>)
    },
    {
        path: "/projects", element: withHeader(<ProjectSelectPage/>, "Projects")
    },
    {
        path: "/projects/new", element: withHeader(<ProjectSettingsPage isNew={true}/>, "Create new project")
    },
    {
        path: "/projects/:projectId/settings", element: withHeader(<ProjectSettingsPage isNew={false}/>)
    },
    {
        path: "/auth", element: <AuthPage />
    },
    {
        path: "/register", element: <RegisterPage />
    },
    {
        path: "/", element: <LoginPage />
    }
])

export default function App() {
    return (
        <div className="App">
            <RouterProvider router={router}/>
        </div>
    );
}