import {createContext} from "react";
import Tag from "../data/Tag";

const TagsContext = createContext<Map<number, Tag>>(new Map());

export default TagsContext;