import React, { Component } from "react";
import PropTypes from "prop-types";
import Transition from "react-addons-css-transition-group";
import clazz from "classnames";
import "./style.global.css";

export default class Button extends Component {
    static propTypes = {
        show: PropTypes.bool,
        fullscreen: PropTypes.bool,
    };

    static defaultProps = {
        show: false,
        fullscreen: false,
    };

    state = {
        show: false,
        fullscreen: false,
    };

    componentDidMount() {
        this.setState({
            show: this.props.show,
            fullscreen: this.props.fullscreen,
        });
        // 最长loading阈值
        // this.loadingTimer = setTimeout(() => {
        //     this.setState({
        //         show: false
        //     })
        // }, 1000 * 8)
    }

    componentWillUnmount() {
        if (this.loadingTimer) clearTimeout(this.loadingTimer);
    }

    renderContent() {
        const { show, fullscreen } = this.state;
        if (!show) {
            return;
        }

        return (
            <div
                className={clazz("Loader", this.props.className, {
                    "Loader--fullscreen": fullscreen,
                })}
            >
                <svg className="Loader-circular">
                    <circle
                        className="Loader-path"
                        cx="50"
                        cy="50"
                        fill="none"
                        r="20"
                        strokeWidth="5"
                        strokeMiterlimit="10"
                    />
                </svg>
            </div>
        );
    }

    render() {
        return (
            <Transition
                transitionName="Loader"
                transitionEnterTimeout={200}
                transitionLeaveTimeout={200}
            >
                {this.renderContent()}
            </Transition>
        );
    }
}
