/**
 * @Description 拓店任务详情-基本信息-拓店任务类型Item
 */

import { Form } from 'antd';
import { FC, useState, useEffect, useMemo } from 'react';
import V2DetailItem from '@/common/components/Feedback/V2DetailItem';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import { V2Confirm } from '@/common/components/Others/V2Confirm';
import TypeRecordsModal from './TypeRecordsModal';
import { taskTypeList, updateTaskType } from '@/common/api/expandStore/expansiontask';
import { isArray } from '@lhb/func';

interface Props {
  detail: any;
  open: boolean;
  canEditType: boolean;
  refresh?: Function;
}

const TaskTypeItem: FC<Props> = ({
  detail,
  open, // 拓店任务详情抽屉是否打开
  canEditType = false, // 是否可变更类型
  refresh,
}) => {
  const [form] = Form.useForm();
  const [taskTypes, setTaskTypes] = useState<any[]>([]);
  const [recordsVisible, setRecordsVisible] = useState<boolean>(false); // 任务类型变更记录

  useEffect(() => {
    if (open) {
      getTaskTypeList(); // 类型选项
    }
  }, [open]);

  /**
   * @description 获取该租户配置的所有任务类型
   */
  const getTaskTypeList = () => {
    taskTypeList().then((data) => {
      if (isArray(data) && data.length) {
        const types = data.map((itm: any) => ({ value: itm.id, label: itm.typeName }));
        setTaskTypes(types);
      }
    });
  };

  /**
   * @description  可变更的任务选项（所有任务类型除去当前设定的任务类型）
   */
  const typeSelection = useMemo(() => {
    return (detail && isArray(taskTypes)) ? taskTypes.filter((itm: any) => itm.value !== detail.taskTypeId) : [];
  }, [taskTypes, detail]);

  /**
   * @description 取消类型变更
   */
  const onCancel = () => {
    form.resetFields();
  };

  /**
   * @description 确定类型变更
   */
  const onOK = () => {
    const type = form.getFieldValue('type');
    if (!type) return;
    V2Confirm({
      content: '确定改变任务类型？',
      onSure: () => {
        const params = {
          taskId: detail?.id,
          taskTypeId: +type,
        };
        updateTaskType(params).then((res) => {
          if (res) {
            V2Message.success('提交成功');
            refresh && refresh();
            form.resetFields();
          }
        });
      }
    });
  };

  return (
    <>
      <Form form={form}>
        <V2DetailItem
          label={<>
            <span>任务类型</span>
            {detail?.taskTypeId ? <span className='ml-5 c-006 pointer' onClick={() => setRecordsVisible(true)}>变更记录</span> : null}
          </>}
          value={detail?.taskTypeName}
          allowEdit={canEditType}
          editConfig={{
            formCom: <V2FormSelect options={typeSelection} name='type'/>,
            onCancel,
            onOK,
          }}
        />
      </Form>
      {/* 类型变更记录 */}
      <TypeRecordsModal taskId={detail.id} open={recordsVisible} setOpen={setRecordsVisible}/>
    </>
  );
};

export default TaskTypeItem;
