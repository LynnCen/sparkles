/**
 * @Description 埋点共通方法
 */

import { isArray } from '@lhb/func';

/**
 * @Description 埋点共通方法，用于locationPC端查看租户日志
 *
 * @param event_id 事件id
 * event_id 在埋点信息的在线文档中维护
 *  文档地址:
 *    https://doc.weixin.qq.com/sheet/e3_AKoAdgZlAOoLeTY0kKKSYyLOBjiFA?scode=ADMAmgftAAcZr9Xo54AKoAdgZlAOo&tab=1xo36j
 * 文件sheet:
 *   event_id 列表
 *
 * @param op_menu_id 菜单id
 * @param op_menu 操作菜单 ex. 工作台-机会点
 * @param op_feat 操作功能 ex. 编辑
 * @param desc 文案 ex. 点击了机会点编辑
 */
export function bigdataAction(
  event_id: string,
  op_menu_id: number | string,
  op_menu: string,
  op_feat: string,
  desc: string,
) {
  const msg: any = {
    op_menu_id: op_menu_id || '',
    op_menu: op_menu || '',
    op_feat: op_feat || '',
    desc: desc || '',
  };
  // console.log('bigdataAction', event_id, msg);
  window.LHBbigdata.send({
    event_id, // 事件id
    msg // 额外需要插入的业务信息
  });
}

/**
 * @description 菜单uri与埋点信息(event_id,菜单名)映射表
 */
const menuBigdataMap = new Map([
  ['/industry/report', ['a9fbbc4a-4d5e-42bc-afab-9dfd271382bb', '行业研报']],
  ['/selection/industry', ['3a0ced79-ca0f-4afd-8672-41f094f49008', '行业地图']],
  ['/car/storemap', ['217d36d2-234d-4416-9321-aae2fd2c7058', '门店地图']], // 这里列了三个门店地图菜单，同个埋点事件
  ['/fishtogether/storemap', ['217d36d2-234d-4416-9321-aae2fd2c7058', '门店地图']],
  ['/selection/store', ['217d36d2-234d-4416-9321-aae2fd2c7058', '门店地图']],
  ['/recommend/contrast', ['8c3c9959-8767-4cf6-9a68-0814a636cddf', '竞品对比']],
  ['/selection/poimap', ['d42634e9-5164-4b43-9e6a-7e1abe0a0f3f', 'POI地图']],
  ['/recommend/cityAnalysis', ['15938b83-ab36-4b71-aee3-dd5021ba95c8', '城市分析']],
  ['/surround', ['fedbfb25-6f86-4f05-a42c-53e385ca7b54', '周边查询']],
  ['/car/shopfilter', ['aba4d60a-353d-4777-911c-ad8014f169d9', '商场初筛']],
  ['/recommend/networkplan', ['00abe938-f45e-47c9-aeeb-2fc2e1dccc03', '规划管理']],
  ['/recommend/branchnetworkplan', ['950edf98-608d-43e3-944d-7d0fc2abc35f', '分公司规划管理']],
  ['/recommend/modal', ['f85a9b49-7515-48b4-8dfe-2ee635bc301c', '开店区域推荐']],
  ['/recommend/report', ['5170478b-771b-49db-b45e-e5d720e79267', '推荐报告查询']],
  ['/recommend/areacollect', ['88a96c47-7c18-44c7-b2b0-897e542f7dde', '查看收藏区域']],
  ['/recommend/map', ['b41734bc-2e1a-4751-a093-5641e51f8888', '自定义指标推荐']],
  ['/recommend/planareamanage', ['4a82877f-26be-4d76-bc55-941cfcfa396e', '网规区域管理']],
  ['/storemap/universal', ['d75c036a-71ac-4de6-9613-cfdc263f6cae', '门店地图 (正式)']],
  ['/fishtogether/chancepointmanage', ['a9540b87-ee49-42cf-b641-36bb7d12be86', '机会点']], // 这里列了三个机会点菜单（鱼你，标准版，最老版本），同个埋点事件
  ['/expandstore/chancepoint', ['a9540b87-ee49-42cf-b641-36bb7d12be86', '机会点']],
  ['/storemanage/tap', ['a9540b87-ee49-42cf-b641-36bb7d12be86', '机会点']],
  ['/fishtogether/expandtaskmng', ['5e99900e-1c0c-49ef-8b87-7135c29152e3', '加盟商管理']], // 这里列了两个加盟商菜单（鱼你，与标准版），同个埋点事件
  ['/expandstore/franchisee', ['5e99900e-1c0c-49ef-8b87-7135c29152e3', '加盟商管理']],
  ['/storemanage/plan', ['a4293c67-762e-4586-bf02-f0d78df65175', '开店计划管理']],
  ['/longerpoppupshop/placescreen', ['c1065a1c-c38c-4fab-bfcc-bde03b55794a', '场地筛选(追觅)']],
  ['/longerpoppupshop/placemanage', ['07947e59-7130-482e-9b6a-2abb0fbecf0c', '场地管理(追觅)']],
  ['/storemanage/adjustplan', ['e004a3b6-b0b7-411a-adab-822596bb73fc', '计划调整']],
  ['/storemanage/situation', ['65517171-422a-4b17-8b37-9f4537d8750f', '整体情况']],
  ['/storemanage/alternative', ['73dc4ae2-dc89-4e74-bf64-bfc3335aa959', '备选址管理']],
  ['/storemanage/reserve', ['91292eee-2d18-4a18-b6fc-046cb1263351', '储备店管理']],
  ['/storemanage/progress', ['7746ea34-d58f-452f-8294-5c2140a3a23c', '拓店进展统计']],
  ['/storemanage/report', ['3ecc40f1-4720-41a5-9284-888170319ed0', '明细报表']],
  ['/storemanage/devdptkpireport', ['591c10f0-fef4-47ee-9230-f7fade7b01c4', '开发部绩效报表']],
  ['/footprinting/manage', ['85c9f846-8e18-4fc4-ba12-974e02993d3a', '踩点任务管理']],
  ['/footprinting/analysis', ['f1991194-082d-43b9-9a62-e30634e4f9ae', '踩点分析设置']],
  ['/footprinting/report', ['55a0c3a9-529e-4969-b9ee-bf6f76851d2e', '踩点分析结果']],
  ['/footprinting/review', ['629dc1c8-ebc0-4341-b09b-ee27c45418f2', '踩点分析报告']],
  ['/construction/overview', ['ca6ba73b-7aeb-4255-973c-360255c8f9e8', '筹建管理看板']],
  ['/construction/project', ['570f5f54-86c8-4d98-af34-81e5651c7fff', '筹建项目管理']],
  ['/construction/task', ['e39e1f91-4d21-4a85-8b61-255041ce728d', '筹建任务管理']],
  ['/car/home', ['957f2a64-51fa-418a-b069-207545bf875a', '门店运营概览 (汽车)']],
  ['/overview', ['b70ad8c8-47ab-4460-a1f5-7dd6a181a261', '门店运营概览']],
  ['/car/storemanage', ['f6ecd722-869c-46a5-9a57-50f2c68e901b', '门店管理(汽车演示)']],
  ['/analysis', ['cd282bf5-b828-4a43-9f77-a0a2969c52ec', '门店分析']],
  ['/car/analysis', ['bfd31c0b-d3ae-40a4-984d-b1a594eab03e', '门店分析 (汽车演示)']],
  ['/stores/contrast', ['f5727df8-59e6-47a8-93ae-f4bf67474aae', '门店对比']],
  ['/predict', ['741f0600-4f17-4d48-bc46-7b980298adc3', '门店预测']],
  ['/report/manage', ['a361aeb4-5ee7-4070-877a-efce15ca370c', '数据报表']],
  ['/stores/manage', ['cc05b769-45ff-4a8f-98c6-7a9d26b254b2', '门店摄像头管理']],
  ['/order/manage', ['c43dbd1a-afc4-40b8-a52c-3cd864ea07f0', '订单管理']],
  ['/expandstore/approver', ['a1ae69b7-2ccc-4702-8262-c916dd0e7fdf', '审批工作台']],
  ['/brain/gradeinsight', ['90bc044e-5527-4bc4-b410-a15b18452cb7', '评分表洞察']],
  ['/brain/conversioninsight', ['783f30ce-1eca-4ed1-9856-34cfbe215909', '转化率洞察']],
  ['/brain/storedata', ['89130ce4-33d4-4528-8829-f18cbf3199d7', '店铺数据管理']],
  ['/insight/list', ['38707c11-0f10-40e7-835c-59845f91a7e8', '洞察列表']],
  ['/insight/storedata', ['ac555ae3-3430-44eb-a9f4-2739d0641735', '店铺数据管理']],
  ['/system/enterprise', ['5b3ea831-7d63-45c9-b751-a9f06f00eee6', '企业配置']],
  ['/organization/department', ['ccf7acd3-c7c8-46a6-aaf9-a5889de507c9', '部门管理']],
  ['/organization/post', ['9ec3e1cd-fd5f-4ad8-8ff2-9733a740eacb', '岗位管理']],
  ['/organization/user', ['3a4b338d-5a86-4d15-85e8-af0129249e41', '用户管理']],
  ['/organization/role', ['f4c919d3-de80-44b2-b496-1789d5c03b70', '角色管理']],
  ['/organization/permission', ['8920f314-5b8a-4cc4-86ac-7fe677af074c', '权限管理']],
  ['/system/industryMap', ['04510e04-6fd8-4790-929c-5a62eaff3ab2', '选址地图配置']],
  ['/system/migration', ['72818458-3891-40bb-bfe7-1ff2d52e19d0', '数据迁移']], // 这里列了两个数据迁移菜单，同个埋点事件
  ['/system/standardmigration', ['72818458-3891-40bb-bfe7-1ff2d52e19d0', '数据迁移']],
  ['/iterate/siteselectionmapb', ['5442cb35-cfb2-df63-3684-6879f6f2a08e	', '选址地图']],
]);

/**
 * @description 菜单事件埋点，按指定uri上报日志
 * @param uri 菜单设置的uri
 * @param menuId 菜单id
 * @param menu 菜单名
 * @param feat 功能名
 * @param desc 描述文案
 */
export function bigdataMenu(
  uri: string,
  menuId: number | string,
  menu = '',
  feat = '',
  desc = ''
) {
  if (!uri || !menuId) return;

  const info = menuBigdataMap.get(uri);
  if (!isArray(info) || !info.length) return;

  const action = info.length ? info[0] : '';
  const op_menu = menu || (info.length > 1 ? info[1] : '');
  const op_feat = feat || (info.length > 2 ? info[2] : '');
  const op_desc = desc || (info.length > 3 ? info[3] : op_menu ? `查看了${op_menu}` : '');
  bigdataAction(action, menuId, op_menu, op_feat, op_desc);
}

/**
 * @Description 按钮事件埋点
 *
 * @param event_id 事件id
 * @param op_menu 操作菜单 ex. 工作台-机会点
 * @param op_feat 操作功能 ex. 编辑
 * @param desc 文案 ex. 点击了机会点编辑
 */
export function bigdataBtn(
  event_id: string,
  op_menu: string,
  op_feat: string,
  desc: string,
) {
  // zdj TODO 按钮事件暂时没传menuid
  bigdataAction(event_id, '', op_menu, op_feat, desc);
}
