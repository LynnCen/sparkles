// 路由配置
import { Suspense, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Layout from '@/layout';
import NotFound from '@/common/components/NotFound';
import RouterControl from './router/control'; // 路由守卫
import { Spin } from 'antd';
import { routersConfig } from '@/router/router';
// 注释动画的原因是，不同页面跳转时，某些固定（fixed）元素出现闪烁，比如，不同的地图页都加了Loading组件时，因为使用的是React Router，是由于新旧页面同时存在于DOM树中导致的
// import { TransitionGroup, CSSTransition } from 'react-transition-group';
// import { config } from '@/common/qiankun/config';
import { onNavigate } from '@/common/document-event/on';
const routeList = routersConfig(); // 不能在jsx内执行，需要在Main函数之前就调用，才能获取到正确的页面组件

const Main = () => {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    onNavigate(navigate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <RouterControl locationTo={location} routeList={routeList}>
      <Layout>
        <Suspense fallback={<Spin />}>
          {/* <TransitionGroup component={null}>
            <CSSTransition key={location.key} classNames='fade' timeout={300}> */}
          {/* https://juejin.cn/post/6844903922574819342#heading-7 */}
          <Routes location={location}>
            {routeList.map((item) => (
              <Route key={item.path} path={item.path} element={<item.component location={location} />}></Route>
            ))}
            {/* 匹配子应用 */}
            {/* <Route path={`${config.basename}/*`} element={null}></Route> */}
            {/* 根页面特殊处理，不需要提示页面丢失，显示加载中更合适 */}
            <Route path='/' element={<Spin />}></Route>
            {/* 匹配找不到的路由 */}
            <Route path='*' element={<NotFound />}></Route>
          </Routes>
          {/* </CSSTransition>
          </TransitionGroup> */}
        </Suspense>
      </Layout>
    </RouterControl>
  );
};

export default Main;
