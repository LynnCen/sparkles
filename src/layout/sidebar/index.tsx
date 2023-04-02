import React, { Component, useState, useEffect, ReactNode } from "react";
import { Dropdown, Menu, Tooltip } from "antd";
import { FundOutlined } from '@ant-design/icons';
import Icon from "components/Icon";
import moment from "moment";
import debounce from "lodash/debounce";
import { isFullscreen, isMobile, loadScript } from "utils/common";
import context from "../context";
import { positionHandler } from "layout/handler";
import TDTMap from "../../utils/TDTMap";
import map from "utils/TDTMap";
import { sxcother } from "config/sxcwms";

const parentNotInSidebar = (target, exclude?: (target) => boolean) => {
    while (
        !target.classList.value.includes("sidebar") &&
        target.nodeName != "BODY" &&
        (exclude ? exclude(target) : true)
    ) {
        target = target.parentNode;
    }
    return target.nodeName == "BODY";
};
process.env.NODE_ENV == "development" &&
    isMobile() &&
    loadScript("static/js/vconsole.min.js").then((r) => new VConsole());
const mapTypeData = [
    { text: "矢量图", value: "TMAP_NORMAL_MAP" },
    { text: "卫星图", value: "TMAP_SATELLITE_MAP" },
    { text: "地形图", value: "TMAP_TERRAIN_MAP" },
]

interface Props {
    toggleDrawer: Function;
    refresh: Function;
}

interface States {
    rightActiveIdx?: number | undefined;
    show?: boolean;
    fullscreen?: boolean;
    pin?: boolean;
    showContour?: boolean;
}

export default class extends Component<Props, States> {
    static contextType = context;
    rightMenu = [];

    get sidebarHeight() {
        const sidebar: HTMLElement = document.querySelector('footer[class*="sidebar"]');
        return sidebar ? sidebar.offsetHeight + 10 : 0;
    }

    constructor(props) {
        super(props);
        this.state = {
            show: true,
            fullscreen: isFullscreen(),
            pin: true,
            rightActiveIdx: undefined,
            showContour: false
        };
    }

    menu = () => {
        return <Menu>{
            mapTypeData.map((it, i) => {
                return <Menu.Item>
                    <a onClick={() => this.onChangeMapType(it.value)}>
                        {it.text}
                    </a>
                </Menu.Item>
            })} </Menu>

    };

    componentWillReceiveProps(props) {
        const { toggleDrawer, refresh } = props;
        this.rightMenu = [
            { component: <Time /> },
            { component: <Tooltip title={'刷新'}><Icon type={"iconshuaxin1"} onClick={refresh} /></Tooltip> },
            {
                component: <Dropdown overlay={this.menu} placement="topCenter">
                    <Icon type={"icondituqiehuan"} />
                </Dropdown>
            },
            { component: <Tooltip title={'等高线'} ><Icon type={'iconic_duoxiliezhexiantu_u'} onClick={this.contour} /></Tooltip>, active: true },
            isMobile() && {
                component: <Icon type={"iconweizhi"} onClick={positionHandler.bind(this)} />,
            },
            { component: <Tooltip title={'收缩'}><Icon type={"icon-statistics"} onClick={toggleDrawer} /></Tooltip>, active: true },
            { component: <FullScreen onChange={this.fullscreenChange} /> },
        ].filter(Boolean);
        console.log(this.rightMenu);

    }
    contour = () => {
        const { rightActiveIdx } = this.state
        if (!rightActiveIdx) {
            if (!map.getLayer(sxcother.contour.id)) {
                map.map.addLayer(map.sxcLayerMap["contour"]);
                map.sxcLayerMap['contour'].setParams({ layers: sxcother["contour"].layers })
                map.sxcLayerMap['contour'].setZIndex(80)
            }
        } else {
            map.map.removeOverLay(map.sxcLayerMap["contour"]);
        }
    }
    onChangeMapType = (value) => {
        TDTMap.map.getLayers().forEach((item) => {
            TDTMap.map.removeLayer(item);
        });
        console.log(TDTMap.map.getLayers());
        TDTMap.map.setMapType(window[value]);
        TDTMap.map.addLayer(TDTMap.sxcLayer);
    };

    onPin = (e) => {
        this.setState({ pin: !this.state.pin }, this.fullscreenChange.bind(this, true));
    };
    fullscreenChange = (fullscreen: boolean) => {
        console.log(TDTMap.map.getLayers())
        this.setState({ fullscreen });
        document.body.removeEventListener("mousemove", this.showSidebar);
        // document.body.removeEventListener("click", this.cancelMenuActive);
        !this.state.pin &&
            this.setState({ show: !fullscreen, rightActiveIdx: undefined }, () => {
                fullscreen && document.body.addEventListener("mousemove", this.showSidebar);
                // : document.body.addEventListener("click", this.cancelMenuActive);
            });
    };
    showSidebar = debounce((e) => {
        if (!this.state.show && document.body.clientHeight - e.y <= this.sidebarHeight) {
            this.setState({ show: true });
        } else if (
            isFullscreen() &&
            this.state.show &&
            document.body.clientHeight - e.y > this.sidebarHeight
        ) {
            parentNotInSidebar(e.target) && this.setState({ show: false, rightActiveIdx: undefined });
        }
    }, 30);

    render() {
        const { rightActiveIdx, show, fullscreen, pin } = this.state;
        const style = { opacity: Number(show) };
        return (
            <footer
                className={"sidebar"}
                style={{ bottom: show ? 0 : -this.sidebarHeight + 10 }}
            // onMouseEnter={e => console.log(e)}
            >
                <div className={"sidebar-wrapper flex-center-between"} style={style}>
                    <div className={"sidebar-left"}>
                        {fullscreen && (
                            <Icon
                                type="icon-pin"
                                title={`${pin ? "un" : ""}pin the sidebar`}
                                style={{
                                    // transform: `rotate(${pin ? -45 : 0}deg)`,
                                    color: pin ? "#0091ff" : "#000",
                                }}
                                onClick={this.onPin}
                            />
                        )}
                    </div>
                    <div className={"sidebar-right"}>
                        <ul className={"flex-center"}>
                            {this.rightMenu.map((e: any, i) => (
                                <li
                                    key={i}
                                    className={"flex-center"}
                                    onClick={(ev) => {
                                        if (this.rightMenu[i].active) {
                                            this.setState({ rightActiveIdx: rightActiveIdx == i ? undefined : i });
                                        }
                                    }}
                                >
                                    {{
                                        ...e.component,
                                        props: {
                                            ...e.component.props,
                                            active: i == rightActiveIdx,
                                            className: i == rightActiveIdx ? "active" : "",
                                        },
                                    }}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </footer>
        );
    }
}

const Time = ({ format = "YYYY年MM月DD日 HH:mm:ss", step = "s", ...rest }) => {
    const [time, setTime] = useState(moment().format(format));
    const _step = {
        d: 24 * 60 * 60 * 1000,
        h: 60 * 60 * 1000,
        m: 60 * 1000,
        s: 1000,
    }[step];
    useEffect(() => {
        let t = setInterval(() => setTime(moment().format(format)), _step || 1000);
        return () => clearInterval(t);
    }, [_step, format]);
    return <span {...rest}>{time}</span>;
};

const setFullscreen = () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
};
const handleKeyF11 = (e) => {
    // console.log(e.keyCode);
    if (e.keyCode == 122 /* f11 */) {
        e.preventDefault();
        setFullscreen();
    }
};

export const FullScreen = ({ onChange = (val) => null, f11 = true }) => {
    const [full, setFull] = useState(isFullscreen());
    useEffect(() => {
        f11 && window.addEventListener("keydown", handleKeyF11);
        window.addEventListener(
            "fullscreenchange",
            (e) => {
                setFull(isFullscreen());
                onChange(isFullscreen());
            },
            false
        );
    }, [f11, onChange]);

    return (
        <Tooltip title={'全屏'}><Icon
            type={`icon-fullscreen${full ? "-exit" : ""}`}
            onClick={(e) => {
                setFullscreen();
                setFull(isFullscreen());
                onChange(isFullscreen());
            }}
        /></Tooltip>

    );
};
