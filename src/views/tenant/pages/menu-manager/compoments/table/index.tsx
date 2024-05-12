/**
 * @Description 租户菜单管理-编辑菜单
 */
import { FC } from 'react';
import { Card, Col, Form, Row, Tooltip, message } from 'antd';
import { FormInstance } from 'antd/es/form/Form';
import { QuestionCircleOutlined } from '@ant-design/icons';

import styles from './index.module.less';
import FormInput from '@/common/components/Form/FormInput';
import FormTreeSelect from '@/common/components/Form/FormTreeSelect';
import FormInputNumber from '@/common/components/Form/FormInputNumber';
import V2Operate from '@/common/components/Others/V2Operate';
import { useMethods } from '@lhb/hook';
import { post } from '@/common/request';
import FormSetName from '@/common/components/Form/FormSetName/FormSetName';
import { refactorPermissions } from '@lhb/func';


interface ButtonTableProps {
  form: FormInstance;
  treeData?: any;
  successCallback?:Function;
  cancelCallback?:Function;
};


// 按钮列表
const operateList:any[] = [
  {
    name: '取消',
    event: 'cancel',
    type: 'default',
  },
  {
    name: '提交',
    event: 'submit',
    type: 'primary',
  },
];

const ButtonTable: FC<ButtonTableProps> = (props) => {
  const { treeData, form, successCallback, cancelCallback } = props;

  const methods = useMethods({
    handleSubmit() {
      form.validateFields().then((values) => {
        const params = {
          ...values,
        };
        // https://yapi.lanhanba.com/project/378/interface/api/52051
        post('/tntModule/update', params, { proxyApi: '/mirage', needHint: true }).then(() => {
          message.success('修改成功');
          successCallback?.();
        });
      });
    },
    handleCancel() {
      cancelCallback?.();
    }
  });


  return (
    <>
      <Card title='编辑菜单' >
        <Row>
          <Col span={16}>
            <Form
              form={form}
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}>
              <FormSetName name='id'></FormSetName>
              <FormInput
                label='菜单别名'
                name='name'
                rules={[
                  {
                    required: true,
                    message: '菜单别名必填'
                  }
                ]}
                placeholder='请输入菜单别名'/>
              <FormInput
                label='菜单名称'
                name='moduleName'
                config={{ disabled: true }}
                placeholder='请输入菜单名称'/>
              <FormTreeSelect
                label={(<> <Tooltip title='空代表添加到根结点'>
                  <QuestionCircleOutlined />
                </Tooltip>上级菜单</>)}
                treeData={[{ title: '根菜单', key: 0, value: 0, children: treeData }]}
                name='moduleParentId'
                rules={[{
                  required: true,
                  message: '请选择上级菜单'
                }]}
                placeholder='请选择上级菜单'/>
              <FormInputNumber
                label={(<> <Tooltip title='数字越小越靠前'>
                  <QuestionCircleOutlined />
                </Tooltip>排序</>)}
                name='sortNum'
                config={{ precision: 0, style: { width: '100%' } }}
              />
            </Form>
            <div className={styles.operate}>
              <V2Operate operateList={refactorPermissions(operateList)} onClick={(btns: { func: string | number }) => methods[btns.func]()}/>
            </div>
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default ButtonTable;
