const menus = new Map([
  // 根据appId获取应用菜单
  ['menus', '/module/findByAppId'],
  // 根据moduleIds获取应用菜单树
  ['tree', '/module/permissions'],
  // 新增菜单
  ['add', '/module/create'],
  // 修改菜单
  ['update', '/module/update'],
  // 删除菜单
  ['delete', '/module/delete'],
  ['reorder', '/module/reorder']
]);

export default menus;
