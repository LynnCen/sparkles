import { FC, forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { contrast, deepCopy, parseObjectArrayToString, replaceEmpty } from '@lhb/func';
import dayjs from 'dayjs';
import { useMethods } from '@lhb/hook';
import { getDemandPageList, getRequirementSelection } from '@/common/api/demand-management';
import { refactorSelectionNew } from '@/common/utils/ways';
import { StatusColor } from '@/views/locxx/pages/demandManagement/ts-config';

import cs from 'classnames';
import styles from './index.module.less';
import { Button, Cascader, Form, Modal, Typography } from 'antd';
import V2Container from 'src/common/components/Data/V2Container';
import FormSearch from '@/common/components/Form/SearchForm';
import V2FormInput from 'src/common/components/Form/V2FormInput/V2FormInput';
import V2FormSelect from 'src/common/components/Form/V2FormSelect/V2FormSelect';
import V2FormProvinceList from 'src/common/components/Form/V2FormProvinceList';
import FormResourceBrand from 'src/common/components/FormBusiness/FormResourceBrand';
import V2FormCascader from 'src/common/components/Form/V2FormCascader/V2FormCascader';
import FormUserList from 'src/common/components/FormBusiness/FormUserList';
import V2FormInputNumber from 'src/common/components/Form/V2FormInputNumber/V2FormInputNumber';
import V2FormRangePicker from 'src/common/components/Form/V2FormRangePicker/V2FormRangePicker';
import V2Table from 'src/common/components/Data/V2Table';

const { Text } = Typography;
const { SHOW_CHILD } = Cascader;

// 选择需求-弹窗
const Component: FC<{ complete: Function } & { ref?: any }> = forwardRef(({ complete }, ref) => {

  useImperativeHandle(ref, () => ({
    init: methods.init
  }));

  /* state */

  const [params, setParams] = useState({ oneLevelTab: '1' });
  const [searchForm] = Form.useForm();

  const [selection, setSelection] = useState({
    demandOptions: [], // 需求类型
    commercials: [], // 业态
  });

  // 选中项
  const [selectedRows, setSelectedRows] = useState<any[]>([]);

  const [mainHeight, setMainHeight] = useState<number>(0);

  const [visible, setVisible] = useState<any>(null);

  // 列表列，参考 src/views/locxx/pages/demandManagement/components/TableList.tsx
  const defaultColumns = [
    { title: '需求名称', key: 'name', fixed: 'left', width: '130px', importWidth: true },
    { title: '需求类型', key: 'purposeTypeName', width: '70px', importWidth: true },
    { title: '所需城市', key: 'cityLists', width: '100px', importWidth: true,
      render: (value, record) => <Text ellipsis={{ tooltip: replaceEmpty(record?.cityListName) }}>{ record?.cityListName }</Text> },
    { title: '品牌行业', key: 'brandIndustry', width: '140px', importWidth: true },
    { title: '跟进人', key: 'follower', width: '80px', importWidth: true },
    { title: '发布人', key: 'publisher', width: '160px', importWidth: true },
    { title: '发布时间', key: 'publishTime', width: '160px', importWidth: true },
    { title: '需求状态', key: 'status', width: '80px', importWidth: true, render: (value, record) => {
      const color = StatusColor[record.status] || StatusColor['default'];
      return (<span style={{ color }}>{record.statusName}</span>);
    } },
  ];

  /* hooks */
  useEffect(() => {
    methods.getSelection();
  }, []);

  /* methods */
  const methods = useMethods({
    // 初始化
    init() {
      setVisible(true);
      setSelectedRows([]);
    },

    // 获取选项
    getSelection() {
      getRequirementSelection({ modules: 'locxxPurposeType,commercial' }).then((response) => {
        setSelection(val => ({ ...val,
          demandOptions: refactorSelectionNew({ selection: contrast(response, 'locxxPurposeType', []) }),
          commercials: refactorSelectionNew({ selection: contrast(response, 'commercials', []) }),
        }));
      });
    },
    // 非数字或英文逗号替换为空
    checkRequirementKeyword() {
      const tempStr = searchForm.getFieldValue('requirementKeyword');
      searchForm.setFieldsValue({ requirementKeyword: tempStr ? tempStr.replace(/[^0-9,]/g, '') : '' });
    },

    // 搜索
    onSearch(data = {}) {
      setParams({
        ...searchForm.getFieldsValue(),
        ...data,
      });
    },

    // 搜索
    async fetchData(_params) {
      setSelectedRows([]);
      let params = deepCopy(_params);

      const cityIds = params?.cityIds?.length ? params?.cityIds.map(item => item[1]) : [];
      const commercialFormIds = params?.commercialFormIds?.length ? params?.commercialFormIds.map(item => item[1]) : [];
      const { publishDates } = params;
      const hasPublishDate = Array.isArray(publishDates) && publishDates.length;

      params = Object.assign({
        ...params,
        isFollowerInclude: 1, // 为了使跟进人筛选生效
        cityIds,
        commercialFormIds,
        brandIds: params?.brandId ? [params.brandId] : [],
        contactIds: params?.contactId ? [params.contactId] : [],
        publishTimeStart: hasPublishDate ? dayjs(params.publishDates[0]).format('YYYY-MM-DD') : null,
        publishTimeEnd: hasPublishDate ? dayjs(params.publishDates[params.publishDates.length - 1]).format('YYYY-MM-DD') : null,
      });

      const response = await getDemandPageList(params);
      const { objectList = [], totalNum = 0 } = response || {};
      return {
        dataSource: Array.isArray(objectList) ? objectList.map(item => ({
          ...item,
          cityListName: parseObjectArrayToString(item.cityList, 'name', '、')
        })) : [],
        count: totalNum
      };
    },

    // 取消
    cancel() {
      console.log('cancel');
      setVisible(false);
    },

    // 确定
    confirm() {
      console.log('confirm', selectedRows);
      complete?.(Array.isArray(selectedRows) ? selectedRows.map(item => ({
        id: item.id,
        name: item.name,
        purposeType: item.purposeType,
        purposeTypeName: item.purposeTypeName,
        cityList: item.cityList,
        cityListName: item.cityListName,
        minArea: item.minArea,
        maxArea: item.maxArea,
        brandIndustry: item.brandIndustry,
        followerId: item.followerId,
        follower: item.follower,
        publisher: item.publisher,
        publishTime: item.publishTime,
        status: item.status,
        statusName: item.statusName,
      })) : []);
      setVisible(false);
    },

  });

  return (<Modal
    open={visible}
    title='选择需求'
    footer={<div className={styles.bottomOperate}>
      <Button onClick={() => methods.cancel()}>取消</Button>
      <Button type='primary' onClick={() => methods.confirm()}>确定</Button>
    </div>}
    onCancel={() => setVisible(false)}
    width={1240}
    maskClosable={false}
    style={{ top: '5%' }}
  >
    <V2Container
      style={{ height: '75vh', minHeight: '700px' }}
      emitMainHeight={(h) => setMainHeight(h)}
      extraContent={{
        top: <FormSearch
          form={searchForm}
          onSearch={methods.onSearch}>
          <V2FormInput
            label='需求ID'
            name='requirementKeyword'
            placeholder="多个需求ID以','隔开"
            maxLength={3000}
            blur={methods.checkRequirementKeyword}
          />
          <V2FormInput label='内容搜索' name='keyword' placeholder='需求名称、跟进记录' maxLength={30}/>
          <V2FormSelect
            label='需求类型'
            name='purposeType'
            placeholder='选择类型'
            options={selection.demandOptions}
            allowClear
          />
          <V2FormProvinceList
            label='所需城市'
            name='cityIds'
            placeholder='选择城市'
            type={2}
            config={{
              allowClear: true,
              changeOnSelect: true,
              multiple: true
            }}
          />
          <FormResourceBrand
            label='品牌'
            name='brandId'
            allowClear={true}
            placeholder='请搜索并选择品牌'
            config={{ getPopupContainer: (node) => node.parentNode }}
          />
          <V2FormCascader
            label='业态'
            name='commercialFormIds'
            options={selection.commercials}
            config={{
              showSearch: true,
              showArrow: true,
              allowClear: true,
              changeOnSelect: true,
              multiple: true,
              maxTagCount: 'responsive',
              showCheckedStrategy: SHOW_CHILD,
            }}
            placeholder='请选择业态'
          />

          <FormUserList
            label='跟进人'
            name='followerIds'
            placeholder='请选择跟进人'
            allowClear={true}
            form={searchForm}
            config={{ getPopupContainer: (node) => node.parentNode, mode: 'multiple', maxTagCount: 1 }}
          />

          <V2FormInputNumber
            label='发布人'
            name='creatorMobile'
            placeholder='输入手机号'
            precision={0}
            config={{
              controls: false,
              maxLength: 11
            }}
          />

          <V2FormRangePicker label='发布时间' name='publishDates' />
        </FormSearch>,
      }}>

      <div className={styles.selectDemandMain} style={{ height: mainHeight }}>
        <V2Table
          rowKey='id'
          defaultColumns={defaultColumns}
          onFetch={methods.fetchData}
          filters={params}
          hideColumnPlaceholder
          rowSelection={{
            type: 'checkbox',
            fixed: true,
            selectedRowKeys: selectedRows.map(item => item.id),
            onChange: (selectedRowKeys, selectedRows: any[]) => {
              setSelectedRows(selectedRows);
            },
          }}
          onRow={(record) => ({ onClick: () => {
            // 点击后，新增/移除当前行数据
            const newData = selectedRows.filter(item => item.id !== record.id);
            console.log('selectedRows', selectedRows);
            console.log('newData', newData);
            setSelectedRows(val => (newData.length === selectedRows.length ? [...val, record] : newData));
          } })}
          // 勿删! 64：分页模块总大小、48分页模块减去paddingBottom的值、42是table头部
          scroll={{ y: mainHeight - 64 - 42 }}
          className={cs(styles.selectDemandTableList)}
          paginationConfig={{ pageSizeOptions: [20, 50, 100, 500] }}
        />
      </div>
    </V2Container>
  </Modal>);
});

export default Component;
