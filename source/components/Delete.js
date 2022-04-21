// import { connect } from "react-redux";
// // import { useState } from "react";

// function Delete({ handleDelete, showDelete }) {


//     function handleDeleteButtonClicked() {

//         let idText = document.getElementById("idTextD").value;
//         if (document.getElementById("idTextD").value == "") {
//             alert('ID value cannot be blank');
//             document.getElementById("idTextD").focus();
//         } else {
//             document.getElementById("idTextD").value = "";
//             handleDelete(idText);
//         }
        
//     }

//     return (
//         <div id="deleteDiv" className="row">
//             <div className="col-sm-10 col-sm-offset-1"><h3>Delete File</h3></div>
//             <div className="col-sm-10 col-sm-offset-1">
//                 <input type="text" className="form-control form-group" id="idTextD" placeholder="Enter file id:"></input> 
//             </div>
//             <div className="col-sm-10 col-sm-offset-1">
//                 <button id="deleteButton" 
//                         className="btn btn-primary"
//                         onClick={handleDeleteButtonClicked}
//                         disabled={!showDelete}
//                     >
//                         Delete
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

// export default connect(mapStateToProps)(Delete);