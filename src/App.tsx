import "./style/App.css";
import "./style/AnnotatingWorkingArea.css"
import "./style/ProjectSelectPage.css"
import "./style/ProjectSettingsPage.css"
import "./style/TagList.css"
import "./style/AppHeader.css"
import {ProjectViewPage} from "./pages/ProjectViewPage/ProjectViewPage";
import {ApplicationHeader} from "./pages/Header/ApplicationHeader";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {ProjectSettingsPage} from "./pages/ProjectSettingsPage/ProjectSettingsPage";
import {ProjectSelectPage} from "./pages/ProjectSelectPage/ProjectSelectPage";

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
])

export default function App() {
    return (
        <div className="App">
            <RouterProvider router={router}/>
        </div>
    );
}