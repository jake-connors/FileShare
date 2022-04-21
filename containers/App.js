import { connect } from "react-redux";
import { Switch, BrowserRouter } from "react-router-dom";
import WebbRoute from "@webb/route";
import Container from "./Container";

const App = () => {

    return (
        <BrowserRouter>
            <Switch>
                <WebbRoute component={Container} />
            </Switch>
        </BrowserRouter>
    );
};

export default connect()(App);
