import { Component, lazy, Suspense } from "react";
import { RouteComponentProps, Switch, Route, withRouter } from "react-router-dom";
import { Drawer, message } from "antd";
import React from "react";
import Header from "./Header";
import Sidebar from "./sidebar";
import routes from "config/routes";
import context from "./context";
import { Spin } from "antd";
import LeftList from "./LeftList";
import SearchPopup from "components/SearchPopup";
import map from "utils/TDTMap";
import sxcwms from "config/sxcwms";
import Axios from "axios";
import { mergeParams } from "utils/common";
import handler from "./handler";
import Service from "utils/Service";

interface Props extends RouteComponentProps { }
interface States {
  toolList: string[];
  drawerVisible: boolean;
  store: { [k: string]: any; loading?: boolean };
  code: string;
  townName: string;
  popUpVisible: boolean;
  checkedItems: any[];
  keyword: string;
}
/*eslint no-restricted-globals: ["warn", "location"]*/
class Layout extends Component<Props, States> {
  constructor(props: Props) {
    super(props);
    this.state = {
      toolList: [],
      drawerVisible: true,
      store: {},
      code: "000",
      townName: "莲都区",
      popUpVisible: false,
      checkedItems: [],
      keyword: "",
    };
  }

  componentDidMount() {
    Axios.get(`/system`).then((r) => {
      if (r.data) this.setStore({ system: r.data });
    });
    setTimeout(() => {
      if (map.map) {
        map.map.addEventListener("zoomend", this.getClassByBounds);
        map.map.addEventListener("dragend", this.getClassByBounds);
        map.map.addEventListener("moveend", this.getClassByBounds);
      }
    });
  }

  componentWillReceiveProps({ location: { pathname }, ...rest }) {
    if (pathname != this.props.location.pathname) {
      //reset map layer
      map.reset();
      this.setState({
        code: "000",
        townName: "莲都区",
        checkedItems: [],
        popUpVisible: false,
      });
    }
  }
  // static getDerivedStateFromProps(props, state) {
  //   const { pathname } = props.location;
  //   if (pathname != location.pathname) {
  //     map.sxcLayer.setParams({ layers: sxcwms.layers });
  //     return {
  //       code: "000",
  //       townName: "莲都区",
  //       checkedItems: [],
  //       popUpVisible: false,
  //     };
  //   }
  //   return null;
  // }

  componentDidUpdate({ location, ...rest }) {
    const { pathname } = this.props.location;
    const { store } = this.state;
    let r = routes.find((r) => r.path == pathname);
    if (r && !store[r.key]) {
      const { key, configPath } = r;
      configPath && this.getPageConfig({ key, configPath });
      Object.assign(this.props.location, { state: { key: r.key } });
    }
  }
  //页面预设 json 数据
  getPageConfig = ({ key, configPath }) => {
    const { store } = this.state;
    if (!store.loading) {
      this.setStore({ loading: true });
      fetch(configPath, { mode: "cors" })
        .then((r) => r.json())
        .then((r) => {
          this.setStore({ [key]: r, loading: false });
        });
    }
  };
  //右下角刷新
  refresh = () =>
    this.componentWillReceiveProps({ location: { pathname: location.pathname + "?" } });

  getClassByBounds = (e) => {
    const bounds = e.target.getBounds();
    if (map.map.getZoom() >= map.CLASS_TITLE_ZOOM) {
      //获取显示小班编号
      const sw = bounds.getSouthWest();
      const ne = bounds.getNorthEast();
      const [minX, minY, maxX, maxY] = [sw.getLng(), sw.getLat(), ne.getLng(), ne.getLat()];
      Axios.get(`/home/centroid_by_range`, {
        params: { townCode: this.state.code, minX, minY, maxX, maxY },
      }).then((r) => {
        if (r.data) {
          r.data.forEach((item) => {
            map.addLabel({
              lng: item.x,
              lat: item.y,
              text: item.className,
              id: item.classId,
              style: { fontSize: "16px" },
              contentType: "class",
            });
          });
        }
      });
      let { lng: x, lat: y } = map.map.getCenter();
      //莲都区切换至乡镇
      if (this.state.code == "000") {
        Service.getTownName({ x, y }).then((r) => {
          if (r.data) {
            let town = handler.getTown.call(this.state, { townName: r.data });
            if (town) this.setTownLayerAndCode(town);
          }
        });
      }
    } else {
      //隐藏小班编号
      map.overlayPane.forEach((lay) => {
        let shouldHide = lay.options.contentType == "class" && !lay.isHidden();
        if (shouldHide) lay.hide();
      });
    }
  };

  townChange = ({ code, townName }) => {
    const { popUpVisible } = this.state;
    let obj = {};
    if (code !== this.state.code) {
      obj["checkedItems"] = [];
    }
    if (popUpVisible) {
      obj["popUpVisible"] = false;
    }
    this.setState({ code, townName, ...obj });
  };
  popupVisibleChange = (v = !this.state.popUpVisible) => {
    this.setState({ popUpVisible: v });
    const { layers } = map.sxcLayer.KR;
    //单个小班图层
    map.sxcLayer.setParams({
      layers: mergeParams(layers, { [sxcwms.layerMap["single_class"]]: v }),
    });
  };
  searchPopupChange = (checkedItems, key = "") => {
    const { code } = this.state;
    const { pathname } = this.props.location;
    const { layers } = map.sxcLayer.KR;
    let source = { [sxcwms.townLayer[code]]: false };
    this.popupVisibleChange(false);
    if (pathname == "/analysis") {
      //选中的小班图层
      map.sxcLayer.setParams({
        layers: mergeParams(layers, { [sxcwms.layerMap["analysis_class"]]: true, ...source }),
        viewparams: `townCode:${code};` + (checkedItems.length ? "key:" + key : ""),
      });
    } else if (pathname == "/progress") {
      //选中的采伐队图层
      map.sxcLayer.setParams({
        layers: mergeParams(layers, { [sxcwms.layerMap["progress_team"]]: true, ...source }),
        viewparams:
          `townCode:${code};` +
          (checkedItems.length ? "teamList:" + checkedItems.map(({ id }) => id).join("\\,") : ""),
      });
    }
    this.setState({ checkedItems, keyword: key });
  };
  get searchPopupProps() {
    const { code } = this.state;
    return {
      "/analysis": {
        title: "小班编号",
        columnKey: "name",
        request: { url: `/home/list_class?townCode=${code}`, pagi: true },
        useCheck: false,
        onCheck: (item, checked) => {
          map.sxcLayer.setParams({ viewparams: checked ? `classId:'${item.id}'` : "" });
          if (checked) {
            Axios.get(`/home/centroid_by_id?classId=${item.id}`).then((r) => {
              if (r.data) {
                const { x, y } = r.data;
                map.map.centerAndZoom(new T.LngLat(x, y), map.CLASS_TITLE_ZOOM);
              }
            });
          }
        },
      },
      "/progress": {
        title: "采伐队列",
        columnKey: "teamName",
        request: { url: `/progress/list_cut_team?townCode=${code}` },
      },
    }[this.props.location.pathname];
  }
  setStore = (obj) => this.setState({ store: { ...this.state.store, ...obj } });
  setTownLayerAndCode = (town: any) => {
    if (town && town.x) {
      handler.setTownLayer(town);
      this.townChange(town);
    }
  };
  render() {
    const { match, location } = this.props;
    const {
      drawerVisible,
      store,
      code,
      townName,
      popUpVisible,
      checkedItems,
      keyword,
    } = this.state;
    console.log("layout", checkedItems);
    return (
      <div id="container">
        <context.Provider
          value={{
            store,
            setStore: this.setStore,
            ...handler,
            setTownLayerAndCode: this.setTownLayerAndCode,
          }}
        >
          <div
            className={["mask", "pe-none", drawerVisible && "radial-bg"].filter(Boolean).join(" ")}
          />
          <Header title={env["TITLE"] || ""} enTitle={env["EN_TITLE"] || ""} bg={!drawerVisible} />

          <Drawer
            placement="left"
            closable={false}
            maskClosable={false}
            mask={false}
            width={310}
            className={"drawer drawer-left arial"}
            visible={drawerVisible}
          >
            <div className={"left"}>
              <LeftList
                selectKey={code}
                clickChange={this.townChange}
                buttonKey={/\/analysis|\/progress/.test(location.pathname)}
                popupVisibleChange={this.popupVisibleChange}
              />
              {popUpVisible && (
                <SearchPopup
                  {...this.searchPopupProps}
                  checkedItems={checkedItems}
                  keyword={keyword}
                  onChange={this.searchPopupChange}
                  onClose={(e) => this.popupVisibleChange(false)}
                  code={code}
                  height={560}
                  style={{ height: 615 }}
                />
              )}
            </div>
          </Drawer>
          <Suspense
            fallback={
              <div className="global-spin">
                <Spin />
              </div>
            }
          >
            <Switch>
              {routes.map((r, i) => (
                <Route key={r.key} exact={r.exact} path={r.path}>
                  <r.component
                    config={store[r.key]}
                    visible={drawerVisible}
                    code={code}
                    townName={townName}
                    checkedItems={checkedItems}
                    keyword={keyword}
                  />
                </Route>
              ))}
            </Switch>
          </Suspense>

          <Sidebar
            refresh={this.refresh}
            toggleDrawer={() => this.setState({ drawerVisible: !this.state.drawerVisible })}
          />
        </context.Provider>
      </div>
    );
  }
}

export default withRouter(Layout);
