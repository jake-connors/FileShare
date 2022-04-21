import { useRef, useState, useEffect } from "react";
import PopperHelper from "@webb/popper";

export default function ({ rowFromDir, rowFileID, rowFileDescription, rowFilePath,
    handleGetAction, handleUpdateAction, handleDownloadAction, handleDeleteAction
}) {
    const popperRef = useRef(null);
    const [hidePopper, setHidePopper] = useState(false);

    useEffect(() => {
        setHidePopper(false);
    }), [popperRef];
    
    return (
        <PopperHelper
            referenceElement={
                // <div className="action-button">
                    <strong className="link">
                        Action <span className="caret" />
                    </strong>
                //</div>
            }
            ref={popperRef}
            popperPlacement="bottom-start"
            popperPlacementForce={true}
            popperTrigger="click"
            portalId="portal"
            popperClassName="action-menu"
            // popperStyle={{paddingRight: 100}}
            popperModifiers={[{ name: "offset", options: { offset: [-20,  5] } }]}
        >
        {!hidePopper && 
        <>
            <p>
                <span
                    className="link"
                    onClick={() => {
                        handleGetAction(
                            rowFileID
                        );
                        setHidePopper(true);
                    }}
                >
                    View
                </span>
            </p>
            <p>
                <span
                    className="link"
                    onClick={() => {
                        handleUpdateAction(
                            rowFromDir,
                            rowFileID,
                            rowFileDescription
                        );
                        setHidePopper(true);
                    }}
                >
                    Update
                </span>
            </p>
            <p>
                <span
                    className="link"
                    onClick={() => {
                        handleDownloadAction(rowFilePath);
                        setHidePopper(true);
                    }}
                >
                    Download
                </span>
            </p>
            <p>
                <span
                    className="link"
                    onClick={() => {
                        handleDeleteAction(
                            rowFileID,
                        );
                        setHidePopper(true);
                    }}
                >
                    Delete
                </span>
            </p>
        </>
        }
        </PopperHelper>
    );
}