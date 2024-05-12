import { FC, useEffect, useRef, useState } from 'react';
import styles from './entry.module.less';
import { Form, Modal } from 'antd';
import Search from './components/Search';
import TableList from './components/TableList';
import { useMethods } from '@lhb/hook';
import { KeepAlive, useActivate } from 'react-activation';
// import SearchTableContainer from '@/common/components/SearchTableContainer';
import { isMobile, matchQuery } from '@lhb/func';
import V2Container from '@/common/components/Data/V2Container';

const PassengerFlow: FC<any> = () => {
  const urlShopName = matchQuery(location.search, 'shopName');
  const tableRef: any = useRef();
  const [searchForm] = Form.useForm();
  const [params, setParams] = useState({});
  const [permissions, setPermissions] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
  const [errorCount, setErrorCount] = useState<number>(0);

  useEffect(() => {
    if (urlShopName) {
      if (isMobile()) {
        Modal.warning({
          title: '温馨提醒',
          content: '请在PC端查看',
        });
      }
      searchForm.setFieldsValue({ name: urlShopName });
      setParams({
        ...params,
        name: urlShopName
      });
    }
  }, [urlShopName]);

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
  useActivate(() => {
    // 编辑和删除等会改变列内容的操作，返回时需要携带
    // example: dispatchNavigate('/passengerFlow?reset=1')
    const reset = matchQuery(window.location.href, 'reset');
    if (reset) { // 建议在编辑或者删除时使用
      tableRef.current.onload(true); // 使用当前page，不会把page页码变成1
    } else {
      methods.onSearch(); // 会把page页码变成1，size变成默认的页面展示条数
    }
  });
  return (
    <div className={styles.container}>
      <V2Container
        style={{ height: 'calc(100vh - 100px)' }}
        extraContent={{
          top: <>
            <div className={styles.title}>门店管理</div>
            <div style={{ display: selectedRowKeys?.length ? 'none' : 'block' }}>
              <Search onSearch={methods.onSearch} searchForm={searchForm} permissions={permissions}/>
              {
                errorCount && !selectedRowKeys?.length ? <div className={styles.tableListTotal}>共有异常门店<span style={{ color: '#F23030', fontWeight: 'bold' }}>{errorCount}</span>个</div> : <></>
              }
            </div>
          </>,
        }}>
        <TableList
          tableRef={tableRef}
          params={params}
          selectedRowKeys={selectedRowKeys}
          setSelectedRowKeys={setSelectedRowKeys}
          setErrorCount={setErrorCount}
          permissions={permissions}
          setPermissions={setPermissions}/>
      </V2Container>
    </div>
  );
};
export default ({ location }) => (
  <KeepAlive saveScrollPosition='screen' name={location.pathname}>
    <PassengerFlow/>
  </KeepAlive>
);
