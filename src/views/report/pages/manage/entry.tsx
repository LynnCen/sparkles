import { useEffect, useMemo, useRef, useState } from 'react';
import { reportTempList } from '@/common/api/report';
import styles from './entry.module.less';
import Filter from './components/Filter';
import List from './components/List';
import EditModal from './components/EditModal';
import { ObjectProps, ListResult, OperateModalProps } from './ts-config';
import { PlusOutlined } from '@ant-design/icons';
import { useMethods } from '@lhb/hook';
import { isEqual, refactorPermissions } from '@lhb/func';

// 默认弹框参数
const defaultOperateProps: OperateModalProps = {
  id: 0,
  visible: false,
};

const Report = () => {
  // 查询参数
  const [params, setParams] = useState<ObjectProps>({});

  // 新增/编辑报表模板
  const [toEdit, setToEdit] = useState<OperateModalProps>(defaultOperateProps);

  const [operateExtra, setOperateExtra] = useState<any[]>([]);

  const [exportingList, setExportingList] = useState<any>([]);

  const oldExportingList = useRef<any>([]);
  const timeEventRef = useRef<any>(null);
  const operateList: any = useMemo(() => {
    const list = refactorPermissions(operateExtra);
    return list.map((item) => {
      const res: any = {
        name: item.text,
        event: item.event,
        func: item.func,
        type: item.isBatch ? 'default' : 'primary',
      };
      if (item.event === 'create') {
        res.icon = <PlusOutlined />;
      }
      return res;
    });
  }, [operateExtra]);

  const { onSearch, loadData, addReport, updateReport, refreshList } = useMethods({
    onSearch: (values: any) => {
      setParams({
        ...params,
        ...values,
      });
    },

    loadData: async (params: any) => {
      const { objectList, totalNum, meta }: ListResult = await reportTempList(params);
      setOperateExtra(meta?.permissions || []);

      // 获取当前正在导出的数据的id
      const res:any = [];
      objectList?.map((item:any) => {
        if (item.isExporting) {
          res.push(item.id);
        }
      });
      oldExportingList.current = exportingList;// 此时exportingList为旧数据
      setExportingList(res);

      return {
        dataSource: objectList || [],
        count: totalNum,
      };
    },

    addReport: () => {
      setToEdit({
        id: 0,
        visible: true,
      });
    },
    updateReport: (id: number) => {
      setToEdit({
        id,
        visible: true,
      });
    },
    refreshList: () => {
      setParams({ ...params });
    }
  });

  useEffect(() => {
    if (exportingList.length) {
      timeEventRef.current = setInterval(() => {
        loadData();
      }, 500);
    }
    if (!isEqual(oldExportingList.current, exportingList) && exportingList.length) {
      refreshList();
    }
    if (!exportingList.length) {
      refreshList();
    }

    return () => {
      timeEventRef.current && clearInterval(timeEventRef.current);
    };
  }, [exportingList.length]);

  return (
    <div className={styles.container}>
      <Filter onSearch={onSearch} addReport={addReport} operateList={operateList} />
      <List
        refresh={refreshList}
        params={params}
        loadData={loadData}
        updateReport={updateReport}
        onRefresh={onSearch}
      />
      <EditModal record={toEdit} onClose={setToEdit} onOk={onSearch} />
      {/* <ModalExport
        open={toExport.visible}
        onOk={onOk}
        onClose={() => setToExport({ ...toExport, visible: false })}
      /> */}
    </div>
  );
};

export default Report;
