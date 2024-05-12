import { FC, useEffect, useMemo, useRef, useState } from 'react';
import Operate from '@/common/components/Operate';
import TaskList from './components/TaskList';
import EditTask from './components/Modal/EditTask';
import { PlusOutlined } from '@ant-design/icons';
import { post } from '@/common/request';
import styles from './entry.module.less';

import { AssignTaskModalProps, EditTaskModalProps, TaskDetailDrawProps } from './ts-config';
import { message as msg, Modal, Form } from 'antd';
import { projectTaskDelete } from '@/common/api/footprinting';
import dayjs from 'dayjs';
import Search from './components/Modal/Search';
import { useMethods } from '@lhb/hook';
import AssignTaskModal from './components/Modal/AssignTaskModal';
import TaskDetailDraw from './components/TaskDetailDraw';
import ModalDraw from './components/ModalDraw';
import V2Container from '@/common/components/Data/V2Container';
import ExportReview from './components/Modal/ExportReview';
import { refactorPermissions, urlParams } from '@lhb/func';
import { dispatchNavigate } from '@/common/document-event/dispatch';



function initForm() {
  return {
    cityId: '',
    provinceId: '',
    districtId: '',
    shopCategory: '',
    checkWay: '',
    process: '',
    checkDate: '',
    placeName: '',
    name: '',
    checkerName: '',
    tenantName: '',
  };
}

const Footprinting: FC<any> = () => {

  const {
    projectCode, // 任务码
  } = JSON.parse(decodeURI(urlParams(location.search)?.params || null)) || {};

  const [form] = Form.useForm();
  const [visible, setVisible] = useState<boolean>(false);
  const [editTask, setEditTask] = useState<EditTaskModalProps>({ visible: false });
  const [assignTask, setAssignTask] = useState<AssignTaskModalProps>({ visible: false });
  const [taskDetail, setTaskDetail] = useState<TaskDetailDrawProps>({ visible: false });
  const currentPageRefresh = useRef(false);
  const [searchParams, setSearchParams] = useState<any>(initForm());
  const [rowSelection, setRowSelection] = useState<Array<any>>([]); // 批量操作时选中
  const [operateExtra, setOperateExtra] = useState<any>([]); // 接口返回的操作按钮权限
  const [modalData, setModalData] = useState({
    visible: false,
    id: '', // 踩点任务id
    filterAlreadySetVideos: false, // 是否只过滤已设置框的视频
  });

  useEffect(() => {
    (async () => {
      // https://yapi.lanhanba.com/project/462/interface/api/53990
      const data = await post('/checkSpot/project/managePermission', {}, {
        proxyApi: '/blaster',
        needHint: true
      });
      setOperateExtra(data);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const operateList: any = useMemo(() => {
    const list = refactorPermissions(operateExtra);
    return list.map((item) => {
      const res: any = {
        name: item.text,
        disabled: item.isBatch ? !rowSelection.length : false,
        type: item.isBatch ? 'default' : 'primary',
        onClick: () => methods[item.func](),
      };
      if (item.event === 'projectCreate') {
        res.icon = <PlusOutlined />;
      }
      return res;
    });
    // eslint-disable-next-line
  }, [operateExtra, rowSelection]);

  const onSearch = (type?: string) => {
    // 新增回到第一页，编辑停留在当前页刷新
    switch (type) {
      case 'edit':
        currentPageRefresh.current = true;
        break;
      default:
        currentPageRefresh.current = false;
        break;
    }
    setSearchParams({ ...searchParams });
  };

  const { ...methods } = useMethods({
    // 根据event添加按钮点击事件的方法
    handleProjectCreate() {
      setEditTask({ visible: true });
    },
    handleBatchProjectDelete() {
      // 默认是已下发 3，只要不等于3就是已经开始视频拍摄
      const hasVideo = rowSelection.find((item) => (item.process) !== 3 && (item.process !== 8));
      if (hasVideo) {
        msg.warning('已经开始视频拍摄的任务不可删除，请检查选中的任务');
        return;
      }

      Modal.confirm({
        title: `删除任务`,
        content: `确定删除任务？`,
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          const ids = rowSelection.map((item: any) => item.id);
          projectTaskDelete({ ids }).then(() => {
            // 更新列表
            setSearchParams({ ...searchParams });
            setRowSelection([]);
          });
        },
      });
    },
    handleReviewImport() {
      setVisible(true);
    },
  });

  const onCloseEditModal = () => {
    setEditTask({ visible: false });
  };


  const searchChange = (fieldsValue: Record<string, any>) => {
    setRowSelection([]);
    const {
      pcdIds,
      checkDate,
      industryId,
    } = fieldsValue || {};
    const params: any = {
      ...initForm(),
      ...fieldsValue,
    };

    if (Array.isArray(pcdIds) && pcdIds.length) {
      params.provinceId = pcdIds[0];
      params.cityId = pcdIds[1];
      pcdIds[2] && (params.districtId = pcdIds[2]);
    }
    if (checkDate) {
      params.checkDate = dayjs(checkDate).format('YYYY-MM-DD');
    }
    if (Array.isArray(industryId)) {
      params.industryId = industryId[industryId.length - 1];
    }
    currentPageRefresh.current = false;
    setSearchParams(params);
  };

  const onOk = () => {
    searchChange(searchParams);
  };

  const onCloseModal = () => {
    setVisible(false);
  };

  useEffect(() => {
    if (projectCode) {
      form.setFieldsValue({ projectCode });
      setSearchParams({ ...searchParams, projectCode });
      dispatchNavigate('/passengerFlow/footprinting', { replace: true });
    }

  }, [projectCode]);

  return (
    <div className={styles.container}>
      <V2Container style={{ height: 'calc(100vh - 88px)' }}
        extraContent={{
          top: <div style={{ marginBottom: '12px' }}>
            <Search change={searchChange} form={form}/>
            <Operate showBtnCount={4} operateList={operateList} onClick={(btns) => methods[btns.func]()}/>
          </div>,
        }}>
        <TaskList
          setEditTask={setEditTask}
          setAssignTask={setAssignTask}
          setTaskDetail={setTaskDetail}
          setModalData={setModalData}
          refreshCurrent={currentPageRefresh.current}
          searchParams={searchParams}
          rowSelection={rowSelection}
          selectionChange={setRowSelection}
          onSearch={onSearch}/>
      </V2Container>
      <EditTask editTask={editTask} onOk={onSearch} onCloseEditModal={onCloseEditModal}/>
      <AssignTaskModal assignTask={assignTask} setAssignTask={setAssignTask} onSearch={onSearch}/>
      <TaskDetailDraw taskDetail={taskDetail} setTaskDetail={setTaskDetail} setEditTask={setEditTask}/>
      <ModalDraw
        modalData={modalData}
        updateData={onSearch}
        modalHandle={() => setModalData({ visible: false, id: '', filterAlreadySetVideos: false })}
      />
      <ExportReview visible={visible} onCloseModal={onCloseModal} onOkExport={onOk} />
    </div>
  );
};

export default Footprinting;
