import React, { Suspense } from 'react';
import { deepCopy } from '@lhb/func';
import Login from '@/layout/components/Login';
import { getCookie } from '@lhb/cache';
import { Spin, message } from 'antd';
import PDF from '@/views/pdf/pages/index/entry';

let locationFrom: any = {
  pathname: null,
  search: null,
};
// 路由守卫
function routerAfterEach(from: any, to: any, routeList) {
  const title = routeList.find((item) => {
    return item.path === to.pathname;
  })?.meta?.title;
  if (!title) {
    process.env.NODE_ENV === 'development' && message.error('为了方便数据采集，请添加title！');
  } else {
    document.title = `SaaS管理后台-${title}`; // 项目名-具体页面名称
  }
  if (process.env.NODE_ENV !== 'development') {
  // 在这里进行大数据埋点
    window.LHBbigdata.spa.beforeRouteLeave()(to, from);
    window.LHBbigdata.spa.beforeRouteEnter()(to, from);
  }
}

const RouterControl: React.FC<{
  locationTo: any,
  routeList: Array<Record<string, any>>,
  children: React.ReactNode,
}> = ({ children, locationTo, routeList }) => {
  if (locationTo.pathname !== locationFrom.pathname || locationTo.search !== locationFrom.search) {
    // const { pathname } = locationTo;
    // const targetRoute = routeList.find(routeItem => routeItem.path === pathname);
    // if (targetRoute) {
    //   const { meta } = targetRoute;
    //   const { title } = meta || {};
    //   document.title = title || 'SaaS管理后台';
    // }
    // fullPath完全改变才会触发
    routerAfterEach({
      ...locationFrom,
      fullPath: locationFrom.pathname ? locationFrom.pathname + locationFrom.search : '/',
      path: locationFrom.pathname || '/',
    }, {
      ...locationTo,
      fullPath: locationTo.pathname + locationTo.search,
      path: locationTo.pathname,
    }, routeList);
  }
  // 提前备份location数据
  const location = {
    to: locationTo,
    from: locationFrom,
  };
  locationFrom = deepCopy(locationTo);

  // demo 登录鉴权
  const token = getCookie('kunlun_token');
  if (locationTo.pathname === '/pdf') return <PDF/>;
  // pdf相关页
  if (locationTo.pathname.indexOf('/pdf/') !== -1) {
    const pdfRoutes = routeList.filter((route: any) => route.path.indexOf('/pdf/') !== -1);
    const targetRouter = pdfRoutes.find((item: any) => item.path === locationTo.pathname);
    if (targetRouter) {
      const TargetCom: any = targetRouter.component;
      return (
        <Suspense fallback={<Spin />}>
          <TargetCom />
        </Suspense>
      );
    }
  }


  if (process.env.NODE_ENV !== 'development' && !token) { // 如果不是本地开发，就跳转到kunlun项目
    window.location.href = `${process.env.KUNLUN_URL}?origin=${encodeURIComponent(window.location.href)}`;
    return <></>;
  }
  return (
    <>
      {token ? (
        React.Children.map(children, (child) => {
          return React.cloneElement(child as React.ReactElement, {
            location,
          });
        })
      ) : (
        <Login />
      )}
    </>
  );
};

export default RouterControl;
