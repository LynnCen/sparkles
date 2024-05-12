import { FC } from 'react';
import V2Table from '@/common/components/Data/V2Table';
import { useMethods } from '@lhb/hook';
import { deepCopy } from '@lhb/func';
import { post } from '@/common/request';
import dayjs from 'dayjs';
import { renderStatus, renderPictures, renderRemark } from 'src/views/feedback/pages/index/components/BusinessComplain/components/TableList';
import V2Operate from '@/common/components/Others/V2Operate';

// 资源纠错 列表
const DemandManagementTable: FC<{
  params: any,
  tableRef: any,
  mainHeight?: any,
  setUnDoNum?: any,
  onOperate:Function
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
      if (params.dates) {
        params.start = params.dates[0] ? dayjs(params.dates[0]).format('YYYY-MM-DD') : null;
        params.end = params.dates[params.dates.length - 1] ? dayjs(params.dates[1]).format('YYYY-MM-DD') : null;
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
    }
  });

  // 接口获取columns
  const defaultColumns = [
    { title: '编号', key: 'number', dragChecked: true, width: '160px' },
    { title: '提交人', key: 'creatorName', dragChecked: true, width: '140px' },
    { title: '提交时间', key: 'gmtCreate', dragChecked: true, width: '220px' },
    { title: '定位', key: 'position', dragChecked: true, width: '120px' },
    { title: '内容', key: 'remark', width: '220px', dragChecked: true, render: (value) => renderRemark(value) },
    { title: '状态', key: 'resultName', dragChecked: true, dragDisabled: true, width: '100px', render: (value, record) => renderStatus(value, record) },
    { title: '截图', key: 'pictures', width: '220px', dragChecked: true, noTooltip: true, render: (value) => renderPictures(value) },
    { title: '处理人', key: 'handlePersonName', width: '120px', dragChecked: true },
    { title: '操作', key: 'permissions', width: '160px', fixed: 'right', dragChecked: true, render: (value, record) => {
      const permission = value?.map(item => ({
        name: item.name,
        event: item.encode
      }));
      return <V2Operate operateList={permission} onClick={(btn: any) => onOperate(btn.event, record)} />;
    }
    }
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
