const files = (state = [], action) => {
	switch (action.type) {
        case "LOAD_SELECTED_FILES":
            var selected_files =
				state.selected_files !== undefined
					? [...state.selected_files]
					: [];
			if (action.add === false) {
				selected_files.splice(selected_files.map(file => file.file_id).indexOf(action.data.file_id), 1);
			} else if (action.clear === true) {
                selected_files = [];
            } else if (selected_files.indexOf(action.data.file_id) === -1) {
				selected_files.push(action.data);
			}
			return {
				...state,
				selected_files: selected_files,
			};
        case "ADD_OPENED_FILE":
            var opened_file = state.opened_file !== undefined ? [...state.opened_file] : [];
            if (action.add === false) {
                opened_file.splice(opened_file.map(file => file.id).indexOf(action.data.id), 1);
            } else if (opened_file.map(file => file.id).indexOf(action.data.id) === -1) {
                opened_file.push(action.data);
            }
            return {
                ...state,
                opened_file: opened_file,
            };
        case "SET_A_FILE":
            var aFile =
                state.attached_file !== undefined
                    ? [...state.attached_file]
                    : [];
            if (action.add === false) {
                aFile.splice(aFile.map(file => file.file_id).indexOf(action.data.file_id), 1);
            } else if (action.clear === true) {
                aFile = [];
            } else if (aFile.map(file => file.file_id).indexOf(action.data.file_id) === -1) {
                aFile.push(action.data);
            }
            return {
                ...state,
                attached_file: aFile,
            };
        default:
            return state;
	}
};

export default files;
