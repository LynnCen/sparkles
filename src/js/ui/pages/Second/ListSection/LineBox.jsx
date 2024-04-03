import React, { Component, Fragment } from "react";
import styles from "./styles.less";
import propTypes from "prop-types";
import { OutlineExpand, OutlineClose } from "../../../icons";
import { FormattedMessage } from "react-intl";
import { Badge } from "antd";
import contactsStore from "../stores";

/**
 * @Author Pull
 * @Date 2021-06-16 15:41
 * @project LineBox
 */
class Box extends Component {
    static propTypes = {
        flag: propTypes.bool,
        title: propTypes.string,
        type: propTypes.string,
        onClick: propTypes.func,
        isShowBadge: propTypes.oneOfType([propTypes.number, propTypes.bool]),
    };

    handleClick = () => {
        const { type } = this.props;
        contactsStore.handleToggle(type);
    };

    render() {
        const { flag, title, isShowBadge, count } = this.props;
        return (
            <Fragment>
                <section className={styles.lineBox} onClick={this.handleClick} data-t={count}>
                    <section className={styles.item}>
                        <article className={styles.title}>
                            <i className={styles.icon}>
                                {flag ? <OutlineExpand /> : <OutlineClose />}
                            </i>
                            {isShowBadge ? (
                                <Badge dot={true}>
                                    <span className={styles.name}>
                                        <FormattedMessage id={title} />
                                    </span>
                                </Badge>
                            ) : (
                                <span className={styles.name}>
                                    <FormattedMessage id={title} />
                                </span>
                            )}
                        </article>
                        {count ? <aside className={styles.count}>{count || 0}</aside> : null}
                    </section>
                </section>
                {flag ? this.props.children : null}
            </Fragment>
        );
    }
}

export default Box;
