/**
 * @Author Pull
 * @Date 2021-10-18 17:28
 * @project authPublishSelector
 */
import React, { Fragment, useState } from "react";
import { Select } from "antd";
import styles from "../styles.less";
import propTypes from "prop-types";
import publishAuthOptions from "../../../constants/publishAuthOptions";
import ThemeSelect from "components/Tmm_Ant/ThemeSelect";
import localeFormat from "utils/localeFormat";

export const AuthPublishSelector = ({
    onLabelClick = () => {},
    authSelected,
    authValue,
    children,
}) => {
    const [open, setOpen] = useState(false);
    return (
        <section>
            <ThemeSelect
                // style={{ minWidth: 270 }}
                //onBlur={(e) => setOpen(false)}
                onDropdownVisibleChange={(flag) => setOpen(flag)}
                open={open}
                value={authValue}
                className="aaa"
                dropdownClassName={`${styles["select-container"]} electron_drag-disable`}
                // onSelect={authSelected}
                dropdownMatchSelectWidth={false}
                dropdownRender={(menu, ...reset) => {
                    return (
                        <section className={styles["select-container"]}>
                            {publishAuthOptions.map(({ value, label: LabelView, labelKey }, i) => (
                                <Fragment>
                                    {i === 0 && (
                                        <div
                                            className={`${styles["item-session"]} dark-theme-color_grey`}
                                        >
                                            {localeFormat({ id: "everyoneSeeAble" })}
                                        </div>
                                    )}
                                    {i === 1 && (
                                        <div
                                            className={`${styles["item-session"]} dark-theme-color_grey`}
                                        >
                                            {localeFormat({ id: "someoneSeeAble" })}
                                        </div>
                                    )}
                                    <div
                                        className={`${styles["custom-item"]} ${
                                            authValue === value &&
                                            `${styles["active"]} dark-theme-bg_lighter`
                                        }`}
                                        onClick={() => {
                                            authSelected(value);
                                            setOpen(false);
                                        }}
                                    >
                                        <span
                                            className={`${styles["item-label"]} dark-theme-color_lighter`}
                                            onClick={() => onLabelClick(value)}
                                            style={{
                                                flexDirection: "column",
                                                alignItems: "flex-start",
                                            }}
                                        >
                                            <div className={styles["item-label"]}>
                                                <LabelView label={localeFormat({ id: labelKey })}>
                                                    {authValue === value ? children : null}
                                                </LabelView>
                                            </div>
                                            <div
                                                className={`${styles["desc"]} dark-theme-color_grey`}
                                            >
                                                {localeFormat({ id: `${labelKey}_desc` })}
                                            </div>
                                        </span>
                                    </div>
                                </Fragment>
                            ))}
                        </section>
                    );
                }}
            >
                {publishAuthOptions.map(({ value, label: LabelView, labelKey }) => (
                    <Select.Option value={value} key={value}>
                        <span
                            style={{
                                verticalAlign: "middle",
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                            }}
                            className={`${styles["item-label"]} dark-theme-color_lighter`}
                            onClick={() => setOpen(true)}
                        >
                            <LabelView
                                label={localeFormat({ id: labelKey })}
                                desc={localeFormat({ id: `${labelKey}_desc` })}
                            >
                                {authValue === value ? children : null}
                            </LabelView>

                            {/*<div>1111</div>*/}
                        </span>
                    </Select.Option>
                ))}
            </ThemeSelect>
        </section>
    );
};

AuthPublishSelector.propTypes = {
    authSelected: propTypes.func,
    authValue: propTypes.number,
};

export default AuthPublishSelector;
