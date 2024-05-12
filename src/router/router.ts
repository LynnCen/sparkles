import { routeClearUp } from '@/common/helpers/import-aysnc';

const pageList = process.env.PAGE_LIST;

function setRoute(routeName: string, pageName: string, config?: any) {
  return routeClearUp(routeName, pageName, config);
}

export const routersConfig = () => {
  const routes: any[] = [];
  if (Array.isArray(pageList) && pageList.length) {
    pageList.forEach(async (page: any) => {
      const currentPageConfig =
        // eslint-disable-next-line no-undef
        require(`../views/${page.relativePath}/page.config.ts`).default;
      const relativePath = page.relativePath.split('/pages/');
      const routeName = relativePath[0];
      const pageName = relativePath[1];
      routes.push(setRoute(routeName, pageName, currentPageConfig));
    });
  }
  return routes;
};
