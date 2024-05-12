/**
 * @Description 任务历史
 */
import { FC, useState } from 'react';
import { Form, Modal, Typography } from 'antd';
import { useMethods } from '@lhb/hook';
import SearchForm from '@/common/components/Form/SearchForm';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2Table from '@/common/components/Data/V2Table';
import TaskDetailDrawer from '../index';
import { taskHistory } from '@/common/api/expandStore/expansiontask';
import { isArray, isNotEmptyAny } from '@lhb/func';
import styles from '../index.module.less';
import { TaskStatusColor } from '@/common/components/business/ExpandStore/ts-config';

const { Link } = Typography;

interface Props {
  id: number; // 任务id
  open: boolean; // 打开弹窗
  setOpen: Function; // 控制是否打开弹窗
}

const TaskHistory : FC<Props> = ({
  id,
  open,
  setOpen,
}) => {

  const [form] = Form.useForm(); // 表单参数
  const [filters, setFilters] = useState<any>(); // 筛选参数
  const [taskId, setTaskId] = useState<any>(0);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false); // 拓店任务详情是否可见

  const methods = useMethods({
    /**
     * @description 点击-取消，或者点击任务后关闭当前弹框
     */
    onClose() {
      setOpen(false);
      setFilters({});
      form.resetFields();
    },

    handleTask(id: number) {
      setTaskId(id);
      this.onClose();
      setDrawerVisible(true);
    },

    /**
     * @description 搜索
     * @param params 搜索关键词
     */
    onSearch(params) {
      setFilters(params);
    },

    /**
     * @description 加载表格数据，输入关键字时由前端过滤
     * @param params 搜索参数
     * @returns 表格数据
     */
    async loadData(params) {
      const data = await taskHistory({ id });

      const keyword = params.name;
      const dataSource = isArray(data) ? data.filter((itm: any) => !keyword || itm.name.includes(keyword)) : [];
      return {
        dataSource,
        count: dataSource.length,
      };
    }
  });

  const defaultColumns = [{
    key: 'name',
    title: '任务名称',
    width: '300px',
    render: (value, record) => (<Link onClick={() => methods.handleTask(record.id)}>{value}</Link>)
  }, {
    key: 'status',
    title: '任务状态',
    dragChecked: true,
    width: '100px',
    render: (value, record) => {
      return isNotEmptyAny(value) ? (
        <div className={styles.taskStatus}>
          <span
            className={styles.taskStatusIcon}
            style={{
              backgroundColor: TaskStatusColor[value],
            }}
          />
          {record.statusName}
        </div>
      ) : '-';
    },
  }];

  return (
    <>
      <Modal
        title='任务历史'
        open={open}
        width={680}
        onCancel={methods.onClose}
        destroyOnClose
        footer={null}
      >
        <SearchForm
          onOkText='搜索'
          form={form}
          showResetBtn
          onSearch={methods.onSearch}
        >
          <V2FormInput label='' name='name' placeholder='请输入任务名称'/>
        </SearchForm>

        <V2Table
          rowKey='id'
          defaultColumns={defaultColumns}
          onFetch={methods.loadData}
          pagination={false}
          hideColumnPlaceholder={true}
          filters={filters}
          scroll={{ x: 'max-content', y: 380 }}
        />
      </Modal>
      <TaskDetailDrawer
        id={taskId}
        isHistory
        open={drawerVisible}
        setOpen={setDrawerVisible}
      />
    </>
  );
};
export default TaskHistory;

