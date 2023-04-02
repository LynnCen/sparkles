import React, { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Layout from "layout/index";
import TDTMap from "./utils/TDTMap";
import { ConfigProvider } from "antd";
import zhCN from "antd/es/locale/zh_CN";
import moment from "moment";
import "moment/locale/zh-cn";
moment.locale("zh-cn");

export default class extends Component {
  componentDidMount() {
    TDTMap.init();
  }
  render() {
    return (
      <Router basename={process.env.PUBLIC_URL}>
        <ConfigProvider locale={zhCN}>
          <Layout />
        </ConfigProvider>
      </Router>
    );
  }
}
