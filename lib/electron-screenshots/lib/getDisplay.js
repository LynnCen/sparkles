"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
exports.default = (function () {
    var point = electron_1.screen.getCursorScreenPoint();
    var _a = electron_1.screen.getDisplayNearestPoint(point), id = _a.id, bounds = _a.bounds, workArea = _a.workArea, scaleFactor = _a.scaleFactor;
    if (process.platform === 'darwin') {
        return {
            id: id,
            x: bounds.x,
            y: bounds.y,
            width: bounds.width,
            height: bounds.height
        };
    }
    // win32 darwin linux平台分别处理
    var display = process.platform === 'linux' ? workArea : bounds;
    return {
        id: id,
        x: display.x * (scaleFactor >= 1 ? scaleFactor : 1),
        y: display.y * (scaleFactor >= 1 ? scaleFactor : 1),
        width: display.width * scaleFactor,
        height: display.height * scaleFactor
    };
});
