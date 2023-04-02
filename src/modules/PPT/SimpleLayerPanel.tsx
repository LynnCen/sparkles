import * as React from "react";
import {
  Button,
  Collapse,
  Input,
  Popconfirm,
  Select,
  Switch,
  Icon
} from "antd";
import {
  Animation,
  Geometry,
  Layer,
  Mark,
  Model,
  PipeLine,
  Push
} from "../../components/model/";
import { CollapsePanelProps } from "antd/lib/collapse";
import VrpIcon from "../../components/VrpIcon";

const css = require("../../styles/custom.css");
const scss = require("../../styles/scss/ppttab.scss");

const Panel = Collapse.Panel;
const Option = Select.Option;

/**
 * @name SimpleLayerPanel
 * @author: bubble
 * @create: 2020/06/26 00:47
 */

interface ISimpleLayerPanelProps extends CollapsePanelProps {
  i: number;
  data: Layer;
  count: number;
  page: number;
  pageSize: number;
  onDelete: (isNew, id) => void;
}

interface ISimpleLayerPanelStates {
  id: number;
  isChange: boolean;
  isNew: boolean;
  title: string;
  isOpen: boolean;
  isVisible: boolean;
  // layerData: {},
  marks: Mark[];
  builds: Model[];
  pushs: Push[];
  lines: PipeLine[];
  geometrys: Geometry[];
  animates: Animation[];
  marksIds: number[];
  buildsIds: number[];
  pushsIds: number[];
  linesIds: number[];
  geometrysIds: number[];
  animatesIds: number[];
}

class SimpleLayerPanel extends React.Component<
  ISimpleLayerPanelProps,
  ISimpleLayerPanelStates
> {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      isChange: false,
      isNew: false,
      title: "",
      isOpen: true,
      isVisible: true,
      // layerData: {
      marks: [],
      builds: [],
      pushs: [],
      lines: [],
      geometrys: [],
      animates: [],
      marksIds: [],
      buildsIds: [],
      pushsIds: [],
      linesIds: [],
      geometrysIds: [],
      animatesIds: []
      // }
    };
  }

  componentDidMount() {
    this.setData(this.props.data);
  }

  setData = data => {
    const {
      id,
      isNew,
      title,
      isOpen,
      isVisible,
      marks,
      builds,
      pushs,
      lines,
      geometrys,
      animates
    } = data;
    // console.log(marks, this.getIds(marks));
    this.setState({
      id,
      isNew,
      title,
      isOpen,
      isVisible,
      marks,
      builds,
      pushs,
      lines,
      geometrys,
      animates,
      isChange: isNew,
      marksIds: this.getIds(marks) || [],
      buildsIds: this.getIds(builds) || [],
      pushsIds: this.getIds(pushs) || [],
      linesIds: this.getIds(lines) || [],
      geometrysIds: this.getIds(geometrys) || [],
      animatesIds: this.getIds(animates) || []
    });
  };

  getIds = list => {
    // console.log(list)
    let ids: number[] = [];
    if (list.length > 0) {
      for (const i in list) {
        ids.push(list[i].id);
        if (Number(i) === list.length - 1) {
          // console.log(ids)
          return ids;
        }
      }
    } else {
      return [];
    }
  };

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      this.setData(this.props.data);
    }
  }

  onSave = async () => {
    const { data } = this.props;
    const id = await data.save(this.state);
    this.setState({
      id: data.isNew ? id : data.id,
      isNew: false,
      isChange: false
    });
  };

  onDelete = () => {
    const { id, isNew } = this.state;
    // Layer.removeLayer(id);
    this.props.onDelete(isNew, id);
  };

  handleNameChange = e => {
    e.stopPropagation();
    this.setState({
      isChange: true,
      title: e.target.value
    });
  };

  switchChange = (isOpen, e) => {
    e.stopPropagation();
    const { data } = this.props;
    this.setState(
      {
        isChange: true,
        isOpen
      },
      () => {
        if (!data.isNew) {
          this.onSave();
        }
      }
    );
  };

  toggleVisible = e => {
    e.stopPropagation();
    const { data } = this.props;
    const { marks, builds, pushs, lines, geometrys, animates } = this.state;
    marks.forEach(item => {
      item.setVisible(!this.state.isVisible);
    });
    builds.forEach(item => {
      item.setVisible(!this.state.isVisible);
    });
    pushs.forEach(item => {
      item.setVisible(!this.state.isVisible);
    });
    lines.forEach(item => {
      item.setVisible(!this.state.isVisible);
    });
    geometrys.forEach(item => {
      item.setVisible(!this.state.isVisible);
    });
    this.setState(
      {
        isVisible: !this.state.isVisible,
        isChange: true
      },
      () => {
        if (!data.isNew) {
          this.onSave();
        }
      }
    );
  };

  onSelect = (type, value) => {
    const ResourceMap = Layer.resourceMap;
    switch (type) {
      case "marks":
        const { marksIds, marks } = this.state;
        for (const item of ResourceMap[type]) {
          if (item.id === value) {
            marks.push(item);
          }
        }
        marksIds.push(value);
        this.setState({
          marksIds,
          marks,
          isChange: true
        });
        return;
      case "builds":
        const { buildsIds, builds } = this.state;
        for (const item of ResourceMap[type]) {
          if (item.id === value) {
            builds.push(item);
          }
        }
        buildsIds.push(value);
        this.setState({
          buildsIds,
          builds,
          isChange: true
        });
        return;
      case "pushs":
        const { pushsIds, pushs } = this.state;
        for (const item of ResourceMap[type]) {
          if (item.id === value) {
            pushs.push(item);
          }
        }
        pushsIds.push(value);
        this.setState({
          pushsIds,
          pushs,
          isChange: true
        });
        return;
      case "lines":
        const { linesIds, lines } = this.state;
        for (const item of ResourceMap[type]) {
          if (item.id === value) {
            lines.push(item);
          }
        }
        linesIds.push(value);
        this.setState({
          linesIds,
          lines,
          isChange: true
        });
        return;
      case "geometrys":
        const { geometrysIds, geometrys } = this.state;
        for (const item of ResourceMap[type]) {
          if (item.id === value) {
            geometrys.push(item);
          }
        }
        geometrysIds.push(value);
        this.setState({
          geometrysIds,
          geometrys,
          isChange: true
        });
        return;
      case "animates":
        const { animatesIds, animates } = this.state;
        for (const item of ResourceMap[type]) {
          if (item.id === value) {
            animates.push(item);
          }
        }
        animatesIds.push(value);
        this.setState({
          animatesIds,
          animates,
          isChange: true
        });
        return;
    }
  };
  onChange = (type, value) => {
    console.log(type, value);
  }
  onClear = (type: string) => {
    const obj = { [type]: [], [type + "Ids"]: [] };
    const data = { isChange: true, ...obj };
    this.setState({ ...data });
  };

  render() {
    const { i, count, page, pageSize } = this.props;
    const { title, isChange, isOpen, isVisible } = this.state;
    // console.log(this.state)
    return (
      <Panel
        {...this.props}
        header={
          <span style={{ position: "relative" }}>
            <Input
              onChange={this.handleNameChange}
              onClick={e => e.stopPropagation()}
              placeholder="请输入图层名称"
              value={title}
              style={{ width: 180, marginLeft: 4, paddingRight: 40 }}
              className={scss["menu-title"]}
            />
            <Switch
              style={{ marginLeft: -44 }}
              checkedChildren="开"
              unCheckedChildren="关"
              checked={isOpen}
              onChange={(isOpen, e) => this.switchChange(isOpen, e)}
            />
          </span>
        }
        extra={
          <VrpIcon
            iconName={`icon-${isVisible ? "" : "in"}visible`}
            onClick={this.toggleVisible}
          />
        }
      >
        <div className={css["m-sm"]}>
          {Object.keys(Layer.resourceMap).map((it, i) => {
            return (
              <DataPicker
                key={i}
                type={it}
                data={Layer.resourceMap[it]}
                value={this.state[it + "Ids"]}
                onSelect={this.onSelect}
                onClear={this.onClear}
                onChange={this.onChange}
              />
            );
          })}
        </div>
        <div className={css["flex"] + " " + scss["panel-footer"]}>
          <Button
            type="primary"
            size="small"
            disabled={!isChange}
            onClick={this.onSave}
          >
            保存
          </Button>
          <Popconfirm
            title={"确定要删除吗？"}
            okText={"确定"}
            cancelText={"取消"}
            onConfirm={this.onDelete}
          >
            <Button size="small" style={{ color: "#F5222DFF" }}>
              删除
            </Button>
          </Popconfirm>
        </div>
      </Panel>
    );
  }
}

export default SimpleLayerPanel;
const DataPicker = (props: { type; data; value; onSelect; onClear; onChange }) => {
  function getLabel(name) {
    switch (name) {
      case "marks":
        return "标签";
      case "builds":
        return "模型";
      case "pushs":
        return "塌陷";
      case "lines":
        return "线条";
      case "geometrys":
        return "体块";
      case "animates":
        return "轨迹";
    }
  }

  return (
    <div className={css["flex-center-between"] + " " + css["m-y-sm"]}>
      <span>{getLabel(props.type)}：</span>
      {/*<Input size={"small"} className={css['ddd']} suffix={<Icon type="small-dash"/>}/>*/}
      <Select
        size={"small"}
        style={{ width: 180 }}
        mode="multiple"
        showArrow={false}
        maxTagCount={4}
        maxTagTextLength={2}
        // onSelect={props.onSelect}
        onSelect={value => props.onSelect(props.type, value)}
        value={props.value}
        filterOption={(input, option) =>
          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {props.data &&
          props.data.map((item, i) => {
            return (
              <Option key={i} value={item.id}>
                {item.title}
              </Option>
            );
          })}
      </Select>
      <a onClick={() => props.onClear(props.type)}>清除</a>
    </div>
  );
};
