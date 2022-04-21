import { render } from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import { rootReducer, initial } from "./redux/reducers";
import thunkMiddleware from "redux-thunk";
import App from "./containers/App.js";

import "./styles/styles.css";
import "./styles/styles.less";

const store = createStore(
    rootReducer,
    initial,
    applyMiddleware(
        thunkMiddleware // lets us dispatch() functions
    )
);

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById("root")
);
