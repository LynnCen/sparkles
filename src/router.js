import React, { lazy, Suspense, useEffect } from "react";
import { HashRouter, Route, Switch } from "dva/router";
import { ConfigProvider, Spin } from "antd";
import zhCN from "antd/es/locale-provider/zh_CN";
// import IndexPage from "./page/IndexPage";
// import PreviewPage from "./page/PreviewPage";
import SharePage from "./page/SharePage";
import SharePPT from "./page/SharePPT";
// import CompareTerrain from "./components/CompareTerrain";

const IndexPage = lazy(() => import(/* webpackChunkName: "edit" */ "./page/IndexPage"));
// const SharePage = lazy(() =>
//   import(/* webpackChunkName: "share" */ "./page/SharePage")
// );
// const SharePPT = lazy(() =>
//   import(/* webpackChunkName: "share" */ "./page/SharePPT")
// );
const ShareVideo = lazy(() =>
  import(/* webpackChunkName: "ShareVideo" */ "./modules/Share/ShareVideo")
);

const PreviewPage = lazy(() => import(/* webpackChunkName: "preview" */ "./page/PreviewPage"));
const CompareTerrain = lazy(() =>
  import(/* webpackChunkName: "compare" */ "./components/CompareTerrain")
);
export default function RouterConfig({ history }) {
  useEffect(() => {
    window["NProgress"].set(0.7);
    setTimeout(window["NProgress"].done, 1000);
  }, []);
  return (
    <HashRouter basename={"/"}>
      <ConfigProvider locale={zhCN}>
        <Suspense
          fallback={
            <div className="global-spin">
              <Spin />
            </div>
          }
        >
          <Switch>
            <Route path="/edit" component={props => <IndexPage {...props} />} />
            <Route path="/share/:url" component={SharePage} />
            <Route path="/shareppt/:url" component={SharePPT} />
            <Route path="/sharevideo/:url" component={props => <ShareVideo {...props} />} />
            <Route path="/preview/:id" component={props => <PreviewPage {...props} />} />
            <Route path="/compare" component={props => <CompareTerrain {...props} />} />
          </Switch>
        </Suspense>
      </ConfigProvider>
    </HashRouter>
  );
}
