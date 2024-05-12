/**
 * @LastEditors Please set LastEditors
 * @LastEditTime 2023-11-17 14:11
 * @Description : 新增/编辑部门
 */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, FC, useEffect } from 'react';
import { Modal, Form, message, Row, Col, Cascader } from 'antd';
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
import V2FormProvinceList from '@/common/components/Form/V2FormProvinceList';

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
      // 选中的城市id
      const cityIds = values.cityList?.length ? values.cityList.map((subArray) => subArray[subArray.length - 1]) : [0];// 未选择管辖范围的时候需要传[0]
      const params = {
        ...values,
        cityIds,
        parentId: values.parentId || null, // 选中顶级部门的时候需要传null
        manageIds: values.manageIds || null, // 未选择主管的时候需要传null
        ...(operateDepartMent.id && { id: operateDepartMent.id }),
      };
      delete params.manageName;
      // 修改-http://yapi.lanhanba.com/project/289/interface/api/33066
      // 创建-http://yapi.lanhanba.com/project/289/interface/api/33065
      const url = operateDepartMent.id ? '/department/update' : '/department/create';
      post(url, params, {
        needHint: true,
        proxyApi: '/mirage'
      }).then(() => {
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
    get('/department/detail', { id: operateDepartMent.id }, {
      proxyApi: '/mirage',
      needHint: true
    }).then((result: DepartmentDetail) => {
      form.setFieldsValue({
        ...result,
        parentId: result?.parent?.id || 0, // 没有上级部门的默认选中顶级部门，顶级部门id为0
        ...(result.managerList &&
            result.managerList.length && { manageName: result.managerList?.map((user) => user.name)?.join('、'), manageIds: result.managerList?.map((user) => user.id) }),
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
    console.log(users, visible);
    form.setFieldsValue({
      manageName: (users.length && users?.map(user => user.name)?.join('、')) || '',
      manageIds: (users.length && users?.map(user => user.id)) || undefined,
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
            <Col span={12}>
              {treeData.length ? (
                <V2FormTreeSelect
                  label='所属上级'
                  name='parentId'
                  required
                  treeData={treeData}
                  config={{
                    fieldNames: { label: 'name', value: 'id', children: 'children' },
                    treeDefaultExpandAll: true,
                    showSearch: true,
                    allowClear: true,
                    treeNodeFilterProp: 'name',
                  }}
                />
              ) : null}
              <V2FormInput label='部门编码' name='encode' required maxLength={20}/>
              <V2FormTextArea label='部门说明' name='desc' maxLength={500} config={{ showCount: true }}/>
            </Col>
            <Col span={12}>
              <V2FormInput label='部门名称' name='name' required maxLength={20} />
              {/* 用于回显主管姓名 */}
              <V2FormInput
                label='部门主管'
                name='manageName'
                maxLength={20}
                onClickInput={checkPartner}
                config={{ readOnly: true }}
              />
              <V2FormProvinceList
                label='管辖范围'
                name='cityList'
                type={2}
                multiple
                config={{
                  showCheckedStrategy: Cascader.SHOW_CHILD,
                }}
              />
              {/* 主管id-隐藏字段（依然会收集和校验字段）用于确定传参 */}
              <FormSetName name='manageIds' />
            </Col>
          </Row>
        </V2Form>
      </Modal>
      <PermissionSelector
        title='选择用户'
        type='ONE'
        values={chooseUserValues}
        onClose={setChooseUserValues}
        onOk={onOkSelector}
      />
    </>
  );
};

export default DepartmentInfo;
