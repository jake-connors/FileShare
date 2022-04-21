import { connect } from "react-redux";
import { useState } from "react";
import WebbModal from "@webb/modal";
import UploadModal from "./UploadModal";
import {Button} from "react-bootstrap";
import { getDirectoryAndFiles, getCurrentUser } from "../api/manage_file_share";
import { setAFile } from "../redux/actions/";

function UploadButton({ handleCreate, attached_file, uploadableDirs, dispatch }) {

    const [showModal, setShowModal] = useState(false);
    const [modalDescriptionInProgress, setModalDescriptionInProgress] = useState("");
    
    const [selectedDir, setSelectedDir] = useState(0);

    function handleModalUpload() {
        if (document.getElementById("descriptionTextC").value == "") {
            alert('Description cannot be blank');
            document.getElementById("descriptionTextC").focus();
        } else if (attached_file.length < 1) {
            alert('must attach a file');
            document.getElementById("descriptionTextC").focus();
        } else {
            setShowModal(false);
            handleCreate(selectedDir, document.getElementById("descriptionTextC").value, attached_file[0][0]);
            // clear files
            dispatch(setAFile([], true, true));
        }
    }

    function handleModalInProgress(text) {
        // console.log("changed text: ", text);
        setModalDescriptionInProgress(text);
    }

    function checkCloseModal() {
        if (modalDescriptionInProgress) {
            var confirmed = confirm("Description will not save. Close form?");
            if (confirmed) {
                setShowModal(false);
                if (attached_file.length) {
                    dispatch(setAFile([], true, true));
                }
            } else {
                setShowModal(true);
            }
        } else {
            setShowModal(false);
            if (attached_file.length) {
                dispatch(setAFile([], true, true));
            }
        }
    }

    const canUploadFile = async () => {
        // check if this user has uploaded 5 times
        let getObjectUser = {
            mode: "getCurrentUser",
            directory_id: 1
        };
        let user = await getCurrentUser(getObjectUser);
        let getObjectFiles = {
            mode: "getDirectoryAndFiles",
            directory_id: 1 // dir_id: 1 === '2022 Calendar Photos'
        };
        let resp = await getDirectoryAndFiles(getObjectFiles);
        let uploadCount = 0;
        let maxUploadCount = 5;
        if (resp != undefined) {
            console.log('resp : ', resp);
            let visible_files = resp.visible_files;
            visible_files.forEach(file => {
                // count number of files created_by the current user (uploader)
                var creator = file.create_by;
                if (user == creator) {
                    uploadCount += 1;
                }
            });
            
        }
        if (uploadCount < maxUploadCount) {
            return true;
        } else {
            return false;
        }
        
    };

    function handlePassDirId(id) {
        setSelectedDir(id);
    }

    return (
        <>
            <Button
                id="uploadBtn"
                bsStyle="primary"
                className="pull-right"
                onClick={() => {
                    canUploadFile().then((response) => {
                        let canUploadOrNot = response;
                        // console.log(response);
                        if (!canUploadOrNot) {
                            // console.log("Exceeded max uploads. Delete a picture to upload");
                            alert("Maximum 5 uploads. Delete a picture to upload another.");
                            document.getElementById("uploadBtn").blur();
                        } else {
                            if (showModal) {
                                setShowModal(false);
                            } else {
                                setShowModal(true);
                            }
                        }
                    });
                }}
            >Upload</Button>
            <WebbModal
                title="Upload a File"
                body={<UploadModal 
                        handleModalInProgress={handleModalInProgress}
                        uploadableDirs={uploadableDirs}
                        handlePassDirId={handlePassDirId}
                />}
                onHide={() => {
                    checkCloseModal();
                    // setShowModal(false);
                }}
                show={showModal}
                size="lg"
                footer={
                    <Button
                        onClick={() => {handleModalUpload();}}
                        bsStyle="primary"
                    >Upload</Button>
                }
            />
        </>
    );
}

const mapStateToProps = (state) => {
    // console.log("state (upload button) : , " , state);
    return {
        attached_file: state.files.attached_file,
        selected_files: state.files.selected_files,
    };
};

export default connect(mapStateToProps)(UploadButton);