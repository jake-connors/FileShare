import go from "@webb/go";
import axios from "axios";
// import qs from "qs";

export const createFile = ({
    file_description,
    directory_id,
    file,
}) => {
    
    var formData = new FormData();
    formData.append("file_description", file_description);
    formData.append("directory_id", directory_id);
    formData.append("upload", file);

    return axios.post("/api/file_share/file_create", formData, {
        headers: {
            "content-type": "multipart/form-data",
        },
    });
};

export const getFile = (getObject) => {
    return go.get("/api/file_share/file_read", getObject);
};

export const updateFile = ({
    id,
    file_description,
    file,
}) => {
    var formData = new FormData();
    formData.append("id", id);
    formData.append("file_description", file_description);
    formData.append("upload", file);
    return axios.post("/api/file_share/file_update", formData, {
        headers: {
            "content-type": "multipart/form-data",
        },
    });
};

export const deleteFile = (deleteObject) => {
    return go.post("/api/file_share/file_delete", deleteObject);
};

export const getDirectoryAndFiles = (getObject) => {
    return go.get("/api/file_share/directory_read", getObject);
};

export const getCurrentUser = (getObject) => {
    return go.get("/api/file_share/directory_read", getObject);
};

export const get_export = (getObject) => {
    return go.get("/api/file_share/directory_read", getObject);
};

export const get_directories_list = (getObject) => {
    return go.get("/api/file_share/directory_read", getObject);
};
