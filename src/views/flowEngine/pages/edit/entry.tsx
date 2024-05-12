import { getDepartmentTreeList, getFlowSelection, getFlowTemplateDetail, getRoleSearch, getTreeList, positionSearch, userSearch } from '@/common/api/flowEngine';
import styles from './entry.module.less';
import { FlowEngine } from 'flow-engine';
import { urlParams } from '@lhb/func';
import { useEffect, useState } from 'react';
import { useMethods } from '@lhb/hook';
import EditFlowEngineModal, { EditFlowEngineModalDataProps } from './components/editFlowEngineModal';
import { Breadcrumb, Form } from 'antd';
import { Link } from 'react-router-dom';
import V2Container from '@/common/components/Data/V2Container';
import { getStorage, setStorage } from '@lhb/cache';
import { roleList as roleListApi } from '@/common/api/role';


/**
 * @description 部门树
 */
export interface DepartmentTreeItem{
  /**
   * @description 名称
   */
  name: string;
  /**
   * @description 部门id
   */
  id: number;
  /**
   * @description 编码
   */
  encode: string;
  /**
   * @description 创建时间
   */
  gmtCreate: string;
  /**
   * @description 修改时间
   */
  gmtModified: string;
  /**
   * @description 子部门列表
   */
  children?:DepartmentTreeItem[];
}

/** 全量角色 */
export interface RoleListItem{
  /**
   * @description 名称
   */
  name: string;
  /**
   * @description 角色id
   */
  id: number;
  /**
   * @description 编码
   */
  encode?: string;
  /**
   * @description 创建时间
   */
  gmtCreate?: string;
  /**
   * @description 修改时间
   */
  gmtModified?: string;
}



// const data = {
//   'id': 1,
//   'name': '测试',
//   'code': 'test-01',
//   'formUri': '',
//   'nodes': [
//     {
//       'name': '发起节点',
//       'desc': '<div class=text>用户：管理【系统】 </div>',
//       'nodeCode': 'JTAcN8HS',
//       'prevNode': [],
//       'nextNode': [
//         '8XKbiYiK'
//       ],
//       'type': 0,
//       'typeName': null,
//       'approverType': null,
//       'approverTypeName': null,
//       'approveType': null,
//       'approveTypeName': null,
//       'countersign': null,
//       'roles': null,
//       'positions': null,
//       'employees': [
//         {
//           'id': 100000,
//           'name': '管理',
//           'mobile': '18888888888',
//           'managerId': null,
//           'tntInstId': 1165
//         }
//       ],
//       'sponsorMangerLevel': null,
//       'autoApprove': null,
//       'ccType': null,
//       'ccTypeName': null,
//       'ccRoles': null,
//       'ccPositions': null,
//       'ccEmployees': null,
//       'buttons': [
//         {
//           'name': '撤回',
//           'alias': '撤回',
//           'code': 'withdraw',
//           'enable': 1
//         }
//       ],
//       'conditions': []
//     },
//     {
//       'name': '审批节点 - 01',
//       'desc': '<div class=text>发起人自选</div>',
//       'nodeCode': '8XKbiYiK',
//       'prevNode': [
//         'JTAcN8HS'
//       ],
//       'nextNode': [
//         'Bditkj8S',
//         'K7x6nafN'
//       ],
//       'type': 1,
//       'typeName': '普通节点',
//       'approverType': 4,
//       'approverTypeName': '发起人自选',
//       'approveType': 1,
//       'approveTypeName': '会签',
//       'countersign': null,
//       'roles': null,
//       'positions': null,
//       'employees': null,
//       'sponsorMangerLevel': 1,
//       'autoApprove': 1,
//       'ccType': 2,
//       'ccTypeName': '发起人自选',
//       'ccRoles': null,
//       'ccPositions': null,
//       'ccEmployees': null,
//       'buttons': [
//         {
//           'name': '通过',
//           'alias': '通过',
//           'code': 'approve',
//           'enable': 1
//         },
//         {
//           'name': '拒绝',
//           'alias': '拒绝',
//           'code': 'reject',
//           'enable': 1
//         },
//         {
//           'name': '转交',
//           'alias': '转交',
//           'code': 'transfer',
//           'enable': 1
//         }
//       ],
//       'conditions': []
//     },
//     {
//       'name': '条件 - 01',
//       'desc': '([性别==男] 且 [年龄>=65]) 或 ([性别==女] 且 [年龄>=63])',
//       'nodeCode': 'Bditkj8S',
//       'prevNode': [
//         '8XKbiYiK'
//       ],
//       'nextNode': [
//         'hATBAtwQ'
//       ],
//       'type': 2,
//       'typeName': '条件节点',
//       'approverType': null,
//       'approverTypeName': null,
//       'approveType': null,
//       'approveTypeName': null,
//       'countersign': null,
//       'roles': null,
//       'positions': null,
//       'employees': null,
//       'sponsorMangerLevel': null,
//       'autoApprove': null,
//       'ccType': null,
//       'ccTypeName': null,
//       'ccRoles': null,
//       'ccPositions': null,
//       'ccEmployees': null,
//       'buttons': [],
//       'conditions': [
//         {
//           'logicOperation': 'or',
//           'expressions': [
//             {
//               'field': 'sex',
//               'operation': '==',
//               'value': '男'
//             },
//             {
//               'field': 'age',
//               'operation': '>=',
//               'value': '65'
//             }
//           ]
//         },
//         {
//           'logicOperation': 'or',
//           'expressions': [
//             {
//               'field': 'sex',
//               'operation': '==',
//               'value': '女'
//             },
//             {
//               'field': 'age',
//               'operation': '>=',
//               'value': '63'
//             }
//           ]
//         }
//       ]
//     },
//     {
//       'name': '审批节点 - 02',
//       'desc': '<div class=text>用户：刘良 </div>',
//       'nodeCode': 'hATBAtwQ',
//       'prevNode': [
//         'Bditkj8S'
//       ],
//       'nextNode': [],
//       'type': 1,
//       'typeName': '普通节点',
//       'approverType': 1,
//       'approverTypeName': '指定成员',
//       'approveType': 1,
//       'approveTypeName': '会签',
//       'countersign': null,
//       'roles': null,
//       'positions': null,
//       'employees': [
//         {
//           'id': 100181,
//           'name': '刘良',
//           'mobile': '18720970845',
//           'managerId': null,
//           'tntInstId': 1165
//         }
//       ],
//       'sponsorMangerLevel': 1,
//       'autoApprove': 1,
//       'ccType': 1,
//       'ccTypeName': '指定抄送人',
//       'ccRoles': null,
//       'ccPositions': null,
//       'ccEmployees': null,
//       'buttons': [
//         {
//           'name': '通过',
//           'alias': '通过',
//           'code': 'approve',
//           'enable': 1
//         },
//         {
//           'name': '拒绝',
//           'alias': '拒绝',
//           'code': 'reject',
//           'enable': 1
//         },
//         {
//           'name': '转交',
//           'alias': '转交',
//           'code': 'transfer',
//           'enable': 1
//         }
//       ],
//       'conditions': []
//     },
//     {
//       'name': '条件 - 02',
//       'desc': '([性别==男] 且 [年龄<=30]) 或 ([性别==女] 且 [年龄<=25])',
//       'nodeCode': 'K7x6nafN',
//       'prevNode': [
//         '8XKbiYiK'
//       ],
//       'nextNode': [
//         'Rxdszani'
//       ],
//       'type': 2,
//       'typeName': '条件节点',
//       'approverType': null,
//       'approverTypeName': null,
//       'approveType': null,
//       'approveTypeName': null,
//       'countersign': null,
//       'roles': null,
//       'positions': null,
//       'employees': null,
//       'sponsorMangerLevel': null,
//       'autoApprove': null,
//       'ccType': null,
//       'ccTypeName': null,
//       'ccRoles': null,
//       'ccPositions': null,
//       'ccEmployees': null,
//       'buttons': [],
//       'conditions': [
//         {
//           'logicOperation': 'or',
//           'expressions': [
//             {
//               'field': 'sex',
//               'operation': '==',
//               'value': '男'
//             },
//             {
//               'field': 'age',
//               'operation': '<=',
//               'value': '30'
//             }
//           ]
//         },
//         {
//           'logicOperation': 'or',
//           'expressions': [
//             {
//               'field': 'sex',
//               'operation': '==',
//               'value': '女'
//             },
//             {
//               'field': 'age',
//               'operation': '<=',
//               'value': '25'
//             }
//           ]
//         }
//       ]
//     },
//     {
//       'name': '审批节点 - 03',
//       'desc': '<div class=text>用户：管理【系统】 </div>',
//       'nodeCode': 'Rxdszani',
//       'prevNode': [
//         'K7x6nafN'
//       ],
//       'nextNode': [],
//       'type': 1,
//       'typeName': '普通节点',
//       'approverType': 1,
//       'approverTypeName': '指定成员',
//       'approveType': 1,
//       'approveTypeName': '会签',
//       'countersign': null,
//       'roles': null,
//       'positions': null,
//       'employees': [
//         {
//           'id': 100000,
//           'name': '管理',
//           'mobile': '18888888888',
//           'managerId': null,
//           'tntInstId': 1165
//         }
//       ],
//       'sponsorMangerLevel': 1,
//       'autoApprove': 1,
//       'ccType': 2,
//       'ccTypeName': '发起人自选',
//       'ccRoles': null,
//       'ccPositions': null,
//       'ccEmployees': null,
//       'buttons': [
//         {
//           'name': '通过',
//           'alias': '通过',
//           'code': 'approve',
//           'enable': 1
//         },
//         {
//           'name': '拒绝',
//           'alias': '拒绝',
//           'code': 'reject',
//           'enable': 1
//         },
//         {
//           'name': '转交',
//           'alias': '转交',
//           'code': 'transfer',
//           'enable': 1
//         }
//       ],
//       'conditions': []
//     }
//   ],
//   'tntInstId': 1165,
//   'appId': 16
// };

const FlowEngineModules = () => {

  const {
    appId, // 应用id
    tenantId, // 租户id
    id, // 模版id
    isDemo,
    dynamicRelationId
  } = JSON.parse(decodeURI(urlParams(location.search)?.params || null)) || {};

  let formFields = [];
  let formConditionFields = [];
  try {
    formFields = getStorage('formFields') || []; // 表单字段
    formConditionFields = getStorage('formConditionFields') || []; // 条件字段
  } catch (error) {
    formFields = [];
    formConditionFields = [];
  }

  const [form] = Form.useForm();
  const [mainHeight, setMainHeight] = useState<number>(0);
  const [data, setData] = useState<any>({}); // 模版详情
  const [flowTemplateSelection, setFlowTemplateSelection] = useState<any>({}); // 表单筛选选项
  const [modalData, setModalData] = useState<EditFlowEngineModalDataProps>({
    visible: false,
    data: null,
    isDemo: false
  });
  const [departmentTreeList, setDepartmentTreeList] = useState<DepartmentTreeItem[]>([]); // 部门树
  const [roleList, setRoleList] = useState<RoleListItem[]>([]); // 角色列表

  // 获取表单筛选选项
  const getFlowSelectionData = () => {
    getFlowSelection().then((res: any) => {
      setFlowTemplateSelection(res);
    });
  };

  // 提交/保存按钮
  const handleSubmit = (params: any) => {
    const _params = {
      ...data,
      ...params,
      appId,
      tenantId,
      dynamicRelationId: dynamicRelationId || null
    };
    form.setFieldsValue({
      ..._params
    });
    setModalData({
      ...modalData,
      visible: true,
      data: _params,
      isDemo,
    });
  };

  // 部门、岗位、角色、员工 搜索接口
  const multipleSearch = async (params: any, type: string) => {
    let request: any;
    switch (type) {
      case 'employee':
        request = userSearch;
        break;
      case 'position':
        request = positionSearch;
        break;
      case 'role':
        request = getRoleSearch;
        break;
      case 'department':
        request = getTreeList;
        break;

      default:
        request = getRoleSearch;
        break;
    }

    const _params = {
      ...params,
      tenantId // 需要带上租户id
    };
    const data = await request(_params);

    return data;
  };

  const methods = useMethods({
    getDetail() {
      getFlowTemplateDetail({ id, tenantId }).then((res:any) => {
        setData(res);
      });
    },
    async getDepartment (tenantId?: any) {
      const data = await getDepartmentTreeList(tenantId);
      setStorage('sponsorDept', data);
      setDepartmentTreeList(data);
    },
    async getRole (params?: {page?: number, size?: number, keyword?: any, tenantId?: number|string}) {
      const { objectList } = await roleListApi({ ...params });
      setStorage('sponsorRole', objectList);
      setRoleList(objectList);
    },

  });

  useEffect(() => {
    if (id) {
      methods.getDetail();
    }

  }, [id]);

  useEffect(() => {
    if (!flowTemplateSelection.length) {
      getFlowSelectionData();
    }
    methods.getDepartment({ tenantId: tenantId });
    methods.getRole({ size: 500, tenantId: tenantId }); // 夏奇说先传500表示全量
  }, []);

  return (
    <>
      <V2Container
        className={styles.container}
        style={{ height: 'calc(100vh - 88px)' }}
        emitMainHeight={(h) => setMainHeight(h)}
        extraContent={{
          top: <>
            <Breadcrumb className={styles.breadcrumb}>
              <Breadcrumb.Item>
                {isDemo
                  ? <Link to={`/flowEngine?appId=${appId}&tenantId=${tenantId}`}>流程配置列表</Link>
                  : <Link to={`/location/tenantdetail?id=${tenantId}`}>企业详情</Link>}
              </Breadcrumb.Item>
              <Breadcrumb.Item>流程配置</Breadcrumb.Item>
            </Breadcrumb>
          </>
        }}>
        <div style={{ height: mainHeight - 30 }}>
          <FlowEngine
            flowTemplateSelection={flowTemplateSelection}
            handleSubmit={handleSubmit}
            data={data}
            multipleSearch={multipleSearch}
            formFields={formFields || []}
            departmentTreeList={departmentTreeList}
            roleList={roleList}
            otherConditionFields={formConditionFields}
          />
        </div>
      </V2Container>
      <EditFlowEngineModal
        form={form}
        modalData={modalData}
        setModalData={setModalData}
      />
    </>
  );
};


export default FlowEngineModules;


