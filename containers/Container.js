import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { getFile, updateFile, deleteFile, getDirectoryAndFiles, get_directories_list } from "../api/manage_file_share";
import Table from "../components/Table";
import Header from "./Header";
import Popup_Notify from "@webb/popup-notify";

import { setSelectedFiles, setAFile } from "../redux/actions/";

function Container({ dispatch, selected_files, opened_dir }) {

    const [imageTag, setImageTag] = useState("");
    const [imageNotFound, setImageNotFound] = useState(true);

    const [pdfTag, setPdfTag] = useState("");
    const [pdfNotFound, setPdfNotFound] = useState(true);

    const [fileDescriptionGet, setFileDescriptionGet] = useState("");
    const [allDirsAndFiles, setAllDirsAndFiles] = useState([]);
    const [dirClicked, setDirClicked] = useState(false);

    const [uploadableDirs, setUploadableDirs] = useState([]);

    useEffect(() => {
        console.log('hit createTable useEffect');
        createTableData();
    }, [dirClicked]);

    async function getFilesForDir(dir_id) {
        // jake notes 9/8/21: 
        // instead of ajax call everytime ...
        // one ajax call when page inits(useEffect() ? ) and also after (whenever) more files are upload
        // this ONE ajax call stores file/dirs in a GLOBALVAR (or redux state)
        // we would have arrays of DIrs/files to be used from redux (this is faster than numerous api calls or dirs w/ many files)
        // implement this way if file_share is being worked on again
        // ctrl + f --> 'ajax' or 'await' to see where to use the redux arrays instead of an ajax call
        // build these ajax arrays in useEffect()/componentDidMount()/onInit
        let tempFilesForDir = [];
        let getObject = {
            mode: "getDirectoryAndFiles",
            directory_id: dir_id
        };
        let resp = await getDirectoryAndFiles(getObject); // ... ajax ... | use redux array for this.dir.id ...
        let vf=resp.visible_files;
        for (const file of vf) {
            file['name'] = file['file_name'];
            file['about'] = file['file_description'];
            file['id'] = file['file_id'];
            file['path'] = file['file_path'];
            file['type'] = 'file';
            delete file.file_name;
            delete file.file_description;
            delete file.user_can_delete;
            delete file.user_can_edit;
            delete file.file_type;
            delete file.file_size;
            delete file.file_id;
            delete file.file_path;
            tempFilesForDir.push(file);
        }
        console.log("tempFilesfoDir: ", tempFilesForDir);
        return tempFilesForDir;
    }

    async function createTableData() {
        // parameter is for when using this func for 'refreshing' table data, such as after uploading
        let dirListResp = await get_directories_list({mode: "getDirectoriesList"}); // (ajax) use the global/redux array instead
        let dirArray = dirListResp.directories;

        var tempUploadableDirs = [...uploadableDirs];
        
        for (const item of dirArray) {
            
            var included = false;
            for (let i = 0; i < tempUploadableDirs.length; i++) {
                if (tempUploadableDirs[i].id == item['directory_id']) {
                    included = true;
                    break;
                }
            }
            if (!included) {
                tempUploadableDirs.push({ id: item['directory_id'], title: item['directory_title']});

            }
            
            // normalize directory attributes
            item['name'] = item['directory_title'];
            item['id'] = item['directory_id'];
            item['about'] = 'Directory: ' + item['directory_id'];
            item['type'] = 'directory';
            delete item.directory_title;
            delete item.directory_id;
        }
        setUploadableDirs(tempUploadableDirs);
        if (opened_dir.length === 0) {
            setAllDirsAndFiles(dirArray);
        } else {
            let tempAllDirsAndFiles = [];
            for (const dir of dirArray) {
                tempAllDirsAndFiles.push(dir);
                for (const dir2 of opened_dir) {
                    if (dir.id === dir2.id) {
                        let filesForDirArray = await getFilesForDir(dir.id); // (ajax) ... use array that has all files for this.dir.id...
                        for (const file of filesForDirArray) {
                            tempAllDirsAndFiles.push(file);
                        }
                    }
                }
            }
            setAllDirsAndFiles(tempAllDirsAndFiles);
        }
    }

    const clearFileDisplay = () => {
        setImageTag("");
        setImageNotFound(true);
        setPdfTag("");
        setPdfNotFound(true);
        setFileDescriptionGet("");
        document.getElementById("uploadBtn").focus();
        document.getElementById("uploadBtn").blur();
        // console.log(allVisibleDirsAndFiles);
    };

    const handleGet = (idInput) => {
        clearFileDisplay();
        let getObject = {
            mode: "getFile",
            id: idInput
        };
        getFile(getObject).then((response) => {
            // console.log(response);
            let resp = response.file;
            if (Object.keys(resp).length > 0) {
                setFileDescriptionGet(resp.file_description);
                if (resp.file_type.includes("image")) {
                    // console.log("image found");
                    setImageNotFound(false);
                    setImageTag("files/" + resp.file_path);
                    document.getElementById("imgFile").scrollIntoView({behavior: 'smooth'});
                } else if (resp.file_type.includes("pdf")) {
                    // console.log("pdf found");
                    setPdfNotFound(false);
                    setPdfTag("files/" + resp.file_path);
                    document.getElementById("pdfFile").scrollIntoView({behavior: 'smooth'});
                } else {
                    // other file type
                    // console.log("file type not supported");
                    alert("file type not supported for viewing yet");
                    // Popup_Notify.create_notification(
                    //     "File type not supported yet...",
                    //     "text-danger"
                    // );
                }
            } else {
                // not found
                setImageNotFound(true);
                setPdfNotFound(true);
                alert('file not found');
                // console.log("file not found");
                Popup_Notify.create_notification(
                    "File not found",
                    "text-danger"
                );
            }           
        }).catch(err => alert(err));
    };

    const handleUpdate = (idInput, descriptionInput, file) => {
        // console.log("file: ", file);
        clearFileDisplay();
        updateFile({
            id: idInput,
            file_description: descriptionInput,
            file: file,
        }).then((response) => {
            // console.log(response.data);
            // console.log(response);
            if (response.data.error !== undefined &&
                response.data.error.length > 0) {
                // console.log("Update unsuccessful....");
                Popup_Notify.create_notification(
                    "Error: " + response.data.error,
                    "text-danger"
                );
            } else {
                let fileJustChanged = true;
                createTableData(fileJustChanged);

                selected_files.forEach((file_id) => {
                    dispatch(setSelectedFiles(file_id, true, true));
                });
                dispatch(setAFile([], true, true));
                // console.log("file successfully updated!");
                Popup_Notify.create_notification(
                    "File Updated!",
                    "text-success"
                );
            }
        }).catch(err => alert(err));
    };

    const handleDelete = (idInput) => {
        clearFileDisplay();
        var confirmed = confirm("Are you sure you want to delete?");
        if (confirmed) {
            let deleteObject = {
                mode: "deleteFile",
                id: idInput
            };
            deleteFile(deleteObject).then((response) => {
                // console.log(response);
                if (response.response === "") {
                    let fileJustChanged = true;
                    createTableData(fileJustChanged);
                    
                    // console.log("file successfully deleted!");
                    selected_files.forEach((file) => {
                        dispatch(setSelectedFiles(file, true, true));
                    });
                    dispatch(setAFile([], true, true));
                    Popup_Notify.create_notification(
                        "File Deleted!",
                        "text-success"
                    );
                } else {
                    // console.log("delete unsuccessful....");
                    Popup_Notify.create_notification(
                        "Error...",
                        "text-danger"
                    );
                }
            }).catch(err => alert(err));
        }
    };

    function handleIsDirClicked() {
        if (dirClicked) {
            setDirClicked(false);
        } else {
            setDirClicked(true);
        }
    }

    const imageArea = (
        <div className="col-sm-12 form-group" id="imgBox">
            <h3><b>Description: </b><br></br>{fileDescriptionGet}</h3>
            <img id="imgFile" src={imageTag} alt="image"></img>
        </div>
    );

    const pdfArea = (
        <div className="col-sm-12 form-group">
            <h3><b>Description: </b><br></br>{fileDescriptionGet}</h3>
            <object id="pdfFile" data={pdfTag} type="application/pdf" width="1125px" height="900px"></object>
        </div>
    );

    return (
        <div className="container" id="container">
            <div className="row gray-bkg">
                <div className="col-sm-12 form-group">
                    <h2>File Share</h2>
                </div>
                <div className="col-sm-12">
                    <Header 
                        clearFileDisplay={clearFileDisplay}
                        createTableData={createTableData}
                        isTableEmpty={allDirsAndFiles.length != 0}
                        uploadableDirs={uploadableDirs}
                    />
                    {allDirsAndFiles.length != 0 && 
                        <Table
                            data={allDirsAndFiles}
                            handleGet={handleGet}
                            handleUpdate={handleUpdate}
                            handleDelete={handleDelete}
                            getFilesForDir={getFilesForDir}
                            handleIsDirClicked={handleIsDirClicked}
                        />
                    }
                </div>
                {!imageNotFound && imageArea}
                {!pdfNotFound && pdfArea}
            </div>
        </div>
    );
}

const mapStateToProps = (state) => {
    // console.log("state (container): ", state);
    return {
        selected_files: state.files.selected_files,
        opened_dir: state.dirs.opened_dir,
    };
};

export default connect(mapStateToProps)(Container);