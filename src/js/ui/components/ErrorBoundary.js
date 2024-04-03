import React from "react";
import { requestMan } from "@newSdk/service/apiCore/createCancelToken";
import localeFormat from "utils/localeFormat";
import { remote } from "electron";
import { ipcRenderer } from "../../platform";
import WSClient from "@newSdk/websocket_client";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        requestMan.cancelAll();
        WSClient.close();
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.log(error, errorInfo);
    }

    handleClick = () => {
        sessionStorage.clear();
        ipcRenderer.send("do-login");
        remote.getCurrentWebContents().reload();
    };

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <section>
                    <h1>{localeFormat({ id: "unknownError" })} </h1>
                    <button onClick={this.handleClick}>click to reload</button>
                </section>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
