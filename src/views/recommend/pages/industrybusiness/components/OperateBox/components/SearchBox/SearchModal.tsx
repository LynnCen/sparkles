import { FC, useEffect, useState } from 'react';
import cs from 'classnames';
import styles from './index.module.less';
import { Button, Modal } from 'antd';
import V2Form from '@/common/components/Form/V2Form';
// import V2Anchor from '@/common/components/Others/V2Anchor';
import V2Title from '@/common/components/Feedback/V2Title';
import { useMethods } from '@lhb/hook';
import { isNotEmpty } from '@lhb/func';
// import { post } from '@/common/request';
// import { unstable_batchedUpdates } from 'react-dom';
// import { getStoreRateSuccess } from '@/common/api/networkplan';
// import { setSession } from '@lhb/cache';
import SearchFrom from './SearchFrom';
// const { Link } = Anchor;

const SearchModal: FC<any> = ({
  form,
  visible,
  close,
  selections,
  // detail,
  searchNum, // 筛选项个数
  onSearch,
  onReset,
  computedSearchNum // 计算筛选项个数
}) => {

  // const [labels, setLabels] = useState<any>({});
  const [cacheParams, setCacheParams] = useState<any>();
  // const [featureMap, setFeatureMap] = useState<any>();

  const methods = useMethods({
    // updateLabels(keys, open) {
    //   if (!open) { // blur的时候，触发计算，降低接口请求频率
    //     const enName = keys[0][0];
    //     const min = form.getFieldValue(keys[0]);
    //     const max = form.getFieldValue(keys[1]);
    //     if ((isNotEmpty(min) && isNotEmpty(max)) && min > max) { // 目前所有筛选项都是有这个逻辑
    //       setLabels({
    //         ...labels,
    //         [enName]: null
    //       });
    //       return;
    //     }
    //     if (!isUndef(min) || !isUndef(max)) {
    //       getStoreRateSuccess({
    //         branchCompanyId: detail.branchCompanyId,
    //         // cityIds: detail.cities?.map(item => item.id),
    //         districtIdList: detail.cities?.map(item => {
    //           // 兼容历史数据
    //           if (isArray(item)) {
    //             const len = item.length;
    //             if (len === 3) return item[2].id; // 1026改为筛选项为省市区了
    //             return item[1].id; // 兼容历史数据（省市）
    //           }
    //           return null;
    //         }
    //         ),
    //         planClusterFeatureRequestList: [
    //           {
    //             enName,
    //             minValue: min,
    //             maxValue: max,
    //           }
    //         ]
    //       }).then((res) => {
    //         setLabels({
    //           ...labels,
    //           [enName]: res[0]?.successRate || 0
    //         });
    //       });
    //     } else {
    //       setLabels({
    //         ...labels,
    //         [enName]: null
    //       });
    //     }
    //   }
    // },
    // getLabel(label, key: string) {
    //   const value = labels[key];
    //   return (
    //     <span>
    //       {label}
    //       {
    //         !isUndef(value) ? <span className={styles.searchModalLabel}>该范围好店占比 {labels[key]}%</span> : undefined
    //       }
    //     </span>
    //   );
    // },
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
    // resetLabels(oldParams, originFeature) {
    //   const newFeature = originFeature || featureMap;
    //   const planClusterFeatureRequestList: any[] = [];
    //   each(oldParams, (item: any, key: string) => {
    //     // 只把动态项拿来请求计算，红线筛选和其他筛选里的内容应该被过滤掉。
    //     if (
    //       newFeature[key] &&
    //       (isArray(item) && (item[0] || item[1]))
    //     ) { // 有值的才做插入
    //       if (key !== 'no-mean') { // 规避掉no-mean
    //         planClusterFeatureRequestList.push({
    //           enName: key,
    //           minValue: item[0],
    //           maxValue: item[1]
    //         });
    //       }
    //     }
    //   });
    //   // if (planClusterFeatureRequestList.length) {
    //   //   getStoreRateSuccess({
    //   //     branchCompanyId: detail.branchCompanyId,
    //   //     // cityIds: detail.cities?.map(item => item.id),
    //   //     cityIds: detail.cities?.map(item => {
    //   //       // 兼容历史数据
    //   //       if (isArray(item)) {
    //   //         const len = item.length;
    //   //         if (len === 3) return item[2].id; // 1026改为筛选项为省市区了
    //   //         return item[1].id; // 兼容历史数据（省市）
    //   //       }
    //   //       return null;
    //   //     }),
    //   //     planClusterFeatureRequestList
    //   //   }).then((res) => {
    //   //     setLabels(res.reduce((obj, item) => {
    //   //       obj[item.enName] = item.successRate;
    //   //       return obj;
    //   //     }, {}));
    //   //   });
    //   // }
    // },
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
        // setSession('planManagementDetail', {
        //   detail, // 用于表单额外数据
        //   // 如果没点开高级筛选是不会把外部两个筛选项带进去的，所以需要合并一下
        //   formData: form.getFieldsValue(), // 用于表单回显
        //   visible: false,
        // });
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
      // setLabels({});
      // 组装动态选项。
      // if (!featureMap) {
      // https://yapi.lanhanba.com/project/546/interface/api/60458
      // post('/planCluster/feature', {
      //   branchCompanyId: detail.branchCompanyId,
      //   planId: detail.planId,
      //   // cityIds: detail.cities?.map(item => item.id),
      //   cityIds: detail.cities?.map(item => {
      //     // 兼容历史数据
      //     if (isArray(item) && item.length) {
      //       // const len = item.length;
      //       // if (len === 3) return item[2].id; // 1026改为筛选项为省市区了
      //       return item[1].id; // 接口说这个只能传城市
      //     }
      //     return null;
      //   }),
      // }, {
      //   needHint: true,
      //   // isMock: true,
      //   // mockId: 546,
      //   // mockSuffix: '/api',
      // }).then((res) => {
      //   const newFeature = res.reduce((res, item) => {
      //     res[item.enName] = item.cutBin;
      //     return res;
      //   }, {});
      //   unstable_batchedUpdates(() => {
      //     setFeatureMap(newFeature);
      //   });
      //   // 防止未来有可能提前插入动态的查询条件，所以统一都做了处理
      //   methods.resetLabels(oldParams, newFeature);
      // });
    }
  }, [visible]);
  return (
    <Modal
      title='筛选条件'
      open={visible}
      onCancel={methods.cancel}
      // onOk={methods.submit}//之前就注释的
      width={684}
      className={cs(styles.searchModal, 'recommend-network-plan-c1c4ba3a')}
      footer={modalFooterBtn()}
      // 控制是否在组件首次渲染时就将 Modal 的内容渲染到 DOM 树中,让modal中的form可以在首次渲染中加载出来
      forceRender
    >
      {/* <div style={{ display: 'flex' }}> */}
      <V2Form
        form={form}
        style={{ width: '636px' }}
        onValuesChange={methods.formValuesChange}>
        {/* 基础筛选 改了变顺序位置 Module命名没有更改*/}
        <V2Title id='recommend-network-plan-c1c4ba3a-2' text='基础筛选' type='H2' divider
          style={{ margin: '0 0 16px' }} />
        <SearchFrom
          getRangeRules={methods.getRangeRules}
          selections={selections}
          form={form}
          // detail={detail}
        />
      </V2Form>

      {/* 锚点信息 */}
      {/* <div style={{ flex: 1 }}>
          {
            <V2Anchor
              getContainer={() => {
                // 微应用记得判断 container
                const target: HTMLElement = document.querySelector('.recommend-network-plan-c1c4ba3a .ant-modal-body') || document.body;
                return target;
              }}
              offsetTop={25}
              style={{ float: 'right', marginTop: '16px' }}
            >
              { [
                {
                  id: 'recommend-network-plan-c1c4ba3a-2',
                  title: '基础筛选'
                },
              ].map(item => <Link key={item.title} href={`#${item.id}`} title={item.title} />) }
            </V2Anchor>

          }
        </div> */}
      {/* </div> */}
    </Modal>
  );
};

export default SearchModal;
