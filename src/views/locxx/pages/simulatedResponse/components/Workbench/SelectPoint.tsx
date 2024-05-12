import { FC, forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { useMethods } from '@lhb/hook';
import { getKeysFromObjectArray, isNotEmpty } from '@lhb/func';
import { get } from '@/common/request';
import { refactorSelectionNew } from '@/common/utils/ways';
import { getQuotePlaceSearch } from '@/common/api/demand-management';

import cs from 'classnames';
import styles from './index.module.less';
import { Button, Form, Modal, Spin, Cascader } from 'antd';
import V2Container from 'src/common/components/Data/V2Container';
import FormSearch from '@/common/components/Form/SearchForm';
import V2FormInput from 'src/common/components/Form/V2FormInput/V2FormInput';
import V2FormSelect from 'src/common/components/Form/V2FormSelect/V2FormSelect';
import { PointProps, PointCard } from './Point';
import V2FormRangeInput from 'src/common/components/Form/V2FormRangeInput/V2FormRangeInput';
import V2Empty from 'src/common/components/Data/V2Empty/index';
import V2Pagination from 'src/common/components/Data/V2Pagination';
import V2FormCascader from 'src/common/components/Form/V2FormCascader/V2FormCascader';
import AddPoint from 'src/common/components/Business/AddPoint/index';

const { SHOW_CHILD } = Cascader;

// 点位分组
const PointGroup:FC<{ active: any, setActive: Function, title: string, list: PointProps[] }> = ({ active, setActive, title, list }) => {

  const handleClick = (item) => {
    setActive?.(item);
  };

  return <div className={styles.pointGroup}>
    <div className={styles.pointGroupTitle}>{title || '-'}</div>
    <div className={styles.pointGroupList}>
      {Array.isArray(list) && !!list.length
        ? list.map((item, index) => <PointCard key={index} point={item} selectable={true} active={active?.spotId === item.spotId} onClick={handleClick} />)
        : '暂无点位'}
    </div>
  </div>;
};

// 选择点位-弹窗
const Component: FC<{ complete: Function } & { ref?: any }> = forwardRef(({ complete }, ref) => {

  useImperativeHandle(ref, () => ({
    init: methods.init
  }));

  /* state */
  const groupListWrapperRef = useRef<any>();

  const [searchForm] = Form.useForm();
  const [selection, setSelection] = useState({
    areas: [{ value: 1, label: '门口' }, { value: 2, label: '电梯口' }],
    inOrOutDoor: [{ value: 0, label: '室内' }, { value: 1, label: '室外' }],
    categories: [], // 场地类型
    pointCategory: [], // 点位类型
    cityList: [], // 城市
    districts: [], // 城市区域
  });

  const [requesting, setRequesting] = useState(false);
  const [pageParams, setPageParams] = useState({
    page: 1, // 当前页
    pageSize: 20, // 每页条数
    totalNum: 85, // 总数
  });

  const [mainHeight, setMainHeight] = useState<number>(0);
  const [groupListData, setGroupListData] = useState<any[]>([]); // 列表数据

  const [visible, setVisible] = useState(false);
  // 选中项
  const [active, setActive] = useState<any>(null);

  // 新增点位弹窗
  const [addVisible, setAddVisible] = useState(false);

  /* hooks */
  // useEffect(() => {
  //   methods.loadData();
  // }, []);

  /* methods */
  const methods = useMethods({
    // 初始化
    init() {
      setVisible(true);
      setActive(null);

      methods.getSelection();
      methods.loadData();
    },
    // 新增点位
    add() {
      console.log('新增点位');
      setAddVisible(true);
    },
    // 新增点位回调
    addComplete() {
      methods.loadData();
    },

    getSelection () {
      get('/requirement/selection', { modules: 'category' }, { isMock: false, needCancel: false, proxyApi: '/lcn-api' }).then((response) => {
        setSelection(val => ({ ...val, categories: refactorSelectionNew({ selection: response?.categories || [] }) }));
      });
      get('/spot/searchCategory', null, { isMock: false, needCancel: false, proxyApi: '/lcn-api' }).then((response) => {
        setSelection(val => ({ ...val, pointCategory: refactorSelectionNew({ selection: response || [] }) }));
      });
      get('/requirement/selection/cityList', null, { isMock: false, needCancel: false, proxyApi: '/lcn-api' }).then((response) => {
        setSelection(val => ({ ...val, cityList: refactorSelectionNew({ selection: response || [] }) }));
      });
    },

    // 选择省市区
    changeProvinceList(value, selectOptions) {
      console.log('selectOptions', selectOptions);
      if (!Array.isArray(selectOptions)) {
        selectOptions = [];
      }

      setSelection(val => ({
        ...val,
        districts: refactorSelectionNew({
          // 把 不限 过滤掉
          selection: selectOptions.map(item => ({ ...item, children: Array.isArray(item.districts) ? item.districts.filter(itm => itm.id !== 0) : null })) || []
        })
      }));

      // 可选的区域 id 数组
      const _districtIds: number[] = selectOptions.reduce((result, item) => result.concat(getKeysFromObjectArray(item.districts, 'id')), []);

      // 当前已选的区域 id 二维数组
      const oldDistricts = searchForm.getFieldValue('districtIds') || []; // 二位数组，如 [[1, 1], [1, 2], [1, 3]]
      if (_districtIds.length) {
        searchForm.setFieldsValue({ districtIds: oldDistricts.filter(item => _districtIds.includes(item[item.length - 1])) });
      } else {
        searchForm.setFieldsValue({ districtIds: [] });
      }
    },

    // 搜索
    loadData(_params) {
      const page = _params?.page || 1; // 如果不传，默认第一页
      const pageSize = _params?.pageSize || pageParams.pageSize || 20;
      console.log('loadData', page);
      setPageParams(val => ({ ...val, page, pageSize }));

      setActive(null);
      groupListWrapperRef.current && (groupListWrapperRef.current.scrollTop = 0);

      const params = {
        'pageNum': page,
        'pageSize': pageSize,
        ...searchForm.getFieldsValue(),
      };

      params.districtIds = Array.isArray(params.districtIds) ? params.districtIds.map(item => Array.isArray(item) && item.length ? item[item.length - 1] : null).filter(item => isNotEmpty(item)) : [];

      setRequesting(true);
      getQuotePlaceSearch(params).then((response) => {
        const { objectList, totalNum } = response || { objectList: [], totalNum: 0 };
        console.log('response', response);

        // const data = Array.isArray(objectList) ? objectList.reduce((result, item, index) => {
        //   const placeName = item.placeName;
        //   if (!result[placeName]) {
        //     result[placeName] = {
        //       seq: index,
        //       title: placeName,
        //       list: [],
        //     };
        //   }

        //   result[placeName].list.push({ spotId: item.spotId, title: item.name, info: `${item.spotName || '-'}(${item.area || '-'}㎡)`, img: index % 2 ? 'https://comment.linhuiba.com/FjyygsUJZjJqFfu2-Z73jp3EWWKI' : 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg' });
        //   return result;
        // }, {}) : {};
        // setGroupListData(Object.values(data).sort((a: any, b: any) => a.seq - b.seq));

        setPageParams(val => ({ ...val, totalNum }));
        setGroupListData(objectList);

      }).finally(() => {
        setRequesting(false);
      });
    },
    // 取消
    cancel() {
      console.log('cancel');
      setVisible(false);
    },

    // 确定
    confirm() {
      if (!active) {
        return;
      }
      console.log('confirm', active);
      complete?.(active);
      setVisible(false);
    },

  });

  return (<Modal
    open={visible}
    title='添加点位'
    footer={<div className={styles.bottomOperate}>
      <Button onClick={() => methods.cancel()}>取消</Button>
      <Button type='primary' disabled={!active} onClick={() => methods.confirm()}>确定</Button>
    </div>}
    onCancel={() => setVisible(false)}
    width={1200}
    maskClosable={false}
    style={{ top: '5%' }}
  >
    <V2Container
      style={{ height: '75vh', minHeight: '700px' }}
      emitMainHeight={(h) => setMainHeight(h)}
      extraContent={{
        top: <FormSearch
          form={searchForm}
          onSearch={methods.loadData}
          extra={<div className={styles.extraOperate}>
            <Button type='primary' onClick={() => methods.add?.()}>新增点位</Button>
          </div>
          }>
          <V2FormInput label='名称搜索' name='name' allowClear maxLength={30} />
          <V2FormSelect
            label='城市筛选'
            name='cityIds'
            placeholder='请选择城市'
            options={selection.cityList}
            mode='multiple'
            allowClear
            config={{ maxTagCount: 'responsive', onChange: methods.changeProvinceList }}
          />

          <V2FormCascader
            label='所在区域'
            name='districtIds'
            options={selection.districts}
            multiple
            config={{ showCheckedStrategy: SHOW_CHILD, allowClear: true, showSearch: true, maxTagCount: 'responsive' }}
          />
          <V2FormSelect
            label='点位类型'
            name='spotCategoryIds'
            options={selection.pointCategory}
            mode='multiple'
            allowClear
          />
          <V2FormRangeInput label='面积' name={['minArea', 'maxArea']} extra='m²' useBaseRules />
          <V2FormSelect
            label='室内/室外'
            name='inOrOutDoor'
            options={selection.inOrOutDoor}
            allowClear
          />
          <V2FormSelect
            label='场地类型'
            name='categoryId'
            placeholder='请选择场地类型'
            config={{ showSearch: true, }}
            options={selection.categories}
          />
        </FormSearch>,
      }}>

      <div className={styles.selectPointMain} style={{ height: mainHeight }}>
        <div ref={groupListWrapperRef} className={cs(styles.groupListWrapper, 'groupListWrapper')}>
          <Spin spinning={requesting}>
            {Array.isArray(groupListData) && !!groupListData.length
              ? groupListData.map((item, index) => <PointGroup key={index} active={active} setActive={setActive} title={item.name} list={item.spots} />)
              : <V2Empty/>}
          </Spin>
        </div>
        <V2Pagination
          current={pageParams.page}
          pageSize={pageParams.pageSize}
          total={pageParams.totalNum}
          onChange={(page, pageSize) => methods.loadData({ page, pageSize })}
        />
      </div>

      {/* 新增点位 */}
      <AddPoint channel='LOCXX' visible={addVisible} onClose={() => setAddVisible(false)} onOK={methods.addOk}/>

    </V2Container>
  </Modal>);
});

/* const listMockData = [
  {
    title: '杭州城西银泰',
    list: [
      { id: 1, title: '杭州城西银泰2', info: '一楼大中庭(200㎡)', img: 'https://comment.linhuiba.com/FjyygsUJZjJqFfu2-Z73jp3EWWKI' },
      { id: 2, title: '杭州城西银泰3', info: '一楼大中庭(200㎡)', img: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg' },
      { id: 3, title: '杭州城西银泰4', info: '一楼大中庭(200㎡)', img: 'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg' },
      { id: 4, title: '杭州城西银泰5', info: '一楼大中庭(200㎡)', img: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png' },
      { id: 5, title: '杭州城西银泰6', info: '一楼大中庭(200㎡)', img: 'https://comment.linhuiba.com/FjyygsUJZjJqFfu2-Z73jp3EWWKI' },
      { id: 6, title: '杭州城西银泰7', info: '一楼大中庭(200㎡)', img: 'https://comment.linhuiba.com/FjyygsUJZjJqFfu2-Z73jp3EWWKI' },
      { id: 7, title: '杭州城西银泰8', info: '一楼大中庭(200㎡)', img: 'https://comment.linhuiba.com/FjyygsUJZjJqFfu2-Z73jp3EWWKI' },
      { id: 8, title: '杭州城西银泰9', info: '一楼大中庭(200㎡)', img: 'https://comment.linhuiba.com/FjyygsUJZjJqFfu2-Z73jp3EWWKI' },
      { id: 9, title: '杭州城西银泰10', info: '一楼大中庭(200㎡)', img: 'https://comment.linhuiba.com/FjyygsUJZjJqFfu2-Z73jp3EWWKI' },
    ]
  },
  {
    title: '杭州城西银泰22',
    list: [
      { id: 10, title: '杭州城西银泰11', info: '一楼大中庭(200㎡)', img: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg' },
    ]
  },
  {
    title: '杭州城西银泰33',
    list: [
      { id: 11, title: '杭州城西银泰12', info: '一楼大中庭(200㎡)', img: 'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg' },
      { id: 12, title: '杭州城西银泰13', info: '一楼大中庭(200㎡)', img: 'https://comment.linhuiba.com/FjyygsUJZjJqFfu2-Z73jp3EWWKI' },
      { id: 13, title: '杭州城西银泰14', info: '一楼大中庭(200㎡)', img: 'https://comment.linhuiba.com/FjyygsUJZjJqFfu2-Z73jp3EWWKI' },
      { id: 14, title: '杭州城西银泰15', info: '一楼大中庭(200㎡)', img: 'https://comment.linhuiba.com/FjyygsUJZjJqFfu2-Z73jp3EWWKI' },
    ]
  },
  {
    title: '杭州城西银泰33',
    list: [
      { id: 15, title: '杭州城西银泰12', info: '一楼大中庭(200㎡)', img: 'https://comment.linhuiba.com/FjyygsUJZjJqFfu2-Z73jp3EWWKI' },
      { id: 16, title: '杭州城西银泰13', info: '一楼大中庭(200㎡)', img: 'https://comment.linhuiba.com/FjyygsUJZjJqFfu2-Z73jp3EWWKI' },
      { id: 17, title: '杭州城西银泰14', info: '一楼大中庭(200㎡)', img: 'https://comment.linhuiba.com/FjyygsUJZjJqFfu2-Z73jp3EWWKI' },
      { id: 18, title: '杭州城西银泰15', info: '一楼大中庭(200㎡)', img: 'https://comment.linhuiba.com/FjyygsUJZjJqFfu2-Z73jp3EWWKI' },
    ]
  },
  {
    title: '杭州城西银泰33',
    list: [
      { id: 19, title: '杭州城西银泰12', info: '一楼大中庭(200㎡)', img: 'https://comment.linhuiba.com/FjyygsUJZjJqFfu2-Z73jp3EWWKI' },
      { id: 20, title: '杭州城西银泰13', info: '一楼大中庭(200㎡)', img: 'https://comment.linhuiba.com/FjyygsUJZjJqFfu2-Z73jp3EWWKI' },
      { id: 21, title: '杭州城西银泰14', info: '一楼大中庭(200㎡)', img: 'https://comment.linhuiba.com/FjyygsUJZjJqFfu2-Z73jp3EWWKI' },
      { id: 22, title: '杭州城西银泰15', info: '一楼大中庭(200㎡)', img: 'https://comment.linhuiba.com/FjyygsUJZjJqFfu2-Z73jp3EWWKI' },
    ]
  },
  {
    title: '杭州城西银泰33',
    list: [
      { id: 23, title: '杭州城西银泰12', info: '一楼大中庭(200㎡)', img: 'https://comment.linhuiba.com/FjyygsUJZjJqFfu2-Z73jp3EWWKI' },
      { id: 24, title: '杭州城西银泰13', info: '一楼大中庭(200㎡)', img: 'https://comment.linhuiba.com/FjyygsUJZjJqFfu2-Z73jp3EWWKI' },
      { id: 25, title: '杭州城西银泰14', info: '一楼大中庭(200㎡)', img: 'https://comment.linhuiba.com/FjyygsUJZjJqFfu2-Z73jp3EWWKI' },
      { id: 26, title: '杭州城西银泰15', info: '一楼大中庭(200㎡)', img: 'https://comment.linhuiba.com/FjyygsUJZjJqFfu2-Z73jp3EWWKI' },
    ]
  },
  {
    title: '杭州城西银泰33',
    list: [
      { id: 27, title: '杭州城西银泰12', info: '一楼大中庭(200㎡)', img: 'https://comment.linhuiba.com/FjyygsUJZjJqFfu2-Z73jp3EWWKI' },
      { id: 28, title: '杭州城西银泰13', info: '一楼大中庭(200㎡)', img: 'https://comment.linhuiba.com/FjyygsUJZjJqFfu2-Z73jp3EWWKI' },
      { id: 29, title: '杭州城西银泰14', info: '一楼大中庭(200㎡)', img: 'https://comment.linhuiba.com/FjyygsUJZjJqFfu2-Z73jp3EWWKI' },
      { id: 30, title: '杭州城西银泰15', info: '一楼大中庭(200㎡)', img: 'https://comment.linhuiba.com/FjyygsUJZjJqFfu2-Z73jp3EWWKI' },
    ]
  }
]; */

export default Component;
