// 基本信息
import { FC, useState, useRef, useEffect } from 'react';
import V2Container from '@/common/components/Data/V2Container';
import Search from './components/Search';
import TableList from './components/TableList';
import styles from '../../entry.module.less';
import { Form } from 'antd';
import { useMethods } from '@lhb/hook';
import { post } from '@/common/request';
import { refactorSelection } from '@lhb/func';

const Component:FC<any> = ({ mainHeight }) => {
  const [searchForm] = Form.useForm();
  const [params, setParams] = useState({});
  const tableRef: any = useRef();
  const [status, setStatus] = useState(1);
  const [openStatusOptions, setOpenStatusOptions] = useState<any[]>([]);
  const methods = useMethods({
    onSearch(data = {}) {
      // 为了让查询动态化
      const _params = searchForm.getFieldsValue();
      if (_params.tab === 4 && !_params.statuses) {
        _params.statuses = [2, 3];
      } else if (_params.tab === 1) {
        _params.statuses = [1, 4];
      }
      setParams(state => ({ ...state, ...data, ..._params, }));
    },
  });
  useEffect(() => {
    post('/common/selection/openStatus', {}, {
      needHint: true,
      proxyApi: '/zhizu-api'
    }).then((res) => {
      setOpenStatusOptions(refactorSelection(res));
    });
  }, []);

  return (<div className={styles.container}>
    <V2Container
      style={{ height: mainHeight }}
      extraContent={{
        top: <Search openStatusOptions={openStatusOptions} onSearch={methods.onSearch} searchForm={searchForm} status={status} setStatus={setStatus}/>
      }}>
      <TableList openStatusOptions={openStatusOptions} tableRef={tableRef} params={params} status={status}></TableList>
    </V2Container>
  </div>);
};

export default Component;
