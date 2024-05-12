/**
 * @Description 系统配置-编辑审批流
 */
import { FC, useEffect, useState } from 'react';
import { Form } from 'antd';
import {
  approvalFlowTemplateOfDetail,
  approvalFlowTemplateSelection
} from '@/common/api/approvalflow';
import { departmentTreeList } from '@/common/api/department';
import { isArray, urlParams } from '@lhb/func';
import { DepartmentTreeItem } from './ts-config';
import { roleList } from '@/common/api/role';
import { userList } from '@/common/api/brief';
import { positionList } from '@/common/api/position';
import styles from './entry.module.less';
import V2Container from '@/common/components/Data/V2Container';
import FlowEngine from '@/common/components/business/FlowEngine';
import EditFlowEngineModal from './components/EditFlowEngineModal';

const ApprovalFloweEdit: FC<any> = () => {
  const id: string | number = urlParams(location.search)?.id || 0; // 详情时的id
  const [form] = Form.useForm();
  const [detailData, setDetailData] = useState<any>({}); // 模板详情
  const [flowTemplateSelection, setFlowTemplateSelection] = useState<any>({}); // 表单筛选选项
  const [mainHeight, setMainHeight] = useState<number>(0);
  const [modalData, setModalData] = useState<any>({ // 弹窗
    visible: false,
    data: null
  });
  const [departmentTreeData, setDepartmentTreeData] = useState<DepartmentTreeItem[]>([]); // 部门树
  const [roleListData, setRoleListData] = useState<any[]>([]); // 角色列表

  // 部门、岗位、角色、员工 搜索接口
  const multipleSearch = async (params: any, type: string) => {
    let request: any;
    switch (type) {
      case 'employee': // 员工
        request = userList;
        break;
      case 'position': // 岗位
        request = positionList;
        break;
      case 'role': // 角色
        request = roleList;
        break;
      case 'department': // 部门
        request = departmentTreeList;
        break;
      default:
        request = roleList;
        break;
    }

    const _params = {
      ...params,
    };
    const data = await request(_params);

    return data;
  };

  useEffect(() => {
    if (!(+id)) return;
    getDetail();
  }, [id]);

  useEffect(() => {
    getTemplateSelection();
    getDepartmentData();
    getRoleList();
  }, []);
  // 模板详情
  const getDetail = () => {
    approvalFlowTemplateOfDetail({ id }).then((res:any) => {
      res && setDetailData(res);
    });
  };
  // 筛选项详情
  const getTemplateSelection = () => {
    approvalFlowTemplateSelection().then((res: any) => {
      res && setFlowTemplateSelection(res);
    });
  };
  // 部门数据
  const getDepartmentData = () => {
    departmentTreeList().then((res) => {
      setDepartmentTreeData(res);
    });
  };
  // 编辑
  const handleSubmit = (params: any) => {
    const _params = {
      ...detailData,
      ...params
    };
    form.setFieldsValue({
      ..._params
    });
    setModalData({
      visible: true,
      data: _params
    });
  };
  // 角色列表
  const getRoleList = async () => {
    const { objectList }: any = await roleList({ size: 150 });
    setRoleListData(isArray(objectList) ? objectList : []);
  };

  return (
    <>
      <V2Container
        className={styles.container}
        style={{ height: 'calc(100vh - 88px)' }}
        emitMainHeight={(h) => setMainHeight(h)}>
        <div style={{ height: mainHeight - 30 }}>
          <FlowEngine
            flowTemplateSelection={flowTemplateSelection}
            handleSubmit={handleSubmit}
            data={detailData}
            roleList={roleListData}
            multipleSearch={multipleSearch}
            departmentTreeList={departmentTreeData}
          />
        </div>
      </V2Container>
      {/* 提交后的确认弹窗 */}
      <EditFlowEngineModal
        form={form}
        modalData={modalData}
        setModalData={setModalData}
      />
    </>
  );
};

export default ApprovalFloweEdit;
