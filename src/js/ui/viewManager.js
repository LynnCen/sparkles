import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import App from "../../app";
import AuthorizeMiniApp from "../windows/authApp/authorizeMiniApp";
// import LightBox from "../windows/LightBox/app";
import { parse } from "querystring";

class ViewManager extends Component {
    static Views() {
        return {
            main: <App />,
            miniApp: <AuthorizeMiniApp />,
            // lightBox: <LightBox />,
        };
    }

    static View(props) {
        let name = props.location.search.substr(1);
        const viewName = (parse(props.location.search.substr(1)) || {}).pageName;
        let view = ViewManager.Views()[name] || ViewManager.Views()[viewName];
        if (view == null) throw new Error("View '" + name + "' is undefined");
        return view;
    }

    render() {
        return (
            <Router>
                <ErrorBoundary>
                    {/*<div>*/}
                    <Route path="/" component={ViewManager.View} />
                    {/*</div>*/}
                </ErrorBoundary>
            </Router>
        );
    }
}

export default ViewManager;
