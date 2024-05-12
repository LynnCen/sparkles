// 路由配置
import { Suspense, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Layout from '@/layout';
import NotFound from '@/common/components/NotFound';
import RouterControl from './router/control'; // 路由守卫
import { Spin } from 'antd';
import { routersConfig } from '@/router/router';
// import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { onNavigate } from '@/common/document-event/on';
import { matchQuery } from '@lhb/func';

const routeList = routersConfig(); // 不能在jsx内执行，需要在Main函数之前就调用，才能获取到正确的页面组件

// todo (test)
// import Menu from '@/views/menu1/pages/index/entry';


// todo 暂时注释掉路由切换动效，引发问题有点多，回头空了仔细研究一下

const Main = () => {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    // navigate方法绑定到document-event上，页面内需要调用navigate方法直接使用dispatchNavigate
    onNavigate(navigate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <RouterControl locationTo={location} routeList={routeList}>
      <Layout isOpen={!!matchQuery(location.search, 'source')}>
        <Suspense fallback={<Spin />}>
          {/* <TransitionGroup component={null}>
            <CSSTransition key={location.key} classNames='fade' timeout={300}> */}
          <Routes location={location}>
            {/* <Route key='/menu' path='/menu' element={Menu} /> */}
            {routeList.map((item) => (
              // location作为props传给路由页面，页面需使用location的时候从props中取值
              <Route key={item.path} path={item.path} element={<item.component location={location} />} />
            ))}
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
