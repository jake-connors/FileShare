import { connect } from "react-redux";
import { useEffect, useState, useCallback } from "react";
import { Attachments, AttachmentsLink } from "../components/Attachments";
import { setAFile } from "../redux/actions/";

function UpdateModal({ fileDescription, handleModalInProgress, directory, dispatch, opened_dir, attached_file }) {

    const [attachments, setAttachments] = useState([]);
    const [showAttachments, setShowAttachments] = useState(false);
    const [fileAdded, setFileAdded] = useState(false);
    const [descriptionText, setDescriptionText] = useState("");

    useEffect(() => {
        handleModalInProgress(descriptionText);
    }, [descriptionText]);

    const handleDescriptionChange = (event) => {
        setDescriptionText(event.target.value);
    };

    const onDrop = useCallback((acceptedFiles) => {
        if (attachments.length < 1) {
            dispatch(setAFile([...attachments, ...acceptedFiles], true, false));
            setAttachments([...attachments, ...acceptedFiles]);
            setFileAdded(true);
        } else {
            // I don't think this condition can be hit but just in case
            alert("ERROR"); 
        }
    });

    function removeFile(file) {
        if (attached_file.length) {
            dispatch(setAFile([], true, true));
        }
        const newFiles = [...attachments];
        newFiles.splice(newFiles.indexOf(file), 1);
        setAttachments(newFiles);
        setFileAdded(false);
    }

    return (
        <div id="updateModal" className="row">

            <div id="whichDirUpdate" className="col-sm-10 col-sm-offset-1">
                <select className="form-select" disabled>
                    <option defaultValue>{
                        opened_dir.map((dir) => {
                            if (dir.id == directory) {
                                return dir.name;
                            }
                        })
                    }</option>
                </select>
            </div>
            
            {directory == 1 && 
            <div id="calContestUpdate">
                <div className="col-sm-10 col-sm-offset-1"><h3>Update Description</h3></div>
                <div className="col-sm-6 col-sm-offset-1">
                    <textarea className="form-control" id="descriptionTextUpdateModal"
                        defaultValue={fileDescription}
                        rows="10" onChange={(event) => handleDescriptionChange(event)}>
                    </textarea>
                </div>
                <div className="col-sm-4">
                    <textarea className="form-control" disabled id="enterFollowing" 
                    defaultValue="Please enter the following:
Line 1: Short description of the picture
Line 2: Location where the picture was taken
Line 3: Full name of photographer
Line 4: Photographer relationship to you (if it's not you)
Line 5: City, State you work out of" rows="10">
                    </textarea>      
                </div>
                <div className="col-sm-10 col-sm-offset-1 form-group">
                    <Attachments
                        showAttachments={showAttachments}
                        attachments={attachments}
                        fileAdded={fileAdded}
                        onDrop={onDrop}
                        removeFile={removeFile}
                    />
                    <AttachmentsLink
                        showAttachments={showAttachments}
                        setShowAttachments={setShowAttachments}
                    />
                </div>
            </div>
            }

            {directory == 2 &&
            <div id="woodWorkingUpdate">

                <div className="col-sm-10 col-sm-offset-1"><h3>Enter Description:</h3></div>
                <div className="col-sm-10 col-sm-offset-1">
                    <textarea className="form-control" id="descriptionTextC"
                        rows="10" onChange={(event) => handleDescriptionChange(event)}>
                    </textarea>
                </div>
                <div className="col-sm-10 col-sm-offset-1 form-group">
                    <Attachments
                            attachments={attachments}
                            fileAdded={fileAdded}
                            onDrop={onDrop}
                            removeFile={removeFile}
                        />
                </div>

            </div>

            }

        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        opened_dir: state.dirs.opened_dir,
        attached_file: state.files.attached_file
    };
};

export default connect(mapStateToProps)(UpdateModal);