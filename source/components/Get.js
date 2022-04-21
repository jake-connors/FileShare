// import { connect } from "react-redux";
// // import { useState } from "react";

// function Get({ handleGet, showGet }) {


//     function handleGetButtonClicked() {

//         let idText = document.getElementById("idTextG").value;
//         if (document.getElementById("idTextG").value == "") {
//             alert('ID value cannot be blank');
//             document.getElementById("idTextG").focus();
//         } else {
//             document.getElementById("idTextG").value = "";
//             handleGet(idText);
//         }
        
//     }

//     return (
//         <div id="getDiv" className="row">
//             <div className="col-sm-10 col-sm-offset-1"><h3>Get File</h3></div>
//             <div className="col-sm-10 col-sm-offset-1">
//                 <input type="text" className="form-control form-group" id="idTextG" placeholder="Enter file id:"></input> 
//             </div>
//             <div className="col-sm-10 col-sm-offset-1">
//                 <button id="getButton" 
//                     className="btn btn-primary"
//                     onClick={handleGetButtonClicked}
//                     disabled={!showGet}
//                 >
//                     Get
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

// export default connect(mapStateToProps)(Get);