import { FC, useEffect, useState, useRef, useMemo } from 'react';
import styles from '../entry.module.less';
import FormSearch from '@/common/components/Form/SearchForm';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import V2FormProvinceList from '@/common/components/Form/V2FormProvinceList';
import { Badge, Button, Cascader, Form, Radio } from 'antd';
import { getRequirementSelection, postRequirementAssignFollowerAll } from '@/common/api/demand-management';
import ImportData from './ImportData';
import { refactorSelectionNew } from '@/common/utils/ways';
import { contrast, urlParams } from '@lhb/func';
import FormTenant from '@/common/components/FormBusiness/FormTenant';
import { useMethods } from '@lhb/hook';
import V2FormInputNumber from '@/common/components/Form/V2FormInputNumber/V2FormInputNumber';
import FormUserList from '@/common/components/FormBusiness/FormUserList';
import V2FormCascader from '@/common/components/Form/V2FormCascader/V2FormCascader';
import V2FormRangeInput from 'src/common/components/Form/V2FormRangeInput/V2FormRangeInput';
import { DemandStatus } from '../ts-config';
import FormResourceBrand from 'src/common/components/FormBusiness/FormResourceBrand';
import FormContacts from '@/common/components/FormBusiness/FormContacts';
import V2FormRangePicker from '@/common/components/Form/V2FormRangePicker/V2FormRangePicker';
import FormPreSelect from 'src/common/components/FormBusiness/FormPreSelect';
import FollowerModal from '@/common/components/Modal/FollowerModal';
import dayjs from 'dayjs';

const { SHOW_CHILD } = Cascader;

// 需求管理搜索
const DemandManagementSearch: FC<{
  onSearch: any,
  searchForm: any,
  permissions: any[],
  edit?: (val?: number) => void, // 新增/编辑需求
  type: String, // 需求类型 '1' 全部，'2' 待审核，'3' 已审核，'4' 待外呼，'5' 待跟进，'6' 有需求，'7' 无需求，
  setTwoLevelTab: any, // 设置二级tab的值
  twoLevelTab: number // 二级tab的值
  allNum: number, // 二级tab‘全部’的数量
  myNum: number, // 二级tab‘我的’的数量
}> = ({ onSearch, searchForm, permissions, edit, type = '1', setTwoLevelTab, twoLevelTab = 1, myNum = 0 }) => {
  const PRE_SEARCH_TYPE_EMPTY = 3;// 前置筛选为 ’为空‘
  const importDataRef = useRef<any>(null);
  const demandManagementSearch = [DemandStatus.ALL, DemandStatus.WAIT_OUT_CALL, DemandStatus.WAIT_FOLLOW_UP, DemandStatus.HAS_DEMAND, DemandStatus.NOT_DEMAND] as any;
  const demandStageTabs = [DemandStatus.WAIT_OUT_CALL, DemandStatus.WAIT_FOLLOW_UP, DemandStatus.HAS_DEMAND, DemandStatus.NOT_DEMAND] as any;

  /** 待跟进、全部跟进阶段显示逻辑 */
  const renderFollowedStatus = useMemo(() => {
    // 待跟进 tab 下只有全部显示'跟进阶段'筛选
    if (type === DemandStatus.WAIT_FOLLOW_UP && twoLevelTab === 1) return true;

    return false;

  }, [type, twoLevelTab]);

  const twoLevelTabs = [
    { value: 3, label: '我的待初访', count: myNum || 0 },
    { value: 4, label: '我的已初访', count: 0 },
    { value: 1, label: '全部', count: 0 },
  ];

  const [selection, setSelection] = useState({
    demandOptions: [], // 需求类型
    demandTags: [], // 需求标签
    statuses: [
      { value: 1, label: '未开放' },
      { value: 2, label: '开放中' },
    ], // 需求状态
    // 需求等级
    demandLevels: [],
    // 内部标签
    locxxInternalLabels: [],
    commercials: [], // 业态
    auditStatus: [
      { value: 1, label: '待审核' },
      { value: 2, label: '已通过' },
      { value: 3, label: '已拒绝' },
    ],
    preOptions: [
      { value: 1, label: '包含' },
      { value: 2, label: '不包含' },
      { value: 3, label: '为空' },
    ],
    locxxRequirementStages: [],
    locxxRequirementAIOutCalls: [],
    locxxFollowedStatus: [
      { value: 0, label: '待初访' },
      { value: 1, label: '已初访' },
    ],
    locxxRequirementSourceChannels: [], // 需求来源渠道
  });
  // 租户
  const isFollowerInclude = Form.useWatch('isFollowerInclude', searchForm);
  const isInternalLabelInclude = Form.useWatch('isInternalLabelInclude', searchForm);
  const isLabelInclude = Form.useWatch('isLabelInclude', searchForm);
  // 修改跟进人
  const [editFollower, setEditFollower] = useState<any>({ visible: false, follower: {} });

  useEffect(() => {
    if (isFollowerInclude === PRE_SEARCH_TYPE_EMPTY) {
      searchForm.setFieldValue('followerIds', []);
    }
  }, [isFollowerInclude]);

  useEffect(() => {
    if (isInternalLabelInclude === PRE_SEARCH_TYPE_EMPTY) {
      searchForm.setFieldValue('internalLabelIds', []);
    }
  }, [isInternalLabelInclude]);

  useEffect(() => {
    if (isLabelInclude === PRE_SEARCH_TYPE_EMPTY) {
      searchForm.setFieldValue('labelIds', []);
    }
  }, [isLabelInclude]);

  useEffect(() => {
    methods.getQueryData();

    methods.getSelection();
  }, []);

  const methods = useMethods({
    // 获取路由传参
    getQueryData() {
      const query = urlParams(location.search);
      if (Object.keys(query).length) {
        Object.entries(query).forEach(([key, value]) => {
          if (key === 'requirementId') {
            searchForm.setFieldValue('requirementKeyword', value);
          } else {
            searchForm.setFieldValue(key, value);
          }
        });

        setTimeout(() => onSearch(), 0);
      }
    },
    openImportDataModal() {
      importDataRef.current?.init();
    },
    getSelection() {
      getRequirementSelection({ modules: 'locxxLabel,locxxPurposeType,locxxInternalLabel,locxxRequirementLevelLabel,commercial,locxxRequirementStage,locxxRequirementAIOutCall, locxxRequirementSourceChannel' }).then((response) => {
        setSelection(val => ({ ...val,
          demandOptions: refactorSelectionNew({ selection: contrast(response, 'locxxPurposeType', []) }),
          demandTags: refactorSelectionNew({ selection: contrast(response, 'locxxLabels', []) }),
          locxxInternalLabels: refactorSelectionNew({ selection: contrast(response, 'locxxInternalLabels', []) }),
          demandLevels: refactorSelectionNew({ selection: contrast(response, 'locxxRequirementLevelLabels', []) }),
          commercials: refactorSelectionNew({ selection: contrast(response, 'commercials', []) }),
          locxxRequirementStages: refactorSelectionNew({ selection: contrast(response, 'locxxRequirementStages', []) }),
          locxxRequirementAIOutCalls: refactorSelectionNew({ selection: contrast(response, 'locxxRequirementAIOutCalls', []) }),
          locxxRequirementSourceChannels: refactorSelectionNew({ selection: contrast(response, 'locxxRequirementSourceChannels', []) })
        }));
      });
    },
    // 非数字或英文逗号替换为空
    checkRequirementKeyword() {
      const tempStr = searchForm.getFieldValue('requirementKeyword');

      searchForm.setFieldsValue({ requirementKeyword: tempStr ? tempStr.replace(/[^0-9,]/g, '') : '' });
    },
    changeTwoLevelTab(val) {
      setTwoLevelTab(val);
      onSearch({ twoLevelTab: val });
    },
    // 打开跟进人弹窗
    assignAllFollowers() {
      setEditFollower({ visible: true, follower: {}, mode: 'multiple' });
    },
    // 指派跟进人方法
    updateFollower(val) {
      return new Promise((resolve, reject) => {
        let searchParams = searchForm.getFieldsValue();
        const cityIds = searchParams?.cityIds?.length ? searchParams?.cityIds.map(item => item[1]) : [];
        const commercialFormIds = searchParams?.commercialFormIds?.length ? searchParams?.commercialFormIds.map(item => item[1]) : [];
        const { publishDates, followDates } = searchParams;
        const hasPublishDate = Array.isArray(publishDates) && publishDates.length;
        const hasFollowDate = Array.isArray(followDates) && followDates.length;

        searchParams = Object.assign({
          ...searchParams,
          cityIds,
          commercialFormIds,
          brandIds: searchParams?.brandId ? [searchParams.brandId] : [],
          contactIds: searchParams?.contactId ? [searchParams.contactId] : [],
          publishTimeStart: hasPublishDate ? dayjs(searchParams.publishDates[0]).format('YYYY-MM-DD') : null,
          publishTimeEnd: hasPublishDate ? dayjs(searchParams.publishDates[searchParams.publishDates.length - 1]).format('YYYY-MM-DD') : null,
          followerTimeStart: hasFollowDate ? dayjs(searchParams.followDates[0]).format('YYYY-MM-DD') : null,
          followerTimeEnd: hasFollowDate ? dayjs(searchParams.followDates[searchParams.followDates.length - 1]).format('YYYY-MM-DD') : null,
          oneLevelTab: (type || 1),
          twoLevelTab: type === DemandStatus.WAIT_FOLLOW_UP ? (twoLevelTab || 1) : 1
        });
        const params = {
          followerIds: Array.isArray(val?.followId) && val?.followId.length ? val?.followId : [val?.followId],
          queryCondition: searchParams,
        };
        postRequirementAssignFollowerAll(params).then(() => {
          resolve(true);
        }).catch(() => {
          reject();
        });
      });
    },
    // 修改跟进人成功
    changeFollower() {
      setEditFollower({ visible: false, follower: {} });
      onSearch();
    },
  });

  return (
    <>
      <FormSearch
        form={searchForm}
        onSearch={onSearch}
        className={styles.formSearch}
        extra={<div className={styles.extraOperate}>
          {permissions.find(item => item.event === 'create') && <Button type='primary' onClick={() => edit?.()}>创建需求</Button>}
          {permissions.find(item => item.event === 'import') && <Button type='default' onClick={() => methods.openImportDataModal()}>导入需求</Button>}
          {permissions.find(item => item.event === 'assignFollowerAll') && type === DemandStatus.WAIT_FOLLOW_UP && <Button type='primary' onClick={() => methods.assignAllFollowers()}>全部指派</Button>}
        </div>
        }>
        {type === DemandStatus.WAIT_FOLLOW_UP ? <div className={styles.searchRadioGroup}>
          <Radio.Group value={twoLevelTab} style={{ marginBottom: '16px' }} onChange={(e) => methods.changeTwoLevelTab(e.target?.value)}>
            {twoLevelTabs.map((item: any) => {
              return (<Radio.Button value={item?.value} key={item?.label}>
                <Badge
                  style={{ zIndex: 999 }}
                  size='small'
                  showZero={false}
                  count={item.count}
                  offset={[14, -8]}
                >{item?.label || ''}
                </Badge>
              </Radio.Button>);
            })}
          </Radio.Group>
        </div> : ''}
        {demandManagementSearch.includes(type) ? <>
          <V2FormInput
            label='需求ID'
            name='requirementKeyword'
            placeholder="多个需求ID以','隔开"
            maxLength={3000}
            blur={methods.checkRequirementKeyword}
          />
          <V2FormInput label='内容搜索' name='keyword' placeholder='需求名称、跟进记录' maxLength={30}/>
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
          <V2FormRangeInput
            label='面积'
            name={['minArea', 'maxArea']}
          />
          <V2FormSelect
            label='需求类型'
            name='purposeType'
            placeholder='选择类型'
            options={selection.demandOptions}
            allowClear
          />
          <FormPreSelect
            label='需求标签'
            name='labelIds'
            placeholder='选择标签'
            options={selection.demandTags}
            preName='isLabelInclude'
            preOptions={selection.preOptions}
            preDefaultValue={1}
            config={{ mode: 'multiple', maxTagCount: 1 }}
            disabled={isLabelInclude === PRE_SEARCH_TYPE_EMPTY}
          />
          <FormTenant
            label='租户'
            name='tenantId'
            allowClear={true}
            placeholder='请搜索并选择租户'
            enableNotFoundNode={false}
            config={{
              getPopupContainer: (node) => node.parentNode,
            }}
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
          <V2FormSelect
            label='需求状态'
            name='status'
            placeholder='选择需求状态'
            options={selection.statuses}
            allowClear
          />
          <FormPreSelect
            label='跟进人'
            preName='isFollowerInclude'
            preOptions={selection.preOptions}
            preDefaultValue={1}
          >
            <FormUserList
              name='followerIds'
              placeholder='请选择跟进人'
              allowClear={true}
              form={searchForm}
              config={{ getPopupContainer: (node) => node.parentNode, mode: 'multiple', disabled: isFollowerInclude === PRE_SEARCH_TYPE_EMPTY, maxTagCount: 1 }}
              className={styles.userList}
            />
          </FormPreSelect>
          {!demandStageTabs.includes(type) ? <V2FormSelect
            label='跟进阶段'
            name='requirementStageIds'
            placeholder='选择跟进阶段'
            options={selection.locxxRequirementStages}
            allowClear
            config={{ mode: 'multiple' }}
          /> : ''}
          {renderFollowedStatus ? <V2FormSelect
            label='跟进阶段'
            name='followedStatus'
            placeholder='选择跟进阶段'
            options={selection.locxxFollowedStatus}
            allowClear
            config={{ mode: 'multiple' }}
          /> : null}
          <V2FormSelect
            label='需求分级'
            name='levelIds'
            placeholder='选择需求级别'
            options={selection.demandLevels}
            allowClear
            config={{ mode: 'multiple' }}
          />
          <FormPreSelect
            label='内部标签'
            name='internalLabelIds'
            placeholder='选择标签'
            options={selection.locxxInternalLabels}
            preName='isInternalLabelInclude'
            preOptions={selection.preOptions}
            preDefaultValue={1}
            config={{ mode: 'multiple', maxTagCount: 1 }}
            disabled={isInternalLabelInclude === PRE_SEARCH_TYPE_EMPTY}
          />
          <V2FormSelect
            label='AI外呼'
            name='requirementAiOutCallIds'
            placeholder='选择AI外呼'
            options={selection.locxxRequirementAIOutCalls}
            allowClear
            config={{ mode: 'multiple', maxTagCount: 1 }}
          />
          <V2FormRangeInput label='需求ID范围' name={['minId', 'maxId']} useBaseRules min={0} precision={0}/>
          <V2FormRangePicker
            label='发布时间'
            name='publishDates'
          />
          <V2FormRangePicker
            label='创建时间'
            name='gmtCreateDates'
          />
          <FormUserList
            name='crtorIds'
            label='创建人'
            placeholder='请选择创建人'
            allowClear={true}
            form={searchForm}
            config={{ getPopupContainer: (node) => node.parentNode, mode: 'multiple', disabled: isFollowerInclude === PRE_SEARCH_TYPE_EMPTY, maxTagCount: 1 }}
          />
          <V2FormRangePicker
            label='最新跟进时间'
            name='followDates'
          />
        </> : ''}
        {type === DemandStatus.WAIT || type === DemandStatus.PASS ? <>
          <V2FormInput label='内容搜索' name='remark' placeholder='请输入搜索内容' maxLength={30}/>
          <FormResourceBrand
            label='品牌'
            name='brandId'
            allowClear={true}
            placeholder='请搜索并选择品牌'
            config={{ getPopupContainer: (node) => node.parentNode }}
          />
          <FormContacts
            label='联系人'
            name='contactId'
            allowClear={true}
            placeholder='请输入手机号搜索并选择联系人'
            config={{ getPopupContainer: (node) => node.parentNode }}
          />
        </> : ''}
        {type === DemandStatus.PASS ? <V2FormSelect
          label='审核状态'
          name='status'
          placeholder='选择审核状态'
          options={selection.statuses}
          allowClear
        /> : ''}
        <V2FormSelect
          label='来源渠道'
          name='sourceChannelIds'
          placeholder='选择来源渠道'
          options={selection.locxxRequirementSourceChannels}
          allowClear
          config={{ mode: 'multiple', maxTagCount: 1 }}
        />
      </FormSearch>
      {/* 导入需求弹窗 */}
      <ImportData onRefresh={onSearch} ref={importDataRef}></ImportData>
      {/* 选择跟进人弹窗 */}
      <FollowerModal
        title='指派跟进人'
        placeholder='请选择跟进人'
        updateRequest={methods.updateFollower}
        editFollower={editFollower}
        onClose={() => setEditFollower({ ...editFollower, visible: false })}
        onOk={methods.changeFollower}
      />
    </>
  );
};

export default DemandManagementSearch;
