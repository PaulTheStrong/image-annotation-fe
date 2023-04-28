import "./style/App.css";
import "./style/AnnotatingWorkingArea.css"
import {ProjectViewPage} from "./pages/ProjectViewPage/ProjectViewPage";
import ProjectContext from "./context/ProjectContext";


export default function App() {
    return (
        <div className="App">
            <ProjectContext.Provider value={1}>
                {/*<BoundingBoxCanvas imageId={13}/>*/}
                <ProjectViewPage/>
            </ProjectContext.Provider>
        </div>
    );
}