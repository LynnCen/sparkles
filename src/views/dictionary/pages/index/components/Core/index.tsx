import React, { useEffect, useState } from 'react'; // useRef
import {
  dictionaryDataList
} from '../../api';
import { DictionaryDataQuery, DictionaryDataListItem } from '../../ts-config';
import { Permission } from '@/common/components/Operate/ts-config';
import { useMethods } from '@lhb/hook';
import styles from '../../entry.module.less';
// import Search from './components/Search';
import Table from './components/Table';

const Core: React.FC<{ dictionaryId: number }> = ({ dictionaryId }) => {
  // const [state, setState] = useState<>();
  const [listData, setListData] = useState<DictionaryDataListItem[]>([]);
  const [mainPermissions, setMainPermissions] = useState<Permission[]>([]);
  // const searchRef = useRef();

  // methods
  const { loadData } = useMethods({
    // keyword?: string
    loadData: async () => {
      const params: DictionaryDataQuery = {
        dictionaryId
      };
      // if (typeof (keyword) === 'string') {
      //   params.keyword = keyword;
      // }
      const { objectList = [], meta: { permissions = [] } } = await dictionaryDataList(params);
      setListData(objectList);
      setMainPermissions(permissions);
    },
    // resetSearchForm: () => {
    //   (searchRef as any).current.resetFormFields(false);
    // },
    // keywordChange: (fieldsValue: DictionaryDataQuery) => {
    //   // 左侧字典分类没数据时
    //   if (!dictionaryId) return;
    //   const { keyword } = fieldsValue;
    //   loadData(keyword);
    // }
  });

  // watch
  useEffect(() => {
    if (dictionaryId) {
      // resetSearchForm();
      loadData();
    }
    // eslint-disable-next-line
  }, [dictionaryId]);

  return (
    <div className={styles.coreSection}>
      {/* <Search change={keywordChange} searchRef={searchRef}/> */}
      <Table
        listData={listData}
        loadData={loadData}
        mainBtnPermissions={mainPermissions}
        dictionaryId={dictionaryId}/>
    </div>
  );
};

export default Core;
