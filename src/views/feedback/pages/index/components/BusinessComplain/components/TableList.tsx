import { FC } from 'react';
import V2Table from '@/common/components/Data/V2Table';
import { useMethods } from '@lhb/hook';
import { deepCopy } from '@lhb/func';
import { StatusColor } from 'src/views/feedback/pages/index/ts-config';
import { Badge, Typography } from 'antd';
import { post } from '@/common/request';
import { getKeysFromObjectArray, parseArrayToString } from '@lhb/func';
import dayjs from 'dayjs';
import V2DetailItem from '@/common/components/Feedback/V2DetailItem';
import V2DetailGroup from '@/common/components/Feedback/V2DetailItem/Group';
import { QiniuImageUrl } from '@/common/utils/qiniu';
import styles from 'src/views/feedback/pages/index/entry.module.less';
import { replaceEmpty } from '@lhb/func';
import V2Operate from '@/common/components/Others/V2Operate';
import { UrlSuffix } from '@/common/enums/qiniu';

// 渲染状态
export const renderStatus = (value, record) => {
  const color = StatusColor[record.status] || StatusColor['default'];
  return <Badge color={color} text={value} />;
};

// 渲染截图
export const renderPictures = (value, isOriginalPicture = false) => {
  if (!Array.isArray(value) || !value.length) {
    return '';
  }
  const pics = value.map(item => ({ name: item.name, url: isOriginalPicture ? item.url + UrlSuffix.locationOri : QiniuImageUrl(item.url) }));
  const tooltipContent = () => {
    return <V2DetailGroup moduleType='easy'>
      <V2DetailItem type='images' assets={pics}></V2DetailItem>
    </V2DetailGroup>;
  };
  return <Typography.Paragraph ellipsis={{ tooltip: { title: tooltipContent, color: '#FFFFFF' } }} style={{ marginBottom: '4px', width: '180px' }} >
    <div className={styles.pictures}>
      {pics.map((item, index) => (
        <V2DetailGroup moduleType='easy'>
          <V2DetailItem type='images' assets={[item]} key={index}></V2DetailItem>
        </V2DetailGroup>
      ))}
    </div>
  </Typography.Paragraph>;
};

// 渲染内容
export const renderRemark = (value) => {
  return <Typography.Text
    ellipsis={{ tooltip: <pre className={styles.pretext}>{replaceEmpty(value)}</pre> }}
    style={{ maxWidth: '100%' }}
  >
    <span>{replaceEmpty(value)}</span>
  </Typography.Text>;
};

// 业务投诉 列表
const DemandManagementTable: FC<{
  params: any,
  tableRef: any,
  mainHeight?: any,
  setUnDoNum?: any,
  onOperate: Function,
}> = ({
  params,
  tableRef,
  mainHeight,
  setUnDoNum,
  onOperate
}) => {
  /* methods */
  const methods = useMethods({
    async fetchData(_params) {
      const params = deepCopy(_params);
      if (Array.isArray(params.dates) && params.dates.length) {
        params.start = params.dates[0] ? dayjs(params.dates[0]).format('YYYY-MM-DD') : null;
        params.end = params.dates[params.dates.length - 1] ? dayjs(params.dates[params.dates.length - 1]).format('YYYY-MM-DD') : null;
      }
      const { objectList = [], totalNum = 0, meta = {} } = await methods.getList(params);
      setUnDoNum(meta?.undoNum);
      return {
        dataSource: objectList,
        count: totalNum
      };
    },
    // 获取业务投诉列表
    getList(params) {
      return new Promise((resolve, reject) => {
        // https://yapi.lanhanba.com/project/307/interface/api/60591
        post('/saas/advice/pageList', params, { proxyApi: '/lcn-api' }).then((res) => {
          resolve(res);
        }).catch(err => {
          console.log(err);
          reject({});
        });
      });
    },
  });
  // 接口获取columns
  const defaultColumns = [
    { title: '编号', key: 'number', dragChecked: true, width: '160px' },
    { title: '提交人', key: 'creatorName', dragChecked: true, width: '140px' },
    { title: '提交时间', key: 'gmtCreate', dragChecked: true, width: '220px' },
    { title: '定位', key: 'position', dragChecked: true, width: '120px' },
    { title: '常见问题', key: 'detailTypeVOList', width: '220px', dragChecked: true, staticTooltipTitle: (value) => <><span>{parseArrayToString(getKeysFromObjectArray(value, 'name'), '、')}</span></>, render: (value) => <><span>{parseArrayToString(getKeysFromObjectArray(value, 'name'), '、')}</span></> },
    { title: '内容', key: 'remark', width: '220px', dragChecked: true, render: (value) => renderRemark(value) },
    { title: '状态', key: 'resultName', dragChecked: true, dragDisabled: true, width: '100px', render: (value, record) => renderStatus(value, record) },
    { title: '截图', key: 'pictures', width: '220px', dragChecked: true, noTooltip: true, render: (value) => renderPictures(value) },
    { title: '被投诉对象', key: 'targetName', width: '220px', dragChecked: true },
    { title: '处理人', key: 'handlePersonName', width: '120px', dragChecked: true },
    { title: '操作', key: 'permissions', width: '160px', fixed: 'right', dragChecked: true, render: (value, record) => {
      const permission = value?.map(item => ({
        name: item.name,
        event: item.encode
      }));
      return <V2Operate operateList={permission} onClick={(btn: any) => onOperate(btn.event, record)} />;
    }
    },
  ];
  return (
    <>
      <V2Table
        ref={tableRef}
        defaultColumns={defaultColumns}
        onFetch={methods.fetchData}
        filters={params}
        rowKey='id'
        // 勿删! 64：分页模块总大小、48分页模块减去paddingBottom的值、42是table头部
        scroll={{ y: mainHeight - 64 - 42 }}
      />
    </>
  );
};

export default DemandManagementTable;
