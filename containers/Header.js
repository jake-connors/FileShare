import UploadButton from "../components/UploadButton";
import DeleteSelectedFilesButton from "../components/DeleteSelectedFilesButton";
import DownloadSelectedFilesButton from "../components/DownloadSelectedFilesButton";
import { get_export, createFile, deleteFile } from "../api/manage_file_share";
import { connect } from "react-redux";
import { useState } from "react";
import ExcelModal from "@webb/excel_modal";
import Popup_Notify from "@webb/popup-notify";
import { setSelectedFiles } from "../redux/actions";
import ExportSelectedToExcelButton from "../components/ExportSelectedToExcelButton";

function Header({ clearFileDisplay, createTableData, isTableEmpty, uploadableDirs, selected_files, dispatch }) {

    const [allFilesToExport, setAllFilesToExport] = useState({  });
    const [showExcelModal, setShowExcelModal] = useState(false);

    const handleCreate = (directoryId, descriptionInput, attachment) => {
        clearFileDisplay();
        // console.log("attachment", attachment);       
        createFile({
            file_description: descriptionInput,
            directory_id: directoryId,
            file: attachment,
        }).then((response) => {
            // console.log(response.data);
            // console.log(response);
            if (response.data.error !== undefined &&
                response.data.error.length > 0) {
                // console.log("Create unsuccessful....", response);
                Popup_Notify.create_notification(
                    "Error: " + response.data.error,
                    "text-danger"
                );
            } else {
                createTableData();
                // console.log("file successfully created!");
                Popup_Notify.create_notification(
                    "File Created!",
                    "text-success"
                );
            }
        }).catch(err => alert(err));
    };

    function handleBulkDeleteClick() {
        clearFileDisplay();
        var conf = confirm(`Delete ${selected_files.length} Files?`);
        if (conf == true) {
            selected_files.forEach(file => {
                const f_id = file.file_id;
                let deleteObject = {
                    mode: "deleteFile",
                    id: f_id
                };
                deleteFile(deleteObject).then((response) => {
                    // console.log(response);
                    if (response.response === "") {
                        // console.log("file successfully deleted!");
                        createTableData();
                        clearFileDisplay();
                        // un-check checkboxes, clear redux states
                        selected_files.forEach((file) => {
                            dispatch(setSelectedFiles(file, true, true));
                        });
                        Popup_Notify.create_notification(
                            "Files Deleted!",
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
            });
        }
    }

    function handleBulkDownloadClick() {
        clearFileDisplay();
        var conf = confirm(`Download ${selected_files.length} Files?`);
        if (conf == true) {
            var link = document.createElement('a');
            link.style.display = 'none';
            document.body.appendChild(link);
            for(var i = 0; i < selected_files.length; i++) {
                var path = selected_files[i].file_path;
                var i2 = path.lastIndexOf('/');
                if (i2 != -1) {
                    path = path.substr(i2+1);
                }
                link.setAttribute('download', path);
                link.setAttribute('href', window.location.href + "files/" + selected_files[i].file_path);
                link.click();
            }
            document.body.removeChild(link);
            // un-check checkboxes, clear redux states
            selected_files.forEach((file) => {
                dispatch(setSelectedFiles(file, true, true));
            });
        }
    }

    function handleBulkExportClick() {
        clearFileDisplay();
        let getObject = {
            mode: "get_export",
            directory_id: 1
        };
        
        get_export(getObject).then((resp) => {
            // console.log("get_export: " , resp);
            if (resp.errorMsg === "") {
                setAllFilesToExport(resp);
                setShowExcelModal(true);
            } else {
                console.log("response: ", resp);
                alert("Error: ", resp.response);
            }
        }).catch(err => alert(err));       
        
    }


    function handleExcelModalClose() {
        showExcelModal ? setShowExcelModal(false) : setShowExcelModal(true);

        selected_files.forEach((file) => {
            dispatch(setSelectedFiles(file, true, true));
        });
    }

    return (
        <div id="headerDiv" className="row">
            <div className="col-sm-12 form-group">
                { isTableEmpty &&
                    <DeleteSelectedFilesButton
                        selectedCount={selected_files.length}
                        handleBulkDeleteClick={handleBulkDeleteClick}
                    />
                }
                { isTableEmpty &&
                    <DownloadSelectedFilesButton
                        selectedCount={selected_files.length}
                        handleBulkDownloadClick={handleBulkDownloadClick}
                    />
                }
                { isTableEmpty &&
                    <ExportSelectedToExcelButton
                        handleBulkExportClick={handleBulkExportClick}
                    />
                }
                <ExcelModal
                    show={showExcelModal}
                    onHide={handleExcelModalClose}
                    excelResult={allFilesToExport}
                />
                <UploadButton
                    handleCreate={handleCreate}
                    uploadableDirs={uploadableDirs}
                />
            </div>
        </div>
    );
}

const mapStateToProps = (state) => {
    // console.log("state (Header): ", state);
    return {
        selected_files: state.files.selected_files,
    };
};

export default connect(mapStateToProps)(Header);