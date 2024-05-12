import { FC, useEffect, useState } from 'react';
import cs from 'classnames';
import styles from './index.module.less';
import { Anchor, Button, Modal } from 'antd';
import V2Form from '@/common/components/Form/V2Form';
import V2Anchor from '@/common/components/Others/V2Anchor';
import V2Title from '@/common/components/Feedback/V2Title';
// import Module1 from './FormModule/Module1';
import Module2 from './FormModule/Module2';
import Module3 from './FormModule/Module3';
import Module4 from './FormModule/Module4';
import Module5 from './FormModule/Module5';
import { useMethods } from '@lhb/hook';
import { each, isArray, isNotEmpty, isUndef } from '@lhb/func';
import { post } from '@/common/request';
import { unstable_batchedUpdates } from 'react-dom';
import { getStoreRateSuccess } from '@/common/api/networkplan';
import { setSession } from '@lhb/cache';
const { Link } = Anchor;

const SearchModal: FC<any> = ({
  form,
  visible,
  close,
  selections,
  detail,
  searchNum, // 筛选项个数
  isBranch, // 是否是分公司
  onSearch,
  onReset,
  computedSearchNum, // 计算筛选项个数
  isSetSession = true, // 是否将筛选项存在本地
}) => {

  const [labels, setLabels] = useState<any>({});
  const [cacheParams, setCacheParams] = useState<any>();
  const [featureMap, setFeatureMap] = useState<any>();
  const [moduleShowMap, setModuleShowMap] = useState<any>({
    module3: false,
    module4: false,
    module5: false,
  });
  const [anchorItems, setAnchorItems] = useState<any[]>([]);

  const methods = useMethods({
    updateLabels(keys, open) {
      if (!open) { // blur的时候，触发计算，降低接口请求频率
        const enName = keys[0][0];
        const min = form.getFieldValue(keys[0]);
        const max = form.getFieldValue(keys[1]);
        if ((isNotEmpty(min) && isNotEmpty(max)) && min > max) { // 目前所有筛选项都是有这个逻辑
          setLabels({
            ...labels,
            [enName]: null
          });
          return;
        }
        if (!isUndef(min) || !isUndef(max)) {
          getStoreRateSuccess({
            branchCompanyId: detail.branchCompanyId,
            // cityIds: detail.cities?.map(item => item.id),
            districtIdList: detail.cities?.map(item => {
              // 兼容历史数据
              if (isArray(item)) {
                const len = item.length;
                if (len === 3) return item[2].id; // 1026改为筛选项为省市区了
                return item[1].id; // 兼容历史数据（省市）
              }
              return null;
            }),
            planClusterFeatureRequestList: [
              {
                enName,
                minValue: min,
                maxValue: max,
              }
            ]
          }).then((res) => {
            setLabels({
              ...labels,
              [enName]: res[0]?.successRate || 0
            });
          });
        } else {
          setLabels({
            ...labels,
            [enName]: null
          });
        }
      }
    },
    getLabel(label, key: string) {
      const value = labels[key];
      return (
        <span>
          {label}
          {
            !isUndef(value) ? <span className={styles.searchModalLabel}>该范围好店占比 {labels[key]}%</span> : undefined
          }
        </span>
      );
    },
    getRangeRules(name) {
      return ({ getFieldValue }) => ({
        validator() {
          const min = getFieldValue(name[0]);
          const max = getFieldValue(name[1]);
          if ((isNotEmpty(min) && isNotEmpty(max)) && min > max) {
            return Promise.reject(new Error('请确保后值大于等于前值'));
          }
          return Promise.resolve();
        },
      });
    },
    resetLabels(oldParams, originFeature) {
      const newFeature = originFeature || featureMap;
      const planClusterFeatureRequestList: any[] = [];
      each(oldParams, (item: any, key: string) => {
        // 只把动态项拿来请求计算，红线筛选和其他筛选里的内容应该被过滤掉。
        if (
          newFeature[key] &&
          (isArray(item) && (item[0] || item[1]))
        ) { // 有值的才做插入
          if (key !== 'no-mean') { // 规避掉no-mean
            planClusterFeatureRequestList.push({
              enName: key,
              minValue: item[0],
              maxValue: item[1]
            });
          }
        }
      });
      if (planClusterFeatureRequestList.length) {
        getStoreRateSuccess({
          branchCompanyId: detail.branchCompanyId,
          // cityIds: detail.cities?.map(item => item.id),
          cityIds: detail.cities?.map(item => {
            // 兼容历史数据
            if (isArray(item)) {
              const len = item.length;
              if (len === 3) return item[2].id; // 1026改为筛选项为省市区了
              return item[1].id; // 兼容历史数据（省市）
            }
            return null;
          }),
          planClusterFeatureRequestList
        }).then((res) => {
          setLabels(res.reduce((obj, item) => {
            obj[item.enName] = item.successRate;
            return obj;
          }, {}));
        });
      }
    },
    cancel() {
      // 如果是取消的就回填进来时缓存的数据。
      form.resetFields();
      form.setFieldsValue(cacheParams);
      const values = form.getFieldsValue(true);
      computedSearchNum && computedSearchNum(values);
      close();
    },
    submit() {
      // 如果是确定的，就关闭弹窗，因为form里已经有数据了。
      form.validateFields().then((res) => {
        close();
        onSearch(res);
        if (isSetSession) {
          setSession('planManagementDetail', {
            detail, // 用于表单额外数据
            // 如果没点开高级筛选是不会把外部两个筛选项带进去的，所以需要合并一下
            formData: form.getFieldsValue(), // 用于表单回显
            visible: false,
          });
        }
      });
    },
    reset() {
      onReset?.();
    },
    // 字段值更新时触发回调事件
    formValuesChange(changedValues: any, allValues: any) {
      computedSearchNum && computedSearchNum(allValues);
    },
  });

  const modalFooterBtn = () => {
    const btnList = [{ key: 'cancel', name: '取消', type: 'default' }, { key: 'submit', name: '确定', type: 'primary' }];

    // 分公司规划-地图模式 需要展示重置按钮
    if (onReset) btnList.unshift({ key: 'reset', name: '重置', type: 'default' });

    return btnList.map((item:any) => {
      return (
        <Button
          key={item.key}
          onClick={methods[item.key]}
          type={item.type}
        >
          {item.name}
          {
            item.key === 'submit' ? `${searchNum > 0 ? `(${searchNum})` : ''}` : ''
          }
        </Button>
      );
    });
  };

  useEffect(() => {
    if (visible) {
      const oldParams = form.getFieldsValue();
      setCacheParams(oldParams);
      // 为了防抖，直接先把所有的好店比例数据清空，再重新组装
      // 因为批量请求计算接口，并没有那么快能返回数据
      setLabels({});
      // 组装动态选项。
      // if (!featureMap) {
      // https://yapi.lanhanba.com/project/546/interface/api/60458
      post('/planCluster/feature', {
        branchCompanyId: detail.branchCompanyId,
        planId: detail.planId,
        // cityIds: detail.cities?.map(item => item.id),
        cityIds: detail.cities?.map(item => {
          // 兼容历史数据
          if (isArray(item) && item.length) {
            // const len = item.length;
            // if (len === 3) return item[2].id; // 1026改为筛选项为省市区了
            return item[1].id; // 接口说这个只能传城市
          }
          return null;
        }),
      }, {
        needHint: true,
        // isMock: true,
        // mockId: 546,
        // mockSuffix: '/api',
      }).then((res) => {
        const newFeature = res.reduce((res, item) => {
          res[item.enName] = item.cutBin;
          return res;
        }, {});
        unstable_batchedUpdates(() => {
          setFeatureMap(newFeature);
          const hasModule3 = newFeature.country_rank || newFeature.avg_house_price || newFeature.gdp || newFeature.old || newFeature.town_income;

          const hasModule4 = newFeature.flow_population || newFeature.shopping_passenger_1000m || newFeature.woman_population_proportion || newFeature.woman_power_300m || newFeature.young_power_1000m || newFeature.work_power_1000m || newFeature.high_consumption_power_300m || newFeature.high_house_price_power_1000m;

          const hasModule5 = newFeature.beauty_brands_1000m || newFeature.leisure_food_brands_300m || newFeature.house_stores_1000m || newFeature.house_price_300m || newFeature.house_price_1000m || newFeature.medical_price_1000m || newFeature.life_customer_price_1000m || newFeature.apartment_customer_price_300m || newFeature.shopping_stores_1000m || newFeature.leisure_stores_1000m || newFeature.food_number_1000m || newFeature.university_stores_1000m || newFeature.office_stores_300m || newFeature.house_stores_1000m || newFeature.leisure_stores_1000m || newFeature.scenic_1000m;

          setModuleShowMap({
            module3: hasModule3,
            module4: hasModule4,
            module5: hasModule5
          });
          const newAnchorItem = [
            {
              id: 'recommend-network-plan-c1c4ba3a-2',
              title: '基础筛选'
            },
            // {
            //   id: 'recommend-network-plan-c1c4ba3a-1',
            //   title: '红线筛选'
            // },
          ];
          if (hasModule3) {
            newAnchorItem.push({
              id: 'recommend-network-plan-c1c4ba3a-3',
              title: '城市分析'
            });
          }
          if (hasModule4) {
            newAnchorItem.push({
              id: 'recommend-network-plan-c1c4ba3a-4',
              title: '客群分析'
            });
          }
          if (hasModule5) {
            newAnchorItem.push({
              id: 'recommend-network-plan-c1c4ba3a-5',
              title: '周边配套分析'
            });
          }
          setAnchorItems(newAnchorItem);
        });
        // 防止未来有可能提前插入动态的查询条件，所以统一都做了处理
        methods.resetLabels(oldParams, newFeature);
      });
      // } else {
      //   methods.resetLabels(oldParams);
      // }
    }
  }, [visible]);
  return (
    <Modal
      title='筛选条件'
      open={visible}
      onCancel={methods.cancel}
      // onOk={methods.submit}
      width={830}
      className={cs(styles.searchModal, 'recommend-network-plan-c1c4ba3a')}
      footer={modalFooterBtn()}
      // 控制是否在组件首次渲染时就将 Modal 的内容渲染到 DOM 树中,让modal中的form可以在首次渲染中加载出来
      forceRender
    >
      <div style={{ display: 'flex' }}>
        <V2Form
          form={form}
          style={{ width: '636px' }}
          onValuesChange={methods.formValuesChange}>
          {/* 基础筛选 改了变顺序位置 Module命名没有更改*/}
          <V2Title id='recommend-network-plan-c1c4ba3a-2' text='基础筛选' type='H2' divider
            style={{ margin: '0 0 16px' }} />
          <Module2
            getRangeRules={methods.getRangeRules}
            selections={selections}
            isBranch={isBranch}
            form={form}
            detail={detail}
          />

          {/* 红线筛选 */}
          {/* <V2Title id='recommend-network-plan-c1c4ba3a-1' text='红线筛选' type='H2' divider style={{ margin: '16px 0' }}/>
          <Module1 getRangeRules={methods.getRangeRules} selections={selections} searchMoreForm={form} /> */}
          {/*
            tip: 动态表单
            之所以不做config映射，是为了可读性，选择纯一点的代码平铺方式，
            不然设计到key，name，min，max，precision，extra等太多参数的配置。
            如果使用 配置遍历，自主去生成代码的话，看似优雅，但对于未来维护人员来说非常不友善，所以这块就没做数据化渲染。
          */}
          {/* 城市分析 */}
          {
            moduleShowMap.module3 && <>
              <V2Title id='recommend-network-plan-c1c4ba3a-3' text='城市分析' type='H2' divider style={{ margin: '16px 0' }}/>
              <Module3
                featureMap={featureMap}
                updateLabels={methods.updateLabels}
                getLabel={methods.getLabel}
                getRangeRules={methods.getRangeRules}
                detail={detail}
                form={form}
              />
            </>
          }
          {/* 客群分析 */}
          {
            moduleShowMap.module4 && <>
              <V2Title id='recommend-network-plan-c1c4ba3a-4' text='客群分析' type='H2' divider style={{ margin: '16px 0' }}/>
              <Module4
                featureMap={featureMap}
                updateLabels={methods.updateLabels}
                getLabel={methods.getLabel}
                getRangeRules={methods.getRangeRules}
                detail={detail}
                form={form}
              />
            </>
          }
          {/* 周边配套分析 */}
          {
            moduleShowMap.module5 && <>
              <V2Title id='recommend-network-plan-c1c4ba3a-5' text='周边配套分析' type='H2' divider style={{ margin: '16px 0' }}/>
              <Module5
                featureMap={featureMap}
                updateLabels={methods.updateLabels}
                getLabel={methods.getLabel}
                getRangeRules={methods.getRangeRules}
                detail={detail}
                form={form}
              />
            </>
          }
        </V2Form>
        <div style={{ flex: 1 }}>
          {
            anchorItems?.length && (
              <V2Anchor
                getContainer={() => {
                  // 微应用记得判断 container
                  const target: HTMLElement = document.querySelector('.recommend-network-plan-c1c4ba3a .ant-modal-body') || document.body;
                  return target;
                }}
                offsetTop={25}
                style={{ float: 'right', marginTop: '16px' }}
              >
                { anchorItems.map(item => <Link key={item.title} href={`#${item.id}`} title={item.title} />) }
              </V2Anchor>
            )
          }
        </div>
      </div>
    </Modal>
  );
};

export default SearchModal;
