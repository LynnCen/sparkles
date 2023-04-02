import React, { Component } from 'react';
import { Icon } from 'antd';
import { Mark, Balloon } from "../../../../components/model/";
import VrpIcon from "../../../../components/VrpIcon";

const scss = require("../../../../styles/scss/markerBox.scss");
const css = require("../../../../styles/scss/custom.scss");
// const data = {
//   address: "大众街125号",
//   community: null,
//   dateTime: "2021-02-26 14:30:00",
//   estate: null,
//   id: 1703,
//   latitude: "28.4515467718",
//   longitude: "119.9163082268",
//   name: "示例案件",
//   policeStation: "万象所",
//   remark: null,
//   type: 1,
//   typeName: "盗窃"
// }

interface Props {
  data: any;
}

interface States {
  isFullScreen: boolean;
  mark: Mark | Balloon;
  content?: any;
}

const content1 = {
  "typeName": {
    text: "案件类型：",
    icon: "icon-siyecao",
    value: ""
  },
  "name": {
    text: "案件名称：",
    icon: "icon-folder-2",
    value: ""
  },
  "dateTime": {
    text: "案发时间：",
    icon: "icon-clock",
    value: ""
  },
  "address": {
    text: "案发地址：",
    icon: "icon-position3",
    value: ""
  },
  "policeStation": {
    text: "管辖单位：",
    icon: "icon-build",
    value: ""
  }
}

const content2 = {
  "name": {
    text: "姓名:",
    icon: "",
    value: ""
  },
  "idCard": {
    text: "身份证号:",
    icon: "",
    value: ""
  },
  "currentAddress": {
    text: "家庭住址:",
    icon: "",
    value: ""
  }
}

const typeList = {
  1: "重点精神病人",
  2: "涉毒",
  3: "涉赌",
  4: "涉稳",
}

class LdPopup extends Component<Props, States> {
  markerBox;
  mark: Mark | Balloon;
  template;
  constructor(props: Props) {
    super(props);
    const { data } = props;
    // this.markerBox = document.querySelector(`#markerBox${data.id}`)!!;
    this.state = {
      isFullScreen: false,
      mark: data,
    };
  }

  componentDidMount(): void {
    const { data } = this.props.data.point;
    let template = window['pptTemplate']
    this.template = template
    let content = template === "lianDuPolice" ? content1 : content2
    this.setState({
      content: Object.keys(content).map((key) => ({
        ...content[key],
        value: data[key] || "无"
      }))
    })
  }

  renderType1 = () => {
    const { content } = this.state;
    return <div className={scss["list"]}>
      {Object.values(content).map((it, i) => {
        return <p key={i} className={scss['item']}>
          <VrpIcon className={scss['icon']} iconName={it.icon} />
          <span className={scss['label']}>{it.text}</span>
          <span>{it.value}</span></p>
      })
      }
    </div>
  };

  renderType2 = () => {
    const { data } = this.props.data.point;
    const { content } = this.state

    return <>
      <div className={scss['content-image']}>
        {
          data.picture ? <img src={`http://dtcity.cn:8077/api` + data.picture} /> : <div>暂无图片</div>
        }
      </div>
      <div className={scss["list"]}>
        {Object.values(content).map((it, i) => {
          return <p key={i} className={scss['item']}>
            <VrpIcon className={scss['icon']} iconName={it.icon} />
            <span className={scss['label']}>{it.text}</span>
            <span>{it.value}</span></p>
        })
        }
      </div>
    </>
  }

  render() {
    const { data } = this.props;
    const { title } = data;
    const { content, mark } = this.state;

    return (
      <>
        <div className={scss["ld-marker"]}>
          {content && (
            <div className={scss["ld-popup-container"]}>
              <header className={css['flex-center-between']}>
                {
                  this.template === "lianDuPolice" ? (
                    <span className={scss['title']}>
                      {title}(案件名称)
                    </span>
                  ) : (
                    <span className={scss['title']}>
                      {typeList[data.point.data.type]}({title})
                    </span>
                  )}
                <Icon type="close" className={scss["close"]} onClick={e => {
                  mark.showMessage = true;
                  mark.showBalloonData();
                }} />
              </header>
              <div className={scss['content']}>
                {this.template === "lianDuPolice" ? this.renderType1() : this.renderType2()}
              </div>
            </div>
          )}
        </div>
      </>
    );
  }
}


export default LdPopup;
