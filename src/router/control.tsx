// import React from 'react';
import React, { Suspense } from 'react';
import { message, Spin } from 'antd';
import { deepCopy, isMobile, isWxWorkBrowser, urlParams } from '@lhb/func';
// import { Routes, Route } from 'react-router-dom';
import Login from '@/layout/components/Login';
import ForgetPassword from '@/views/password/pages/index/entry';
import PDF from '@/views/pdf/pages/index/entry';
import ShareIndustry from '@/views/selection/pages/shareindustry/entry';
import { getCookie } from '@lhb/cache';
import { useAliveController } from 'react-activation';
import { keepRoutes } from './keep-alive-config';
import MassImage from '@/views/massimage/pages/index/entry';

let locationFrom: any = {
  pathname: null,
  search: null,
};
const clObj = {
  from: '',
  to: ''
};

// 无需登录访问的页面（注意有些事是完整的pathname、有些只是部分的pathname）
// const dispenseWithAuthentication = [
//   '/pdf/', // 渲染pdf的相关页面
//   '/openweb', // 协议相关页面
// ];
// 路由守卫
function routerAfterEach(from: any, to: any, routeList: any[], clearAlive: any) {
  clObj.from = from;
  clObj.to = to;
  const title = routeList.find((item) => {
    return item.path === to.pathname;
  })?.meta?.title;
  if (!title) {
    const ignorePaths = ['/']; // 不提示添加title的特殊页面路由
    process.env.NODE_ENV === 'development' && !ignorePaths.includes(to.pathname) && message.error('为了方便数据采集，请添加title！');
  } else {
    document.title = `${title}`; // 具体页面名称(不加项目名，潜水让拿掉)
  }
  if (from?.pathname && to?.pathname) {
    const needClear = keepRoutes.every(item => {
      const matching = !item.formPathname.includes(from.pathname) || !item.toPathname.includes(to.pathname);
      const matchingReverse = !item.formPathname.includes(to.pathname) || !item.toPathname.includes(from.pathname);
      return matching && matchingReverse;
    });
    needClear && clearAlive();
  }
  if (process.env.NODE_ENV !== 'development') {
    // 大数据埋点，先发送离开页面的信息 再上传进入页面的信息
    window.LHBbigdata.spa.beforeRouteLeave()(to, from);
    window.LHBbigdata.spa.beforeRouteEnter()(to, from);
  }
}

const RouterControl: React.FC<{
  locationTo: any;
  routeList: Array<any>;
}> = ({ children, locationTo, routeList }) => {
  const { clear } = useAliveController();
  if (locationTo.pathname !== locationFrom.pathname || locationTo.search !== locationFrom.search) {
    // fullPath完全改变才会触发
    // 为大数据埋点设置fullPath，path
    routerAfterEach({
      ...locationFrom,
      fullPath: locationFrom.pathname ? locationFrom.pathname + locationFrom.search : '/',
      path: locationFrom.pathname || '/',
    }, {
      ...locationTo,
      fullPath: locationTo.pathname + locationTo.search,
      path: locationTo.pathname,
    }, routeList, clear);
  }
  // 提前备份location数据
  const location = {
    to: locationTo,
    from: locationFrom,
  };
  locationFrom = deepCopy(locationTo);

  //  登录鉴权
  const token = getCookie('flow_token');

  // 移动端
  // const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  // if (token && isMobile) { // 包含token信息移动端跳转
  //   window.location.href = 'https://locationweb2b.lanhanba.net';
  // }

  // 前端白名单
  // pdf导航页
  if (locationTo.pathname === '/pdf') return <PDF/>;
  // 行业地图分享页
  if (locationTo.pathname === '/selection/shareindustry') return <ShareIndustry/>;
  // 海量点图片处理页面
  if (locationTo.pathname === '/massimage') return <MassImage/>;

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
  // 协议相关页面无需登录
  if (locationTo.pathname.indexOf('/openweb') !== -1) {
    const pdfRoutes = routeList.filter((route: any) => route.path.indexOf('/openweb') !== -1);
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

  // 图片相关页面无需登录
  if (locationTo.pathname.indexOf('/imageserve/') !== -1) {
    const imageRoutes = routeList.filter((route: any) => route.path.indexOf('/imageserve/') !== -1);
    const targetRouter = imageRoutes.find((item: any) => item.path === locationTo.pathname);
    if (targetRouter) {
      const TargetCom: any = targetRouter.component;
      return (
        <Suspense fallback={<Spin />}>
          <TargetCom />
        </Suspense>
      );
    }
  }
  // 没有登录且不在忘记密码页面则显示登录
  if (!token && locationTo.pathname !== '/password') return <Login />;
  // 没有登录且在忘记密码页面则显示忘记密码页面
  if (!token && locationTo.pathname === '/password') return <ForgetPassword />;

  // 在企微内打开需要判断设备跳转
  if (token && isMobile() && isWxWorkBrowser() && process.env.CONSOLE_H5_URL && process.env.STORE_ASSISTANT_URL && process.env.INSIGHT_URL) {
    const params = urlParams(locationTo.search);
    if (params.id && params.mobileRouter) {
      if (params.type === '16') { // 字段为string类型
        // 集客点审批需要跳转到area-insight项目中----mobileRouter只有审批消息才有
        window.location.href = `${process.env.INSIGHT_URL}${params.mobileRouter}?id=${params.id}`;
        return null;
      }
      window.location.href = `${process.env.STORE_ASSISTANT_URL}${params.mobileRouter}?id=${params.id}`;
      return null;
    } else if (!params.id && params.mobileRouter) {
      window.location.href = `${process.env.STORE_ASSISTANT_URL}${params.mobileRouter}`;
      return null;
    } else {
      // window.location.href = process.env.CONSOLE_H5_URL;
      window.location.href = process.env.INSIGHT_URL + `/home`;
      return null;
    }
  }

  return (
    <>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child as React.ReactElement, {
          location,
        });
      })}
    </>
  );
};

export default RouterControl;
