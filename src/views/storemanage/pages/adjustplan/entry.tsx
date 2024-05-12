/**
 * @Description 拓店管理计划调整 - 1012
 */
import { getStorePlan, getTemplateExcelUrl, importStorePlan } from '@/common/api/storemanage';
import V2Table from '@/common/components/Data/V2Table';
import styles from './entry.module.less';
import { FC, useEffect, useState } from 'react';
import { Button, Divider } from 'antd';
import V2Container from '@/common/components/Data/V2Container';
import { downloadFile } from '@lhb/func';
import V2ImportModal from '@/common/components/business/V2ImportModal';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import PageTitle from '@/common/components/business/PageTitle';
const Adjustplan:FC<any> = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [url, setUrl] = useState<any>(null);
  const [mainHeight, setMainHeight] = useState<number>(0);
  const [params, setParams] = useState<any>(null);
  const defaultColumns = [
    {
      key: 'createTime',
      title: '导入日期',
      dragChecked: true,
    },
    {
      key: 'name',
      title: '文件名称',
      dragChecked: true,
    },
    {
      key: 'operate',
      title: '操作',
      width: 100,
      dragChecked: true,
      render: (val, record) => <span className='c-006 pointer' onClick={() => { handleDownload(record); }}>下载</span>
    },
  ];

  const loadData = async(params) => {
    const { data, meta } = await getStorePlan(params);
    return {
      dataSource: data,
      count: meta.total
    };
  };

  const handleDownload = (record) => {
    downloadFile({
      url: record?.url,
      name: record?.name
    });
  };
  const handleImport = () => {
    setVisible(true);
  };
  const customUploadFetch = async(values, callbackFn) => {
    const target = values?.url?.[0];
    if (!target) return;
    const { url, name } = target;
    const urlStr = `${url}?attname=${name}`;
    const params = { url: urlStr, name };
    try {
      const result = await importStorePlan(params);
      if (!result) {
        V2Message.warning('导入失败');
        callbackFn({ isError: true });
      } else {
        // 得执行下回调才能触发后续的onCancel关闭弹窗
        callbackFn({});
      }
    } catch (e) {
      callbackFn({ isError: true });
    }
  };
  const getTemplateExcel = async() => {
    const data = await getTemplateExcelUrl();
    setUrl(data);
  };
  useEffect(() => {
    getTemplateExcel();
  }, []);
  return <div className={styles.container}>

    <V2Container
      style={{ height: 'calc(100vh - 120px)' }}
      emitMainHeight={(h) => setMainHeight(h)}
      extraContent={{
        top: <>
          <PageTitle content='导入拓店计划' extra={<Button
            className='mb-20'
            type='primary'
            onClick={() => { handleImport(); }}
          > 导入拓店计划</Button>}/>

          <Divider style={{
            marginTop: 0,
            marginBottom: 8
          }}/>
        </>
      } }
    >
      <V2Table
        filters={params}
        rowKey='id'
        defaultColumns={defaultColumns}
        onFetch={loadData}
        pageSize={10}
        scroll={{ y: mainHeight - 56 - 50 }}
        paginationConfig={{
          pageSizeOptions: [10, 20, 50, 100],
        }}
        hideColumnPlaceholder
      />
    </V2Container>
    <V2ImportModal
      isOpen={visible}
      closeModal={() => { setVisible(false); setParams({}); }}
      title='导入拓店计划'
      templateAssets={[
        {
          url,
          name: '开店计划导入模版.xlsx',
        },
      ]}
      customUploadFetch={(values, callbackFn) => customUploadFetch(values, callbackFn)}
    />
  </div>;
};
export default Adjustplan;
