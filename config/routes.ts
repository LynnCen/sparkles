export const System = {
  Business: 'Sys_Business',
  RoleAdm: 'Sys_RoleAdm',
  DataView: 'Sys_DataView',
};

const Au = (prefix: string, roles: string[]) => roles.map((role) => `${prefix}_${role}`);

export default [
  {
    path: '/',
    component: '../layouts/BlankLayout',
    routes: [
      {
        path: '/user',
        component: '../layouts/UserLayout',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './User/login',
          },
        ],
      },
      {
        path: '/',
        component: '../layouts/SecurityLayout',
        routes: [
          {
            path: '/',
            component: '../layouts/BasicLayout',
            routes: [
              {
                path: `/${System.Business}`,
                redirect: '/home/index',
              },
              {
                path: `/${System.RoleAdm}`,
                redirect: '/permission/staff',
              },
              {
                path: `/${System.DataView}`,
                redirect: '/dataView',
              },
              {
                path: '/home',
                name: 'home',
                icon: 'home',
                // authority: Au(System.RoleAdm, ['index']),
                routes: [
                  {
                    path: '/home/index',
                    name: 'index',
                    component: './Welcome',
                    // authority: Au(System.RoleAdm, ['index']),
                  },
                  {
                    path: '/home/operation-log',
                    name: 'operation-log',
                    component: './OperationLog',
                    authority: Au(System.RoleAdm, ['log']),
                  },
                ],
              },
              {
                path: '/nearby',
                name: 'nearby',
                icon: 'environment',
                authority: Au(System.Business, ['nearby']),
                routes: [
                  {
                    path: '/nearby/category',
                    name: 'category',
                    component: './NearbyCategory',
                    authority: Au(System.Business, ['nearcate']),
                  },
                  {
                    path: '/nearby/categorytrans',
                    name: 'categorytrans',
                    component: './NearbyCategoryTrans',
                    authority: Au(System.Business, ['neartrans']),
                  },
                  {
                    path: '/nearby/categoryproperty',
                    name: 'categoryproperty',
                    component: './NearbyProperty',
                    authority: Au(System.Business, ['property']),
                  },
                  {
                    path: '/nearby/merchant',
                    name: 'merchant',
                    component: './NearbyMerchant',
                    authority: Au(System.Business, ['catemch']),
                  },
                ],
              },
              {
                name: 'permission',
                icon: 'lock',
                path: '/permission',
                authority: Au(System.RoleAdm, ['system']),
                routes: [
                  {
                    name: 'staff',
                    path: '/permission/staff',
                    component: './MemberManagement',
                    authority: Au(System.RoleAdm, ['staff']),
                  },
                  {
                    name: 'role',
                    path: '/permission/role',
                    component: './RoleManagement',
                    authority: Au(System.RoleAdm, ['role']),
                  },
                ],
              },
              {
                name: 'merchant',
                path: '/merchant',
                icon: 'dollar',
                component: './MerchantManagement',
                authority: Au(System.Business, ['merchant']),
              },

              {
                name: 'moments',
                icon: 'snippets',
                path: '/moments',
                authority: Au(System.RoleAdm, ['moments']),
                routes: [
                  {
                    name: 'management',
                    path: '/moments/management',
                    component: './MomentManagement',
                    authority: Au(System.RoleAdm, ['moments']),
                  },
                  // {
                  //   name: 'adverts',
                  //   path: '/moments/adverts',
                  //   component: './MomentAdManagement',
                    // authority: Au(System.Business, ['ad']),
                  // },
                ],
              },
              {
                name: 'system',
                icon: 'desktop',
                path: '/setting',
                authority: Au(System.RoleAdm, ['setting']),
                routes: [
                  {
                    name: 'configure',
                    path: '/setting/configure',
                    component: './SettingConfig',
                    authority: Au(System.Business, ['config']),
                  },
                  {
                    name: 'version',
                    path: '/setting/versions',
                    component: './VersionList',
                    authority: Au(System.RoleAdm, ['version']),
                  },
                  {
                    name: 'version.audit',
                    path: '/setting/version/audit',
                    component: './VersionAudit',
                    authority: Au(System.RoleAdm, ['audit']),
                  },
                  {
                    name: 'copy.management',
                    path: '/setting/copy',
                    component: './CopyManagement',
                    authority: Au(System.Business, ['copy']),
                  },
                  {
                    name: 'sensitive.management',
                    path: '/setting/sensitiveword',
                    component: './SensitiveWordsManagement',
                    authority: Au(System.Business, ['sensword']),
                  },
                  {
                    name: 'setting.promote',
                    path: '/setting/promote',
                    component: './PromoteManagement',
                    authority: Au(System.Business, ['promote']),
                  },
                  {
                    name: 'setting.jump',
                    path: '/setting/jump',
                    component: './JumpManagement',
                    authority: Au(System.Business, ['jump']),
                  },
                  {
                    name: 'spider',
                    path: '/setting/spidermanagement',
                    component: './SpiderManagement',
                    authority: Au(System.Business, ['spiderswitch']),
                  },
                  {
                    name: 'package',
                    path: '/setting/packagemanagement',
                    component: './PackageManagement',
                    authority: Au(System.RoleAdm, ['apk']),
                  },
                ],
              },
              {
                name: 'official',
                path: '/official',
                icon: 'user',
                authority: Au(System.Business, ['official']),
                routes: [
                  {
                    name: 'app',
                    path: '/official/app',
                    component: './OfficialAppManagement',
                    authority: Au(System.Business, ['offapp']),
                  },
                ],
              },
              {
                name: 'user.management',
                path: '/users/management',
                icon: 'team',
                authority: Au(System.RoleAdm, ['user']),
                component: './UserManagement',
              },
              {
                name: 'miniprogram',
                path: '/miniprogram',
                icon: 'mobile',
                authority: Au(System.Business, ['miniprogram']),
                routes: [
                  {
                    name: 'category',
                    path: '/miniprogram/',
                    component: './MiniCategory',
                    authority: Au(System.Business, ['minicate']),
                  },

                  {
                    name: 'application',
                    path: '/miniprogram/application',
                    component: './MiniAppManagement',
                    authority: Au(System.Business, ['miniapp']),
                  },
                  // {
                  //   name: 'users',
                  //   path: '/miniprogram/users',
                  //   component: './MiniUserManagement',
                  //   authority: Au(System.Business, ['miniuser']),
                  // },
                  // {
                  //   name: 'authorization',
                  //   path: '/miniprogram/authorization',
                  //   component: './MiniAuthorization',
                  //   authority: Au(System.Business, ['miniauth']),
                  // },
                  {
                    name: 'banner',
                    path: '/miniprogram/banner',
                    component: './MiniBannerManagement',
                    authority: Au(System.Business, ['minibanner']),
                  },

                  {
                    name: 'highlyrecommendGame',
                    path: '/miniprogram/hightlyGame/',
                    component: './HighGame',
                    // authority: Au(System.Business, ['minicate']),
                  },
                  {
                    name: 'highlyrecommendApp',
                    path: '/miniprogram/hightlyApp/',
                    component: './HighApp',
                    // authority: Au(System.Business, ['minicate']),
                  },
                  {
                    name: 'programIndex',
                    path: '/miniprogram/programIndex/',
                    component: './HomeAppIndex',
                    // authority: Au(System.Business, ['minicate']),
                  },
                ],
              },
              {
                name: 'report',
                path: '/report',
                icon: 'profile',
                authority: Au(System.RoleAdm, ['reportmanager']),
                routes: [
                  {
                    name: 'momentreport',
                    path: '/report/moments',
                    component: './Report',
                    authority: Au(System.RoleAdm, ['reportmoments']),
                  }
                ]
              },
              //  dataView
              {
                name: 'DataView',
                path: '/dataView',
                icon: 'home',
                component: './DataView',
                authority: Au(System.DataView, ['home']),
              },
              //  dataView
              // {
              //   name: 'DataAnalysis',
              //   path: '/DataAnalysis',
              //   icon: 'home',
              //   component: './DataAnalysis',
              //   authority: Au(System.RoleAdm, ['system']),
              // },
              // {
              //   name: 'Schedule',
              //   path: '/Schedule',
              //   icon: 'dollar',
              //   component: './Schedule',
              //   authority: Au(System.RoleAdm, ['system']),
              // },
              // {
              //   name: 'BindVersion',
              //   path: '/BindVersion',
              //   icon: 'dollar',
              //   component: './BindVersion',
              //   authority: Au(System.RoleAdm, ['system']),
              // },
              // {
              //   name: 'DetailsVersion',
              //   path: '/DetailsVersion',
              //   icon: 'dollar',
              //   component: './DetailsVersion',
              //   authority: Au(System.RoleAdm, ['system']),
              // },
              // {
              //   name: 'CompletedTasks',
              //   path: '/CompletedTasks',
              //   icon: 'dollar',
              //   component: './CompletedTasks',
              //   authority: Au(System.RoleAdm, ['system']),
              // },
              // {
              //   name: 'UnCompletedTasks',
              //   path: '/UnCompletedTasks',
              //   icon: 'dollar',
              //   component: './UnCompletedTasks',
              //   authority: Au(System.RoleAdm, ['system']),
              // },
              // {
              //   name: 'ChannelAnalysis',
              //   icon: 'home',
              //   path: '/ChannelAnalysis',
              //   // authority: Au(System.DataView, ['home']),
              //   routes: [
              //     {
              //       name: 'ChannelAnalysis',
              //       path: '/channelanalysis/',
              //       icon: 'home',
              //       component: './ChannelAnalysis',
              //     },
              //     {
              //       name: 'ChannelDetail',
              //       path: '/ChannelAnalysis/channeldetail',
              //       icon: 'home',
              //       component: './ChannelAnalysis/Detail',
              //     },
              //     {
              //       name: 'ChannelControl',
              //       path: '/ChannelAnalysis/channelcontrol',
              //       icon: 'home',
              //       component: './ChannelAnalysis/Control',
              //     },
              //   ],
              // },
              // {
              //   name: 'MessageAnalysis',
              //   icon: 'home',
              //   path: '/messageanalysis',
              //   component: './MessageAnalysis',
              // },
              // {
              //   name: 'GroupAnalysis',
              //   icon: 'rise',
              //   path: '/groupanalysis',
              //   component: './GroupAnalysis',
              // },
              // {
              //   name: 'KeepUsers',
              //   path: '/keepusers1',
              //   icon: 'rise',
              //   component: './UserAnalysis/KeepUsers',
              // },
              // {
              //   name: 'userAnalysis',
              //   icon: 'rise',
              //   // authority: Au(System.DataView, ['home']),
              //   routes: [
              //     {
              //       name: 'NewUsers',
              //       path: '/newusers',
              //       icon: 'stock',
              //       component: './UserAnalysis/NewUsers',
              //     },
              //     {
              //       name: 'ActiveUsers',
              //       path: '/activeusers',
              //       icon: 'stock',
              //       component: './UserAnalysis/ActiveUsers',
              //     },
              //     {
              //       name: 'VersionDistribute',
              //       path: '/versiondistribute',
              //       icon: 'lineChart',
              //       component: './UserAnalysis/VersionDistribute',
              //     },
              //   ],
              // },
              {
                path: '/',
                redirect: '/home/index'
              },
              {
                component: './404',
              },
            ],
          },
          {
            component: './404',
          },
        ],
      },
    ],
  },
  {
    component: './404',
  },
];
