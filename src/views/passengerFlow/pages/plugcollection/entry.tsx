import { FC, useRef, useState } from 'react';
import styles from './entry.module.less';
import { Form } from 'antd';
import Search from './components/Search';
import TableList from './components/TableList';
import { useMethods } from '@lhb/hook';
import V2Container from '@/common/components/Data/V2Container';

const PlugCollection: FC<any> = () => {
  const tableRef: any = useRef();
  const [searchForm] = Form.useForm();
  const [params, setParams] = useState({});

  const methods = useMethods({
    onSearch(data = {}) {
      // 为了让查询动态化
      const _params = searchForm.getFieldsValue();
      setParams({
        ..._params,
        ...data,
      });
    }
  });
  return (
    <div className={styles.container}>
      <V2Container
        style={{ height: 'calc(100vh - 100px)' }}
        extraContent={{
          top: <Search onSearch={methods.onSearch} searchForm={searchForm}/>,
        }}>
        <TableList
          tableRef={tableRef}
          params={params}/>
      </V2Container>
    </div>
  );
};
export default PlugCollection;
