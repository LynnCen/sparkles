/**
 * @Description 规划统计页
 * @Quote 1. 规划管理-> 点击【编辑规划】
 */

import { FC, useEffect, useRef, useState } from 'react';
import { useMethods } from '@lhb/hook';

import V2Container from '@/common/components/Data/V2Container';
import V2Table from '@/common/components/Data/V2Table';
// import V2FormProvinceList from '@/common/components/Form/V2FormProvinceList';
import SearchForm from '@/common/components/Form/SearchForm';

import Edit from '@/common/components/business/Edit';
import styles from './enrty.module.less';
import { Button, Cascader, Divider, Form } from 'antd';
import { downloadFile, isNotEmptyAny, mapSize, refactorSelection, urlParams } from '@lhb/func';
import { exportNetworkExcel, getPlanClusterCompanyPlanList, getTreeSelection, getSelection } from '@/common/api/networkplan';
import V2FormCascader from '@/common/components/Form/V2FormCascader/V2FormCascader';
import V2Title from '@/common/components/Feedback/V2Title';
import V2Message from '@/common/components/Others/V2Hint/V2Message';

// 规划统计
const PlanningStatistics: FC<any> = () => {

  // 兼容地址栏地图返回
  const {
    isMapReturn,
    planId,
    branchCompanyId,
    branchCompanyName,
    isActive
  } = JSON.parse(decodeURI(urlParams(location.search)?.params || null)) || {};

  const [form] = Form.useForm();
  const [filters, setFilters] = useState<any>();
  const [mainHeight, setMainHeight] = useState<number>(0);
  const [selections, setSelections] = useState<any>([]);

  // 规划管理弹窗
  const [editData, setEditData] = useState<any>({
    visible: !!isMapReturn && !isActive,
    branchCompanyId,
    planId,
  }); // 规划管理弹窗

  const isLock = useRef<boolean>(false);
  useEffect(() => {
    // 获取筛选项目
    const promisList: any[] = [];
    // 商圈和其他静态筛选合集。且只获取一次
    if (!mapSize(selections)) {
      promisList.push(getSelection({ module: 1 }));
      // module 1 网规相关，2行业商圈 （通用版）
      promisList.push(getTreeSelection({ planId: planId, type: 2, module: 1 }));
    }
    promisList.push(getTreeSelection({ planId: planId, type: 1, childCompanyId: branchCompanyId }));
    Promise.all(promisList).then(res => {
      if (res?.length === 3) {
        setSelections({ ...res[0], businesses: res[1], cities: res[2] });
      } else {
        setSelections({ ...selections, cities: res[0] });
      }
    });
  }, []);

  const methods = useMethods({

    /** 加载表格数据 */
    async onFetch(params) {

      const { pcdIds } = form.getFieldsValue();
      const districtIds: number[] = pcdIds ? pcdIds.map(subArray => subArray[2]) : []; // 获取每个子数组的第三个元素--区域id

      // 表格数据，总数，统计数据
      const { objectList, totalNum, meta: Statistics } = await getPlanClusterCompanyPlanList({
        branchCompanyId: branchCompanyId,
        planId: planId,
        districtIds,
        ...params
      });

      // meta 合计数据
      const list = [{ ...Statistics, id: 'total', provinceName: '合计' }].concat(objectList);
      return {
        dataSource: list,
        count: totalNum
      };
    },

    /** 点击编辑规划 */
    handlePlanManange(record) {
      // 改字段为了和后续页面联动规划区域问题
      const districtIdList = [[String(record.provinceId), String(record.cityId), String(record.districtId)]];
      setEditData({
        visible: true,
        ...record,
        districtIdList,
      });
    },

    /** 搜索 */
    onSearch(params) {
      setFilters({ ...params });
    },

    // 导出excel
    async exportExcel() {
      if (isLock.current) return;
      isLock.current = true;

      const { pcdIds } = form.getFieldsValue();
      const districtIds: number[] = pcdIds ? pcdIds.map(subArray => subArray[2]) : []; // 获取每个子数组的第三个元素--区域id

      V2Message.info(`正在导出中，请稍等`);
      const { url } = await exportNetworkExcel({
        branchCompanyId: branchCompanyId,
        planId: planId,
        districtIds,
      });
      downloadFile({
        downloadUrl: url,
      });
      isLock.current = false;
    }
  });

  /** 默认表头 */
  const defaultColumns = [

    { title: '省份',
      key: 'provinceName',
      dragChecked: true,
      dragDisabled: true,
      width: 170,
      render: (value) => (isNotEmptyAny(value) ? value : '-'),
      onCell: (_, index) => ({
        colSpan: (index as number) === 0 ? 3 : 1,
      }),
    },

    { title: '城市',
      key: 'cityName',
      dragChecked: true,
      dragDisabled: true,
      width: 170,
      render: (value) => (isNotEmptyAny(value) ? value : '-'),
      onCell: (_, index) => ({
        colSpan: (index as number) === 0 ? 0 : 1,
      }),
    },

    { title: '区县',
      key: 'districtName',
      dragChecked: true,
      dragDisabled: true,
      width: 170,
      render: (value) => (isNotEmptyAny(value) ? value : '-'),
      onCell: (_, index) => ({
        colSpan: (index as number) === 0 ? 0 : 1,
      }),
    },
    /** **********************************************8 */
    { title: '总商圈数',
      key: 'recommendBusinessCount',
      dragChecked: true,
      dragDisabled: true,
      width: 120,
      render: (value) => (isNotEmptyAny(value) ? value : '-')
    },

    { title: '已推荐商圈',
      key: 'parentCompanyPlanBusinessCount',
      dragChecked: true,
      dragDisabled: true,
      width: 120,
      render: (value) => (isNotEmptyAny(value) ? value : '-'),
    },

    { title: '平均品牌适合度',
      key: 'avgProba',
      dragChecked: true,
      dragDisabled: true,
      width: 140,
      render: (value) => (isNotEmptyAny(value) ? value.toFixed(1) + '%' : '-')

    },

    { title: '预测目标值',
      key: 'predictTargetValue',
      dragChecked: true,
      dragDisabled: true,
      width: 120,
      render: (value) => (isNotEmptyAny(value) ? value : '-')
    },
    {
      title: '预测市场容量',
      dataIndex: 'circleCapacityNum',
      key: 'circleCapacityNum',
      dragChecked: true,
      width: 148,
      render: (text) => text || '-'
    },

    { title: '分公司规划数',
      key: 'childCompanyPlanBusinessCount',
      dragChecked: true,
      dragDisabled: true,
      width: 120,
      render: (value) => (isNotEmptyAny(value) ? value : '-')
    },

    { title: '操作',
      key: 'operate',
      fixed: 'right',
      dragChecked: true,
      width: 120,
      // hidden: !editable,
      // onCell: (_, index) => ({
      //   colSpan: (index as number) === 0 ? 0 : 1,
      // }),
      render: (value, record, index) =>
        (index as number) === 0 ? <></> : <a onClick={() => methods.handlePlanManange(record)}>规划管理</a>
    },
  ];

  return (
    <>
      <V2Container
        className={styles.container}
        emitMainHeight={(h) => setMainHeight(h)}
        style={{ height: 'calc(100vh - 88px)' }}
        extraContent={{
          top: <>
            <V2Title type='H1' text='规划统计' style={{ marginTop: 20, color: '#222', }}
              extra={<Button type='primary' onClick={() => methods.exportExcel()}>导出</Button>}
            />
            <Divider />
          </>
        }}
      >

        <SearchForm
          form={form}
          onSearch={methods.onSearch}
          className={styles.searchConatin}
        >
          <V2FormCascader
            label='规划区域'
            name='pcdIds'
            options={refactorSelection(selections.cities, { children: 'child' })}
            config={{ multiple: true, showCheckedStrategy: Cascader.SHOW_CHILD, maxTagCount: 'responsive' }}
            onChange={methods.updateSearchNum}
          />
        </SearchForm>

        <V2Table
          rowKey='id'
          filters={filters}
          onFetch={methods.onFetch}
          // 勿删! 64：分页模块总大小、52:分页模块减去paddingBottom的值、42:table头部
          scroll={{ y: mainHeight - 56 - 54 - 62 }}
          defaultColumns={defaultColumns}
          hideColumnPlaceholder
        />

      </V2Container>
      <Edit
        detail={editData}
        setDetail={setEditData}
        onReset={methods.onSearch}
        originPath={'/networkbranchplanstatistics'} // 规划统计
        isBranch={false}
        branchCompanyName={branchCompanyName}
      />
    </>
  );
};

export default PlanningStatistics;
