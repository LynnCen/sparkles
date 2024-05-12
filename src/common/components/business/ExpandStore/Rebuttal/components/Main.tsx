/**
 * @Description 驳回表单
 */

import { FC, useEffect, useState } from 'react';
import { Row, Col } from 'antd';
import { approvalNodeList } from '@/common/api/expandStore/approveworkbench';
// import cs from 'classnames';
// import styles from './entry.module.less';
import V2Form from '@/common/components/Form/V2Form';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import V2FormRadio from '@/common/components/Form/V2FormRadio/V2FormRadio';
import V2FormTextArea from '@/common/components/Form/V2FormTextArea/V2FormTextArea';
import { isArray } from '@lhb/func';

const Main: FC<any> = ({
  form,
  id,
  refreshNodesFlag, // 刷新结点flag
}) => {
  const [nodeOptions, setNodeOptions] = useState<any[]>([]); // 审批节点
  useEffect(() => {
    // 每次打开弹窗时请求
    refreshNodesFlag && getApprovalNodes();
  }, [refreshNodesFlag]);

  const getApprovalNodes = async () => {
    const listData = await approvalNodeList({ id });
    setNodeOptions(isArray(listData) ? listData : []);
  };

  return (
    <V2Form form={form}>
      <Row gutter={16}>
        <Col span={12}>
          <V2FormSelect
            label='驳回节点'
            name='rejectNode'
            options={nodeOptions}
            rules={[{ required: true, message: '请选择驳回节点' }]}
            config={{
              fieldNames: {
                label: 'name',
                value: 'nodeCode'
              }
            }}
          />
        </Col>
        <Col span={12}>
          <V2FormRadio
            label='驳回后重新发起'
            name='nodeSkip'
            options={[
              { label: '按审批流依次审批', value: 1 },
              { label: '直接到当前节点', value: 2 },
            ]}
            rules={[{ required: true, message: '请选择驳回后重新发起的操作' }]}
          />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <V2FormTextArea
            label='驳回意见'
            name='reason'
            maxLength={50}
            config={{
              showCount: true,
              rows: 3
            }}
            placeholder='请输入驳回意见，最多输入50字'
            rules={[{ required: true, message: '请输入意见' }]}
          />
        </Col>
      </Row>
    </V2Form>
  );
};

export default Main;
