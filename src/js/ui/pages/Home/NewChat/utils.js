/**
 * @description 气泡排列样式
 */

import { isGroup, isMe, isP2P } from "@newSdk/utils";

const _renderAvatar = ({ successiveCount, chatId, currentId }) => {
    // 单聊不显示

    if (isP2P(chatId)) return false;
    if (isMe(currentId)) return false;
    // 群聊连续的第一个显示
    if (successiveCount !== 1) return false;
    return true;
};

const _renderMarginTop = ({ successiveCount }) => {
    const smallMargin = 8;
    const largeMargin = 16;
    // 第一个元素 上间距为0
    if (successiveCount === 1) return largeMargin;
    else return smallMargin;
};

const _renderBorderRadius = ({ currentId, successiveCount, nextId }) => {
    const me = isMe(currentId);

    const rightAngle_leftTop = me ? `10px 0 10px 10px` : `0 10px 10px 10px`;
    const rightAngle_leftBottom = me ? `10px 10px 0 10px` : `10px 10px 10px 0`;
    const rightAngle_left = me ? `10px 0 0 10px` : `0 10px 10px 0`;

    // 顶部
    if (successiveCount === 1) {
        if (nextId !== currentId) {
            return rightAngle_leftTop;
        } else {
            return rightAngle_leftBottom;
        }
    }

    // 排除2个的特殊样式
    if (successiveCount === 2 && nextId !== currentId) {
        return rightAngle_leftTop;
    }

    // 超过三个；
    // 中间
    if (nextId === currentId) {
        return rightAngle_left;
    }
    // 底部
    if (!nextId || nextId !== currentId) {
        return rightAngle_leftTop;
    }
};

const _renderSubContentMarginLeft = ({ chatId, currentId }) => {
    if (isGroup(chatId) && !isMe(currentId)) return 30;
    else return 0;
};

export const renderStyle = (() => {
    let prevId = null;
    let successiveCount = 0;
    let nextId = null;

    return (group, index) => {
        const list = group || [];

        const curItem = list[index];

        const currentId = curItem.sender;
        // 当前组第一条消息
        if (index === 0) {
            prevId = currentId;
            successiveCount = 1;
        } else {
            // 连续的
            if (prevId === currentId) {
                successiveCount += 1;
            } else {
                // 中断
                prevId = currentId;
                successiveCount = 1;
            }
        }
        // next
        nextId = list[index + 1] && list[index + 1].sender;

        const isShowAvatar = _renderAvatar({ chatId: curItem.chatId, successiveCount, currentId });
        const marginTop = _renderMarginTop({ successiveCount });
        const borderRadius = _renderBorderRadius({ currentId, successiveCount, nextId });
        const contentMarginLeft = _renderSubContentMarginLeft({
            chatId: curItem.chatId,
            currentId,
        });
        return {
            isShowAvatar,
            marginTop,
            borderRadius,
            contentMarginLeft,
        };
    };
})();
