// 侧边栏

const asideMenuConfig = [
  {
    name: '租户管理',
    path: '/',
    icon: 'icon-ic_zuhuguanli',
  },
  {
    name: '应用管理',
    path: '/application',
    icon: 'icon-ic_yingyongguanli',
  },
  {
    name: '菜单管理',
    path: '/menu',
    icon: 'icon-ic_yingyongguanli',
  },
  {
    name: '组织管理',
    path: '',
    icon: 'icon-ic_zuzhiguanli',
    children: [
      {
        name: '部门管理',
        path: '/organization/department',
      },
      {
        name: '岗位管理',
        path: '/organization/post',
      },
      {
        name: '用户管理',
        path: '/organization/user',
      },
      {
        name: '角色管理',
        path: '/organization/role',
      },
      {
        name: '权限管理',
        path: '/organization/permission',
      },
    ],
  },
  {
    name: '系统设置',
    path: '/setting',
    icon: 'icon-ic_xitongshezhi',
    children: [
      {
        name: '数据字典',
        path: '/dictionary',
      },
      // {
      //   name: '行政区域',
      //   path: '/administrative',
      // },
      {
        name: '操作日志',
        path: '/operate',
      },
    ],
  },
];
const devMenu = [
  // {
  //   name: 'PMS管理',
  //   uri: '/pms',
  //   encode: '/pms',
  //   children: [
  //     {
  //       name: '企业管理',
  //       uri: '/pms/companyManage',
  //       encode: '/pms/companyManage',
  //       parent: {
  //         uri: '/pms'
  //       }
  //     },
  //   ]
  // }
  // {
  //   name: '应用管理',
  //   uri: '/application',
  //   icon: 'icon-ic_yingyongguanli',
  //   encode: '/application',
  //   children: [
  //     {
  //       name: '菜单管理',
  //       uri: '/application/menu-managent',
  //       encode: '/application/menu-managent',
  //       parent: {
  //         uri: '/application'
  //       }
  //     }
  //   ]
  // },
  // {
  //   name: '资源库',
  //   uri: '/resource',
  //   icon: 'icon-ic_xitongshezhi',
  //   encode: '/resource',
  //   children: [
  //     // {
  //     //   name: '资源管理',
  //     //   uri: '/resmng',
  //     //   encode: '/resmng',
  //     //   icon: 'icon-ic_yingyongguanli',
  //     //   parent: {
  //     //     uri: '/resource'
  //     //   }
  //     // },
  //     // {
  //     //   name: '资源审核',
  //     //   uri: '/resaudit',
  //     //   encode: '/resaudit',
  //     //   icon: 'icon-ic_yingyongguanli',
  //     //   parent: {
  //     //     uri: '/resource'
  //     //   }
  //     // },
  //   ],
  // },
  // {
  //   name: '资源库设置',
  //   uri: '/ressetting',
  //   encode: '/ressetting',
  //   icon: 'icon-ic_xitongshezhi',
  //   children: [
  //     {
  //       name: '类目管理',
  //       uri: '/ressetting/category',
  //       encode: '/ressetting/category',
  //       icon: 'icon-ic_yingyongguanli',
  //       parent: {
  //         uri: '/ressetting'
  //       }
  //     },
  //     {
  //       name: '类目模板管理',
  //       uri: '/restpl',
  //       encode: '/restpl',
  //       icon: 'icon-ic_yingyongguanli',
  //       parent: {
  //         uri: '/ressetting'
  //       }
  //     },
  //     {
  //       name: '属性库管理',
  //       uri: '/ressetting/property',
  //       encode: '/ressetting/property',
  //       icon: 'icon-ic_yingyongguanli',
  //       parent: {
  //         uri: '/ressetting'
  //       }
  //     },
  //     {
  //       name: '标签库管理',
  //       uri: '/ressetting/label',
  //       encode: '/ressetting/label',
  //       icon: 'icon-ic_yingyongguanli',
  //       parent: {
  //         uri: '/ressetting'
  //       }
  //     },
  //     {
  //       name: '行业管理',
  //       uri: '/ressetting/industry',
  //       encode: '/ressetting/industry',
  //       icon: 'icon-ic_yingyongguanli',
  //       parent: {
  //         uri: '/ressetting'
  //       }
  //     },
  //     {
  //       name: '品牌管理',
  //       uri: '/ressetting/brand',
  //       encode: '/ressetting/brand',
  //       icon: 'icon-ic_yingyongguanli',
  //       parent: {
  //         uri: '/ressetting'
  //       }
  //     },
  //     {
  //       name: '商圈管理',
  //       uri: '/ressetting/circle',
  //       encode: '/ressetting/circle',
  //       icon: 'icon-ic_yingyongguanli',
  //       parent: {
  //         uri: '/ressetting'
  //       }
  //     },
  //     {
  //       name: 'demo',
  //       uri: '/restpl/config',
  //       encode: '/restpl/config',
  //       icon: 'icon-ic_yingyongguanli',
  //       parent: {
  //         uri: '/ressetting'
  //       }
  //     },
  //   ],
  // }



  // {
  //   name: '客流宝管理 ',
  //   uri: '/flow',
  //   icon: 'icon-ic_xitongshezhi',
  //   children: [
  //     {
  //       name: '管理员设置',
  //       uri: '/flow/manager'
  //     },
  //     {
  //       name: '门店管理',
  //       uri: '/flow/shop'
  //     },
  //     {
  //       name: '设备管理',
  //       uri: '/flow/device',
  //     },
  //   ]
  // }
];

export { asideMenuConfig, devMenu };
