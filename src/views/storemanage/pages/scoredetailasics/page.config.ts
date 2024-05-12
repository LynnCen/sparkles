const name = window.location.pathname === '/storemanage/tapdetail' ? '机会点管理' : (window.location.pathname === '/storemanage/alternativedetail' ? '备选址管理' : '储备店管理');
const path = window.location.pathname === '/storemanage/tapdetail' ? '/storemanage/tap' : (window.location.pathname === '/storemanage/alternativedetail' ? '/storemanage/alternative' : '/storemanage/reserve');
export default {
  meta: {
    title: '评分解读',
    parentPath: ['/storemanage'],
    breadcrumbs: {
      path: [path],
      name: [name],
    },
  },
};
