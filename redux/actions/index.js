import {
    getFile,
} from "../../api/manage_file_share";

export const setSelectedFiles = (files, add, clear) => ({
    type: "LOAD_SELECTED_FILES",
    data: files,
    add,
    clear,
});

export const setAFile = (file, add, clear) => ({
    type: "SET_A_FILE",
    data: file,
    add,
    clear,
});

export const addOpenedDir = (dir, add) => ({
    type: "ADD_OPENED_DIR",
    data: dir,
    add,
});

export const addOpenedFile = (file, add) => ({
    type: "ADD_OPENED_FILE",
    data: file,
    add,
});

export function getSelectFiles(file_id, check) {
    let getObject = {
        mode: "getFile",
        id: file_id
    };
    return function (dispatch) {
        getFile(getObject).then((response) => {
            // console.log(response);
            dispatch(setSelectedFiles(response.file, check, false));
        });
    };
}

