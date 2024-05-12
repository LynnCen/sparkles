/**
 * 开发部绩效报表
 */
import Filter from './components/Filter';
import cs from 'classnames';
import styles from './entry.module.less';
import { useEffect, useState } from 'react';
import V2Container from '@/common/components/Data/V2Container';
import DevDptKPIReportTable from './components/DevDptKPIReportTable';
import { urlParams } from '@lhb/func';
import { Form } from 'antd';
import dayjs from 'dayjs';

const DevDptKPIReport = () => {
  const {
    start,
    end
  } = JSON.parse(decodeURI(urlParams(location.search)?.params || null)) || {};
  const [searchForm] = Form.useForm();
  const [mainHeight, setMainHeight] = useState<number>(0);
  const [params, setParams] = useState<any>({});
  const onSearch = (values: any) => {
    setParams({ ...values });
  };

  useEffect(() => {
    setParams({
      start: start || dayjs().startOf('year').format('YYYY-MM-DD'),
      end: end || dayjs().endOf('year').format('YYYY-MM-DD'),
    });
    searchForm.setFieldsValue({
      time: [dayjs(start) || dayjs().startOf('year'), dayjs(end) || dayjs().endOf('year')]
    });
  }, []);


  return (
    <V2Container
      className={cs(styles.container, 'bg-fff', 'pd-20')}
      style={{ height: 'calc(100vh - 84px)' }}
      emitMainHeight={(h) => setMainHeight(h)}
      extraContent={{
        top: <Filter onSearch={onSearch} searchForm={searchForm}/>,
      }}
    >

      <DevDptKPIReportTable mainHeight={mainHeight} filters={params}/>
    </V2Container>
  );
};

export default DevDptKPIReport;
