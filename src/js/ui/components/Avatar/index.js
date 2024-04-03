import React from "react";
import styles from "./avatar.less";
export default class Avatar extends React.PureComponent {
    state = {
        avatar: "",
        reTry: false,
        loadError: true,
    };

    componentDidMount() {
        this.lazyLoad();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // 限制更新数
        const { src, avatar } = this.props;
        const imageUrl = src || avatar;
        const prevUrl = prevProps.src || prevProps.avatar;
        if (imageUrl !== prevUrl) {
            this.lazyLoad();
        }
    }

    lazyLoad = () => {
        const src = this.props.src || this.props.avatar;
        if (!src) return this.setState({ loadError: true });

        const img = new Image();
        img.onload = () => {
            this.setState({ avatar: src, loadError: false });
        };
        img.onerror = () => {
            this.setState({ loadError: true });
        };
        img.src = src;
    };

    render() {
        const { avatar, loadError } = this.state;
        const { size = 44, style = {}, Icon, wrapperstyle } = this.props;
        const show = avatar && !loadError;

        return show ? (
            <React.Fragment>
                <div style={{ ...wrapperstyle, display: "inline-block" }}>
                    <img
                        src={avatar}
                        style={{
                            borderRadius: "50%",
                            width: size,
                            height: size,
                            objectFit: "cover",
                            ...style,
                        }}
                    />
                    {Icon && (
                        <aside className={styles.mask}>
                            <span className={styles.editIcon}>{Icon}</span>
                        </aside>
                    )}
                </div>
            </React.Fragment>
        ) : (
            <React.Fragment>
                <div style={{ ...wrapperstyle, display: "inline-block" }}>
                    <span style={{ width: size, height: size }} className={styles.error} />
                    {Icon && (
                        <aside className={styles.mask}>
                            <span className={styles.editIcon}>{Icon}</span>
                        </aside>
                    )}
                </div>
            </React.Fragment>
        );
    }
}
