/**
 * @Description 即插即踩列表
 */
import { FC } from 'react';
import styles from '../../entry.module.less';
import cs from 'classnames';
import V2Table from '@/common/components/Data/V2Table';
import { useMethods } from '@lhb/hook';
import { get } from '@/common/request';
import { Image } from 'antd';
import { getQiniuFilePreviewUrl } from '@/common/utils/qiniu';
const PlugCollectionTable: FC<any> = ({ params, tableRef, mainHeight }) => {

  /* methods */
  const methods = useMethods({
    async fetchData(_params) {
      const { objectList = [], totalNum = 0 } = await get('/checkSpotDevice/task/page', _params, { proxyApi: '/blaster' });
      return {
        dataSource: objectList,
        count: totalNum
      };
    },

  });

  // 接口获取columns
  const defaultColumns = [
    { title: '任务id', key: 'id', width: 110, dragChecked: true, dragDisabled: true, fixed: 'left' },
    { title: '点位名称', key: 'spot', dragChecked: true },
    { title: 'Location设备码', key: 'serialNum', dragChecked: true },
    { title: '租户名称', key: 'tenantName', dragChecked: true },
    { title: '账号', key: 'creator', dragChecked: true },
    { title: '开始时间', key: 'start', dragChecked: true },
    { title: '结束时间', key: 'end', dragChecked: true },
    { title: '拍摄时长', key: 'duration', dragChecked: true, render: (value) => {
      const minute = Number(value);
      return `${Math.floor(minute / 60)}小时${minute % 60}分钟`;
    } },
    { title: 'POI点位名称', key: 'address', dragChecked: true },
    { title: '画框图片', key: 'picUrl', dragChecked: true, render: (value) => {
      return value ? <Image height={22} width={22} src={getQiniuFilePreviewUrl(value)} /> : '-';
    } },
    { title: '分析状态', key: 'anaStatusName', width: 110, dragChecked: true, dragDisabled: true, fixed: 'right' },
  ];
  return (
    <>
      <V2Table
        ref={tableRef}
        defaultColumns={defaultColumns}
        tableSortModule='passengerFlowPlugCollectionTableList'
        onFetch={methods.fetchData}
        filters={params}
        className={cs(styles.tableList)}
        rowKey='id'
        // 勿删! 64：分页模块总大小、48分页模块减去paddingBottom的值、42是table头部
        scroll={{ y: mainHeight - 64 - 42 }}
        useResizable
      />
    </>
  );
};

export default PlugCollectionTable;
