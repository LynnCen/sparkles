import { lazy } from 'react';

// 模块必须是完整的路径 绝对路径或相对路径 @/views/方式导入失败
// 使用lazy开启按需加载
const loadComponent = (route: string, page: string) =>
  lazy(() => import(`../../views/${route}/pages/${page}/entry.tsx`));

const toLowerCaseFisrt = (str: string) => {
  return str.charAt(0).toLowerCase() + str.slice(1);
};

export function routeClearUp(route: string, pageName: string, config?: any) {
  const firstPath = toLowerCaseFisrt(route);
  const twoPath = (pageName && toLowerCaseFisrt(pageName)) || '';
  const pageModule = loadComponent(route, pageName);
  let res = {
    // 所有的一级目录下的 index 页面，皆直接使用当前路由
    // views/home/pages/index下的页面为默认Path /home
    path: pageName === 'index' ? `/${firstPath}` : `/${firstPath}/${twoPath}`,
    // 精确匹配
    exact: true,
    name: `${firstPath}${twoPath}`,
    component: pageModule,
  };
  res = Object.assign({}, res, config);
  return res;
}
