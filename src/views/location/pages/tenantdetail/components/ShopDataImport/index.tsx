import { FC, useState } from 'react';
import { Button } from 'antd';
import ShopDataImportModal from './Modal/ShopDataImportModal';
import { shopDataImportRecord } from '@/common/api/location';
import V2Table from '@/common/components/Data/V2Table';
import V2Container from '@/common/components/Data/V2Container';
import V2Operate from '@/common/components/Others/V2Operate';
import { downloadFile, refactorPermissions } from '@lhb/func';
import { useMethods } from '@lhb/hook';

const ShopDataImport: FC<any> = ({ tenantId }) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<number>(0);
  const [mainHeight, setMainHeight] = useState<number>(0);
  const [filters, setFilters] = useState<any>({});
  const onImport = () => {
    setVisible(true);
  };

  const onFetch = async () => {
    const params = {
      tenantId
    };
    const { objectList, totalNum } = await shopDataImportRecord(params);
    return {
      dataSource: objectList,
      count: totalNum,
    };
  };

  const onRefresh = () => {
    setRefresh(refresh + 1);
    setFilters({ ...filters });
  };

  const closeHandle = () => {
    setVisible(false);
  };

  const confirmHandle = () => {
    setVisible(false);
    onRefresh();
  };

  const methods = useMethods({
    handleDownload(item) {
      downloadFile({
        name: item.name,
        url: `${item.url}?attname=${item.name}`
      });
    },
  });

  const defaultColumns: any[] = [
    { key: 'id', width: 80, title: '序号', dragChecked: true, dragDisabled: false },
    { key: 'name', title: '文件名称', dragChecked: true, dragDisabled: false, width: 400 },
    { key: 'createTime', title: '导入时间', dragChecked: true, dragDisabled: false },
    { key: 'permission', title: '操作', dragChecked: true, dragDisabled: false, render: (_:any, record:any) => <V2Operate
      operateList={refactorPermissions([
        {
          name: '下载', // 必填
          event: 'download', // 必填
          // type: 'primary', //  非必填，默认为link
          func: 'handleDownload',
        },
      ])}
      onClick={(btns: { func: string | number }) => methods[btns.func](record)}/> },
  ];

  return (
    <div>
      <V2Container
        emitMainHeight={(h) => setMainHeight(h)}
        style={{ height: 'calc(100vh - 88px)' }}
        extraContent={{
          top: <>
            <Button onClick={onImport} className='mr-12' type='primary'>
          导入门店数据
            </Button>
          </>
        }}>
        <V2Table
          className='mt-20'
          rowKey='id'
          filters={filters}
          // 勿删! 64：分页模块总大小、52:分页模块减去paddingBottom的值、42:table头部
          scroll={{ y: mainHeight - 64 - 48 }}
          defaultColumns={defaultColumns}
          onFetch={onFetch}
        />
      </V2Container>
      <ShopDataImportModal visible={visible} closeHandle={closeHandle} confirmHandle={confirmHandle} tenantId={tenantId}/>
    </div>
  );
};

export default ShopDataImport;
