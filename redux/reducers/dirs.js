const dirs = (state = [], action) => {
	switch (action.type) {
        case "ADD_OPENED_DIR":
            var opened_dir = state.opened_dir !== undefined ? [...state.opened_dir] : [];
            if (action.add === false) {
                opened_dir.splice(opened_dir.map(dir => dir.id).indexOf(action.data.id), 1);
            } else if (opened_dir.map(dir => dir.id).indexOf(action.data.id) === -1) {
                opened_dir.push(action.data);
            }
            return {
                ...state,
                opened_dir: opened_dir,
            };
        default:
            return state;
	}
};

export default dirs;
