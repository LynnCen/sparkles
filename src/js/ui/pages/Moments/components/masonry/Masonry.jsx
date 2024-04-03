/**
 * @Author Pull
 * @Date 2021-10-25 09:57
 * @project Masonry
 */
import React, {
    Fragment,
    useEffect,
    useRef,
    forwardRef,
    useImperativeHandle,
    useState,
} from "react";
import CellMeasurer from "react-virtualized/dist/es/CellMeasurer/CellMeasurer";
import CellMeasurerCache from "react-virtualized/dist/es/CellMeasurer/CellMeasurerCache";
import createMasonryCellPositioner from "react-virtualized/dist/es/Masonry/createCellPositioner";
import Masonry from "react-virtualized/dist/es/Masonry/Masonry";
import WindowScroller from "react-virtualized/dist/es/WindowScroller";
import AutoSizer from "react-virtualized/dist/es/AutoSizer/AutoSizer";
import MomentItem from "../momentItem/MomentItem";
import mediaDownloadProxy from "../../store/mediaDownloadProxy";
import UiEventCenter from "utils/sn_event_center";
import hotCommentProxy from "../../store/hotCommentProxy";
import styles from "./styles.less";
import empty from "./emptyMoments.png";
import "react-virtualized/styles.css";
import commentCountProxy from "../../store/commentCountProxy";
import { fetchMomentLikes } from "@newSdk/logic/moments/momentLikes";
import useDebounce from "../../../../hooks/useDebounce";
import useThrottle from "../../../../hooks/useThrottle";
import useMasonry from "./useMasonry";
import localeFormat from "utils/localeFormat";

// let cache = new CellMeasurerCache({
//     defaultHeight: 250,
//     defaultWidth: 272,
//     fixedWidth: true,
//     // fixedHeight: true,
// });
// let cellPosConfig = {
//     cellMeasurerCache: cache,
//     columnCount: 3,
//     columnWidth: 272,
//     spacer: 20,
// };

// const cellPositioner = createMasonryCellPositioner(cellPosConfig);

function cellRenderer({ index, key, parent, style }) {
    const datum = (parent.props["data-renderSource"] || [])[index];
    // const handleResize = parent.props["data-resize"] || [];
    if (!datum) return null;
    const {
        id,
        createTime,
        text,
        media,
        uid,
        authType,
        isForward,
        breakOff,
        forwardPresInfo,
        forwardRoot,
        applet_info,
    } = datum;

    return (
        <CellMeasurer
            cache={parent.props.cellMeasurerCache}
            index={index}
            key={key}
            parent={parent}
        >
            <div style={style}>
                {/*<button onClick={handleResize}>test</button>*/}
                <MomentItem
                    momentInfo={{
                        ...datum,
                        id: id,
                        uid: uid,
                        authType: authType,
                        sendTime: createTime,
                        textContext: text,
                        sourceList: media,
                        forwardPresInfo: forwardPresInfo,
                        forwardRoot: forwardRoot,
                        breakOff: breakOff,
                    }}
                    log={datum}
                />
            </div>
        </CellMeasurer>
    );
}

export const MasonryList = forwardRef(
    (
        { hasMore, loadMore, isLoading, dataSource = [], onScroll = () => "", loadingStyle = {} },
        ref
    ) => {
        const {
            cache,
            cellPosConfig,
            cellPositioner,
            MasonryRef,
            handleCellsRendered,
            resizeMasonry,
        } = useMasonry(ref, hasMore, loadMore, isLoading, dataSource);

        // useEffect(() => {
        //     resizeMasonry();
        // }, [dataSource]);

        const renderList = [...dataSource];

        return (
            <Fragment>
                <AutoSizer>
                    {({ height, width }) => (
                        <Masonry
                            onCellsRendered={handleCellsRendered}
                            cellCount={renderList.length}
                            id="moments_masonry_container"
                            keyMapper={(i) =>
                                renderList[i] ? renderList[i].uuid || renderList[i].id : i
                            }
                            onScroll={(e) => {
                                onScroll && onScroll(e);
                            }}
                            cellMeasurerCache={cache}
                            cellPositioner={cellPositioner}
                            cellRenderer={cellRenderer}
                            scrollingResetTimeInterval={88}
                            height={height}
                            width={width}
                            ref={(ref) => (MasonryRef.current = ref)}
                            data-isLoading={isLoading}
                            data-hasMore={hasMore}
                            data-renderSource={renderList}
                            data-resize={resizeMasonry}
                            style={{
                                paddingTop: 24,
                                outline: "none",
                            }}
                        />
                    )}
                </AutoSizer>

                {/* todo: use windowScroll */}
                {/*<WindowScroller>*/}
                {/*    {({ height, isScrolling, registerChild, onChildScroll, scrollTop }) => (*/}
                {/*        <AutoSizer disableHeight height={height} scrollTop={scrollTop}>*/}
                {/*            {({ width }) => (*/}
                {/*                <Masonry*/}
                {/*                    autoHieght*/}
                {/*                    onCellsRendered={handleCellsRendered}*/}
                {/*                    cellCount={renderList.length}*/}
                {/*                    id="moments_masonry_container"*/}
                {/*                    keyMapper={(i) =>*/}
                {/*                        renderList[i] ? renderList[i].uuid || renderList[i].id : i*/}
                {/*                    }*/}
                {/*                    // onScroll={() => {*/}
                {/*                    //     // console.log("on scroll");*/}
                {/*                    //     onChildScroll();*/}
                {/*                    // }}*/}
                {/*                    onScroll={(e) => console.log(e)}*/}
                {/*                    cellMeasurerCache={cache}*/}
                {/*                    cellPositioner={cellPositioner}*/}
                {/*                    cellRenderer={cellRenderer}*/}
                {/*                    isScrolling={isScrolling}*/}
                {/*                    scrollTop={scrollTop}*/}
                {/*                    height={height}*/}
                {/*                    width={width}*/}
                {/*                    ref={(ref) => (MasonryRef.current = ref)}*/}
                {/*                    data-isLoading={isLoading}*/}
                {/*                    data-hasMore={hasMore}*/}
                {/*                    data-renderSource={renderList}*/}
                {/*                    data-resize={resizeMasonry}*/}
                {/*                    style={{*/}
                {/*                        paddingTop: 24,*/}
                {/*                        outline: "none",*/}
                {/*                    }}*/}
                {/*                />*/}
                {/*            )}*/}
                {/*        </AutoSizer>*/}
                {/*    )}*/}
                {/*</WindowScroller>*/}

                {isLoading && <div className={styles.loading} style={loadingStyle} />}
                {/*{1 && <div className={styles.loading} />}*/}
            </Fragment>
        );
    }
);

MasonryList.Empty = ({ bodyStyle = {}, loading }) => {
    return (
        <div className={styles.emptyContainer} style={bodyStyle}>
            {loading ? (
                <h4 className={styles.emptyText} style={{ marginTop: 100 }}>
                    {localeFormat({ id: "initStatus_pulling" })}
                </h4>
            ) : (
                <aside className={styles.empty}>
                    <img src={empty} alt="" />
                    <h4>{localeFormat({ id: "shareMoments" })}</h4>
                    <p>{localeFormat({ id: "shareWithYourFriends" })}</p>
                </aside>
            )}
        </div>
    );
};

MasonryList.EmptyWithText = ({ bodyStyle = {}, loading }) => {
    return (
        <div className={styles.emptyContainer} style={bodyStyle}>
            <aside className={styles.emptyText}>
                <h4>
                    {loading
                        ? localeFormat({ id: "initStatus_pulling" })
                        : localeFormat({ id: "contentEmpty" })}
                </h4>
            </aside>
        </div>
    );
};
export default MasonryList;
