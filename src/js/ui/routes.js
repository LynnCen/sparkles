import React, { Fragment, lazy } from "react";
import { withRouter, BrowserRouter, Route, Switch } from "react-router-dom";

import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Second from "./pages/Second";
import MomentDetail from "./pages/MomentDetail";
import MomentList from "./pages/Moments/MomentsList";
import MomentTopics from "./pages/Moments/Topic";
import MomentTopicDetail from "./pages/Moments/TopicDetail";
import UserMomentsAll from "./pages/Moments/UserMoments/category/Moments";

const Main = withRouter((props) => <Layout {...props} />);

export const ROUTE_PATH = {
    HOME: `/`,
    SECOND: "/contacts",
    MOMENT_DETAIL: "/moment/:id",
    MOMENTS_LIST: "/moments/list/:type",
    MOMENTS_TOPIC: "/moments/topic",
    TOPIC_DETAILS: "/topic/:id",
    _USER_MOMENTS: "/user/moments/:uid",
    USER_MOMENTS_ALL: "/user/moments/:uid/moments",
    USER_MOMENTS_PICTURE: "/user/moments/:uid/picture",
    USER_MOMENTS_VIDEO: "/user/moments/:uid/video",
};

export default () => {
    /* eslint-disable */
    return (
        <Main>
            <Switch>
                <Route exact path={ROUTE_PATH.HOME} component={Home} />
                <Route exact path={ROUTE_PATH.SECOND} component={Second} />
                <Route exact path={ROUTE_PATH.MOMENT_DETAIL} component={MomentDetail} />
                <Route
                    exact
                    path={ROUTE_PATH.MOMENTS_LIST}
                    component={({ location }) => (
                        <Fragment key={location.pathname}>
                            <MomentList />
                        </Fragment>
                    )}
                />
                <Route exact path={ROUTE_PATH.MOMENTS_TOPIC} component={() => <MomentTopics />} />
                <Route
                    exact
                    path={ROUTE_PATH.USER_MOMENTS_ALL}
                    component={({ location }) => (
                        <Fragment key={location.pathname}>
                            <UserMomentsAll />
                        </Fragment>
                    )}
                />

                <Route
                    exact
                    path={ROUTE_PATH.TOPIC_DETAILS}
                    component={({ location }) => {
                        return (
                            <Fragment key={location.pathname}>
                                <MomentTopicDetail />
                            </Fragment>
                        );
                    }}
                />
                {/*</MomentsLayout>*/}
            </Switch>
        </Main>
    );
    /* eslint-enable */
};
