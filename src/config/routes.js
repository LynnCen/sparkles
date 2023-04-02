import { lazy } from "react";
import Home from "pages/home";

const routes = [
  {
    path: "/",
    exact: true,
    component: Home,
    title: "年度总览",
    icon: require("assets/icon/home.svg"),
    configPath: "./config/home.json",
  },
  {
    path: "/analysis",
    title: "分析决策",
    icon: require("assets/icon/analysis.svg"),
    configPath: "./config/analysis.json",
  },
  {
    path: "/dispatch",
    title: "任务派发",
    icon: require("assets/icon/dispatch.svg"),
    configPath: "./config/dispatch.json",
  },
  {
    path: "/progress",
    title: "进度跟踪",
    icon: require("assets/icon/progress.svg"),
    configPath: "./config/progress.json",
  },
  {
    path: "/acceptance",
    title: "核查验收",
    icon: require("assets/icon/acceptance.svg"),
    configPath: "./config/acceptance.json",
  },
  // {
  //   path: "/cost",
  //   title: "费用核算",
  //   icon: require("assets/icon/cost.svg"),
  //   configPath: "./config/cost.json",
  // },
  {
    path: "/audit",
    title: "全程监督",
    icon: require("assets/icon/audit.svg"),
    configPath: "./config/audit.json",
  },
  // {
  //   path: "",
  //   title: "打孔注药",
  //   icon: require("assets/icon/打孔注药.svg"),
  //   configPath: "./config/audit.json",
  // },
];
routes.forEach((r, i) => {
  if (i) {
    r.key = r.path.slice(1);
    r.component = lazy(() => import(/* webpackChunkName: "page" */ `../pages${r.path}`));
  } else r.key = "home";
});
console.log(routes);

export default routes;
