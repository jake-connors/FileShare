import { combineReducers } from "redux";
import initial from "./initial";
import general from "./general";
import files from "./files";
import dirs from "./dirs";

const rootReducer = combineReducers({
    files,
    dirs,
    general,
});

export { rootReducer, initial };
