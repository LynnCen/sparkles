import { FC, useState } from 'react';
import styles from './index.module.less';
import { Button, Cascader, Form, Space } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import SearchForm from '@/common/components/Form/SearchForm';
import V2FormCascader from '@/common/components/Form/V2FormCascader/V2FormCascader';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import DistrictModal from './DistrictModal';
import SearchModal from './SearchModal';
import { V2Confirm } from '@/common/components/Others/V2Confirm';
import { useMethods } from '@lhb/hook';
import { each, isArray, isNotEmpty, refactorSelection } from '@lhb/func';
import { post } from '@/common/request';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import cs from 'classnames';

const PlanSearch: FC<any> = ({
  searchForm,
  searchMoreForm,
  refactorParams,
  searchNum,
  setSearchNum,
  onSearch,
  onReset,
  totalNumber,
  selections,
  detail,
  isBranch, // 是否是分公司
  statistics,
  // otherKeys,
  // close
}) => {
  const [districtVisible, setDistrictVisible] = useState<boolean>(false);// 新增商圈抽屉开关
  const [searchVisible, setSearchVisible] = useState<boolean>(false);// 全部筛选Modal开关


  const methods = useMethods({
    subAll() {
      if (!totalNumber) {
        V2Message.warning('请确认当前筛选项经过查询后是存在相关数据的');
      } else {
        V2Confirm({
          content: '是否将当前筛选条件下的所有项添加规划',
          onSure() {
            // 全部规划操作
            // https://yapi.lanhanba.com/project/546/interface/api/60633
            post('/plan/addAll', {
              branchCompanyId: detail.branchCompanyId,
              planId: detail.planId,
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
              secondLevelCategory: detail.industries?.map(item => item.name),
              ...refactorParams()
            }, true).then(() => {
              V2Message.success('操作成功');
              onSearch();
              onReset?.();
            });
          }
        });
      }
    },
    moreSearch() { // 唤起全部筛选时，需要把是否已规划和是否已开店的值同步给弹窗。
      const params = searchMoreForm.getFieldsValue();
      // 把外漏筛选的参数合并给弹窗内的全量筛选
      searchMoreForm.setFieldsValue({
        ...params,
        ...searchForm.getFieldsValue()
      });
      setSearchVisible(true);
    },
    onSearchSyncParams(params) { // 全部筛选在搜索时，需要把是否已规划和是否已开店的值同步给外显。
      searchForm.setFieldsValue({
        districtIdList: params.districtIdList,
        secondLevelCategory: params.secondLevelCategory,
        isPlanned: params.isPlanned
      });
      // 同时需要更新全部筛选的number统计值
      methods.computedSearchNum(params);
      onSearch(params);
    },
    computedSearchNum(params) { // 更新setSearchNum的值
      let num = 0;
      each(params, (item, key) => {
        if (
          (isArray(item) && (item[0] || item[1])) || // 如果是数组，那至少要有其中一个值
          (!isArray(item) && isNotEmpty(item)) // 如果不是数组，就不能为空
        ) { // 有值的才做插入
          if (key !== 'no-mean') { // 规避掉 no-mean
            num++;
          }
        }
      });
      setSearchNum(num);
    },
    updateSearchNum() {
      const _params = searchForm.getFieldsValue();
      const _params2 = searchMoreForm.getFieldsValue();
      const mergeParams = {
        ..._params2,
        ..._params,
      };
      methods.computedSearchNum(mergeParams);
    },
    onCustomerReset() {
      searchMoreForm.resetFields();
      setSearchNum(0);
    },
    closeModal() {
      setDistrictVisible(false);
      onSearch?.();
      onReset?.();
    },
    // toMap() {
    //   close?.();
    //   const isOpenStore = searchMoreForm.getFieldValue('isOpenStore');
    //   const isPlanned = searchMoreForm.getFieldValue('isPlanned');
    //   // 全部筛选需要用到的数据 保存到session，供地图模式使用
    //   setSession('planManagementDetail', {
    //     detail, // 用于表单额外数据
    //     // 如果没点开高级筛选是不会把外部两个筛选项带进去的，所以需要合并一下
    //     formData: Object.assign({}, searchMoreForm.getFieldsValue(), searchForm.getFieldsValue()), // 用于表单回显
    //     visible: false,
    //   });
    //   // 用于接口使用
    //   const urlParams = {
    //     planId: detail.planId,
    //     branchCompanyId: detail.branchCompanyId,
    //     isBranch: isBranch,
    //     otherKeys: otherKeys,
    //     isOpenStore,
    //     isPlanned
    //   };
    //   dispatchNavigate(`/recommend/networkplaneditmap?params=${JSON.stringify(urlParams)}`);
    // }
  });
  return (
    <div className={styles.searchBox}>
      <SearchForm
        form={searchForm}
        labelLength={isBranch ? 4 : 6}
        onSearch={onSearch}
        onCustomerReset={methods.onCustomerReset}
        colon={false}
        className={cs(styles.flexRightSearch, 'form-search')}
      >
        <V2FormCascader
          label='规划区域'
          name='districtIdList'
          options={refactorSelection(selections.cities, { children: 'child' })}
          config={{ multiple: true, showCheckedStrategy: Cascader.SHOW_CHILD, maxTagCount: 'responsive' }}
          onChange={methods.updateSearchNum}
        />
        <V2FormCascader
          label='规划商圈'
          name='secondLevelCategory'
          options={refactorSelection(selections.businesses, { children: 'child' })}
          config={{ multiple: true, showCheckedStrategy: Cascader.SHOW_CHILD, maxTagCount: 'responsive' }}
          onChange={methods.updateSearchNum}
        />
        <V2FormSelect
          label={`${isBranch ? '规划状态' : '总部推荐状态'}`}
          name='isPlanned'
          // planStatus为'xx规划' isPlanned为'xx推荐'
          options={refactorSelection(isBranch ? selections.planStatus : selections.isPlanned)}
          onChange={methods.updateSearchNum}
        />
        <Form.Item>
          <div className={styles.moreSearch} onClick={methods.moreSearch}>
            筛选条件
            {searchNum ? <>
              <span className={styles.searchNumber}>{searchNum}</span>
            </> : undefined}<RightOutlined />
          </div>
        </Form.Item>
      </SearchForm>
      <div className={styles.flexRightMoreOperate}>
        <div className={styles.moreOperateNum}>
          <span>总共商圈数量</span>
          <span className={styles.moreOperateNumber}>{totalNumber}</span>
          <span className={styles.moreDes}>（
            {/* 最低品牌评分: <span className={styles.count}> {statistics?.minTotalScore ? statistics?.minTotalScore.toFixed(0) : '-'}   </span> */}
            {/* 最低品牌适合度: <span className={styles.count}>{statistics?.minProda || '-'}</span> */}
          平均适合度: <span className={styles.count}>{statistics?.avgProba || '-' }</span>
          预测目标值: <span className={styles.count}>{statistics?.targetValue || '-'}</span>）
          </span>
        </div>
        <Space>
          {/* 全部规划按钮隐藏: https://confluence.lanhanba.com/pages/viewpage.action?pageId=104599955 */}
          {/* <Button type='primary' onClick={methods.subAll}>
            {isBranch ? '全部规划' : '全部设为推荐'}
            <Tooltip title='筛选后的全部商圈一键全部规划' overlayClassName={styles.customTip}>
              <InfoCircleOutlined />
            </Tooltip>
          </Button> */}
          {isBranch && <Button onClick={() => setDistrictVisible(true)}>
            新增商圈
          </Button>}
          {/* <Button onClick={methods.toMap}>
            地图模式
          </Button> */}
        </Space>
      </div>
      <DistrictModal
        planId={detail.planId}
        branchCompanyId={detail.branchCompanyId}
        visible={districtVisible}
        close={() => methods.closeModal()}
        onAdd={() => {
          onSearch?.();
          onReset?.();
        }}
      />
      <SearchModal
        isBranch={isBranch}
        form={searchMoreForm}
        selections={selections}
        detail={detail}
        searchNum={searchNum}
        onSearch={methods.onSearchSyncParams}
        computedSearchNum={methods.computedSearchNum}
        visible={searchVisible}
        close={() => setSearchVisible(false)}/>
    </div>
  );
};

export default PlanSearch;
