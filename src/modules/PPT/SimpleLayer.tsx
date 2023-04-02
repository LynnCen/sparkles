import React, { Component } from "react";
import { Icon, Pagination, Collapse, message } from "antd";
import { warnHandler } from "../Modal/MarkerModal";
import SimpleLayerPanel from "./SimpleLayerPanel";
import Layer from "../../components/model/Layer";
import SimpleLayerService from "../../services/SimpleLayerService";
import Config from "../../config/Config";

const css = require("../../styles/custom.css");
const scss = require("../../styles/scss/ppttab.scss");

/**
 * @name SimpleLayer 小流域图层制作
 * @author: bubble
 * @create: 2020/06/25
 */

interface Props { }

interface States {
  list: Layer[];
  count: number;
  page: number;
  activeKey: string | string[];
}

export default class SimpleLayer extends Component<Props, States> {
  pageSize = process.env.NODE_ENV != "production" ? 20 : 50;

  constructor(props) {
    super(props);
    this.state = {
      // list: [new Layer({})],
      list: [...Layer.layers],
      count: Layer.layers.length,
      page: 1,
      activeKey: "0"
    };
  }

  componentDidMount() {
    // this.setState({
    //   list: Layer.layers,
    //   count: Layer.layers.length
    // })
  }

  handleAdd = async () => {
    const { list, page, count } = this.state;
    if (list.some(item => item.isNew)) warnHandler(this);
    else {
      // if (page != 1) {
      //   await this.pageChange(1);
      // }
      const data = new Layer({});
      data.isNew = true;
      data.id = Layer.layers.length + 1;
      list.unshift(data);
      // console.log(Layer.layers);
      Layer.addLayer(data);
      this.setState({ activeKey: "0", list, count: count + 1 });
      //todo 保存返回的图层总数 count
    }
  };

  pageChange = (page: number) => {
    this.setState({
      page
    });
    //todo 请求下一页 要不要分页 看接口详情
  };

  onDelete = (isNew, id) => {
    const { list } = this.state;
    const layer = Layer.getById(id);
    if (!isNew) {
      layer &&
        layer.del(() => {
          this.setState({
            list: [...Layer.layers]
          });
        });
    } else
      for (let i = 0; i < list.length; i++) {
        if (id === list[i].id) {
          list.splice(i, 1);
          this.setState({
            list
          });
          message.success("删除成功");
          break;
        }
      }
  };

  render() {
    const { list, count, page, activeKey } = this.state;
    console.log(list);
    return (
      <div className={css["m-sm"] + " " + scss["tabCard"]} role="collapsecard">
        <h3 className={css["p-l-sm"] + " " + css["flex-center-between"]}>
          <span>图层制作</span>
          <span>
            <Icon
              type="plus-circle"
              style={{ fontSize: "17.5px" }}
              onClick={this.handleAdd}
              className={scss["pointer"]}
              title={"添加"}
            />
          </span>
        </h3>
        {list && (
          <Collapse
            accordion
            expandIconPosition="right"
            defaultActiveKey={String(0)}
            activeKey={activeKey}
            onChange={key => this.setState({ activeKey: key })}
            className={scss["right-collapse"]}
          >
            {list.map((item, i) => {
              return (
                <SimpleLayerPanel
                  key={i}
                  i={i}
                  data={item}
                  count={count}
                  page={page}
                  pageSize={this.pageSize}
                  onDelete={this.onDelete}
                />
              );
            })}
          </Collapse>
        )}
        {/*<div className={css["m-t-md"] + " " + css["flex-center"]}>*/}
        {/*  <Pagination*/}
        {/*    defaultCurrent={1}*/}
        {/*    pageSize={this.pageSize}*/}
        {/*    current={page}*/}
        {/*    total={count}*/}
        {/*    size="small"*/}
        {/*    onChange={this.pageChange}*/}
        {/*  />*/}
        {/*</div>*/}
      </div>
    );
  }
}
