// // 侧边栏

const asideMenuConfig = [
//   {
//     name: '概览',
//     path: '/',
//     icon: 'icon-gaishu',
//   },
//   {
//     name: '门店分析',
//     path: '/analysis',
//     icon: 'icon-fdaohang-fenxi',
//   },
//   {
//     name: '门店预测',
//     path: '/predict',
//     icon: 'icon-a-daohang-yuce',
//   },
//   {
//     name: '门店对比',
//     path: '/stores/contrast',
//     icon: 'icon-a-daohang-duibi',
//   },
//   {
//     name: '数据报表',
//     path: '/report/manage',
//     icon: 'icon-a-daohang-baobiao',
//   },
//   {
//     name: '门店管理',
//     path: '/stores/manage',
//     icon: 'icon-daohang-mendian',
//   },
//   // 2.1.8不做员工管理，放在后台
//   // {
//   //   name: '员工管理',
//   //   path: '/employee/manage',
//   //   icon: 'icon-daohang-yuangong',
//   // },
//   {
//     name: '订单管理',
//     path: '/order/manage',
//     icon: 'icon-daohanglan-dingdan',
//   },
];

// //  本地开发时，如果接口还未添加对应的菜单，可在此配置进行本地开发
const devMenu: Array<any> = [
  {
    name: '本地开发',
    encode: 'dev',
    icon: 'icon-a-daohang-duibi',
    uri: '/dev',
    sortNum: '1',
    parent: null,
    children: [
      {
        name: '地图hook',
        encode: 'dev:amap',
        uri: '/dev/amap',
        icon: null,
        parent: {
          name: '本地开发',
          encode: 'dev',
          icon: 'icon-a-daohang-duibi',
          uri: '/dev',
          sortNum: '1',
          parent: null,
        },
      },
      {
        name: '组件测试',
        encode: 'com:test',
        uri: '/dev/comtest',
        icon: null,
        parent: {
          name: '本地开发',
          encode: 'dev',
          icon: 'icon-a-daohang-duibi',
          uri: '/dev',
          sortNum: '1',
          parent: null,
        },
      },
      {
        name: '审批流引擎',
        encode: 'flow:engine',
        uri: '/dev/flowengine',
        icon: null,
        parent: {
          name: '本地开发',
          encode: 'dev',
          icon: 'icon-a-daohang-duibi',
          uri: '/dev',
          sortNum: '1',
          parent: null,
        },
      },
    ],
  },
  // {
  //   name: '行业信息',
  //   encode: 'industry',
  //   icon: 'icon-a-daohang-duibi',
  //   uri: '/industry',
  //   sortNum: '1',
  //   parent: null,
  //   children: [
  //     {
  //       name: '行业研报',
  //       encode: 'industry:report',
  //       uri: '/industry/report',
  //       icon: null,
  //       parent: {
  //         name: '行业信息',
  //         encode: 'industry',
  //         icon: 'icon-a-daohang-duibi',
  //         uri: '/industry',
  //         sortNum: '1',
  //         parent: null,
  //       },
  //     },
  //   ],
  // },
];
export { asideMenuConfig, devMenu };
