import {Col, Row, ConfigProvider, Tag, Popover, Image,} from "antd";
import {ConfigProviderProps} from "antd/lib/config-provider";
import React, {CSSProperties,useState, useEffect, useRef, forwardRef} from "react";
import {findDOMNode} from "react-dom";
import { FixedSizeList } from "react-window";
// import AutoSizer from "react-virtualized-auto-sizer";
const { CheckableTag } = Tag;
interface DataBlockProps {
    title: string;
    number;
    unit?: string;
    imgUrl?: string;
    numStyle?: object;
    onClick?: () => void;
    className?: string;
    style?: CSSProperties;
    hover?: boolean;
}

export const DataBlock = ({
                              title,
                              number,
                              unit = "",
                              imgUrl,
                              numStyle,
                              style = {},
                              onClick,
                              className,
                              hover = false
                          }: DataBlockProps) => {
    const _style = imgUrl ? {display: "flex", alignItems: "center"} : {};
    return (
        <div className={"data-block-box"} style={{..._style, ...style}}>
            <div>{imgUrl && <img src={imgUrl}/>}</div>
            <div onClick={onClick} className={hover && "hover "+ className}>
                <div>
                    <span style={numStyle}>{number}</span>
                    {unit}
                </div>
                <div>{title}</div>
            </div>
        </div>
    );
};

/**
 *
 * @description 文本标签
 */
interface TextLabelProps {
    title: string;
    number;
    unit: string;
    style?: Object;
}

export const TextLabel = ({title, number, unit, ...rest}: TextLabelProps) => {
    return (
        <div className={"text-label-box"} {...rest}>
            <span>{title}：</span>
            <div>
                <span>{number}</span>
            </div>
            <span>{unit}</span>
        </div>
    );
};

/**
 * @description 进度条
 */
interface ProgressBarProps {
    blueShow?: boolean;
    number;
    strokeColor?: string;
    title: string;
}

export const ProgressBar = ({blueShow, number, strokeColor, title}: ProgressBarProps) => {
    const ref = useRef();
    useEffect(() => {
        if (ref.current) {
            const node: HTMLElement = findDOMNode(ref.current) as HTMLDivElement;
            const text: HTMLElement = node.querySelector("div:last-child");
            if (number < 100) {
                text.style.left =
                    (node.offsetWidth * number) / 100 < text.offsetWidth + 2
                        ? number + 1 + "%"
                        : `calc(${text.textContent} - ${text.offsetWidth + 2}px)`;
            } else {
                text.style.left = "unset";
                text.style.right = "8px";
            }
        }
    }, [number, ref.current]);
    return (
        <div className={"progress-bar-box"}>
            <span>{title}</span>
            <div className={"progress-bar" + (blueShow ? " progress-bar-blue" : "")} ref={ref}>
                <div
                    style={{
                        background: `${strokeColor}`,
                        width: `${number}%`,
                        height: "100%",
                        borderRight: "1px solid transparent",
                    }}
                />
                <div style={{position: "absolute", top: 0}}>{number}%</div>
            </div>
        </div>
    );
};

export const VerticalDataBlock = ({
                                      title,
                                      number,
                                      unit,
                                      imgUrl,
                                      onClick,
                                      className = "",
                                  }: DataBlockProps) => {
    return (
        <div className={"vertical-data-block " + className} onClick={onClick}>
            <div>{imgUrl && <img src={imgUrl}/>}</div>
            <div className={"number"}>
                {number}
                <span className={"unit"}>{unit}</span>
            </div>
            <div className={"title"}>{title}</div>
        </div>
    );
};

export const LabelItem = ({text, children}) => {
    return (
        <div className={"label-item"}>
            <label className={"label-item-label"}>{text}</label>
            {children}
        </div>
    );
};

export const InfoWin = ({data}) => {
    return (
        <div>
            {data.map((e, i) => (
                <Row style={{lineHeight: "28px"}} key={i}>
                    <Col
                        style={{width: data.reduce((r, c) => (r = Math.max(r, c.label.length)), 0) + "rem"}}
                    >
                        {e.label}
                    </Col>
                    <Col>{e.value + (e.unit || "")}</Col>
                </Row>
            ))}
        </div>
    );
};
export const InfoWinTable = ({data}) => {
    return (
        <div className="pop-stripe">
            {data.map((e, i) => (
                <Row justify={e.label ? "space-between" : "center"} key={i}>
                    {e.label && <Col>{e.label}</Col>}
                    <Col>{e.value}</Col>
                </Row>
            ))}
        </div>
    );
};

export const withConfigProvider = (WrappedComponent) => {
    return forwardRef(
        ({config, ...props}: { config: ConfigProviderProps; [k: string]: any }, ref) => (
            <ConfigProvider {...config}>
                <WrappedComponent {...props} ref={ref}/>
            </ConfigProvider>
        )
    );
};

interface TableProps {
    columns: any[],
    dataSource: any,
    handleLocation: (latitude, longitude, trunkId) => void
}
export const VirtualTable = ({ columns, dataSource, handleLocation }: TableProps) => {

    const columnsKey = []
    columns.map((item, index) =>
        columnsKey.push(item.key)
    )
    const [selectedTags, SetSelectKey] = useState([])
    function handleChange(tag, checked) {
        const nextSelectedTags = checked ? [...selectedTags, tag] : selectedTags.filter(t => t !== tag);
        SetSelectKey(nextSelectedTags)
    }
    const RowItem = (({ data, index, style }) => {
            return (
                <Row style={style} className='table-cell'>
                    <Col>{data[index][columnsKey[0]]}</Col>
                    <Col>{data[index][columnsKey[1]]}</Col>
                    <Col>{data[index][columnsKey[2]]}</Col>
                    <Col>
                        <CheckableTag
                            checked={selectedTags.indexOf(data[index].trunkId) > -1}
                            className={selectedTags.indexOf(data[index].trunkId) > -1 ? 'select' : ''}
                            onChange={checked => {
                                handleChange(data[index].trunkId, checked);
                                handleLocation(data[index].longitude, data[index].latitude, data[index].trunkId);
                            }}

                        >
                            定位</CheckableTag>
                        <Popover
                            placement="left"
                            trigger="click"
                            overlayClassName={"popover"}
                            content={
                                <div className="pop-injection">
                                    <div className='title'>{dataSource.pop.data[0].label}</div>
                                    <div className='injection-content'>
                                        <Image
                                            width={284}
                                            height={213}
                                            src={data[index].img}
                                        />
                                        <div>
                                            {dataSource.pop.data.map((p, i) => (
                                                p.key == 'detail' ? '' :
                                                    <Row justify={"space-between"} key={i}>
                                                        <Col>{p.label}</Col>
                                                        <Col>{data[index][p.key] ? data[index][p.key] + (p.unit || "") : '暂无数据'}</Col>
                                                    </Row>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            }
                        >
                            <Tag
                                color={"#007DDC"}
                            >
                                操作 </Tag>
                        </Popover>
                    </Col>
                </Row>
            )
        }
    )
    return (
        <div className='table'>
            <div className='table-header'>
                {columns.map((item, i) => {
                        return (
                            <span key={item.key}>{item.title}</span>
                        )
                    }
                )}
            </div>
            <div className="table-body">
                {/*<AutoSizer>*/}
                    {
                        ({ height, width }) =>
                            (
                                <FixedSizeList
                                    itemCount={dataSource.data.length}
                                    itemSize={35}
                                    height={416}
                                    width={width}
                                    itemData={dataSource.data}
                                    useIsScrolling
                                >
                                    {RowItem}
                                </FixedSizeList>
                            )
                    }
                {/*</AutoSizer>*/}
            </div>
        </div>
    )
}