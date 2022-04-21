import { connect } from "react-redux";
import { useEffect, useState, useCallback } from "react";
import { Attachments } from "../components/Attachments";
import { setAFile } from "../redux/actions/";

function UploadModal({ handleModalInProgress, uploadableDirs, handlePassDirId, dispatch, attached_file }) {

    const [attachments, setAttachments] = useState([]);
    const [fileAdded, setFileAdded] = useState(false);
    const [descriptionText, setDescriptionText] = useState("");

    const [selectedDir, setSelectedDir] = useState(0);

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
            // ? I don't think this condition can be hit but.. ?
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

    function handleSelectDir(e) {
        console.log(e);
        setSelectedDir(e);
        handlePassDirId(e);
        setDescriptionText("");
    }

    return (
        <div id="createDiv" className="row">

            <div id="whichDir" className="col-sm-10 col-sm-offset-1">
                <select className="form-select" onChange={(e) => handleSelectDir(e.target.value)}>
                    <option defaultValue>Select Directory</option>
                    {uploadableDirs.map((dir, index) => {
                        return <option key={index} value={dir.id}>{dir.title}</option>;
                    })}
                </select>
            </div>

            {selectedDir == 1 && 
            <div id="calContest">

                <div className="col-sm-10 col-sm-offset-1"><h3>Enter Description:</h3></div>
                <div className="col-sm-6 col-sm-offset-1">
                    <textarea className="form-control" id="descriptionTextC"
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
                            attachments={attachments}
                            fileAdded={fileAdded}
                            onDrop={onDrop}
                            removeFile={removeFile}
                        />
                </div>

            </div>
            }

            {selectedDir == 2 &&
            <div id="woodWorking">

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
        attached_file: state.files.attached_file,
    };
};

export default connect(mapStateToProps)(UploadModal);