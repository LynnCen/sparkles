// import {
//   start,
//   registerMicroApps,
//   addGlobalUncaughtErrorHandler
// } from 'qiankun';
// import { getCookie } from '@lhb/cache';
// import { message as msg } from 'antd';
// import { config } from './config';
// // import actions from './actions';

// const apps: any = [
//   { // 接入账号中心的组织管理
//     name: 'MicroOrganizationConfig',
//     entry: config.url, // 子应用地址
//     container: `#${config.containerName}`, // 指定子应用加载时的容器dom名，
//     // activeRule: '/micro', // 路由拦截时的匹配规则
//     activeRule: (location) => getCookie('flow_token') && location.pathname.startsWith(config.basename),
//     props: {
//       $config: config
//     }
//   }
// ];

// // https://qiankun.umijs.org/zh/api
// registerMicroApps(apps, {
//   // qiankun 生命周期钩子 - 微应用加载前
//   beforeLoad: () => {
//     // actions.setGlobalState({ $config: config });
//     return Promise.resolve();
//   },
//   // qiankun 生命周期钩子 - 微应用挂载后
//   afterMount: (app: any) => {
//     // 加载微应用前，进度条加载完成
//     console.log('after mount', app.name);
//     return Promise.resolve();
//   }
// });

// /**
//  * 添加全局的未捕获异常处理器
//  */
// addGlobalUncaughtErrorHandler((event: Event | string) => {
//   const { message } = event as any;
//   // 加载失败时提示
//   if (message && message.includes('died in status LOADING_SOURCE_CODE')) {
//     msg.error('微应用加载失败，请检查应用是否可运行');
//   }
// });

// export default start;
export default {};

