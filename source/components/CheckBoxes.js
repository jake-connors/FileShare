import { useState } from "react";

export const CheckBoxCell = ({ checked, handleChange }) => {
    const [tempChecked, setTempChecked] = useState(checked);
    return (
        <div
            className="file-checkbox"
            onClick={() => {
                setTempChecked(!tempChecked);
                handleChange(!tempChecked);
            }}
        >
            <input
                type="checkbox"
                onChange={(event) => event}
                checked={tempChecked}
            />
        </div>
    );
};
