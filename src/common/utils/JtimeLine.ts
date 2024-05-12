/* eslint-disable @typescript-eslint/no-this-alias */
// 华为回放进度条
class JTimeLine {
  isMouseDown = !1;
  isOver = !1;
  mousePosition = 0;
  oldTime = 0;
  nowTime = 0;
  moved = false;
  hoverLeft = 0;
  timeTipShow = !1;
  timeWidthTbls = [60, 1800, 3600, 86400, 259200];
  timeUnits = [
    '范围: 1分钟; 单位: 秒',
    '范围: 30分钟; 单位: 分钟',
    '范围: 1小时; 单位: 分钟',
    '范围: 1天; 单位: 小时',
    '范围: 3天; 单位: 小时',
  ];
  drawPen: any = null;
  timeSection = [];
  canvasWidth = 0;
  canvasHeight = 0;
  timeTips = null;
  canvasContain: any = '';
  ocanvas: any = '';
  options = {
    width: this.canvasWidth,
    height: 48,
    time: new Date().getTime(),
    timeSection: [],
    timeWidth: 0,
    readOnly: false,
  };
  timeWidthTblIndex = 0;
  timeWidth = 0;
  timeUnit = '';
  mouseTime = 0;
  hoverTime: string | number | Date = '';
  mouseString: string | number | Date = '';
  constructor(params: any) {
    this.canvasContain = params.canvasContain;
    this.ocanvas = params.ocanvas;
  }
  subTime(time: string | number) {
    return time < 10 ? '0' + time : time;
  }
  tranTime(time: string | number | Date) {
    let stringTime = time;
    let newDate;
    if (time) {
      newDate = new Date(time);
      stringTime =
          newDate.getFullYear() +
          '/' +
          (newDate.getMonth() + 1) +
          '/' +
          newDate.getDate() +
          ' ' +
          this.subTime(newDate.getHours()) +
          ':' +
          this.subTime(newDate.getMinutes()) +
          ':' +
          this.subTime(newDate.getSeconds());
    }
    return stringTime;
  }
  init(params: { onChange: any }) {
    const _this = this;
    const opts = this.options;
    let callback;
    this.timeWidthTblIndex = opts.timeWidth;
    const canvas = this.ocanvas;
    this.drawPen = canvas.getContext('2d');
    this.nowTime = opts.time || Date.now();
    this.timeSection = opts.timeSection || [];
    this.canvasWidth = canvas.offsetWidth;
    this.canvasHeight = canvas.offsetHeight;
    this.options.width = this.canvasWidth;
    this.updata();
    this.ocanvas
      .addEventListener('mousemove', function(e: any) {
        _this.options.readOnly || _this.mousemove(e);
      });
    this.ocanvas
      .addEventListener('mouseover', function() {
        _this.options.readOnly || _this.mouseover();
      });
    this.ocanvas
      .addEventListener('mouseleave', function() {
        _this.options.readOnly || _this.mouseleave();
      });
    this.ocanvas
      .addEventListener('mousedown', function(e: any) {
        _this.options.readOnly || _this.mousedown(e);
      });
    this.ocanvas.addEventListener('mouseup', function(e: any) {
      if (!_this.options.readOnly) {
        callback = params.onChange;
        _this.mouseUpFn(e, callback);
      }
    });
  }
  updata(data?: any) {
    const that = this;
    data = data || {};
    that.nowTime = data.time || that.nowTime;
    that.timeSection = data.timeSection || that.timeSection;
    that.timeWidthTblIndex = data.timeWidth || that.timeWidthTblIndex;
    that.timeWidth =
    that.timeWidthTbls[data.timeWidth || that.timeWidthTblIndex];
    that.timeUnit = that.timeUnits[data.timeWidth || that.timeWidthTblIndex];
    if (data.timeWidth === 0) {
      that.timeWidthTblIndex = 0;
      that.timeWidth = that.timeWidthTbls[0];
      that.timeUnit = that.timeUnits[0];
    }
    that.drawPen.fillStyle = '#292B36';
    that.drawPen.fillRect(0, 0, that.canvasWidth, that.canvasHeight);
    that.drawScale();
    that.drawRecord();
    that.drawOtherMsg();
    this.canvasContain.style.width =
      this.options.width + 'px';
    this.ocanvas.style.width = this.options.width + 'px';
    this.canvasContain.style.height =
      this.options.height + 'px';
    this.ocanvas.style.height = this.options.height + 'px';
  }

  // 画刻度
  drawScale() {
    const that = this;
    const lineColor = 'rgba(255,255,255,0.3)';
    const startDate = new Date(that.nowTime);
    let starSecond = startDate.getSeconds();
    let starMin = startDate.getMinutes();
    let startHours = startDate.getHours();
    let startDay = startDate.getDate();
    let startYears = startDate.getFullYear();
    let OffsetLeft = 60 * starMin + starSecond;
    let curScale = 0;
    let params;
    let timeString;
    let i;
    let dotNum;
    switch (that.timeWidth) {
      case 60:
        dotNum = parseInt(`${that.canvasWidth / 10}`);
        startDate.setSeconds(startDate.getSeconds() - parseInt(`${dotNum / 2}`, 10));
        startDay = startDate.getDate();
        startHours = startDate.getHours();
        starMin = startDate.getMinutes();
        starSecond = startDate.getSeconds();
        for (i = 0; i < dotNum; i++) {
          curScale = starSecond + i;
          startDate.setSeconds(curScale);
          if (curScale % 10 === 0) {
            params = { startX: (i * that.canvasWidth) / dotNum, startY: 0, endX: (i * that.canvasWidth) / dotNum, endY: (that.canvasHeight / 5) * 1.5, lineWidth: 1, color: lineColor };
            that.drawSolidLine(params);
            timeString =
                this.subTime(startDate.getHours()) +
                ':' +
                this.subTime(startDate.getMinutes()) +
                ':' +
                this.subTime(startDate.getSeconds());
            that.drawString(timeString, (i * that.canvasWidth) / dotNum, (that.canvasHeight / 5) * 2.5, 'center', 'rgba(255,255,255,0.3)');
          } else {
            params = { startX: (i * that.canvasWidth) / dotNum, startY: 0, endX: (i * that.canvasWidth) / dotNum, endY: (that.canvasHeight / 5) * 0.5, lineWidth: 1, color: lineColor };
            that.drawSolidLine(params);
          }
          startDate.setDate(startDay);
          startDate.setHours(startHours);
          startDate.setMinutes(starMin);
        }
        break;
      case 1800:
        dotNum = parseInt(`${that.canvasWidth / 20}`);
        startDate.setMinutes(startDate.getMinutes() - parseInt(`${dotNum / 2}`, 10));
        startHours = startDate.getHours();
        starMin = startDate.getMinutes();
        for (i = 0; i <= dotNum; i++) {
          curScale = starMin + i;
          startDate.setMinutes(curScale);
          if (curScale % 5 === 0) {
            params = { startX: (i * that.canvasWidth) / dotNum, startY: 0, endX: (i * that.canvasWidth) / dotNum, endY: (that.canvasHeight / 5) * 1.5, lineWidth: 1, color: lineColor };
            that.drawSolidLine(params);
            timeString =
                this.subTime(startDate.getHours()) +
                ':' +
                this.subTime(startDate.getMinutes());
            that.drawString(timeString, (i * that.canvasWidth) / dotNum, (that.canvasHeight / 5) * 2.5, 'center', 'rgba(255,255,255,0.3)');
          } else {
            params = { startX: (i * that.canvasWidth) / dotNum, startY: 0, endX: (i * that.canvasWidth) / dotNum, endY: (that.canvasHeight / 5) * 0.5, lineWidth: 1, color: lineColor };
            that.drawSolidLine(params);
          }
          startDate.setHours(startHours);
        }
        break;
      case 3600:
        dotNum = parseInt(`${that.canvasWidth / 20}`);
        startDate.setMinutes(startDate.getMinutes() - parseInt(`${dotNum / 2}`, 10));
        startHours = startDate.getHours();
        starMin = startDate.getMinutes();
        for (i = 0; i <= dotNum; i++) {
          curScale = starMin + i;
          startDate.setMinutes(curScale);
          if (curScale % 10 === 0) {
            params = { startX: (i * that.canvasWidth) / dotNum, startY: 0, endX: (i * that.canvasWidth) / dotNum, endY: (that.canvasHeight / 5) * 1.5, lineWidth: 1, color: lineColor };
            that.drawSolidLine(params);
            timeString =
                this.subTime(startDate.getHours()) +
                ':' +
                this.subTime(startDate.getMinutes());
            that.drawString(timeString, (i * that.canvasWidth) / dotNum, (that.canvasHeight / 5) * 2.5, 'center', 'rgba(255,255,255,0.3)');
          } else {
            params = { startX: (i * that.canvasWidth) / dotNum, startY: 0, endX: (i * that.canvasWidth) / dotNum, endY: (that.canvasHeight / 5) * 0.5, lineWidth: 1, color: lineColor };
            that.drawSolidLine(params);
          }
          startDate.setHours(startHours);
        }
        break;
      case 86400:
        dotNum = parseInt(`${that.canvasWidth / 30}`);
        startDate.setHours(startDate.getHours() - parseInt(`${dotNum / 2}`, 10));
        starSecond = startDate.getSeconds();
        starMin = startDate.getMinutes();
        startHours = startDate.getHours();
        startDay = startDate.getDate();
        startYears = startDate.getFullYear();
        for (i = 0; i <= dotNum; i++) {
          curScale = startHours + i;
          startDate.setHours(curScale);
          if (curScale % 24 !== 0) {
            timeString = this.subTime(startDate.getHours()) + ':00';
            params = { startX: (i * that.canvasWidth) / dotNum, startY: 0, endX: (i * that.canvasWidth) / dotNum, endY: (that.canvasHeight / 5) * 0.5, lineWidth: 1, color: lineColor };
            that.drawSolidLine(params);
          } else {
            timeString = startDate.toLocaleDateString();
            params = { startX: (i * that.canvasWidth) / dotNum, startY: 0, endX: (i * that.canvasWidth) / dotNum, endY: (that.canvasHeight / 5) * 1, lineWidth: 1, color: lineColor };
            that.drawSolidLine(params);
          }
          if (curScale % 2 === 0) {
            that.drawString(timeString, (i * that.canvasWidth) / dotNum, (that.canvasHeight / 5) * 2, 'center', 'rgba(255,255,255,0.3)');
          }
          startDate.setFullYear(startYears);
          startDate.setDate(startDay);
          startDate.setHours(startHours);
        }
        break;
      case 259200:
        startDate.setHours(startDate.getHours() - 36);
        starSecond = startDate.getSeconds();
        starMin = startDate.getMinutes();
        startHours = startDate.getHours();
        OffsetLeft = 60 * starMin + starSecond;
        for (i = 0; i <= 72; i++) {
          curScale = startHours + i;
          if (curScale >= 24) {
            curScale %= 24;
          }
          curScale === 0 ? startDate.setHours(24) : startDate.setHours(curScale);
          timeString = this.subTime(startDate.getHours());
          if (curScale % 3 === 0) {
            curScale || (timeString = startDate.toLocaleDateString());
            that.drawString(timeString, ((3600 * i - OffsetLeft) * that.canvasWidth) / 259200, (that.canvasHeight / 5) * 2.5, 'center', 'rgba(255,255,255,0.3)');
            params = { startX: ((3600 * i - OffsetLeft) * that.canvasWidth) / 259200, startY: 0, endX: ((3600 * i - OffsetLeft) * that.canvasWidth) / 259200, endY: (that.canvasHeight / 5) * 1, lineWidth: 1, color: lineColor };
            that.drawSolidLine(params);
          } else {
            params = { startX: ((3600 * i - OffsetLeft) * that.canvasWidth) / 259200, startY: 0, endX: ((3600 * i - OffsetLeft) * that.canvasWidth) / 259200, endY: (that.canvasHeight / 5) * 0.5, lineWidth: 1, color: lineColor };
            that.drawSolidLine(params);
          }
        }
    }
  }

  mousemove(e: { pageX: number }) {
    let left;
    let mouseOffset;
    let timeOffsetUnit;
    let currentTime;
    if (this.isMouseDown && this.isOver) {
      mouseOffset = this.mousePosition - e.pageX;
      if (mouseOffset === 0) { return; }
      timeOffsetUnit = 0;
      switch (this.timeWidth) {
        case 60:
          timeOffsetUnit = 0.1;
          break;
        case 1800:
        case 3600:
          timeOffsetUnit = 3;
          break;
        case 86400:
          timeOffsetUnit = 120;
      }
      currentTime = new Date(this.oldTime).getTime() + mouseOffset * timeOffsetUnit * 1e3;
      this.updata({ time: currentTime });
      this.moved = !0;
    } else {
      left = parseInt(
        this.ocanvas.offsetLeft,
        10
      );
      this.mousePosition = e.pageX - left;
      this.updata();
    }
  }
  mousedown(e: { pageX: null }) {
    this.isMouseDown = !0;
    this.mousePosition = e.pageX || 0;
    this.oldTime = this.nowTime;
  }
  mouseover() {
    this.isOver = !0;
  }
  mouseleave() {
    this.isOver = !1;
    this.isMouseDown = !1;
    this.updata();
  }
  mouseUpFn(e: any, callback: (arg0: number) => void) {
    if (this.isMouseDown) {
      this.isMouseDown = !1;
      if (this.moved) {
        this.moved = !1;
        this.updata({ time: this.nowTime });
        this.oldTime = this.nowTime;
        callback(this.nowTime);
      }
    }
  }
  // 画进度条
  drawRecord() {
    let startPosition;
    let endPosition;
    const that = this;
    function findPosition(time: number) {
      let scale = 10;
      switch (that.timeWidth) {
        case 60:
          scale = 10;
          break;
        case 1800:
        case 3600:
          scale = 20 / 60;
          break;
        case 86400:
          scale = 20 / 60 / 60;
      }
      const nowTimePostion = that.canvasWidth / 2;
      let position = nowTimePostion + ((time - that.nowTime) / 1e3) * scale;
      if (position > that.canvasWidth) {
        position = that.canvasWidth;
      }
      if (position <= 0) {
        position = 0;
      }
      return position;
    }
    const timeArr: any[] = this.timeSection || [];
    const drawPen = that.drawPen;
    let i;
    for (i = 0; i < timeArr.length; i++) {
      startPosition = findPosition(timeArr[i].startTime);
      endPosition = findPosition(timeArr[i].endTime);
      drawPen.fillStyle = '#FF502E';
      drawPen.fillRect(
        startPosition,
        (that.canvasHeight / 5) * 3,
        endPosition - startPosition,
        (that.canvasHeight / 5) * 1.5
      );
    }
  }
  // 画中间的条
  drawOtherMsg() {
    this.drawPen.shadowColor = '#ffffff';
    this.drawPen.shadowOffsetX = 0;
    this.drawPen.shadowOffsetY = 0;
    this.drawPen.shadowBlur = 10;
    this.drawPen.beginPath();
    this.drawPen.moveTo(this.canvasWidth / 2 - 4.5, 0);
    this.drawPen.lineTo(this.canvasWidth / 2 + 4.5, 0);
    this.drawPen.lineTo(this.canvasWidth / 2, 4.5);
    this.drawPen.fillStyle = '#fff';
    this.drawPen.closePath();
    this.drawPen.fill();
    this.drawPen.beginPath();
    this.drawPen.moveTo(this.canvasWidth / 2 - 4.5, this.canvasHeight);
    this.drawPen.lineTo(this.canvasWidth / 2 + 4.5, this.canvasHeight);
    this.drawPen.lineTo(this.canvasWidth / 2, this.canvasHeight - 4.5);
    this.drawPen.fillStyle = '#fff';
    this.drawPen.closePath();
    this.drawPen.fill();
    const params = { startX: this.canvasWidth / 2, startY: 0, endX: this.canvasWidth / 2, endY: this.canvasHeight, lineWidth: 2, color: '#ffffff' };
    this.drawSolidLine(params);
    this.drawPen.shadowBlur = 0;
    if (this.isOver) {
      if (!this.isMouseDown) {
        this.mouseTime =
          (this.mousePosition / this.canvasWidth) * this.timeWidth * 1e3 +
          this.nowTime -
          (this.timeWidth / 2) * 1e3;
        this.mouseString = this.tranTime(this.mouseTime);
        this.hoverTime = this.mouseString;
        this.hoverLeft = this.mousePosition - 60;
        this.timeTipShow = !0;
      } else {
        this.timeTipShow = !1;
      }
    }
  }
  // 画刻度调用
  drawSolidLine(drawLineParams: { startX: any; startY: any; endX: any; endY: any; lineWidth: any; color: any }) {
    const { startX, startY, endX, endY, lineWidth, color } = drawLineParams;
    this.drawPen.save();
    this.drawPen.strokeStyle = color;
    this.drawPen.lineWidth = lineWidth;
    this.drawPen.beginPath();
    this.drawPen.moveTo(startX, startY);
    this.drawPen.lineTo(endX, endY);
    this.drawPen.stroke();
    this.drawPen.restore();
  }
  drawString(text: any, x: any, y: any, aling: string, color: string) {
    this.drawPen.font = '12px serif';
    this.drawPen.fillStyle = color || '#ffffff';
    this.drawPen.textAlign = aling || 'left';
    this.drawPen.fillText(text, x, y);
  }
  changeSize(timeWidth: number) {
    this.options.timeWidth = timeWidth;
    this.updata({ timeWidth: timeWidth });
  }

  readOnly() {
    this.options.readOnly = !0;
    this.ocanvas.style.cursor = 'not-allowed';
  }
  unReadOnly() {
    this.options.readOnly = !1;
    this.ocanvas.style.cursor = 'pointer';
  }
  run(data: any) {
    this.isMouseDown || this.updata(data);
  }
  getTime(data: any) {
    console.log('getTime-data', data);
  }



  getRecord(timeArr: never[]) {
    this.timeSection = timeArr;
  }


}

export default JTimeLine;
