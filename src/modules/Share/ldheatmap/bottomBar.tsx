import React, {Component} from 'react';
import VrpIcon from "../../../components/VrpIcon";


const scss = require('./ldheatmap.scss')
const isFullscreen = () => window.screen.height == document.body.clientHeight;
const list = [
  {
    type: 1,
    title: '盗窃',
    name: "icondaoqieicon2",
  },
  {
    type: 2,
    title: '电诈',
    name: "icondianzhaicon2"
  },
  {
    type: 3,
    title: '伤害',
    name: "iconshanghaiicon2"
  },
  {
    type: 4,
    title: '赌博',
    name: "iconsheduicon2"
  },
  {
    type: 5,
    title: '涉黄',
    name: "iconshehuangicon2"
  },
  {
    type: 6,
    title: '矛盾纠纷',
    name: "iconmaodunjiufenicon2"
  }
]


interface Props {
  bottomBarKey: number;
  changeMapState: (value) => void;
}

interface State {
  pin: boolean,
  fullscreen?: boolean;
}


class BottomBar extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      pin: true,
      fullscreen: isFullscreen(),
    }
  }

  render() {
    const {bottomBarKey} = this.props
    const {pin} = this.state
    return (
      <div className={scss['bottom-bar']}>
        <div className={scss['bottom-bar-left']}>
          <div className={scss['button-list']}>
            {
              list.map((r, i) => {
                return <div className={r.type === bottomBarKey ? scss["button-list-action"] : ""}
                            key={i} onClick={() => this.props.changeMapState(r.type)}>
                  <VrpIcon
                    iconName={r.name}
                    className={scss['ld-slider-icon']}
                  />
                  {r.title}
                </div>
              })
            }
          </div>
        </div>
        <div className={scss['bottom-bar-right']}>

        </div>
      </div>
    );
  }
}

export default BottomBar;
