import { FC, forwardRef, useImperativeHandle, useRef } from 'react';
import V2Table from '@/common/components/Data/V2Table';
import { useMethods } from '@lhb/hook';
import { Typography, Tooltip } from 'antd';
import styles from './index.module.less';
import V2DetailItem from '@/common/components/Feedback/V2DetailItem';
import BrandTag from '../BrandTag/index';
import { brandList } from '@/common/api/brand-center';
import V2DetailGroup from '@/common/components/Feedback/V2DetailItem/Group';

const { Text } = Typography;

/*
  品牌库列表
*/
interface TableListProps {
  params: any;
  mainHeight?: any;
  openDetail?: Function; // 打开详情
  setPermissions?: Function;
  ref: any;
}

const TableList: FC<TableListProps> = forwardRef(({
  params,
  mainHeight, // 从V2Container透传过来的，必须挂到scroll上
  openDetail,
  setPermissions,
}, ref) => {
  const tableRef = useRef<any>();
  useImperativeHandle(ref, () => ({
    onload: () => {
      tableRef.current.onload(true);
    },
  }));

  const methods = useMethods({
    async onFetch(_params: any) {
      const { objectList, totalNum, meta } = await brandList(_params);
      setPermissions?.((meta && meta.permissions) ? meta.permissions : []);
      return {
        dataSource: objectList,
        count: totalNum,
      };
    },
    getIndustryNames(objectItem) {
      let industryNames = '';
      let isToolTipShow = false;
      // 生成包含所有的产业的字符串
      if (objectItem?.industryList) {
        objectItem.industryList.forEach((item, index) => {
          if (item.oneIndustryName) {
            industryNames += item.oneIndustryName;
            industryNames += ' > ';
          }
          if (item.twoIndustryName) {
            industryNames += item.twoIndustryName;
            item.threeIndustryName ? industryNames += ' > ' : '';
          }
          if (item.threeIndustryName) {
            industryNames += item.threeIndustryName;
          }
          if (index + 1 !== objectItem.industryList.length) {
            industryNames += '、';
          }
        });
        // 控制所属产业悬浮提示是否开启
        if (objectItem.industryList.length >= 2) {
          isToolTipShow = true;
        } else {
          isToolTipShow = false;
        }
        return <V2DetailGroup direction='horizontal' labelLength={-1}>
          <Tooltip
            trigger={isToolTipShow ? 'hover' : 'contextMenu'}
            placement='top'
            zIndex={10}
            title={industryNames.replace(/、/g, '\n')}
            overlayInnerStyle={{ whiteSpace: 'pre-line' }}
            arrowPointAtCenter={true} >
            <V2DetailItem
              rows={1}
              value={industryNames}
              valueStyle={{ marginTop: '-16px' }}
              tooltipConfig={{
                overlayInnerStyle: { display: 'none' },
                overlayStyle: { display: 'none' },
              }}
              className={styles.industryNameTest}
            />
          </Tooltip>
        </V2DetailGroup>;
      } else {
        return '-';
      }
    },
  });

  const defaultColumns = [
    { key: 'name', title: '品牌名称', dragChecked: true, dragDisabled: true, fixed: 'left', render: (_, item) => (
      <span style={{ color: '#006AFF' }} onClick={() => openDetail?.(item.id)}>
        {item.name}
      </span>
    ) },
    { key: 'id', title: '品牌ID', dragChecked: true, dragDisabled: true, fixed: 'left', render: (text) => {
      return <Text copyable={{ text }}>{text}</Text>;
    } },
    { key: 'levelAndLabel', title: '品牌标签', dragChecked: true, render: (_, item) => {
      const { label, level } = item;
      const arr: any = [];
      if (level && level.includes('[')) {
        JSON.parse(level).forEach((lvl, idx) => {
          arr.push(<BrandTag key={`lvl_${idx}`} levelName={lvl} className='mr-5' isLevel/>);
        });
      }
      if (label && label.includes('[')) {
        JSON.parse(label).forEach((lbl, idx) => {
          arr.push(<BrandTag key={`lbl_${idx}`} levelName={lbl} className='mr-5'/>);
        });
      }
      return arr.length ? <>{arr}</> : '-';
    } },
    { key: 'industryShowName', title: '所属行业', width: 300, dragChecked: true, render: (_, item) => methods.getIndustryNames(item)
    },
    { key: 'typeName', title: '品牌类型', dragChecked: true },
    { key: 'brandEstablishTime', title: '品牌创立时间', dragChecked: true, sorter: (a, b) => {
      return +new Date(parseInt(a.brandEstablishTime + '') + '') - (+new Date(parseInt(b.brandEstablishTime + '') + ''));
    }, render: (text) => text ? (
      text.indexOf('年') > -1 ? text : text + '年'
    ) : '-' },
    { key: 'companyName', title: '所属公司', dragChecked: true, render: (text) => text || '-' },
    { key: 'cityName', title: '品牌发源地', dragChecked: true, render: (text) => text || '-' },
    { key: 'shopCount', title: '门店数量', dragChecked: true, render: (text) => text || '-' },
    // { key: 'channel', title: '来源渠道', dragChecked: true, render: (text) => text || '-' },
    // const levelNames = detail && detail.level ? JSON.parse(detail.level) : [];
  ];

  return (
    <V2Table
      ref={tableRef}
      filters={params}
      rowKey='id'
      // 勿删! 64：分页模块总大小、52:分页模块减去paddingBottom的值、42:table头部
      scroll={{ y: mainHeight - 64 - 42 }}
      defaultColumns={defaultColumns}
      tableSortModule='brandCenterBrandList'
      onFetch={methods.onFetch}
    />
  );
});

export default TableList;
