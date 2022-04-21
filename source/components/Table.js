import { connect } from "react-redux";
import { useMemo, useState } from "react";
import moment from 'moment';
import UpdateModal from "./UpdateModal";
import { CheckBoxCell } from "./CheckBoxes";
import OpenActionMenu from "../containers/OpenActionMenu";
import { Button } from "react-bootstrap";
import { useDefaultTable, RenderDefaultTable } from "@webb/table";
import WebbModal from "@webb/modal";
import Popup_Notify from "@webb/popup-notify";
import { getSelectFiles, setAFile, setSelectedFiles, addOpenedDir, addOpenedFile } from "../redux/actions/";
import { getDirectoryAndFiles } from "../api/manage_file_share";

function Table({ data, handleGet, handleUpdate, handleDelete, getFilesForDir, handleIsDirClicked,
    dispatch, selected_files, attached_file, opened_dir, opened_file }) {

    const [rowFromDir, setRowFromDir] = useState(0);
    const [rowFileID, setRowFileID] = useState(0);
    const [rowFileDescription, setRowFileDescription] = useState("");
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [updateModalDescriptionInProgress, setUpdateModalDescriptionInProgress] = useState("");
    
    
    function handleSelectFile(file_id, isChecked) {
        console.log('isChecked', isChecked, '-', file_id);
        dispatch(getSelectFiles(file_id, isChecked));
    }

    function handleModalUpdate() {

        let descriptionInput = document.getElementById("descriptionTextUpdateModal").value;

        if (!updateModalDescriptionInProgress && attached_file.length < 1) {
            // nothing was changed / updated
            Popup_Notify.create_notification(
                "No Changes Made",
                "text-dark"
            );
            setShowUpdateModal(false);
        } else if (attached_file.length < 1) {
            handleUpdate(rowFileID, descriptionInput, []);
            setShowUpdateModal(false);
        } else {
            handleUpdate(rowFileID, descriptionInput, attached_file[0][0]);
            setShowUpdateModal(false);
        }
        //redux clear ....
        dispatch(setAFile([], true, true));
    }

    function handleModalInProgress(text) {
        // console.log("changed text: ", text);
        setUpdateModalDescriptionInProgress(text);
    }

    function checkCloseModal() {
        if (updateModalDescriptionInProgress) {
            var confirmed = confirm("Updated description will not save. Close form?");
            if (confirmed) {
                setShowUpdateModal(false);
                if (attached_file.length) {
                    dispatch(setAFile([], true, true));
                }
            } else {
                setShowUpdateModal(true);
            }
        } else {
            setShowUpdateModal(false);
            if (attached_file.length) {
                dispatch(setAFile([], true, true));
            }
        }        
    }

    const handleSelectAllFiles = async (isChecked) => {
        for (const dir of opened_dir) {
            let getObject = {
                mode: "getDirectoryAndFiles",
                directory_id: dir.id
            };
            let resp = await getDirectoryAndFiles(getObject); // ... ajax ... | use redux array for this.dir.id
            if (resp != undefined) {
                let visible_files = resp.visible_files;
                visible_files.forEach(file => {
                    if (isChecked) {
                        dispatch(getSelectFiles(file.file_id, true));
                    } else {
                        dispatch(setSelectedFiles(data.file_id, true, true));
                    }
                });
            } else {
                console.log('error, resp undefined');
            }
        }
    };

    function showFileIcon(name) {
        if(name == "dir") {return <i className="fas fa-folder fa-lg" style={{"marginTop" : 5, "color": "Dodgerblue"}}></i>;}
        var extension = name.substr(name.lastIndexOf(".") + 1);        
        extension = extension.toLowerCase();
        switch (extension) {
            case "txt":
            case "csv":
            case "text":
            case "rtf":
            case "msg":
            case "pages":
            case "knt":
            case "rpt":
                return <i className="fas fa-file-alt fa-lg" style={{"marginTop" : 5, "color": "Dodgerblue"}}></i>;
            case "pdf":
                return <i className="fas fa-file-pdf fa-lg" style={{"marginTop" : 5, "color": "Dodgerblue"}}></i>;
            case "jpg":
            case "jpeg":
            case "gif":
            case "eps":
            case "bmp":
            case "tif":
            case "tiff":
            case "png":
                return <i className="fas fa-file-image fa-lg" style={{"marginTop" : 5, "color": "Dodgerblue"}}></i>;
            case "mp4":
            case "mov":
            case "wmv":
            case "flv":
            case "avi":
            case "mkv":
            case "mpg":
                return <i className="fas fa-file-video fa-lg" style={{"marginTop" : 5, "color": "Dodgerblue"}}></i>;
            case "mp3":
            case "wav":
            case "aac":
                return <i className="fas fa-file-audio fa-lg" style={{"marginTop" : 5, "color": "Dodgerblue"}}></i>;
            case "doc":
            case "docx":
                return <i className="fas fa-file-word fa-lg" style={{"marginTop" : 5, "color": "Dodgerblue"}}></i>;
            case "xls":
            case "xlt":
            case "xlam":
            case "xlw":
            case "xlsx":
                return <i className="fas fa-file-excel fa-lg" style={{"marginTop" : 5, "color": "Dodgerblue"}}></i>;
            case "pptx":
            case "ppt":
            case "potx":
            case "ppsx":
            case "pot":
            case "pps": 
                return <i className="fas fa-file-powerpoint fa-lg" style={{"marginTop" : 5, "color": "Dodgerblue"}}></i>;
            case "js":
            case "html":
            case "htm":
            case "php":
            case "py":
            case "css":
            case "less":
            case "class":
            case "java":
            case "sh":
            case "cs":
            case "vb":
            case "sys":
                return <i className="fas fa-file-code fa-lg" style={{"marginTop" : 5, "color": "Dodgerblue"}}></i>;
            default:
                return <i className="fas fa-file fa-lg" style={{"marginTop" : 5, "color": "Dodgerblue"}}></i>;
        }
    }

    function handleGetAction(id) {
        handleGet(id);
    }

    function handleUpdateAction(fromDir, id, description) {
        setRowFromDir(fromDir);
        setRowFileID(id);
        setRowFileDescription(description);
        if (showUpdateModal) {
            setShowUpdateModal(false);
        } else {
            setShowUpdateModal(true);
        }
    }

    function handleDownloadAction(filePath) {
        var link = document.createElement('a');
        link.style.display = 'none';
        document.body.appendChild(link);
        var path = window.location.href + "files/" + filePath;
        var i2 = path.lastIndexOf('/');
        if (i2 != -1) {
            path = path.substr(i2+1);
        }
        link.setAttribute('download', path);
        link.setAttribute('href', window.location.href + "files/" + filePath);
        link.click();
        document.body.removeChild(link);
    }

    function handleDeleteAction(id) {
        handleDelete(id);
    }

    async function handleDirClick(dir, alreadyOpened) {
        let filesForDirArray = await getFilesForDir(dir.id); // ... ajax ... | use the redux dir that has this.dir.id
        if (alreadyOpened) { 
            // Dir is already opened, logic to close
            dispatch(addOpenedDir(dir, false));
            filesForDirArray.forEach((file) => {
                // // uncheck this folder's files (checkbox'es)
                // dispatch(setSelectedFiles(file, false)); // ... clears all selected .. do it for just files in the dir that we're closing
                // remove open file
                dispatch(addOpenedFile(file, false));
            });
        } else {
            // Dir is closed, logic to open the files
            dispatch(addOpenedDir(dir, true));
            filesForDirArray.forEach((file) => {
                dispatch(addOpenedFile(file, true));
            });
        }
        handleIsDirClicked();
    }

    const columns = [
        {
            Header: () => (
                <div className="file-checkbox" style={{"textAlign" : "center"}}>
                    <input
                        type="checkbox"
                        onChange={(event) => {
                            handleSelectAllFiles(event.target.checked);
                        }}
                        checked={selected_files.length != 0}
                        disabled={opened_dir.length === 0}
                    />
                </div>
            ),
            disableFilters: true,
            sortable: false,
            disableResizing: true,
            width: 40,
            id: "checkboxes",
            align: "center",
            style: { padding: 0 },
            Cell: (info) => {
                const file_id = info.row.original.id;
                return (
                    <>
                    {info.row.original.type == 'file' && 
                        <CheckBoxCell
                            checked={ selected_files.length != 0 &&
                                selected_files.map(file => file.file_id).indexOf(file_id) !== -1
                            }
                            handleChange={(isChecked) =>
                                handleSelectFile(file_id, isChecked)
                            }
                            row={info.row.index}
                        />
                    }
                    </> 
                );
            },
        },
        {
            Header: "Name",
            accessor: "file_name",
            className: "text-left",
            maxWidth: 80,
            minResizeWidth: 20,
            Cell: (info) => {
                return (
                    <>
                        {info.row.original.type == 'directory' ? 
                        <div id="fileName">
                            {showFileIcon("dir")}
                            {" "}
                            
                            <button 
                                className="tableDirName" 
                                onClick={() => {
                                    let alreadyOpened = false;
                                    for (const dir of opened_dir) {
                                        if (dir.id === info.row.original.id) {
                                            alreadyOpened = true;
                                        }
                                    }
                                    handleDirClick(info.row.original, alreadyOpened);
                                }}>
                                <b>{info.row.original.name}</b>
                            </button>
                        </div> : 
                        <div id="fileName">
                            {showFileIcon(info.row.original.name)}
                            {" "}
                            <a 
                                className="tableFileName" 
                                href={window.location.href + "files/" + info.row.original.path} 
                                download
                            >
                                {info.row.original.name}
                            </a>
                        </div>}
                    </>
                );
            },
            // filtrable: true
        },
        {
            Header: "Description",
            accessor: "about",
            className: "text-left",
            maxWidth: 280,
            minResizeWidth: 20,
            // filtrable: true
        },
        {
            Header: "Created By",
            accessor: "create_by",
            className: "text-left",
            maxWidth: 40,
            minResizeWidth: 20,
            // filtrable: true
        },
        {
            Header: "Last Modified",
            accessor: row => row.type=='file' ? moment(row.last_modified_dt).format('MMM Do YYYY, h:mm a') : moment(row.create_dt).format('MMM Do YYYY, h:mm a'),
            className: "text-left",
            maxWidth: 45,
            minResizeWidth: 20,
            // filtrable: true
        },
        {
            Header: "",
            id:"action",
            align: "center",
            filterable: false,
            sortable: false,
            maxWidth: 25,
            className: "text-left",
            resizable: false,
            style: { overflow: "visible", padding: "0px"},
            minResizeWidth: 20,
            Cell: (info) => (
                <>
                { info.row.original.type == 'file' ?
                    <OpenActionMenu
                        rowFromDir={info.row.original.from_dir}
                        rowFileID={info.row.original.id}
                        rowFileDescription={info.row.original.about}
                        rowFilePath={info.row.original.path}
                        handleGetAction={handleGetAction}
                        handleUpdateAction={handleUpdateAction}
                        handleDownloadAction={handleDownloadAction}
                        handleDeleteAction={handleDeleteAction}
                    /> :
                    " "
                }
                </>
            ),
        }
    ];



//////////////////////////////////////////////////////////





    // // Real.
    // // const fileColumns = [
    // const columns = [
    //     {
    //         Header: () => (
    //             <div className="file-checkbox" style={{"textAlign" : "center"}}>
    //                 <input
    //                     type="checkbox"
    //                     onChange={(event) =>
    //                         handleSelectAllFiles(event.target.checked)
    //                     }
    //                     checked={selected_files.length != 0}
    //                 />
    //             </div>
    //         ),
    //         disableFilters: true,
    //         sortable: false,
    //         disableResizing: true,
    //         width: 40,
    //         id: "checkboxes",
    //         align: "center",
    //         style: { padding: 0 },
    //         Cell: (info) => {
    //             const file_id = info.row.original.file_id;
    //             return (
    //                 <CheckBoxCell
    //                     checked={ selected_files.length != 0 &&
    //                         selected_files.map(file => file.file_id).indexOf(file_id) !== -1
    //                     }
    //                     handleChange={(isChecked) =>
    //                         handleSelectFile(file_id, isChecked)
    //                     }
    //                     row={info.row.index}
    //                 />
    //             );
    //         },
    //     },
    //     {
    //         Header: "Name",
    //         accessor: "file_name",
    //         className: "text-left",
    //         maxWidth: 80,
    //         minResizeWidth: 20,
    //         Cell: (info) => {
    //             return (
    //                 <div id="fileName">
    //                     {showFileIcon(info.row.original.file_name)}
    //                     {" "}
    //                     <a 
    //                         className="tableFileName" 
    //                         href={window.location.href + "files/" + info.row.original.file_path} 
    //                         download
    //                     >
    //                         {info.row.original.file_name}
    //                     </a>
    //                 </div>
    //             );
    //         },
    //         // filtrable: true
    //     },
    //     {
    //         Header: "Description",
    //         accessor: "file_description",
    //         className: "text-left",
    //         maxWidth: 280,
    //         minResizeWidth: 20,
    //         // filtrable: true
    //     },
    //     {
    //         Header: "Created By",
    //         accessor: "create_by",
    //         className: "text-left",
    //         maxWidth: 40,
    //         minResizeWidth: 20,
    //         // filtrable: true
    //     },
    //     {
    //         Header: "Last Modified",
    //         // accessor: "last_modified_dt",
            
    //         accessor: row => moment(row.last_modified_dt).format('MMM Do YYYY, h:mm a'),
    //         className: "text-left",
    //         maxWidth: 45,
    //         minResizeWidth: 20,
    //         // filtrable: true
    //     },
    //     {
    //         Header: "",
    //         id:"action",
    //         align: "center",
    //         filterable: false,
    //         sortable: false,
    //         maxWidth: 25,
    //         className: "text-left",
    //         resizable: false,
    //         style: { overflow: "visible", padding: "0px"},
    //         minResizeWidth: 20,
    //         Cell: (info) => (
    //             <OpenActionMenu
    //                 rowFileID={info.row.original.file_id}
    //                 rowFileDescription={info.row.original.file_description}
    //                 rowFilePath={info.row.original.file_path}
    //                 handleGetAction={handleGetAction}
    //                 handleUpdateAction={handleUpdateAction}
    //                 handleDownloadAction={handleDownloadAction}
    //                 handleDeleteAction={handleDeleteAction}
    //             />
    //         ),
    //     }
    // ];

    // console.log("colmuns: ", columns);
    // console.log("testCols: ", testCols);
    
    // console.log("before table cosnt!!");
    // console.log("table data is: ", data);
    const table = useDefaultTable({
        data: useMemo(() => data, [data]),
        columns: useMemo(() => columns, [data, opened_dir, opened_file, selected_files]), //table refreshs when chk boxes are cleared
        initialState: {
            pageSize: 15,
            sortBy: [], //[{ id: "viewed_ticket", asc: true }],
        },
    });

    return (
        <>
        <div id="tableReact" className="col-sm-12 form-group">
            {data && data.length &&
            <div className="row">    
                <RenderDefaultTable
                    table={table}
                    paginate={true}
                    className="react-table-highlight-row"
                />
            </div>
            }
            {<WebbModal
                title="Update a File"
                body={<UpdateModal 
                        fileDescription={rowFileDescription}
                        handleModalInProgress={handleModalInProgress}
                        directory={rowFromDir}
                />}
                onHide={() => {
                    checkCloseModal();
                    // setShowModal(false);
                }}
                show={showUpdateModal}
                size="lg"
                footer={
                    <Button
                        onClick={() => {handleModalUpdate();}}
                        bsStyle="primary"
                    >Update</Button>
                }
            />}
        </div>
    </>
    );
}

const mapStateToProps = (state) => {
    // console.log("state (table): ", state);
    return {
        attached_file: state.files.attached_file,
        selected_files: state.files.selected_files,
        opened_dir: state.dirs.opened_dir,
        opened_file: state.files.opened_File
    };
};

export default connect(mapStateToProps)(Table);