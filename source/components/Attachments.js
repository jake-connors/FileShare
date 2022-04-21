import { useDropzone } from "react-dropzone";

export function Attachments({
    showAttachments,
    attachments,
    fileAdded,
    onDrop,
    removeFile,
}) {
    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
    });

    if (showAttachments === false) return <></>;
    if (attachments.length > 1) return <>
        {attachments.map((file, index) => (
            <div
                key={file.path}
                className="small"
            >
                {removeFile(file)}
                {/* {console.log("length ", attachments.length, index)} */}
                {(attachments.length == 2 && index == 0) && alert('only 1 file allowed!')}
            </div>
        ))}
        
    </>;
    if (fileAdded === true) return <>
        <div className="clear5" />
        {attachments.map((file) => (
            <div
                key={file.path}
                className="small"
                style={{ marginLeft: 15, marginTop: 3 }}
            >
                <a
                    href="#"
                    onClick={(e) => {
                        // x button clicked
                        e.preventDefault();
                        removeFile(file);
                    }}
                >
                    <span className="glyphicon glyphicon-remove" />{" "}
                    {file.path}
                </a>{" "}
                ({file.size} bytes)
            </div>
        ))}
    </>;
    return (
        <>
            <div>
                <div className="clear5"/>
                <div
                    {...getRootProps({
                        className: "dropzone",
                        id: "dropzoneId",
                    })}
                >
                    <input className="form-control" required {...getInputProps()} />
                    <p><b>Drop files here, or click to select files</b></p>
                </div>
            </div>
        </>
    );
}

export function AttachmentsLink({ showAttachments, setShowAttachments }) {
    return (
        <a
            href="#"
            onClick={(e) => {
                e.preventDefault();
                setShowAttachments(!showAttachments);
            }}
            className="small"
            id="attachFile"
        >
            {showAttachments === false ? "Update File" : "Hide"}
        </a>
    );
}
