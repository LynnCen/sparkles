import { Component, lazy } from "react";
import { RouteComponentProps, Switch, Route } from "react-router-dom";
import ShareService from "../../services/ShareService";
import Tools from "../../components/tools/Tools";
import Config from "../../config/Config";
import React from "react";
import Header, { IndustrialHeader, ZhongtaiHeader } from "./Components/Header";
import { templates } from "../../config/StrConfig";

const css = require("../../styles/custom.css");
const scss = require("../../styles/scss/sharepage.scss");

/**
 * @name CustomMenu
 * @create: 2019/4/13
 * @description: 分享页面菜单
 */

interface Props extends RouteComponentProps {
  url: string;
  callBack: (img) => void;
  imgCall: (url) => void;
  titleCall: (title) => void;
}

interface States {
  title: string;
  eleList: string;
  menu: any;
  template: string;
  skin: { [k: string]: any };

  time: string;
  drawVisible: boolean;

  modalProps: {
    visible: boolean;
    title: string;
  };
  modalImg: string;
  weatherData: any;
  address: string;
  popoverVisible: boolean;
  logoUrl?: string;
  en: string;

  videoSrc?: string;
}

class ShareVideo extends Component<Props, States> {
  constructor(props: Props) {
    super(props);
    this.state = {
      eleList: "",
      template: "null",
      skin: templates["null"],
      title: "",
      menu: [],
      logoUrl: "",
      time: "",
      drawVisible: true,
      modalProps: {
        visible: false,
        title: ""
      },
      modalImg: "",
      weatherData: null,
      address: "北京",
      popoverVisible: false,
      en: "",
      videoSrc: ""
    };
  }
  componentWillMount() {
    this.getShare();
  }

  getShare = () => {
    let matches = window.location.href.match(/\/sharevideo\/(\w+)\/?/);
    let url: string = "";
    if (matches!.length >= 2) {
      url = matches![1];
    }
    if (url) {
      if (url == "knbmdkyyio") {
        this.setState({
          videoSrc: `${process.env.publicPath}video/jiangnan.mp4`
        });
      } else {
        this.setState({
          videoSrc: `${process.env.publicPath}video/journey.mp4`
        });
      }
      ShareService.getInfo({ url }, (success, res) => {
        if (success) {
          const { data } = res;
          if (data.isOpen) {
            const id = data.planId;
            const {
              plan: { title, city, en },
              eleList,
              onemenuVos,
              template,
              logoUrl
            } = data;
            (window as any).template = Object.keys(templates).find(
              key => key == template
            )
              ? template
              : "null";
            this.getTemplateSkin(id, window.template);
            document.title = title;
            const menu = onemenuVos.sort(Tools.compare("index"));
            this.setState({
              title,
              eleList,
              menu,
              template: template || "null",
              address: city,
              logoUrl,
              en
            });
          }
        }
      });
    }
  };

  getTemplateSkin = (planId, template) => {
    const { match } = this.props;
    Object.keys(templates).forEach(key => {
      const { cdir, routes } = templates[key];
      cdir &&
        (templates[key].component = lazy(() =>
          import(/* webpackChunkName: "skin" */ `./skin/${cdir}`)
        ));
      routes &&
        (templates[key].routes = templates[key].routes.map((e, i) => ({
          path: `${match.url}/${i}`,
          component: lazy(() =>
            import(/* webpackChunkName: "skin" */ `./skin/${e}`)
          )
        })));
    });
    if ("industrial" in templates) {
      templates["industrial"].header = IndustrialHeader;
    }
    if (Config.PLANID === 2300) {
      Object.keys(templates).forEach(key => {
        templates[key].header = ZhongtaiHeader;
      });
    }
    this.setState({ skin: templates[template] });
  };
  render() {
    const {
      title,
      menu,
      template,
      skin,
      drawVisible,
      address,
      en,
      logoUrl,
      videoSrc
    } = this.state;
    const { match } = this.props;
    const drawProps = { visible: drawVisible, address, menu, template };
    const ComputedHeader = skin.header ? skin.header : Header;
    return (
      <>
        <div
          className={
            scss["mask"] +
            " " +
            scss["pe-none"] +
            `${skin.hasDrawer && drawVisible ? ` ${scss["back"]}` : ""}`
          }
        />
        {/* <Video
          loop={true}
          controls={false}
          url={"http://localhost:3000/video/jiangnan.mp4"}
          className={scss["bgvideo"]}
        ></Video> */}
        <video autoPlay loop preload="metadata" className={scss["bgvideo"]}>
          <source src={videoSrc} type="video/mp4" />
        </video>
        <ComputedHeader
          title={title}
          en={en}
          bg={skin.hasDrawer && drawVisible}
          template={template}
          logoUrl={logoUrl}
          menu={menu}
          hasTool={false}
        />
        {skin.routes ? (
          <Switch>
            <Route
              exact
              path={match.url}
              render={props => {
                return <skin.component {...props} {...drawProps} />;
              }}
            />
            {skin.routes.map((route, i) => (
              <Route
                key={i}
                path={route.path}
                render={props => {
                  window.currentMenu = menu[i];
                  return <route.component {...props} {...drawProps} />;
                }}
              />
            ))}
          </Switch>
        ) : skin.component ? (
          <skin.component {...drawProps} />
        ) : null}

        <div className={scss["footer"]}>
          {skin.hasDrawer ? (
            <div
              className={scss["switch"] + " " + scss["pointer"]}
              onClick={e =>
                this.setState({
                  drawVisible: !this.state.drawVisible
                })
              }
            >
              <img
                src={require(`../../assets/leftswitch${Number(
                  drawVisible
                )}.png`)}
                alt=""
              />
            </div>
          ) : null}
        </div>
      </>
    );
  }
}

export default ShareVideo;
