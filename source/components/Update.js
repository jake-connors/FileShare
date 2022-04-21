// import { connect } from "react-redux";
// import { useState, useCallback } from "react";
// import { Attachments/*,AttachmentsLink*/ } from "../components/Attachments";

// function Update({ handleUpdate }) {

//     const [attachments, setAttachments] = useState([]);
//     const [showAttachments, setShowAttachments] = useState(false);
//     const [fileAdded, setFileAdded] = useState(false);

//     const onDrop = useCallback((acceptedFiles) => {
//         if (attachments.length < 1) {
//             setAttachments([...attachments, ...acceptedFiles]);
//             setFileAdded(true);
//         } else {
//             // I don't think this condition can be hit but just in case
//             alert("ERROR"); 
//         }
//     });

//     function removeFile(file) {
//         const newFiles = [...attachments];
//         newFiles.splice(newFiles.indexOf(file), 1);
//         setAttachments(newFiles);
//         setFileAdded(false);
//     }

//     function handleUpdateButtonClicked() {

//         let idText = document.getElementById("idTextU").value;
//         let descriptionInput = document.getElementById("descriptionTextU").value;
//         if (document.getElementById("idTextU").value == "") {
//             alert('ID value cannot be blank');
//             document.getElementById("idTextU").focus();
//         } else if (document.getElementById("descriptionTextU").value == "" && attachments.length == 0) {
//             alert('Description or File must be set');
//             document.getElementById("descriptionTextU").focus();
//         } else {
//             document.getElementById("idTextU").value = "";
//             document.getElementById("descriptionTextU").value = "";
//             handleUpdate(idText, descriptionInput, attachments[0]);

//             setAttachments([]);
//             setShowAttachments(false);
//             setFileAdded(false);
//         }
        
//     }

//     return (
//         <div id="updateDiv" className="row">
//             <div className="col-sm-10 col-sm-offset-1"><h3>Update File</h3></div>
//             <div className="col-sm-10 col-sm-offset-1">
//                 <input type="text" className="form-control form-group" id="idTextU" placeholder="Enter file id:"></input> 
//                 <input type="text" className="form-control form-group" id="descriptionTextU" placeholder="Enter description:"></input>
//             </div>
//             <div className="col-sm-10 col-sm-offset-1 form-group">
//                 <Attachments
//                     showAttachments={showAttachments}
//                     attachments={attachments}
//                     fileAdded={fileAdded}
//                     onDrop={onDrop}
//                     removeFile={removeFile}
//                 />
//                 {/* <AttachmentsLink
//                     showAttachments={showAttachments}
//                     setShowAttachments={setShowAttachments}
//                 /> */}
//                 {" "}(optional)
//             </div>
//             <div className="col-sm-10 col-sm-offset-1">
//                 <button id="updateButton" 
//                     className="btn btn-primary"
//                     onClick={handleUpdateButtonClicked}
//                 >
//                     Update
//                 </button>
//             </div>
//         </div>
//     );
// }

// const mapStateToProps = (state) => {
//     return {
//         state: state
//     };
// };

// export default connect(mapStateToProps)(Update);