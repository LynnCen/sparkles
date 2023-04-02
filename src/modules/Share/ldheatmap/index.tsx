import React, { Component } from 'react';
import { Scene, HeatmapLayer, PointLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import { Select, Slider } from 'antd'
import BottomBar from './bottomBar'


const scss = require('./ldheatmap.scss')
const { Option } = Select
const listColor = {
  1: "#32BBFF",
  2: "#00FFFE",
  3: "#00E950",
  4: "#F7B500",
  5: "#FA6400",
  6: "#E02020",
}

// const REACT_APP_API = 'http://192.168.1.148:8077/api'
const REACT_APP_API = 'http://dtcity.cn:8077/api'

interface Props {
  style: any;
}

interface State {
  marks: any;
  bottomBarKey: number;
  beginTime: string;
  endTime: string;
  timeList: any[];
  policeStationId: number;
  selectList: any[];
  maxKey?: number
}

class index extends Component<Props, State> {
  scene;
  layer;

  constructor(props: Props) {
    super(props);
    this.state = {
      marks: {},
      bottomBarKey: 1,
      beginTime: "",
      endTime: "",
      timeList: [],
      policeStationId: 0,
      selectList: []
    }
  }

  componentDidMount() {
    fetch(REACT_APP_API + '/common/query_areas', {
      method: 'get',
      headers: { "Content-Type": "application/json" }
    })
      .then(r => r.json())
      .then(r => {
        this.setState({
          selectList: r.data
        })
      })
    setTimeout(() => {
      const scene = new Scene({
        id: 'heatMap',
        map: new GaodeMap({
          style: 'dark',
          center: [119.923007, 28.46548],
          zoom: 13,
        }),
        logoVisible: false,
      });
      this.scene = scene
      fetch(REACT_APP_API + '/caseInfo/timeList', {
        method: 'get',
        headers: { "Content-Type": "application/json" }
      })
        .then(res => res.json())
        .then(res => {
          fetch(REACT_APP_API + `/caseInfo/queryForHeatMap?policeStationId=0&type=1&startMonth=${res.data[0]}&endMonth=${res.data[res.data.length - 1]}`, {
            method: 'get',
            headers: { "Content-Type": "application/json" }
          })
            .then(item => item.json())
            .then(item => {
              fetch(REACT_APP_API + item.data)
                .then(data => data.text())
                .then(data => {
                  const pointLayer = new PointLayer({})
                    .source(data, {
                      parser: {
                        type: 'csv',
                        y: 'lat',
                        x: 'lng'
                      }
                    })
                    .size(1.5)
                    .color('#32BBFF')
                    .style({
                      opacity: 1
                    });
                  this.layer = pointLayer
                  scene.addLayer(pointLayer);
                })
            })

          let newList = {}
          res.data.map((r, i) => {
            newList[i] = r
          })
          this.setState({
            marks: newList,
            maxKey: res.data.length - 1,
            beginTime: res.data[0],
            endTime: res.data[res.data.length - 1],
            timeList: res.data
          })
        })

    }, 200)
  }

  componentDidUpdate(props) {
    const { style } = this.props
    if (props.style.zIndex !== style.zIndex) {
      this.scene.removeLayer(this.layer)
      this.layer = {}
      fetch(REACT_APP_API + '/caseInfo/timeList', {
        method: 'get',
        headers: { "Content-Type": "application/json" }
      })
        .then(res => res.json())
        .then(res => {
          fetch(REACT_APP_API + `/caseInfo/queryForHeatMap?policeStationId=0&type=1&startMonth=${res.data[0]}&endMonth=${res.data[res.data.length - 1]}`, {
            method: 'get',
            headers: { "Content-Type": "application/json" }
          })
            .then(item => item.json())
            .then(item => {
              fetch(REACT_APP_API + item.data)
                .then(data => data.text())
                .then(data => {
                  const pointLayer = new PointLayer({})
                    .source(data, {
                      parser: {
                        type: 'csv',
                        y: 'lat',
                        x: 'lng'
                      }
                    })
                    .size(1.5)
                    .color('#32BBFF')
                    .style({
                      opacity: 1
                    });
                  this.layer = pointLayer
                  this.scene.addLayer(pointLayer);
                })
            })

          let newList = {}
          res.data.map((r, i) => {
            newList[i] = r
          })
          this.setState({
            marks: newList,
            maxKey: res.data.length - 1,
            beginTime: res.data[0],
            endTime: res.data[res.data.length - 1],
            timeList: res.data
          })
        })
    }
  }


  sliderChange = (value) => {
    const { marks, timeList, bottomBarKey, policeStationId } = this.state
    this.scene.removeLayer(this.layer)
    this.layer = {}
    fetch(REACT_APP_API + `/caseInfo/queryForHeatMap?policeStationId=${policeStationId}&type=${bottomBarKey}&startMonth=${timeList[value[0]]}&endMonth=${timeList[value[1]]}`, {
      method: 'get',
      headers: { "Content-Type": "application/json" }
    })
      .then(res => res.json())
      .then(res => {
        fetch(REACT_APP_API + res.data)
          .then(data => data.text())
          .then(data => {
            const pointLayer = new PointLayer({})
              .source(data, {
                parser: {
                  type: 'csv',
                  y: 'lat',
                  x: 'lng'
                }
              })
              .size(1.5)
              .color(listColor[bottomBarKey])
              .style({
                opacity: 1
              });
            this.layer = pointLayer
            this.scene.addLayer(pointLayer);
            this.setState({
              beginTime: timeList[value[0]],
              endTime: timeList[value[1]]
            })
          })
      })
  }

  showArea = (isShow) => {
    const { beginTime, endTime, policeStationId } = this.state
    console.log("预警", isShow, beginTime, endTime, policeStationId)
  }

  changeMapState = (value) => {
    const { beginTime, endTime, policeStationId } = this.state
    this.scene.removeLayer(this.layer)
    this.layer = {}
    fetch(REACT_APP_API + `/caseInfo/queryForHeatMap?policeStationId=${policeStationId}&type=${value}&startMonth=${beginTime}&endMonth=${endTime}`, {
      method: 'get',
      headers: { "Content-Type": "application/json" }
    })
      .then(res => res.json())
      .then(res => {
        fetch(REACT_APP_API + res.data)
          .then(data => data.text())
          .then(data => {
            const pointLayer = new PointLayer({})
              .source(data, {
                parser: {
                  type: 'csv',
                  y: 'lat',
                  x: 'lng'
                }
              })
              .size(1.5)
              .color(listColor[value])
              .style({
                opacity: 1
              });
            this.layer = pointLayer
            this.scene.addLayer(pointLayer);
            this.setState({
              bottomBarKey: value
            })
          })
      })
  }

  selectChange = (value) => {
    const { beginTime, endTime, bottomBarKey } = this.state
    this.scene.removeLayer(this.layer)
    this.layer = {}
    fetch(REACT_APP_API + `/caseInfo/queryForHeatMap?policeStationId=${value}&type=${bottomBarKey}&startMonth=${beginTime}&endMonth=${endTime}`)
      .then(res => res.json())
      .then(res => {
        fetch(REACT_APP_API + res.data)
          .then(data => data.text())
          .then(data => {
            const pointLayer = new PointLayer({})
              .source(data, {
                parser: {
                  type: 'csv',
                  y: 'lat',
                  x: 'lng'
                }
              })
              .size(1.5)
              .color(listColor[bottomBarKey])
              .style({
                opacity: 1
              });
            this.layer = pointLayer
            this.scene.addLayer(pointLayer);
          })
      })
  }

  render() {
    const { style } = this.props
    const { marks, bottomBarKey, maxKey, selectList } = this.state

    return (
      <div className={scss['ld-heat-map']} style={style}>
        <div id='heatMap'>
          <div className={scss['header']}>
            <div className={scss['header-left']}>
              <div className={scss['header-title']}>
                <div>莲都公安数字警务派出所应用平台</div>
                <div>LIANDU PUBLIC SECURITY DIGITAL POLICE STATION APPLICATION PLATFORM</div>
              </div>
              <Select
                defaultValue={0}
                getPopupContainer={triggerNode => triggerNode}
                onChange={this.selectChange}
              >
                {
                  selectList.map((r, i) => {
                    return <Option key={i} value={r.id}>{r.name}</Option>
                  })
                }
              </Select>
            </div>
            <div className={scss['header-right']}>
              <img src={`${process.env.publicPath}images/ldPolice/重点警情icon.svg`} alt="" />
              <div>
                <span>
                  重点警情
                            </span>
              </div>
            </div>
          </div>
          {
            maxKey && <div className={scss['time-line']}>
              <Slider
                min={0}
                max={maxKey}
                range={true}
                tipFormatter={null}
                marks={marks}
                onChange={this.sliderChange}
                defaultValue={[0, maxKey]}
              />
            </div>
          }
          <BottomBar
            changeMapState={this.changeMapState} bottomBarKey={bottomBarKey}
          />
        </div>
      </div>
    );
  }
}

export default index;
