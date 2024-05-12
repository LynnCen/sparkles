/**
 * @Description 选择视频应用弹窗
 */

import { Button, Radio, RadioChangeEvent } from 'antd';
import { FC, Key, useState } from 'react';
import { useMethods } from '@lhb/hook';

import { passengerCheckPointsApply, videoListData } from '@/common/api/footprinting';
import V2Table from '@/common/components/Data/V2Table';
import Modal from '@/common/components/Modal/Modal';
import { floorKeep } from '@lhb/func';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import AnalysisImage from '../AnalysisImage';

import styles from './index.module.less';

export interface SelectVideoModalDataProps{
  visible:boolean;
  /** 当前任务 id */
  projectId:string|number;
  /** 当前编辑视频 id */
  currentId: string|number,
  /** 视频点位(过店) */
  outdoorPoints: any[],
  /** 视频点位(进店) */
  indoorPoints: any[],
}

interface SelectVideoModalProps{
  modalData: SelectVideoModalDataProps;
  setModalData:Function;
  onRefresh?:Function;
}

const SelectVideoModal:FC<SelectVideoModalProps> = ({
  modalData,
  setModalData,
  onRefresh = () => {}
}) => {
  // const [listData, setListData] = useState<Array<any>>([]); // 视频列表数据
  const [drawTypeData, setDrawTypeData] = useState<any>({
    type: 1,
    nonCheckPointsCount: 0, // 未绘制画框数量
    hasCheckPointsCount: 0, // 已绘制画框数量
  }); // tabs绘制类型
  const [filters, setFilters] = useState<{ [x: string]: string }>({});
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);


  const options = [
    {
      value: 1,
      label: `全部`,
    },
    {
      value: 2,
      label: `待绘制(${drawTypeData.nonCheckPointsCount})`,
    },
    {
      value: 3,
      label: `已绘制(${drawTypeData.hasCheckPointsCount})`,
    },
  ];

  /* table header配模块 */
  const defaultColumns = [
    { key: 'number', title: '视频名称', dragDisabled: true, render: (text) => {
      return <span >视频{text}</span>;
    } },
    { key: 'startTime', title: '视频时间', width: 260, render: (_, row) => {
      return <span >{row.startTime} 至 {row.endTime}</span>;
    } },
    { key: 'url', title: '视频', whiteTooltip: true, render: (text) => {
      return <video
        src={text}
        width='100%'
        height='140px'
        controls
        crossOrigin='anonymous' />;
    } },
    { key: 'imageUrl', title: '分析区域', render: (text, info) => {
      return info.hasCheckPoints ? <div className={styles.videoAndImage}>
        <AnalysisImage info={info} />
      </div> : <span>-</span>;
    } },
  ];


  const methods = useMethods({
    async getList(params:any) {
      let hasCheckPoints:boolean|null = null;
      switch (drawTypeData.type) {
        case 1:
          hasCheckPoints = null;
          break;
        case 2:
          hasCheckPoints = false;
          break;
        case 3:
          hasCheckPoints = true;
          break;

        default:
          hasCheckPoints = null;
          break;
      }
      const _params = {
        ...modalData,
        ...params,
        id: modalData.projectId,
        hasCheckPoints
      };
      const { data, meta } = await videoListData(_params);

      // 刚刚绘制完的数据需要在列表过滤，所以已绘制数量需要-1
      const _hasCheckPointsCount = meta.data.hasCheckPointsCount > 0 ? floorKeep(meta.data.hasCheckPointsCount, 1, 1, 0) : 0;
      setDrawTypeData({
        ...drawTypeData,
        nonCheckPointsCount: meta.data.nonCheckPointsCount || 0,
        hasCheckPointsCount: _hasCheckPointsCount,
      });

      return {
        // 选择视频列表需要过滤刚刚绘制的数据
        dataSource: data.filter((item:any) => item.id !== modalData.currentId),
        count: data.filter((item:any) => item.id !== modalData.currentId).length || 0
      };
    },
    onSearch(values: { [x: string]: string }) {
      setFilters(values);
    },
    changeDrawType({ target: { value } }: RadioChangeEvent) {
      setDrawTypeData({
        ...drawTypeData,
        type: value,
      });
      // 重置 checkbox
      setSelectedRowKeys([]);
      methods.onSearch({});
    },
    onSelectChange (newSelectedRowKeys: Key[]) {
      // console.log('selectedRowKeys changed: ', newSelectedRowKeys, selectedRows);
      setSelectedRowKeys(newSelectedRowKeys);
    },
    /** 确定/确定并分析 */
    onApply(needToAnalysis:boolean = false) {
      const params = {
        projectId: modalData.projectId,
        sourceVideoId: modalData.currentId,
        outdoorPoints: modalData.outdoorPoints,
        indoorPoints: modalData.indoorPoints,
        needToAnalysis,
        applyAll: false,
        videoIds: selectedRowKeys,
      };
      passengerCheckPointsApply(params).then(() => {
        setModalData({
          ...modalData,
          visible: false,
        });
        onRefresh();
        V2Message.success('应用成功');
      }).catch(() => {
        setModalData({
          ...modalData,
          visible: false,
        });
        V2Message.error('应用失败,请重试');
      });
    },
    onCancel() {
      setModalData({
        ...modalData,
        visible: false
      });
    },
    selectRow (record) {
      const newSelectedRowKeys = [...selectedRowKeys];
      if (newSelectedRowKeys.indexOf(record.id) >= 0) {
        newSelectedRowKeys.splice(newSelectedRowKeys.indexOf(record.id), 1);
      } else {
        newSelectedRowKeys.push(record.id);
      }
      setSelectedRowKeys(newSelectedRowKeys);
    }
  });

  const rowSelection = {
    selectedRowKeys,
    onChange: methods.onSelectChange
  };

  return (
    <Modal
      title='请选择视频'
      open={modalData.visible}
      width={1040}
      onCancel={methods.onCancel}
      className={styles.selectVideoModal}
      getContainer={false}
      centered
      footer={[
        <Button type='primary' onClick={() => methods.onApply(true)}>确定并分析</Button>,
        <Button type='primary' onClick={() => methods.onApply()}>确定</Button>,
      ]}
    >
      <p>请选择需要应用绘制区域的视频</p>
      <div className='mt-12 mb-12'>
        <Radio.Group
          options={options}
          onChange={methods.changeDrawType}
          value={drawTypeData.type}
          optionType='button' />
      </div>
      <V2Table
        rowKey='id'
        rowSelection={rowSelection}
        filters={filters}
        defaultColumns={defaultColumns}
        onFetch={methods.getList}
        useResizable
        scroll={{ x: 'max-content', y: 500 }}
        onRow={(record) => ({
          onClick: () => {
            methods.selectRow(record);
          },
        })}
      />
    </Modal>
  );
};

export default SelectVideoModal;
