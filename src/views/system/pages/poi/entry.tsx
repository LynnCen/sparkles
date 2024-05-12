import { FC, useState, useEffect, useMemo } from 'react';
import { ObjectProps } from './ts-config';
import { selectionTreeByKey } from '@/common/api/selection';
import { getBrandList } from '@/common/api/system';
import { useMethods } from '@lhb/hook';
import styles from './entry.module.less';
import Operate from '@/common/components/Operate';
import EditModal from './components/EditModal';
import Filter from './components/Filter';
import LeftTree from './components/LeftTree';
import TableInfo from './components/TableInfo';
import { refactorPermissions } from '@lhb/func';
// import { PlusOutlined } from '@ant-design/icons';


const Poi: FC<any> = () => {
  const [params, setParams] = useState<ObjectProps>({});
  // 左侧品牌树
  const [categoryTree, setCategoryTree] = useState<any[]>([]);
  const [modalData, setModalData] = useState<any>({
    visible: false,
    id: ''
  });
  const [operateExtra, setOperateExtra] = useState<any>([]);

  useEffect(() => {
    // 获取左侧树状数据
    loadCategoryTree();
  }, []);

  const loadCategoryTree = async() => {
    // key是服务端要求写死的
    const res = await selectionTreeByKey({ key: 'MDFL' });
    setCategoryTree(res);
  };

  const operateList: any = useMemo(() => {
    const list = refactorPermissions(operateExtra);
    return list.map((item) => {
      const res: any = {
        name: item.text,
        event: item.event,
        func: item.func,
        type: item.isBatch ? 'default' : 'primary',
      };
      return res;
    });
  }, [operateExtra]);

  const { ...methods } = useMethods({
    onSearch: (values: any) => {
      setParams({ ...params, ...values });
    },
    loadData: async (params:any) => {
      const data = await getBrandList(params);
      if (!operateList.length) {
        setOperateExtra(data?.meta?.permissions || []);
      }
      return {
        dataSource: data.objectList || [],
        count: data.totalNum || 0,
      };
    },
    handleCreateBrand: () => {
      setModalData({ visible: true, id: '' });
    }
  });

  const onSelect = (selectedKeys: number | string[]) => {
    methods.onSearch({ categoryEncode: selectedKeys[0] });
  };

  return (
    <div className={styles.container}>
      <LeftTree treeData={categoryTree} onSelect={onSelect} />

      <div className={styles.content}>
        {/* 搜索框 已完成 */}
        <Filter onSearch={methods.onSearch} />
        <div className={styles.tableWrap}>
          {/* 按钮 */}
          <Operate operateList={operateList} onClick={(btn) => methods[btn.func](params)} />

          <TableInfo
            onSearch={methods.onSearch}
            params={params}
            setModalData={setModalData}
            loadData={methods.loadData}
          />
        </div>
      </div>
      <EditModal
        // categoryEncode={params}
        // showModal={showModal}
        categoryEncode={params?.categoryEncode}
        modalData={modalData}
        setModalData={setModalData}
        onSuccess={() => methods.onSearch({})}/>
    </div>
  );
};

export default Poi;
