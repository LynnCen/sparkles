import Filter from './components/Filter';
import cs from 'classnames';
import styles from './entry.module.less';
import List from './components/List';
import { useEffect, useState } from 'react';
import { post } from '@/common/request';
import { useMethods } from '@lhb/hook';
import Selection from './components/Selection';
import { TargetChild } from './ts-config';
import { deepCopy, isArray } from '@lhb/func';
import { useTenantType } from '@/common/hook/business/useTenantType';
import IconFont from '@/common/components/IconFont';
import ModalHint from '@/common/components/business/ModalHint';

const Shopfilter = () => {
  // tenantStatus 0:试用企业，1：正式企业； 默认1
  const { tenantStatus } = useTenantType(); // 租户类型
  const defaultHintStr = '今日查询次数已达上限，如需更多查询，请联系客服';
  const [showHint, setShowHint] = useState<boolean>(true);
  const [params, setParams] = useState<any>({
    dateType: 1,
    industryId: 352,
    metaDatas: [
      { metaCode: 'col020301', minIndex: 0, maxIndex: 1 },
      { metaCode: 'col020403', minIndex: 0, maxIndex: 1 },
      { metaCode: 'col020402', minIndex: 0, maxIndex: 1 },
      { metaCode: 'col020501', minIndex: 0, maxIndex: 1 },
      { metaCode: 'col020604', minIndex: 0, maxIndex: 1 },
      { metaCode: 'col020603', minIndex: 0, maxIndex: 1 },
      { metaCode: 'col020606', minIndex: 0, maxIndex: 1 },
      { metaCode: 'col020708', minIndex: 0, maxIndex: 1 },
      { metaCode: 'col020706', minIndex: 0, maxIndex: 1 },
      { metaCode: 'col021001', minIndex: 0, maxIndex: 1 },
      { metaCode: 'col021002', minIndex: 0, maxIndex: 1 },
    ],
  });
  const onSearch = (values: any) => {
    setParams({
      ...values,
    });
  };
  const [showSelection, setShowSelection] = useState(false);
  const [selectionSelected, setSelectionSelected] = useState<Array<TargetChild>>([
    {
      lbsDataType: 2,
      nameCh: '已婚',
      nameEng: null,
      metaCode: 'col020301',
      metaType: '婚姻状况',
      metaTypeCode: 'col0203',
      value: 16,
    },
    {
      lbsDataType: 2,
      nameCh: '次高',
      nameEng: null,
      metaCode: 'col020403',
      metaType: '消费水平',
      metaTypeCode: 'col0204',
      value: 21,
    },
    {
      lbsDataType: 2,
      nameCh: '高',
      nameEng: null,
      metaCode: 'col020402',
      metaType: '消费水平',
      metaTypeCode: 'col0204',
      value: 22,
    },
    {
      lbsDataType: 2,
      nameCh: '有车',
      nameEng: null,
      metaCode: 'col020501',
      metaType: '是否有车',
      metaTypeCode: 'col0205',
      value: 23,
    },
    {
      lbsDataType: 2,
      nameCh: '本科',
      nameEng: null,
      metaCode: 'col020604',
      metaType: '学历',
      metaTypeCode: 'col0206',
      value: 29,
    },
    {
      lbsDataType: 2,
      nameCh: '硕士',
      nameEng: null,
      metaCode: 'col020603',
      metaType: '学历',
      metaTypeCode: 'col0206',
      value: 30,
    },
    {
      lbsDataType: 2,
      nameCh: '博士',
      nameEng: null,
      metaCode: 'col020606',
      metaType: '学历',
      metaTypeCode: 'col0206',
      value: 31,
    },
    {
      lbsDataType: 2,
      nameCh: '25-30',
      nameEng: null,
      metaCode: 'col020708',
      metaType: '年龄',
      metaTypeCode: 'col0207',
      value: 34,
    },
    {
      lbsDataType: 2,
      nameCh: '31-35',
      nameEng: null,
      metaCode: 'col020706',
      metaType: '年龄',
      metaTypeCode: 'col0207',
      value: 35,
    },
    {
      lbsDataType: 2,
      nameCh: '2-5岁',
      nameEng: null,
      metaCode: 'col021001',
      metaType: '子女年龄',
      metaTypeCode: 'col0210',
      value: 71,
    },
    {
      lbsDataType: 2,
      nameCh: '6-12岁',
      nameEng: null,
      metaCode: 'col021002',
      metaType: '子女年龄',
      metaTypeCode: 'col0210',
      value: 72,
    },
  ]);
  const [targetOptions, setTargetOptions] = useState<Array<any>>([]);
  const [visible, setVisible] = useState<boolean>(false);// 试用版弹窗
  const [modalHintContent, setModalHintContent] = useState<string>(defaultHintStr);// 试用版弹窗内容


  const loadData = async (searchParams) => {
    const queryParams: any = deepCopy(searchParams);
    // 未传排序字段默按照cpm排序
    if (queryParams.orderBy === undefined && queryParams.order === undefined) {
      queryParams.sortField = undefined;
      queryParams.isAsc = undefined;
    }
    if (queryParams.orderBy && queryParams.order) {
      queryParams.sortField = queryParams.orderBy;
      queryParams.sort = queryParams.order;
      delete queryParams.orderBy;
      delete queryParams.order;
    }
    // 解决筛选时，输入框输入值之后查询，然后再清空输入值时查询maxIndex为0的问题（不输默认为1）
    const metaDatas = queryParams?.metaDatas;
    if (metaDatas) {
      // eslint-disable-next-line guard-for-in
      for (const item in metaDatas) {
        const targetVal = metaDatas[item];
        targetVal && (targetVal.maxIndex) === 0 && (metaDatas[item].maxIndex = 1);
      }
    }
    if (queryParams.aveFlowMax === 0) {
      delete queryParams.aveFlowMax;
    }
    if (queryParams.aveFlowMin === 0) {
      delete queryParams.aveFlowMin;

    }
    // https://yapi.lanhanba.com/project/329/interface/api/52163
    const result: any = await post('/place/coarseSieve/page', queryParams, true);
    const { errCode, objectList } = result;
    if (errCode === 'frequencyControl') {
      setModalHintContent(defaultHintStr);
      setVisible(true);
      return { dataSource: [], count: 0 };
    }
    let data: any[] = [];
    if (isArray(objectList)) data = objectList;
    const tableData = data.map((e, index: number) => ({
      ...e,
      ...e.profile,
      index
    }));
    return { dataSource: tableData, count: result?.totalNum };
  };
  const methods = useMethods({
    showSelection() {
      setShowSelection(true);
    },
    setHandle(selected: Array<TargetChild>) {
      let metaDatas: Array<TargetChild> = [];
      if (params.metaDatas.length > 0) {
        metaDatas = selected.map((item) => {
          const pIndex = params.metaDatas.findIndex((e) => item.metaCode === e.metaCode);
          if (pIndex < 0) {
            return { metaCode: item.metaCode, minIndex: 0, maxIndex: 1 };
          } else {
            return params.metaDatas[pIndex];
          }
        });
      }
      setSelectionSelected(selected);
      setParams({
        ...params,
        metaDatas,
      });
    },
  });

  useEffect(() => {
    // https://yapi.lanhanba.com/project/329/interface/api/52156
    post('/place/coarseSieve/metaInfo', null, true).then((res: any) => {
      res.shift(); // 移除客流，客流是固定显示的
      setTargetOptions(res);
    });
  }, []);
  return (
    <div className={cs(styles.container)}>
      {
        showHint ? <div className={cs(styles.hintCon, 'mb-10')}>
          <div className={styles.flexCon}>
            <div>
              <IconFont iconHref='iconwarning-circle1' className='color-warning fs-14'/>
            </div>
            <div className='pl-6 fs-14'>
              数据来源说明：巡展热度来源于邻汇吧，客流指数及客群画像数据来源为阿里、腾讯LBS数据，季度更新，也可根据使用需求调整更新频率。
            </div>
          </div>
          <IconFont
            iconHref='iconic-closexhdpi'
            className='c-333 fs-14 pointer'
            onClick={() => setShowHint(false)}/>
        </div> : null
      }
      <div className='bg-fff pd-20'>
        <Filter selection={selectionSelected} onSearch={onSearch} onSet={methods.showSelection} />
        <List
          params={params}
          selection={selectionSelected}
          loadData={loadData}
          tenantStatus={tenantStatus}
          setVisible={setVisible}
          setModalHintContent={setModalHintContent}/>
        <Selection
          showSelection={showSelection}
          setShowSelection={setShowSelection}
          selected={selectionSelected}
          setSelected={methods.setHandle}
          targets={targetOptions}
        />
      </div>
      <ModalHint
        visible={visible}
        setVisible={setVisible}
        content={modalHintContent}/>
    </div>
  );
};

export default Shopfilter;
