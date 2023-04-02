import React, { Component } from 'react';
import { Popover } from 'antd'

const scss = require("../../../styles/scss/sharepage.scss");
const list = [
    {
        title: "裕溪乡",
        childList: [
            {
                id: 1,
                title: "内陈村",
                lng: 119.63682,
                lat: 28.34246
            }
        ]
    },
    {
        title: "大东坝镇",
        childList: [
            {
                id: 2,
                title: "茶排村",
                lng: 119.50638,
                lat: 28.32072
            },
            {
                id: 3,
                title: "下宅街村",
                lng: 119.50948,
                lat: 28.30732
            }
        ]
    }
]

interface Props {
    getPopupIndex: (title, value) => void;
    hidePopup: () => void;
}

interface State {

}

class SyPopupList extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {

        }
    }

    render() {
        const { getPopupIndex, hidePopup } = this.props
        return (
            <div className={scss['sy-popup-list-box']}>
                {
                    list.map((r, i) => {
                        return <Popover
                            content={
                                <>
                                    {
                                        r.childList.map((res, index) => {
                                            return (
                                                <div
                                                    key={index}
                                                    onClick={() => {
                                                        getPopupIndex(r.title, res)
                                                        hidePopup()
                                                    }}
                                                >
                                                    {res.title}
                                                </div>
                                            )
                                        })
                                    }
                                </>
                            }
                            placement='rightTop'
                            getPopupContainer={(triggerNode) => triggerNode}
                        >
                            <div
                                key={i}
                                className={scss['sy-popup-list-first']}
                            >
                                <span>
                                    {r.title}
                                </span>
                                <span>
                                    {`>`}
                                </span>
                            </div>
                        </Popover>

                    })
                }
            </div>
        );
    }
}

export default SyPopupList;