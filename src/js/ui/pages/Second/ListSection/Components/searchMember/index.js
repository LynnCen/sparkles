import React from "react";
import { Input, message, Modal, Spin } from "antd";
import { FormattedMessage, injectIntl } from "react-intl";
import getSearchResult from "@newSdk/service/api/addFriends/searchUserByKeyWords";
import addApplyFriend from "@newSdk/service/api/addFriends/applyToBeFriend";
import { LoadingOutlined } from "@ant-design/icons";
import nc from "@newSdk/notification";
import Members from "@newSdk/model/Members";
import UserInfo from "@newSdk/model/UserInfo";
import { isFriend } from "@newSdk/consts/friend_misc";
import { inject, observer } from "mobx-react";
import Avatar from "components/Avatar";
import classnames from "classnames";
import { SearchIcon, CloseIconBolder, CloseCircleIcon, PlusOutLine } from "../../../../../icons";
import styles from "./index.less";
import contactsStore from "../../../stores";
import { getNameWeight } from "utils/nameWeight";
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

@inject((store) => ({
    shouldUseDarkColors: store.Common.shouldUseDarkColors,
}))
@observer
class SearchMember extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            searchWords: "",
            searchResults: undefined,
            applyLoading: false,
        };
        nc.addObserver(Members.Event.MemberInfoChanged, this.updateUserInfo);
    }

    updateUserInfo = (data) => {
        const allIds = data.map((item) => item.id);
        const { searchResults } = this.state;
        if (!searchResults || !searchResults.user) return;
        const isNeedUpdate = allIds.includes(searchResults.user.id);
        if (!isNeedUpdate) return;
        Members.getMemberById(searchResults.user.id)
            .then((data) => {
                this.setState(({ searchResults }) => ({
                    searchResults: { ...searchResults, user: data },
                }));
            })
            .catch(console.log);
    };

    componentWillUnmount() {
        nc.removeObserve(Members.Event.MemberInfoChanged, this.updateUserInfo);
    }

    onSearch = async (e) => {
        const { value } = e.target;
        const { isLoading } = this.state;
        this.setState({ searchWords: value, searchResults: undefined });
        if (!value || !value.trim() || isLoading) return;
        this.setState({ loading: true });
        try {
            const searchResults = await getSearchResult(value);
            this.setState({ loading: false, searchResults });
        } catch (e) {
            console.error(e);
            // message.error(e.msg);
        }
    };

    onSearchValueChange = (e) => {
        const { value } = e.target;
        this.setState({ searchWords: value, searchResults: undefined });
    };

    onClearInput = () => {
        this.setState({ searchWords: "", searchResults: undefined });
    };

    onApply = async () => {
        const { searchResults, applyLoading } = this.state;
        if (applyLoading) return;
        const { intl } = this.props;
        if (!searchResults || !searchResults.user) return;
        try {
            this.setState({ applyLoading: true });
            await addApplyFriend(searchResults.user.id, searchResults.from_way);
            // message.success(intl.formatMessage({ id: "applySend" }));
        } catch (e) {
            console.error(e);
            // message.error(e);
        } finally {
            this.setState({ applyLoading: false });
        }
    };
    cancelModal = () => {
        contactsStore.handleToggleVisible();
        this.setState({ searchWords: '' });
    };
    render() {
        const { intl, shouldUseDarkColors } = this.props;
        const { loading, searchWords, searchResults, applyLoading } = this.state;
        return (
            <Modal
                wrapClassName={classnames({
                    [styles.wrapper]: true,
                    [styles.dark]: shouldUseDarkColors,
                })}
                visible={contactsStore.requestVisible}
                closable={false}
                footer={null}
                onCancel={this.cancelModal}
                width={480}
                centered
            >
                <div className={styles.search_header}>
                    <span
                        className={styles.search_header_leftback}
                        onClick={this.cancelModal}
                    >
                        <CloseIconBolder />
                    </span>
                    <p>{intl.formatMessage({ id: "AddFriends" })}</p>
                </div>
                <div className={styles.main}>
                    <div className={styles.main_search}>
                        <Input
                            allowClear
                            autoFocus
                            value={searchWords}
                            onPressEnter={this.onSearch}
                            onChange={this.onSearchValueChange}
                            prefix={<SearchIcon title={<FormattedMessage id="Search" />} />}
                            placeholder={`${intl.formatMessage({
                                id: "from_tmm_id",
                            })} / ${intl.formatMessage({ id: "from_phone" })}`}
                        />

                        {searchWords && (
                            <div className={styles.close} onClick={this.onClearInput}>
                                <CloseCircleIcon />
                            </div>
                        )}
                    </div>

                    {searchWords && (
                        <Spin spinning={loading || applyLoading} indicator={antIcon} delay={300}>
                            {!searchResults ? (
                                <div className={styles.search_result} />
                            ) : searchResults.user ? (
                                <div className={styles.search_result}>
                                    <Avatar avatar={searchResults.user.avatarPath} size={32} />
                                    <div className={styles.search_result_content}>
                                        <div className={styles.nameContainer}>
                                            <span>
                                                {/* {searchResults.user.name} */}
                                                {getNameWeight({
                                                    friendAlias: searchResults.user.friendAlias,
                                                    name: searchResults.user.name,
                                                    uid: searchResults.user.id,
                                                    status: searchResults.user.status,
                                                })}
                                            </span>
                                        </div>
                                        <div className={styles.idContainer}>
                                            <span>ID: {searchResults.user.tmm_id}</span>
                                        </div>
                                    </div>
                                    {!isFriend(searchResults.user.isFriend) &&
                                        searchResults.user.id !== UserInfo._id && (
                                            <div
                                                className={styles.apply_request}
                                                onClick={this.onApply}
                                            >
                                                <PlusOutLine />
                                            </div>
                                        )}
                                </div>
                            ) : (
                                <div className={styles.empty_result}>
                                    {intl.formatMessage({ id: "memberUnExist" })}
                                </div>
                            )}
                        </Spin>
                    )}
                </div>
            </Modal>
        );
    }
}

export default injectIntl(SearchMember);
