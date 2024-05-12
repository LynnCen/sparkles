/* eslint-disable react-hooks/exhaustive-deps */
/* 新增/编辑部门 */
import { useState, FC, useEffect } from 'react';
import { Modal, Form, message, Row, Col } from 'antd';
import V2Form from '@/common/components/Form/V2Form';
import V2FormTreeSelect from '@/common/components/Form/V2FormTreeSelect/V2FormTreeSelect';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import FormSetName from '@/common/components/Form/FormSetName/FormSetName';
import V2FormTextArea from '@/common/components/Form/V2FormTextArea/V2FormTextArea';
import PermissionSelector from '@/common/components/Modal/PermissionSelector';
import { PermissionSelectorValues } from '@/common/components/Modal/ts-config';
import { departmentList } from '@/common/api/department';
import { post, get } from '@/common/request';
import { DefaultDepartMent } from '@/common/utils/options';
import { DepartmentModalProps, DepartmentDetail, DepartMentResult } from '../../ts-config';

const DepartmentInfo: FC<DepartmentModalProps> = ({ operateDepartMent, setOperateDepartment, onSearch }) => {
  const [form] = Form.useForm();
  const [chooseUserValues, setChooseUserValues] = useState<PermissionSelectorValues>({
    visible: false,
    users: [], // 部门主管
  });
  const [treeData, setTreeData] = useState<any[]>([]); // 所属上级的树

  useEffect(() => {
    if (operateDepartMent.visible) {
      // 所属上级，新建默认取顶级部门
      operateDepartMent.id ? loadDepartDetail() : form.setFieldsValue({ parentId: 0 });
      loadDepartMentData();
    } else {
      form.resetFields();
      setChooseUserValues({ visible: false, users: [] });
    }
  }, [operateDepartMent.visible]);

  // 确定
  const onSubmit = () => {
    form.validateFields().then((values: any) => {
      const params: any = {
        ...values,
        parentId: values.parentId || null, // 选中顶级部门的时候需要传null
        ...(values.manageIds && { manageIds: [values.manageIds] }),
        ...(operateDepartMent.id && { id: operateDepartMent.id }),
      };
      if (!params.manageIds) {
        params.manageIds = null; // 未选择时必须传null
      }
      delete params.manageName;
      // 修改-http://yapi.lanhanba.com/project/289/interface/api/33066
      // 创建-http://yapi.lanhanba.com/project/289/interface/api/33065
      const url = operateDepartMent.id ? '/department/update' : '/department/create';
      post(url, params, true).then(() => {
        message.success(`${operateDepartMent.id ? '编辑' : '新建'}部门成功`);
        onCancel();
        onSearch();
      });
    });
  };

  // 请求部门列表
  const loadDepartMentData = async () => {
    const { objectList }: DepartMentResult = await departmentList();
    const arr: any = [];
    setTreeData(arr.concat(DefaultDepartMent, objectList)); // 默认放置一个顶级部门在顶部
  };

  // 部门详情
  const loadDepartDetail = () => {
    // http://yapi.lanhanba.com/project/289/interface/api/33064
    get('/department/detail', { id: operateDepartMent.id }).then((result: DepartmentDetail) => {
      form.setFieldsValue({
        ...result,
        parentId: result?.parent?.id || 0, // 没有上级部门的默认选中顶级部门，顶级部门id为0
        ...(result.managerList &&
          result.managerList.length && { manageName: result.managerList[0].name, manageIds: result.managerList[0].id }),
      });
      setChooseUserValues({
        ...chooseUserValues,
        users: result.managerList || [],
      });
    });
  };

  // 关闭
  const onCancel = () => {
    setOperateDepartment({ ...operateDepartMent, visible: false });
  };

  // 选择部门主管
  const checkPartner = () => {
    setChooseUserValues({ ...chooseUserValues, visible: true });
  };

  // 确定选择部门主管
  const onOkSelector = ({ users, visible }: PermissionSelectorValues) => {
    form.setFieldsValue({
      manageName: (users.length && users[0].name) || '',
      manageIds: (users.length && users[0].id) || undefined,
    });
    setChooseUserValues({ users, visible });
  };

  return (
    <>
      <Modal
        title={!operateDepartMent.id ? '新建部门' : '编辑部门'}
        open={operateDepartMent.visible}
        onOk={onSubmit}
        width={640}
        onCancel={onCancel}
        forceRender
      >
        <V2Form form={form}>
          <Row gutter={16}>
            {treeData.length ? (
              <Col span={12}>
                <V2FormTreeSelect
                  label='所属上级'
                  name='parentId'
                  required
                  treeData={treeData}
                  config={{
                    fieldNames: { label: 'name', value: 'id', children: 'children' },
                    treeDefaultExpandAll: true,
                    showSearch: true,
                    treeNodeFilterProp: 'name',
                  }}
                />
              </Col>
            ) : null}
            <Col span={12}>
              <V2FormInput label='部门名称' name='name' required maxLength={20} />
            </Col>
            <Col span={12}>
              <V2FormInput label='部门编码' name='encode' required maxLength={20} />
            </Col>
            <Col span={12}>
              {/* 用于回显主管姓名 */}
              <V2FormInput label='部门主管' name='manageName' maxLength={20} onClickInput={checkPartner} config={{ readOnly: true }} />
              {/* 主管id-隐藏字段（依然会收集和校验字段）用于确定传参 */}
              <FormSetName name='manageIds'></FormSetName>
            </Col>
            <Col span={12}>
              <V2FormTextArea label='部门说明' maxLength={255} name='desc' config={{ showCount: true }}/>
            </Col>
          </Row>
        </V2Form>
      </Modal>
      <PermissionSelector
        title='选择用户'
        values={chooseUserValues}
        onClose={setChooseUserValues}
        onOk={onOkSelector}
      />
    </>
  );
};

export default DepartmentInfo;
