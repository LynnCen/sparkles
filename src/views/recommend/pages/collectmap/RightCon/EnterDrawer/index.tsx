/**
 * @Description 集客点录入抽屉
 */

import V2Drawer from '@/common/components/Feedback/V2Drawer';
import styles from './index.module.less';
import V2Title from '@/common/components/Feedback/V2Title';
import V2Form from '@/common/components/Form/V2Form';
import { Button, Col, Form, Row, Space } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { EnvironmentOutlined } from '@ant-design/icons';
import V2FormCascader from '@/common/components/Form/V2FormCascader/V2FormCascader';
import V2Tabs from '@/common/components/Data/V2Tabs';
import IconFont from '@/common/components/IconFont';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import { V2Confirm } from '@/common/components/Others/V2Confirm';
import TabForm from './TabForm';
import DrawingBoard from './DrawingBoard';
import { tabsKeys } from '../../ts-config';
import { isNotEmptyAny, refactorSelection } from '@lhb/func';
import { get, post } from '@/common/request';
import { getTreeSelection } from '@/common/api/networkplan';
import { approvalReboot, createApproval } from '@/common/api/expandStore/approveworkbench';
import { status } from '../../ts-config';

const EnterDrawer = ({ open, setOpen, onRefresh }) => {
  const [form] = Form.useForm();
  const [mapIns, setMapIns] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeKey, setActiveKey] = useState(tabsKeys.firstTabKey);
  const [lineInfo, setLineInfo] = useState<any>(null);
  const [relationDetail, setRelationDetail] = useState<any>({});
  const [districtTypeOptions, setDistrictTypeOptions] = useState<any>([]);
  const [tableFormLength, setTableFormLength] = useState<any>({});
  const tableFormLengthRef = useRef<any>(null);
  const mapInsRef = useRef<any>(null);
  const defaultTabItem = {
    key: tabsKeys.firstTabKey,
    label: '集客点1',
  };
  const tabItemsRef = useRef<any>([defaultTabItem]);

  const lineInfoRef = useRef<any>(null);
  // const newTabIndex = useRef(2);
  const [tabItems, setTabItems] = useState<any>([defaultTabItem]);
  const tabKeys = ['firstTabKey', 'secondTabKey', 'thirdTabKey'];


  useEffect(() => {
    if (open.visible && open.value?.planClusterId) {
      form.resetFields();
      setActiveKey(tabsKeys.firstTabKey);
      setTableFormLength({});
      getRelationDetail();
    }
  }, [open]);

  useEffect(() => {
    getDistrictTypeOptions();
  }, []);

  /* methods */
  /**
   * @description 获取集客点详情
   */
  const getRelationDetail = () => {
    // https://yapi.lanhanba.com/project/546/interface/api/59667
    get('/plan/spot/relation/detail', { planClusterId: open.value?.planClusterId }, { needHint: true }).then((data) => {
      setRelationDetail(data);
      const resetForm: any = {
        businessType: []
      };
      // 重组form表单数据
      const newTabItems: any = [];
      const initTableFormLen: any = {};
      if (data.planSpots?.length) {
        if (data.firstLevelCategory) {
          resetForm.businessType.push(data.firstLevelCategory);
        }
        if (data.secondLevelCategory) {
          resetForm.businessType.push(data.secondLevelCategory);
        }
        if (data.thirdLevelCategory) {
          resetForm.businessType.push(data.thirdLevelCategory);
        }
        data.planSpots.map((item, index) => {
          initTableFormLen[tabKeys[index]] = {};
          if (item.competitors?.length) {
            const competitors = {};
            item.competitors.map((itm, index) => {
              competitors[`${index}`] = itm;
            });
            initTableFormLen[tabKeys[index]]['competitors'] = item.competitors.length;
            item.competitors = competitors;
          }
          if (item.landlords) {
            const landlords = {};
            item.landlords.map((itm, index) => {
              landlords[`${index}`] = itm;
            });
            initTableFormLen[tabKeys[index]]['landlords'] = item.landlords.length;
            item.landlords = landlords;
          }
          resetForm[tabKeys[index]] = item;
          newTabItems.push({
            key: tabsKeys[tabKeys[index]],
            label: `集客点${index + 1}`,
          });
          if (!initTableFormLen[tabKeys[index]]['competitors']) {
            initTableFormLen[tabKeys[index]]['competitors'] = 1;
          }
          if (!initTableFormLen[tabKeys[index]]['landlords']) {
            initTableFormLen[tabKeys[index]]['landlords'] = 1;
          }
        });
      } else {
        // 未提交则默认添加一个集客点
        resetForm[tabsKeys.firstTabKey] = null;
        newTabItems.push({
          key: tabsKeys.firstTabKey,
          label: `集客点1`,
        });
        initTableFormLen[tabsKeys.firstTabKey] = {
          competitors: 1,
          landlords: 1
        };
      }
      setTableFormLength(initTableFormLen);
      tableFormLengthRef.current = initTableFormLen;
      tabItemsRef.current.splice(0, tabItemsRef.current.length, ...newTabItems);
      form.setFieldsValue(resetForm);
      refactorTabItems();
    });
  };

  const getDistrictTypeOptions = () => {
    getTreeSelection({ type: 3 }).then((data) => {
      const options = refactorSelection(data, { children: 'child' });
      setDistrictTypeOptions(options);
    });
  };

  const onChange = (key: any) => {
    setActiveKey(key);
  };
  // 添加集客点tab
  const addTabItemHandle = () => {
    if (tabItemsRef.current.length >= 3) {
      V2Message.warning('最多添加3个集客点');
    } else {
      const newActiveKey = Object.values(tabsKeys).filter((item) => !tabItemsRef.current.map((item) => item.key).includes(item))[0];
      tabItemsRef.current.push({ key: newActiveKey, label: `集客点${tabItemsRef.current.length + 1}` });
      setActiveKey(newActiveKey);
      tableFormLengthRef.current[newActiveKey] = { landlords: 1, competitors: 1 };
      setTableFormLength({ ...tableFormLengthRef.current });
      refactorTabItems();
    }
  };
  // 添加集客点tab(ps：这里会存在闭包问题，拿不到最新的state)
  const deleteItemHandle = (targetKey: string) => {
    if (tabItemsRef.current.length === 1) {
      V2Message.warning('至少保留一个集客点');
      return;
    }
    V2Confirm({
      content: '确认删除此集客点吗？',
      onOk: () => {
        const targetIndex = tabItemsRef.current.findIndex(pane => pane.key === targetKey);
        tabItemsRef.current.splice(targetIndex, 1);
        const { key } = tabItemsRef.current[targetIndex === tabItemsRef.current.length ? targetIndex - 1 : targetIndex];
        setActiveKey(key);
        tableFormLengthRef.current[targetKey] = null;
        setTableFormLength({ ...tableFormLengthRef.current });
        form.setFieldsValue({ [targetKey]: null });
        refactorTabItems();

        // 清除该tab下面的集客点线段
        lineInfoRef.current?.[targetKey]?.marker?.map((item) => {
          item && mapInsRef.current?.remove(item);
        });
        setLineInfo({
          ...lineInfoRef.current,
          [targetKey]: null
        });

      },
    });
  };

  // 重组tabItems
  const refactorTabItems = () => {
    const newTabItem = tabItemsRef.current.map((item, index) => {
      return {
        key: item.key,
        label: (<span>{`集客点${index + 1}`}<IconFont
          iconHref='iconic-closexhdpi'
          className='ml-6 fs-14 c-869'
          onClick={(e) => {
            e.stopPropagation();
            deleteItemHandle(item.key);
          }} />
        </span>),
      };
    });
    tabItemsRef.current = newTabItem;
    setTabItems(newTabItem);
  };

  const onSubmit = () => {
    form.validateFields().then((values: any) => {
      const firstLevelCategory = values.businessType[0]; // 商圈一级类目
      const secondLevelCategory = values.businessType[1]; // 商圈二级类目
      const thirdLevelCategory = values.businessType[2]; // 商圈三级类目
      const planSpots: any = [];
      // 遍历拿到子集相关值
      for (const spot in values) {
        if (tabKeys.includes(spot)) {
          if (isNotEmptyAny(values[spot]?.competitors)) {
            const competitors: any = [];
            // eslint-disable-next-line guard-for-in
            for (const comp in values[spot].competitors) {
              competitors.push(values[spot].competitors[comp]);
            }
            values[spot].competitors = competitors;
          }
          if (isNotEmptyAny(values[spot]?.landlords)) {
            const landlords: any = [];
            // eslint-disable-next-line guard-for-in
            for (const land in values[spot].landlords) {
              landlords.push(values[spot].landlords[land]);
            }
            values[spot].landlords = landlords;
          }
          if (!lineInfo?.[spot]?.marker) {
            V2Message.error('请在所有集客点中绘制动线');
            return;
          }
          values[spot].moveLineList = lineInfo[spot]?.marker?.map((marker) => {
            return marker.getPath().map((item) => ({
              lng: item.lng,
              lat: item.lat
            }));
          });
          planSpots.push(values[spot]);
          delete values[spot];
        }
      }
      const params = {
        planClusterId: relationDetail.planClusterId,
        ...values,
        firstLevelCategory,
        secondLevelCategory,
        thirdLevelCategory,
        planSpots,
        planSpotCount: planSpots.length
      };
      setLoading(true);
      // https://yapi.lanhanba.com/project/546/interface/api/59688
      post('/plan/spot/batchSave', { ...params }, {
        needHint: true,
      }).then(() => {
        if (relationDetail.approvalId && relationDetail.spotStatus === status.DENY) { // 已驳回时才能重新发起
          approvalReboot({ id: relationDetail.approvalId }).then(() => {
            V2Message.success(`重新发起成功`);
            onRefresh();
            onCancel();
          }).finally(() => setLoading(false));
        } else {
          createApproval({ type: 8, typeValue: 16, id: relationDetail.planClusterId }).then(() => {
            V2Message.success('提交成功');
            onRefresh();
            onCancel();
          }).finally(() => setLoading(false));
        }
      }).catch(() => setLoading(false));
    }).catch((err) => {
      V2Message.warning(err.errorFields[0].errors[0]);
    });
  };

  const onCancel = () => {
    form.resetFields();
    setOpen({
      visible: false,
      value: null
    });
    setLineInfo(null);
    // 关闭时，清除覆盖物
    mapIns?.clearMap();
    // 关闭时，清除所画动线（按理说有了上面的，就不需要清除下面的逻辑）
    // Object.values(lineInfo || {}).map((item:any) => {
    //   item?.marker?.map((m) => {
    //     m && mapIns.remove(m);
    //   });
    // });
  };

  useEffect(() => {
    lineInfoRef.current = lineInfo;
  }, [lineInfo]);
  useEffect(() => {
    mapInsRef.current = mapIns;
  }, [mapIns]);
  return (
    <V2Drawer
      className={styles.enterDrawerWrap}
      open={open.visible}
      onClose={onCancel}
      bodyStyle={{ paddingBottom: '88px' }}
      keyboard={false}
      contentWrapperStyle={{
        width: '1008px',
      }}>
      <V2Title type='H1' text={relationDetail.name} />
      <Space size={24} className={styles.drawerTop}>
        <div className={styles.topItem}><EnvironmentOutlined className='c-666' /><span className='ml-4 c-666 fs-13'>{relationDetail.province || ''}{relationDetail.city || ''}{relationDetail.district || ''}</span></div>
        <div className={styles.topItem}><span className='c-999 fs-14'>已开门店数</span><span className='c-222 ml-4 fs-14'>{relationDetail.openStores ? `${relationDetail.openStores}家` : 0}</span></div>
      </Space>
      <V2Form form={form} className='mt-24'>
        <Row gutter={24}>
          <Col span={8}>
            <V2FormCascader required label='商圈类型' name='businessType' options={districtTypeOptions} config={{ showSearch: true }} />
          </Col>
        </Row>
        <div className={styles.tabs}>

          <V2Tabs
            items={tabItems}
            onChange={onChange}
            activeKey={activeKey}
            tabBarExtraContent={{
              right: <div className={styles.tabItemAddBtn} onClick={addTabItemHandle}><IconFont iconHref='iconic_add_xiangqing' /><span className='c-132 fs-14 ml-4'>新增集客点</span></div>,
            }}/>
          { tableFormLength[tabsKeys.firstTabKey] && <div className={activeKey === tabsKeys.firstTabKey ? styles.showTab : styles.hindTab}><TabForm keyName={tabsKeys.firstTabKey} tableFormLength={tableFormLength} setTableFormLength={setTableFormLength} /></div> }
          { tableFormLength[tabsKeys.secondTabKey] && <div className={activeKey === tabsKeys.secondTabKey ? styles.showTab : styles.hindTab}><TabForm keyName={tabsKeys.secondTabKey} tableFormLength={tableFormLength} setTableFormLength={setTableFormLength} /></div> }
          { tableFormLength[tabsKeys.thirdTabKey] && <div className={activeKey === tabsKeys.thirdTabKey ? styles.showTab : styles.hindTab}><TabForm keyName={tabsKeys.thirdTabKey} tableFormLength={tableFormLength} setTableFormLength={setTableFormLength} /></div> }
          {/* 集客点动线始末- ui要求不同tabs下面的地图一致，所以通过在tabs内容中留白，DrawingBoard绝对定位嵌入进去 */}
          <DrawingBoard
            tabItems={tabItems}
            keyName={activeKey}
            setLineInfo={setLineInfo}
            lineInfo={lineInfo}
            mapIns={mapIns}
            setMapIns={setMapIns}
            relationDetail={relationDetail}
            value={open?.value}
            visible={open?.visible}
          />
        </div>

      </V2Form>
      <div className={styles.drawerFooter}>
        <Space size={12}>
          <Button onClick={onCancel}>取消</Button>
          <Button
            type='primary'
            loading={loading}
            onClick={onSubmit}>提交</Button>
        </Space>
      </div>
    </V2Drawer>
  );
};

export default EnterDrawer;
