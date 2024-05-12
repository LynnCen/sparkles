/**
 * @Description 新建匹配点位
 */
import React, { FC, useEffect, useState } from 'react';
import { Form, Modal } from 'antd';
import { useMethods } from '@lhb/hook';
import SearchForm from '@/common/components/Form/SearchForm';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormProvinceList from '@/common/components/Form/V2FormProvinceList';
import V2FormRangePicker from '@/common/components/Form/V2FormRangePicker/V2FormRangePicker';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import V2Table from '@/common/components/Data/V2Table';
import { associateTask, getTaskChancePointList } from '@/common/api/expandStore/expansiontask';
import { getChancepointSelection } from '@/common/api/expandStore/chancepoint';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import dayjs from 'dayjs';
import { Cascader } from 'antd';
import { isArray } from '@lhb/func';
import { tenantCheck } from '@/common/api/common';

interface Props {
  id:number// 任务id
  open:boolean, // 打开弹窗
  setOpen: Function // 控制是否打开弹窗
  refresh: Function // 刷新详情
}


const CreatePointMatching : FC<Props> = ({
  id,
  open,
  setOpen,
  refresh,
}) => {

  const [form] = Form.useForm(); // 表单参数
  const [filters, setFilters] = useState<any>(); // 筛选参数
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]); // 选择的关联的点位ids
  const [statuses, setStatuses] = useState<any>([]); // 机会点状态选项
  const [isYiHeTang, setIsYiHeTang] = useState<boolean>(false);

  useEffect(() => {
    tenantCheck().then(({ isYiHeTang }) => {
      setIsYiHeTang(!!isYiHeTang);
    });
    getChancepointSelection({}).then(({ relateStatus }: any) => {
      isArray(relateStatus) && setStatuses(relateStatus);
    });
  }, []);


  const methods = useMethods({
    /**
     * @description 点击-取消
     */
    onCancel() {
      // console.log('onCancel');
      setSelectedRowKeys([]); // 清空选择
      setOpen(false); // 关闭弹窗
      setFilters({});
      form.resetFields(); // 重置表单
    },

    /**
     * @description 点击确认-新增匹配点位
     */
    onOk() {
      if (!selectedRowKeys.length) {
        V2Message.warning('请先选择匹配的点位');
        return;
      }
      associateTask({ id, chancePointIds: selectedRowKeys, }).then(() => {
        V2Message.success('添加匹配点位成功');
        methods.onCancel();
        refresh();
      }).catch(() => {
        V2Message.error('添加匹配点位失败');
      });
    },

    /**
     * @description 搜索
     * @param params 搜索关键词
     */
    onSearch(params) {
      // console.log('params 原始', params);
      const { houseDelivery, addresses } = params;
      let houseDeliveryStart;
      let houseDeliveryEnd;
      let tmpAddresses: any;
      // 省市区参数处理
      if (isArray(addresses) && addresses.length) {
        tmpAddresses = addresses.map(itm => ({
          provinceId: itm.length ? itm[0] : undefined,
          cityId: itm.length > 1 ? itm[1] : undefined,
          districtId: itm.length > 2 ? itm[2] : undefined,
        }));
      }
      // 日期参数处理
      if (isArray(houseDelivery) && houseDelivery.length === 2) {
        houseDeliveryStart = dayjs(houseDelivery[0]).format('YYYY-MM-DD');
        houseDeliveryEnd = dayjs(houseDelivery[1]).format('YYYY-MM-DD');
      }
      params = {
        ...params,
        houseDelivery: undefined,
        houseDeliveryStart,
        houseDeliveryEnd,
        addresses: tmpAddresses,
      };
      // console.log('params 格式后', params);
      setFilters(params);
    },

    /**
     * @description 加载表格数据
     * @param params 搜索参数
     * @returns 表格数据
     */
    async loadData(params) {
      const data = await getTaskChancePointList({
        ...params
      });
      return {
        dataSource: data.objectList,
        count: data.totalNum,
      };
    }
  });

  const defaultColumns = [{
    key: 'name',
    title: '机会点名称',
    width: 174,
    dragChecked: true,
    dragDisabled: true
  }, {
    key: 'address',
    width: 'auto',
    title: '详细地址',
    dragChecked: true,
    dragDisabled: true
  }
  ];

  /** V2Table中多选配置项*/
  const rowSelection = {
    type: 'checkbox',
    selectedRowKeys,
    preserveSelectedRowKeys: true, // 保留上一次选择参数，不设置会丢失之前的多选参数
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  return (
    <>
      <Modal
        title='关联机会点'
        open={open}
        onOk={methods.onOk}
        width={740}
        onCancel={methods.onCancel}
        destroyOnClose
      >
        <SearchForm
          onOkText='搜索'
          form={form}
          labelLength={5}
          showResetBtn
          onSearch={methods.onSearch}
        >
          <V2FormInput label='机会点名称' name='keyword' placeholder='请输入店铺名称或地址搜索'/>
          <V2FormProvinceList
            label='省市区'
            name='addresses'
            type={1}
            multiple
            config={{ showCheckedStrategy: Cascader.SHOW_PARENT }}/>
          {isYiHeTang ? <V2FormRangePicker label='可交房日期' name='houseDelivery'/> : <></>}
          <V2FormSelect
            label='机会点状态'
            name='statuses'
            options={statuses}
            config={{
              mode: 'multiple',
              maxTagCount: 'responsive',
              showSearch: true,
              filterOption: false,
              fieldNames: {
                label: 'name',
                value: 'id'
              },
            }}/>

        </SearchForm>

        <V2Table
          rowKey='id'
          defaultColumns={defaultColumns}
          onFetch={methods.loadData}
          pagination={false}
          hideColumnPlaceholder={true}
          filters={filters}
          rowSelection={rowSelection}
          scroll={{ x: 'max-content', y: 368 }}
        />

      </Modal>
    </>
  );
};
export default CreatePointMatching;

