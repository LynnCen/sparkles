import React, { Component } from 'react';
import { Icon } from 'antd'

const scss = require('../../../styles/scss/sharepage.scss')

interface Props {
    ldFirstMonth: string;
    ldLastMonth: string;
    ldClearMonth: () => void;
    ldSelectMonth: (value) => void;
}

interface State {
    visible: boolean;
    deleteVisible: boolean;
}

class LdTimePicker extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            visible: false,
            deleteVisible: false
        }
    }

    changeVisible = () => {
        const { visible } = this.state
        this.setState({
            visible: !visible
        })
    }


    render() {
        const { visible, deleteVisible } = this.state
        const { ldFirstMonth, ldLastMonth, ldSelectMonth, ldClearMonth } = this.props
        const timeList = [
            '1月',
            '2月',
            '3月',
            '4月',
            '5月',
            '6月',
            '7月',
            '8月',
            '9月',
            '10月',
            '11月',
            '12月',
        ]

        return (
            <div className={scss['ld-time-picker']}
                onMouseOver={() => this.setState({ deleteVisible: true })}
                onMouseOut={() => this.setState({ deleteVisible: false })}
            >
                <div className={scss['ld-time-picker-text']}
                    onClick={this.changeVisible}
                >
                    {
                        ldFirstMonth !== "" && ldLastMonth !== "" ? ldFirstMonth + " -  " + ldLastMonth : "请选择"
                    }
                </div>
                {
                    visible ? <Icon type="up"
                        style={{
                            display: `${deleteVisible ? "none" : "block"}`
                        }}
                    /> : <Icon type="down"
                        style={{
                            display: `${deleteVisible ? "none" : "block"}`
                        }}
                    />
                }
                <Icon
                    style={{
                        display: `${deleteVisible ? "block" : "none"}`
                    }}
                    type="close-circle"
                    onClick={() => {
                        this.setState({ visible: false })
                        ldClearMonth()
                    }}
                />
                {
                    visible && <div className={scss['ld-time-picker-list']}>
                        {
                            timeList.map((r, i) => {
                                return <div
                                    key={i}
                                    className={ldFirstMonth === r || ldLastMonth === r ? scss['list-active'] : ""}
                                    onClick={() => {
                                        ldSelectMonth(r)
                                        if (ldFirstMonth !== "") {
                                            this.setState({
                                                visible: false
                                            })
                                        }
                                    }}
                                >{r}</div>
                            })
                        }
                    </div>
                }

            </div>
        );
    }
}

export default LdTimePicker;