/**
 * @Author Pull
 * @Date 2021-08-16 13:54
 * @project sn_event
 */

import { EventEmitter } from "events";

class CustomEvent extends EventEmitter {}

export const UiEventType = {
    SCROLL_TO_BOTTOM: "scroll_to_bottom",
    MOMENT_REFRESH: "moment_refresh", // 发布后刷新
    INPUT_FOCUS: "input_focus",
    // RESIZE_MASONRY: 'resize_masonry',
};

export const UiEventCenter = new CustomEvent();
export default UiEventCenter;
