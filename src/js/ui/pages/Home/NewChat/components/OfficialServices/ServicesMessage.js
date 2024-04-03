import React, { Component } from "react";
import MessageType from "@newSdk/model/MessageType";
import Transition from "./Transition";

export class ServicesMessage extends Component {
    renderContent = () => {
        const { message, timeToShow } = this.props;
        if (!message) return null;
        switch (message.type) {
            case MessageType.TransactionMessage:
                return <Transition message={message} />;
        }
    };

    render() {
        return <div>{this.renderContent()}</div>;
    }
}

export default ServicesMessage;
