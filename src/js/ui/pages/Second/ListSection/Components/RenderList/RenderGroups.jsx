import React, { Component, Fragment } from "react";
import Item from "./Item";
import propTypes from "prop-types";
import styles from "./styles.less";
import contactsStore from "../../../stores";

export class RenderGroupsList extends Component {
    static propTypes = {
        list: propTypes.array,
    };

    // state = {
    //     list: [],
    // };
    //
    // componentDidMount() {
    //     this.setState({
    //         list: this.props.list.slice(0, 10),
    //     });
    //
    //     setTimeout(() => {
    //         this.setState({
    //             list: this.props.list,
    //         });
    //     }, 1000);
    // }
    render() {
        const { list = [] } = this.props;
        return (
            <div className={styles.row}>
                {list.map((item) => (
                    <Item
                        key={item.id}
                        src={item.avatarPath}
                        name={item.name}
                        memberCount={item.memberCount}
                        type={contactsStore.TabEnum.groups}
                        id={item.id}
                    />
                ))}
            </div>
        );
    }
}

export default RenderGroupsList;
