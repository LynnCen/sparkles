export const keepRoutes: any[] = [
  // 对租户管理列表去详情后，需要缓存组件
  {
    formPathname: '/', // 租户管理列表页
    toPathname: ['/tenant/detail'] // 选址需求详情页
  }
];
