const button = new Map([
  // 根据appId获取应用菜单
  ['list', '/permission/list'],
  // 根据moduleIds获取应用菜单树
  ['tree', '/module/menus'],
  // 新增按钮
  ['add', '/permission/create'],
  // 修改菜单
  ['update', '/permission/update'],
  // 删除菜单
  ['delete', '/permission/delete'],
]);

export default button;
