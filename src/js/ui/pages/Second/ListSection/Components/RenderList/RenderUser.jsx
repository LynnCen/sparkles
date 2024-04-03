// 长列表
import { inject } from "mobx-react";
import React, { Component, Fragment } from "react";
import Item from "./Item";
import propTypes from "prop-types";
import styles from "./styles.less";
import userProxy from "../../../../../stores_new/userProxy";
import { splitFstName } from "utils/sn_utils";
import contactsStore from "../../../stores";

@inject((store) => ({}))
export class RenderUserList extends Component {
    static propTypes = {
        list: propTypes.array,
    };

    render() {
        const { type, list } = this.props;
        const {
            TabEnum: { contacts, newFriend },
        } = contactsStore;

        return (
            <div className={styles.row}>
                {type === contacts
                    ? Object.keys(contactsStore.renderGroup)
                          .sort()
                          .sort((a, b) => {
                              if (a.charCodeAt() === 35 || b.charCodeAt() === 35) return -1;
                          })
                          .map((k) => (
                              <Fragment key={k}>
                                  <div className={styles.spe}>{k}</div>
                                  {contactsStore.renderGroup[k].map((item) => (
                                      <Item
                                          key={item.id}
                                          src={item.avatarPath}
                                          name={item.name}
                                          type={contacts}
                                          id={item.id}
                                          // active={viewType && viewInfo.data.id === item.id}
                                          // memberCount={item.memberCount}
                                      />
                                  ))}
                              </Fragment>
                          ))
                    : list
                          .sort(
                              (a, b) => b.createTime - a.createTime //Descending order
                          )
                          .map((item, index) => {
                              return (
                                  <Item
                                      key={item.id + index}
                                      src={item.avatarPath}
                                      name={item.name}
                                      type={newFriend}
                                      id={item.id}
                                      createTime={item.createTime}
                                      status={item.status}
                                      // active={viewType && viewInfo.data.id === item.id}
                                      // memberCount={item.memberCount}
                                  />
                              );
                          })}
            </div>
        );
    }
}

export default RenderUserList;
