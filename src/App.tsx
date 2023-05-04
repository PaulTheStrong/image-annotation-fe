import "./style/App.css";
import "./style/AnnotatingWorkingArea.css"
import {ProjectViewPage} from "./pages/ProjectViewPage/ProjectViewPage";
import ProjectContext from "./context/ProjectContext";
import {ApplicationHeader} from "./pages/Header/ApplicationHeader";
import Project from "./data/Project";


export default function App() {
    return (
        <div className="App">
            <ProjectContext.Provider value={1}>
                <ApplicationHeader project={new Project(1, "name", "desc")}/>
                <ProjectViewPage />
            </ProjectContext.Provider>
        </div>
    );
}