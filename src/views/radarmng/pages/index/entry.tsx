import { FC, useMemo, useState } from 'react';
import styles from './entry.module.less';
import Filters from './components/Filters';
import TaskList from './components/TaskList';
import Operate from '@/common/components/Operate';
import TaskModal from './components/TaskModal';
import { radarList } from '@/common/api/radar';
import { PlusOutlined } from '@ant-design/icons';
import TaskBrandModal from './components/TaskBrandModal';
import { KeepAlive } from 'react-activation';
import { refactorPermissions } from '@lhb/func';

const Gdpoi: FC<any> = () => {
  const [params, setParams] = useState<any>({});
  const [taskInfo, setTaskInfo] = useState<any>({ visible: false });
  const [brandInfo, setBrandInfo] = useState<any>({ visible: false });

  const onSearch = (values: any) => {
    setParams({ ...params, ...values });
  };

  const loadData = async (values: any) => {
    const { totalNum, objectList, meta } = await radarList(values);
    if (!operateList.length) {
      setOperateExtra(meta.permissions);
    }
    return {
      dataSource: objectList || [],
      count: totalNum,
    };
  };

  const handleCreate = () => {
    setTaskInfo({ visible: true });
  };
  const handleBrand = () => {
    setBrandInfo({ visible: true });
  };

  // 操作按钮
  const [operateExtra, setOperateExtra] = useState<any[]>([]);
  const operateList: any = useMemo(() => {
    const list = refactorPermissions(operateExtra);
    return list.map((item) => {
      // console.log('item', item);
      const res: any = {
        name: item.text,
        type: item.isBatch ? 'default' : 'primary',
      };
      if (item.event === 'create') {
        res.icon = <PlusOutlined />;
        res.onClick = () => handleCreate();
      }
      if (item.event === 'brand') {
        res.icon = <PlusOutlined />;
        res.onClick = () => handleBrand();
      }
      return res;
    });
  }, [operateExtra]);

  return (
    <KeepAlive saveScrollPosition>
      <div className={styles.container}>
        <Filters onSearch={onSearch} />
        <div style={{ marginBottom: '16px' }}>
          <Operate operateList={operateList} />
        </div>

        <TaskList params={params} loadData={loadData} onSearch={onSearch} />
        <TaskModal taskInfo={taskInfo} setTaskInfo={setTaskInfo} onSearch={onSearch} />
        <TaskBrandModal brandInfo={brandInfo} setBrandInfo={setBrandInfo} onSearch={onSearch} />
      </div>
    </KeepAlive>
  );
};

export default Gdpoi;
