// import UploadButton from "../components/UploadButton";
// import DeleteSelectedFilesButton from "../components/DeleteSelectedFilesButton";
// import DownloadSelectedFilesButton from "./DownloadSelectedFilesButton";
// import { createFile, deleteFile/*, deleteMultipleFiles*/ } from "../api/manage_file_share";
// import { connect } from "react-redux";
// import Popup_Notify from "@webb/popup-notify";

// import { setSelectedFiles } from "../redux/actions/";

// function Header({ clearFileDisplay, getVisibleFiles, isTableEmpty, selected_files,
//     dispatch }) {

//     const handleCreate = (descriptionInput, attachment) => {
//         clearFileDisplay();
//         // console.log("attachment", attachment);       
//         createFile({
//             file_description: descriptionInput,
//             directory_id: 1,
//             file: attachment,
//         }).then((response) => {
//             // console.log(response.data);
//             // console.log(response);
//             if (response.status == 200) {
//                 getVisibleFiles();
//                 // console.log("file successfully created!");
//                 Popup_Notify.create_notification(
//                     "File Created!",
//                     "text-success"
//                 );
//             } else {
//                 // console.log("Create unsuccessful....", response);
//                 Popup_Notify.create_notification(
//                     "Error..." + response.data.error,
//                     "text-danger"
//                 );
//             }

//         }).catch(err => alert(err));
//     };

    
//     function handleBulkDeleteClick() {
//         clearFileDisplay();
//         var conf = confirm(`Delete ${selected_files.length} Files?`);
//         if (conf == true) {
//             // let deleteObject = {
//             //     mode: "deleteMultipleFiles",
//             //     file_ids_array: selected_for_bulk_action
//             // };
//             // deleteMultipleFiles(deleteObject).then((response) => {
//             //     console.log("response: ", response);
//             //     if (response.success == 1) {
//             //         getVisibleFiles();
//             //         // console.log("file successfully deleted!");
//             //         Popup_Notify.create_notification(
//             //             "File Deleted!",
//             //             "text-success"
//             //         );
//             //     } else {
//             //         // console.log("delete unsuccessful....");
//             //         Popup_Notify.create_notification(
//             //             "Error...",
//             //             "text-danger"
//             //         );
//             //     }
//             // }).catch(err => alert(err));

//             selected_files.forEach(file => {
//                 const f_id = file.file_id;
//                 let deleteObject = {
//                     mode: "deleteFile",
//                     id: f_id
//                 };
//                 deleteFile(deleteObject).then((response) => {
//                     // console.log(response);
//                     if (response.success == 1) {
//                         // console.log("file successfully deleted!");
//                         getVisibleFiles();
//                         clearFileDisplay();
//                         // un-check checkboxes, clear redux states
//                         selected_files.forEach((file) => {
//                             dispatch(setSelectedFiles(file, true, true));
//                         });
//                         Popup_Notify.create_notification(
//                             "Files Deleted!",
//                             "text-success"
//                         );
//                     } else {
//                         // console.log("delete unsuccessful....");
//                         Popup_Notify.create_notification(
//                             "Error...",
//                             "text-danger"
//                         );
//                     }
//                 });
//             });
//         }
//     }

//     function handleBulkDownloadClick() {
//         var conf = confirm(`Download ${selected_files.length} Files?`);
//         if (conf == true) {
//             var link = document.createElement('a');
//             link.style.display = 'none';
//             document.body.appendChild(link);
//             for(var i = 0; i < selected_files.length; i++) {
//                 var path = selected_files[i].file_path;
//                 var i2 = path.lastIndexOf('/');
//                 if (i2 != -1) {
//                     path = path.substr(i2+1);
//                 }
//                 link.setAttribute('download', path);
//                 link.setAttribute('href', window.location.href + "files/" + selected_files[i].file_path);
//                 link.click();
//             }
//             document.body.removeChild(link);

//             // un-check checkboxes, clear redux states
//             selected_files.forEach((file) => {
//                 dispatch(setSelectedFiles(file, true, true));
//             });
//         }
//     }

//     return (
//         <div id="headerDiv" className="row">
//             <div className="col-sm-12 form-group">
//                 { isTableEmpty &&
//                     <DeleteSelectedFilesButton
//                         selectedCount={selected_files.length}
//                         handleBulkDeleteClick={handleBulkDeleteClick}
//                     />
//                 }
//                 { isTableEmpty &&
//                     <DownloadSelectedFilesButton
//                         selectedCount={selected_files.length}
//                         handleBulkDownloadClick={handleBulkDownloadClick}
//                     />
//                 }                
//                 <UploadButton
//                     handleCreate={handleCreate}
//                 />
//             </div>
//         </div>
//     );
// }

// const mapStateToProps = (state) => {
//     // console.log("state (Header): ", state);
//     return {
//         selected_files: state.files.selected_files,
//     };
// };

// export default connect(mapStateToProps)(Header);
