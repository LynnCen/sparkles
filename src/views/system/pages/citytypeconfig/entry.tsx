/**
 * @Description 城市类型配置
 */
import { FC, useEffect, useState } from 'react';
import styles from './entry.module.less';
import { useMethods } from '@lhb/hook';
import V2Container from '@/common/components/Data/V2Container';
import Search from './components/Search';
import { OperateButtonProps } from '@/common/components/Others/V2Operate';
import TableList from './components/TableList';
import ImportModal from './components/Modal/ImportModal';
import ConfigModal from './components/Modal/ConfigModal';
import { getCityCongigTypes, postCityConfigList } from '@/common/api/system';
import { CityTypes } from './ts-config';
import { processPoids } from '@/common/utils/ways';
import { isArray } from '@lhb/func';
import { v4 } from 'uuid';

const CityTypeConfig: FC<any> = () => {

  const [filters, setFilters] = useState<{ [x: string]: any }>({}); // 查询条件
  const [permissions, setPermissions] = useState<OperateButtonProps[]>([]); // 搜索表单操作权限
  const [mainHeight, setMainHeight] = useState<number>(0);
  const [fields, setFields] = useState<CityTypes[]>([]); // 城市类型字段
  const [importModalShow, setImportModalShow] = useState<boolean>(false); // 导入弹窗可见
  const [configModalShow, setConfigModalShow] = useState<boolean>(false); // 配置区域类型弹窗

  useEffect(() => {
    getFields();
  }, []);

  const methods = useMethods({
    /**
     * @description 搜索 TODO:
     */
    onSearch(values: { [x: string]: string }) {
      setFilters(values);
    },

    /**
     * @description 重新加载
     */
    reload() {
      setFilters({ ...filters });
    },

    /**
     * @description 加载表格数据
     */
    async loadData(value) {
      const { pcdIds } = filters || {};
      let params = { ...filters, ...value };

      if (isArray(pcdIds) && pcdIds.length) {
        const [firstLevelCityIds, secondLevelCityIds, thirdLevelCityIds] = processPoids(pcdIds, 1);
        params = { ...params, firstLevelCityIds, secondLevelCityIds, thirdLevelCityIds, pcdIds: undefined };
      }

      const { objectList, totalNum, meta } = await postCityConfigList(params);
      meta?.permissions && setPermissions(meta.permissions);

      return { dataSource: objectList, count: totalNum };
    }


  });
  const getFields = async () => {
    const res = await getCityCongigTypes();
    const fieldArr = res.map((field) => ({ ...field, id: v4() }));
    setFields(fieldArr);
  };

  return (
    <>
      <V2Container
        className={styles.container}
        style={{ height: 'calc(100vh - 48px - 40px)' }}
        emitMainHeight={h => setMainHeight(h)}
        extraContent={{
          top: (
            <Search
              onSearch={methods.onSearch}
              permissions={permissions}
              options={fields}
              setImportModalShow={setImportModalShow}
              setConfigModalShow={setConfigModalShow}
            />
          ),
        }}
      >
        <TableList
          filters={filters}
          mainHeight={mainHeight}
          onFetch={methods.loadData}
          reload={methods.reload}
        />
      </V2Container>

      {importModalShow && (
        <ImportModal
          visible={importModalShow}
          setVisible={setImportModalShow}
          refresh={() => setFilters({})}
        />
      )}
      {configModalShow && (
        <ConfigModal
          visible={configModalShow}
          setVisible={setConfigModalShow}
          refresh={() => { getFields(); }}
          data={fields}
        />
      )}
    </>
  );
};

export default CityTypeConfig;
