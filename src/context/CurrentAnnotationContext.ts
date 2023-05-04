import {createContext} from "react";
import Annotation from "../data/Annotation";

const CurrentAnnotationContext = createContext<Annotation | undefined>(undefined);

export default CurrentAnnotationContext;