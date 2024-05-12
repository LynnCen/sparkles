import { FC, useState, forwardRef, useImperativeHandle, useMemo, useRef, useEffect } from 'react';
import { useMethods } from '@lhb/hook';
import { contrast, getKeysFromObjectArray, isNotEmpty, isNotEmptyAny, refactorSelection, replaceEmpty, treeFind } from '@lhb/func';
import { refactorSelectionNew, scrollToError } from '@/common/utils/ways';
import { get, post } from '@/common/request';
import cs from 'classnames';
import styles from './index.module.less';
import { Form, message, Spin, Row, Col, Button, Space } from 'antd';
import V2FormInput from 'src/common/components/Form/V2FormInput/V2FormInput';
import V2FormRadio from 'src/common/components/Form/V2FormRadio/V2FormRadio';
import V2FormCascader from 'src/common/components/Form/V2FormCascader/V2FormCascader';
import FormBrandCenterBrand from 'src/common/components/FormBusiness/FormBrandCenterBrand';
import V2FormSelect from 'src/common/components/Form/V2FormSelect/V2FormSelect';
import V2FormCheckbox from 'src/common/components/Form/V2FormCheckbox/V2FormCheckbox';
import V2FormProvinceList from 'src/common/components/Form/V2FormProvinceList/index';
import V2FormTextArea from 'src/common/components/Form/V2FormTextArea/V2FormTextArea';
import V2FormRangeInput from '@/common/components/Form/V2FormRangeInput/V2FormRangeInput';
import V2FormMultipleInput from 'src/common/components/Form/V2FormMultipleInput/V2FormMultipleInput';
import V2FormUpload from 'src/common/components/Form/V2FormUpload/V2FormUpload';
import CustomFormUpload from '../CustomFormUpload/index';
import V2Title from '@/common/components/Feedback/V2Title';
import FormContacts from '@/common/components/FormBusiness/FormContacts';
import AddBrand from '../AddBrand';
import AddContacts from '../AddContacts';
import V2Form from '@/common/components/Form/V2Form';
import { useSelector } from 'react-redux';
import FormUserList from '@/common/components/FormBusiness/FormUserList';
import { userCurrentUser } from '@/common/api/user';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import { V2Confirm } from '@/common/components/Others/V2Confirm';
import V2Drawer from '@/common/components/Feedback/V2Drawer';
import V2FormRangePicker from '@/common/components/Form/V2FormRangePicker/V2FormRangePicker';
import dayjs from 'dayjs';
import V2FormInputNumber from '@/common/components/Form/V2FormInputNumber/V2FormInputNumber';
import V2FormDatePicker from '@/common/components/Form/V2FormDatePicker/V2FormDatePicker';
import { budgetTypes } from '../../ts-config';
import FormDemandList from '@/common/components/FormBusiness/FormDemandList';

/**
 * @description: 编辑需求
 * @demo
import Edit from 'src/views/demandManagement/pages/index/components/Edit/index';

<Edit ref={editRef} onConfirm={methods.editComplete}/>

editRef.current?.init(1);
 */
const EditDrawer:FC<{ onConfirm?: (props?: any) => void, ref?: any }> = forwardRef(({ onConfirm }, ref) => {

  const TYPE_OPEN = 1; // 类型-开店需求
  const TYPE_SPREAD = 2; // 类型-推广计划
  const TYPE_SLOW = 3; // 类型-慢闪
  const FIXED_RENT = 2;// 租金模式 固定租金
  const typeTextMap = {
    [TYPE_OPEN]: '正铺选址', // 开店/找商铺/正铺选址
    [TYPE_SPREAD]: '快闪活动', // 推广/快闪选址/快闪活动
    [TYPE_SLOW]: '慢闪活动', // 慢闪活动
  };
  const placeholderMap = {
    [TYPE_OPEN]: '请输入您的开店要求位置，例如：大型密集社区路口；住宅小区门口前123间(新盘不做)；菜市、医院、商超门口。',
    [TYPE_SPREAD]: '请输入您的推广位置，例如：社区商业综合体中庭',
    [TYPE_SLOW]: '请输入您的推广位置，例如：社区商业综合体中庭'
  };
  /* 活动档期 */
  enum PROMOTION_TIME {
    PROMOTION_TIME_DEFINE =1, // 活动档期 确定时间
    PROMOTION_TIME_UNDEFINE =3// 活动档期 不确定时间
  }
  // 1 省市区, 2 省市
  const provinceListType: number = 2;
  const province = useSelector((state: any) =>
    provinceListType === 1 ? state.common.provinceCityDistrict : state.common.provincesCities
  );

  // 抛出给 ref 事件
  useImperativeHandle(ref, () => ({
    init: methods.init
  }));

  /* state */

  const [visible, setVisible] = useState(false);
  const [id, setId] = useState<null | number>(null);
  const [requesting, setRequesting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selection, setSelection] = useState<any>({
    // 需求类型
    types: [
      { value: TYPE_SPREAD, label: typeTextMap[TYPE_SPREAD] },
      { value: TYPE_SLOW, label: typeTextMap[TYPE_SLOW] },
      { value: TYPE_OPEN, label: typeTextMap[TYPE_OPEN] },
    ],
    // 开店方式
    openMethods: [
      { value: 1, label: '直营' },
      { value: 2, label: '加盟' },
    ], // 开店方式
    approveTypes: [
      { value: 1, label: '创建新需求' },
      { value: 2, label: '重复需求' },
      { value: 3, label: '拒绝' },
    ], // 审核结果
    commercials: [], // 业态
    tenancy: [], // 店铺租期：长期店、...
    rentMode: [] as any[], // 合作模式：纯扣点、...
    // industries: [], // 行业
    categories: [], // 目标场景
    engineeringConditions: [], // 工程条件
    locxxLabels: [], // locxx标签
    locxxInternalLabels: [], // 内部标签
    locxxRequirementStages: [] as any, // 跟进阶段
    locxxRequirementSourceChannels: [], // 需求来源
    spotPosition: [], // 目标位置
    budgetTypes: budgetTypes, // 预算类型
  });
  const successRateOptions = ['高', '中', '低'].map((item) => ({ label: item, value: item }));
  const [addBrandsData, setAddBrandsData] = useState({ visible: false });
  const [addContractsData, setAddContactsData] = useState<any>({ visible: false, brandName: '' });
  const [searchBrandContent, setSearchBrandContent] = useState(null);// 品牌搜索时输入的内容
  const [searchContractsContent, setSearchContractsContent] = useState(null);// 品牌搜索时输入的内容
  const [approveOriginDetail, setApproveOriginDetail] = useState<any>(null);// 被审核需求的详情（审核展示用）

  const formBrandRef: any = useRef();
  const formContactsRef: any = useRef();
  const formFollowRef:any = useRef();
  const [form] = Form.useForm();
  const formDataPurposeType = Form.useWatch('purposeType', form);
  const requirementStageId = Form.useWatch('requirementStageId', form);
  const rejectRequirementId = Form.useWatch('rejectRequirementId', form); // 重复需求ID
  const brandId = Form.useWatch('brandId', form); // 品牌
  const creatorId = Form.useWatch('creatorId', form); // 联系人
  const approveType = Form.useWatch('approveType', form); // 审核结果
  const rentModeIds = Form.useWatch('rentModeIds', form); // 租金模式
  const promotionPeriod = Form.useWatch('promotionPeriod', form);// 活动档期类型 1 确定 2 不确定
  const demandStageName = useMemo(() => {
    return Array.isArray(selection.locxxRequirementStages) && selection.locxxRequirementStages.length ? (selection.locxxRequirementStages.find((item:any) => item.id === requirementStageId)?.name || null) : null;
  }, [requirementStageId]);
  const [type, setType] = useState('edit');

  const cityLabel = useMemo(() => {
    const labelMap = {
      [TYPE_OPEN]: '开店', // 开店/找商铺/正铺选址
      [TYPE_SPREAD]: '推广', // 推广/快闪选址/快闪活动
      [TYPE_SLOW]: '推广'
    };
    return labelMap[formDataPurposeType] || '开店';
  }, [formDataPurposeType]);

  // 当前是否全选了城市
  const [selectAll, setSelectAll] = useState<any>(false);
  // 所有可选城市id组集合
  const [allCityIds, setAllCityIds] = useState<any>([]);
  // 所有可选城市的数量
  const [allCityNumber, setAllCityNumber] = useState<any>(0);
  const [repeatCheck, setRepeatCheck] = useState<any>({
    type: '',
    requirements: []
  });

  const isOpenStore = formDataPurposeType === TYPE_OPEN;// 正铺选址
  const isPopularize = [TYPE_SPREAD, TYPE_SLOW].includes(formDataPurposeType); // 快闪慢闪

  /* hooks */
  useEffect(() => {
    if (visible) {
      // 获取目标场景选项
      get('/spot/spotPosition', {}, { proxyApi: '/lcn-api' }).then((response) => {
        setSelection({
          ...selection,
          spotPosition: refactorSelection(response)
        });
      });
    }
  }, [visible]);

  useEffect(() => {
    if (approveType === 1 && id) {
      form.resetFields(); // 先重置表单
      form.setFieldValue('approveType', approveType);

      // 创建新需求，获取详情填充表单
      methods.getDetail(id);
    } else {
      form.resetFields(); // 先重置表单
      form.setFieldValue('approveType', approveType);

    }
  }, [approveType]);

  useEffect(() => {

    methods.getDetail(rejectRequirementId);

  }, [rejectRequirementId]);


  /* methods */
  const methods = useMethods({

    getOriFormData() {
      return {
        sourceChannelId: null, // 来源渠道
        requirementStageId: null, // 跟进阶段
        followerId: null, // 跟进人
        name: null, // 需求名称
        purposeType: 1, // 需求类型
        brandId: null, // 品牌
        commercialFormIds: [], // 业态，[父级id, 子级id]
        openingMode: null, // 开店方式
        tenancyIds: [], // 开店周期
        rentModeIds: [], // 合作方式
        rentModeRemark: null, // 合作方式其他说明
        pcIds: [], // 城市
        position: null, // 理想位置
        categoryIds: [], // 目标场景
        scheme: null, // 落地方案时间
        schemes: [], // 品牌介绍
        brandFiles: [], // 品牌文件
        minArea: null, // 最小面积
        maxArea: null, // 最大面积
        faceWidth: null, // 长
        depth: null, // 宽
        floorHeight: null, // 高
        engineeringConditionIds: [], // 工程条件
        remark: null, // 其他说明
        labelIds: [], // 标签
        storePic: [], // 门店图片
        isPass: null, // 是否是审核通过
        activities: [], // 活动方案
        notice: '', // 需求公告
        promotionPeriod: '', // 推广时间类型
        promotionTime: null, // 预计推广时间区间 yyyy-MM-dd or yyyy-MM
        product: '', // 产品
        reason: '', // 拒绝原因
        spotPositionIdList: [], // 目标位置(资源库的点位位置类型)
        singleActiveDays: '', // 单场活动天数
        popUpNum: '', // 单城活动数
        budgetType: '', // 预算类型  0 单天预算(元)、 1 单场预算(元)、 2 总预算(元)
        dayActiveBudget: '', // 预算金额
        successRateOption: '', // 预期成单率 高/中/低
        expectSignDate: null, // 预计签约时间
        estimatedSales: '', // 预估销售额
        estimatedGrossProfit: '', // 预估毛利
        deadline: null, // 反馈截止时间
        enterpriseName: '', // 企业名称
      };
    },
    /**
     * @description: 初始化
     * @param {*} id 需求id
     * @param {*} type 类型 'approve' 审核，'edit' 编辑
     * @return {*}
     */
    async init(id: number, type?:string, record?:any) {
      setAllCityIds(methods.flattenNestedObject(province));
      setAllCityNumber(allCityIds.length);
      setId(id || null);
      setVisible(true);
      setType(type || (id ? 'edit' : 'add'));
      setSelectAll(false);
      form.resetFields(); // 先重置表单
      methods.getSelection();
      // 重置添加联系人信息，不重置会带入编辑需求时的品牌名称
      setAddContactsData({ visible: false, brandName: '' });

      if (id) {
        if (type !== 'approve') {
          // 为了拿到 id
          setTimeout(() => {
            methods.getDetail(id);
          }, 0);
        } else {
          record && setApproveOriginDetail(record);
        }

      } else {
        const userInfo = await userCurrentUser();

        form.setFieldValue('followerId', userInfo?.id);
        setTimeout(() => {
          formFollowRef.current.setOptions([{ id: userInfo?.id, name: userInfo?.name }]);
        }, 100);
      }
    },

    // 获取需求详情
    getDetail(id) {
      if (!id) {
        return;
      }
      setLoading(true);
      // https://yapi.lanhanba.com/project/307/interface/api/55446
      get('/locxx/requirement/editDetail', { id }, { needCancel: false, proxyApi: '/lcn-api' }).then((response) => {
        const brands = contrast(response, 'brands', []);
        const contacts = contrast(response, 'contactVO', {});
        const cities = contrast(response, 'cities', []);
        // 重塑推广时段
        const result = Object.assign(methods.getOriFormData(), {
          name: contrast(response, 'name'), // 需求名称
          purposeType: (!response.purposeType && type === 'approve') ? 1 : contrast(response, 'purposeType'), // 需求类型
          brandId: brands.length ? brands[0].id : null, // 品牌
          commercialFormIds: contrast(response, 'commercialFormIds', []), // 业态
          openingModes: getKeysFromObjectArray(contrast(response, 'openingModes', []), 'id'), // 开店方式
          tenancyIds: getKeysFromObjectArray(contrast(response, 'tenancies', []), 'id'), // 开店周期
          rentModeIds: getKeysFromObjectArray(contrast(response, 'rentModes', []), 'id'), // 合作方式
          rentModeRemark: contrast(response, 'rentModeRemark'), // 合作方式其他说明
          pcIds: contrast(response, 'cityIds', []), // 城市
          position: contrast(response, 'position'), // 理想位置
          categoryIds: getKeysFromObjectArray(contrast(response, 'categories', []), 'id'), // 目标场景
          scheme: contrast(response, 'scheme'), // 落地方案时间
          schemes: contrast(response, 'schemes', []), // 品牌介绍
          brandFiles: contrast(response, 'brandFiles', []), // 品牌文件
          activities: contrast(response, 'activities', []), // 活动方案：快慢闪
          minArea: contrast(response, 'minArea'), // 最小面积
          maxArea: contrast(response, 'maxArea'), // 最大面积
          faceWidth: contrast(response, 'faceWidth'), // 长
          depth: contrast(response, 'depth'), // 宽
          floorHeight: contrast(response, 'floorHeight'), // 高
          engineeringConditionIds: getKeysFromObjectArray(contrast(response, 'engineeringConditions', []), 'id'), // 工程条件
          remark: contrast(response, 'remark'), // 其他说明
          labelIds: getKeysFromObjectArray(contrast(response, 'labels', []), 'id'), // 标签
          storePic: contrast(response, 'storePic', []), // 门店图片
          internalLabelIds: getKeysFromObjectArray(contrast(response, 'internalLabels'), 'id'), // 内部标签
          creatorId: contacts ? contacts.id : null, // 联系人
          sourceChannelId: contrast(response, 'sourceChannelId'), // 来源渠道id
          followerId: contrast(response, 'followerId'), // 跟进人id
          requirementStageId: contrast(response, 'requirementStageId'), // 需求跟进阶段id
          notice: contrast(response, 'notice'), // 需求公告
          promotionPeriod: contrast(response, 'promotionPeriod'), // 推广时间类型
          promotionTime: response.promotionStart && response.promotionEnd ? [dayjs(response.promotionStart), dayjs(response.promotionEnd)] : null,
          product: contrast(response, 'product'), // 产品
          reason: contrast(response, 'reason'), // 拒绝原因
          spotPositionIdList: getKeysFromObjectArray(response.spotPositionList || [], 'id'), // 目标位置(资源库的点位位置类型)
          singleActiveDays: contrast(response, 'singleActiveDays'), // 单场活动天数
          popUpNum: contrast(response, 'popUpNum'), // 单城活动数
          budgetType: contrast(response, 'budgetType'), // 预算类型  0 单天预算(元)、 1 单场预算(元)、 2 总预算(元)
          dayActiveBudget: contrast(response, 'dayActiveBudget'), // 预算金额
          successRateOption: contrast(response, 'successRateOption'), // 预期成单率 高/中/低
          expectSignDate: response.expectSignDate ? dayjs(response.expectSignDate) : null, // 预计签约时间
          estimatedSales: contrast(response, 'estimatedSales'), // 预估销售额
          estimatedGrossProfit: contrast(response, 'estimatedGrossProfit'), // 预估毛利
          deadline: response.deadline ? dayjs(response.deadline) : null, // 反馈截止时间
          enterpriseName: contrast(response, 'enterpriseName'), // 企业名称
          expectedBusinessCircle: contrast(response, 'expectedBusinessCircle'), // 期望商圈
        });

        if (isNotEmptyAny(brands)) {
          // 品牌联想输入框回填
          formBrandRef.current.addOption(brands[0]);
        }
        setAddContactsData((state) => ({ ...state, brandName: brands[0]?.name || null }));
        // 联系人输入框回填
        formContactsRef.current.setOptions([contacts]);
        // 跟进人输入框回填
        formFollowRef.current.setOptions([{ id: contrast(response, 'followerId'), name: contrast(response, 'followerName') }]);
        setSelectAll(!(cities.length === allCityNumber) && !!cities.length);
        // 表单赋值
        form.setFieldsValue(result);
      }).finally(() => {
        setLoading(false);
      });
    },

    // 获取选项数据
    getSelection() {
      // https://yapi.lanhanba.com/project/307/interface/api/50735
      get('/h5/locxx/requirement/selection', { modules: 'tenancy,rentMode,commercial,category,engineeringCondition,locxxLabel,locxxInternalLabel,openingMode,locxxRequirementSourceChannel,locxxRequirementStage' }, { isMock: false, proxyApi: '/lcn-api' }).then((response) => {
        setSelection(val => ({ ...val,
          commercials: refactorSelectionNew({ selection: contrast(response, 'commercials', [
            // { name: '餐饮', id: 1, children: [{ name: '快餐', id: 11 }, { name: '自助', id: 12 }] },
            // { name: '服装', id: 2, children: [{ name: '衣服', id: 21 }, { name: '裤子', id: 22 }] },
            // { name: '教育', id: 3, children: [{ name: '语文', id: 31 }, { name: '数学', id: 32 }] },
            // { name: '交通', id: 4 },
          ]) }),
          tenancy: refactorSelectionNew({ selection: contrast(response, 'tenancy', []) }),
          rentMode: refactorSelectionNew({ selection: contrast(response, 'rentMode', []) }),
          categories: refactorSelectionNew({ selection: contrast(response, 'categories') }),
          engineeringConditions: refactorSelectionNew({ selection: contrast(response, 'engineeringConditions', [
            // { name: '上下水', id: 1 }, { name: '排烟', id: 2 }, { name: '接电', id: 3 }
          ]) }),
          locxxLabels: refactorSelectionNew({ selection: contrast(response, 'locxxLabels', [
            // { name: '加盟', id: 1 }, { name: '特卖', id: 2 }, { name: '接电', id: 3 }
          ]) }),
          // 内部标签
          locxxInternalLabels: refactorSelectionNew({ selection: contrast(response, 'locxxInternalLabels', []) }),
          openMethods: refactorSelectionNew({ selection: contrast(response, 'openingModes', []) }),
          locxxRequirementStages: refactorSelectionNew({ selection: contrast(response, 'locxxRequirementStages', []) }),
          locxxRequirementSourceChannels: refactorSelectionNew({ selection: contrast(response, 'locxxRequirementSourceChannels', []) }),
        }));
      });
    },

    // // 获取当前部门下的用户
    // async getIndustryList() {
    //   const response = await industryList({});
    //   setSelection((val) => ({ ...val, industries: response || [] }));
    // },

    // 提交表单数据
    onSubmit() {
      form.validateFields().then((formData) => {
        // 1-存在重复需求
        if (repeatCheck.type === 1 && !id) {
          const description:any = () => {
            return <>存在重复需求
              {repeatCheck.requirements.map((item, index) => {
                return <Button key={index} type='link' onClick={() => methods.openDemandManagementDetail(item.id)}>{item.name}</Button>;
              })}
            </>;
          };
          V2Message.warning({
            content: description(),
          });
        } else {
          if (Array.isArray(formData.schemes) && formData.schemes.length && formData.schemes.some(item => !isNotEmpty(item.url))) {
            message.error(`品牌介绍文件上传失败`);
            return;
          }
          if (Array.isArray(formData.activities) && formData.activities.length && formData.activities.some(item => !isNotEmpty(item.url))) {
            message.error(`活动方案文件上传失败`);
            return;
          }
          const commercialFormIds = formData.commercialFormIds;
          const params = Object.assign(formData, {
            id,
            commercialFormId: Array.isArray(commercialFormIds) && commercialFormIds.length ? commercialFormIds[commercialFormIds.length - 1] : null, // commercialFormIds 为数组 [父级id, 子级id]
            brandIds: formData.brandId ? [formData.brandId] : [],
            cityIds: contrast(formData, 'pcIds', []).reduce((result, item) => {
              if (Array.isArray(item) && item.length) {
                result.push(item[item.length - 1]);
              }
              return result;
            }, []),
            isPass: type === 'approve' ? 1 : null,
            deadline: formData.deadline ? dayjs(formData.deadline).format('YYYY-MM-DD') : null,
            expectSignDate: formData.expectSignDate ? dayjs(formData.expectSignDate).format('YYYY-MM') : null,
          });
          if (formData.promotionTime?.length) {
            params.promotionStart = dayjs(formData.promotionTime[0]).format(formData.promotionPeriod === PROMOTION_TIME.PROMOTION_TIME_DEFINE ? 'YYYY-MM-DD' : 'YYYY-MM');
            params.promotionEnd = dayjs(formData.promotionTime[1]).format(formData.promotionPeriod === PROMOTION_TIME.PROMOTION_TIME_DEFINE ? 'YYYY-MM-DD' : 'YYYY-MM');
          }
          delete params.promotionTime;

          const request = () => {
            const apiMap = {
              'add': '/locxx/requirement/create', // https://yapi.lanhanba.com/project/307/interface/api/58519
              'edit': '/locxx/requirement/store', // https://yapi.lanhanba.com/project/307/interface/api/55369
              'refuse': '/locxx/requirement/reject',
              'merge': '/locxx/requirement/merge' // https://yapi.lanhanba.com/project/307/interface/api/69579
            };
            setRequesting(true);
            let url = '';
            if (id) {
              if (type !== 'approve') {
                url = apiMap['edit'];
              } else if (approveType === 1) {
                url = apiMap['edit'];
              } else if (approveType === 2) {
                url = apiMap['merge'];
                const changeId = params.id;
                params.id = params.rejectRequirementId;
                params.rejectRequirementId = changeId;
              } else if (approveType === 3) {
                url = apiMap['refuse'];
              } else {
                url = apiMap['add'];
              }
            } else {
              url = apiMap['add'];
            }
            post(url, params, { isMock: false, proxyApi: '/lcn-api', headers: { 'Content-Type': 'application/json' } }).then(() => {
              message.success('保存成功');
              onConfirm && onConfirm?.(!id ? (demandStageName || '全部') : null);
              methods.onCancel();
            }).finally(() => {
              setRequesting(false);
            });
          };
          // 2-存在同手机号需求
          if (repeatCheck.type === 2 && !id) {
            const content:any = () => {
              return <>存在同手机号需求，是否确认继续创建需求：
                {repeatCheck.requirements.map((item, index) => {
                  return <p key={index}><Button type='link' onClick={() => methods.openDemandManagementDetail(item.id)}>{item.name}</Button></p>;
                })}
              </>;
            };
            V2Confirm({
              onSure: (modal: any) => {
                request();
                modal.destroy();
              },
              onCancel: (modal: any) => {
                setRequesting(false);
                modal.destroy();
              },
              content: content()
            });
          } else if (repeatCheck.type === 0 || id) {
            // 没有重复或者是编辑
            request();
          } else {
            V2Message.info('请重试');
          }
        }
      }).catch((err) => {
        if (err.errorFields?.[0]?.name?.[0] === 'promotionTime') {
          message.warning('请选择活动档期的时间范围');
        }
        scrollToError(document);
      });
    },
    // 关闭弹窗
    onCancel() {
      // 触发父级的回调
      // onClose && onClose();
      setVisible(false);
    },
    // 打开添加品牌弹窗
    handleAddBrand(visible = true) {
      setAddBrandsData({ visible });
    },
    // 获取搜索品牌的关键词
    onChangeBrandKeyword(searchBrandContent) {
      setSearchBrandContent(searchBrandContent);
    },
    // 品牌添加成功回调
    updateBrand(val) {
      if (!val) return;
      form.setFieldValue('brandId', val?.id || null);
      form.validateFields(['brandId']);
      // 品牌联想输入框回填
      formBrandRef.current.setOptions([val]);
      setAddContactsData((state) => ({ ...state, brandName: val?.name || null }));
    },
    // 品牌改变
    changeBrandHandle(val, option) {
      if (type !== 'add') {
        const cities = form.getFieldValue('pcIds');
        const brand = option ? { id: option?.value, name: option?.label } : {};
        methods.updateDemandName(cities, brand);
      }
      setAddContactsData((state) => ({ ...state, brandName: option?.label || null }));
      if (val) {
        const storePic = form.getFieldValue('storePic');
        // 如果门店图片为空，则带入品牌图片
        if (!Array.isArray(storePic) || !storePic.length) {
          methods.updateStorePicFromBrand(val);
        }
      }
    },
    // 从品牌更新门店图片
    updateStorePicFromBrand(brandId) {
      if (!brandId) {
        return;
      }
      get('/locxx/requirement/selection/brandDetail', { id: brandId }, { isMock: false, mockId: 307, needCancel: false, proxyApi: '/lcn-api' }).then((response) => {
        form.setFieldValue('storePic', contrast(response, 'images', []).map(item => ({ name: `${+new Date()}.jpg`, url: item })));
      });
    },
    // 搜素内容为空时的展示内容
    searchEmpty(title, func) {
      return (<div style={{ textAlign: 'center' }}>
        <img style={{ width: 120, margin: 20 }} src='https://staticres.linhuiba.com/project-custom/custom-flow/img_404@2x.png' />
        <p className='mb-24'>暂无{replaceEmpty(title)}，去 <span className='pointer color-primary ' onClick={func}>添加{replaceEmpty(title)}</span></p>
      </div>);
    },
    // 打开添加联系人弹窗
    handleAddContacts(visible = true) {
      setAddContactsData((state) => ({ ...state, visible }));
    },
    // 获取搜索联系人的关键词
    onChangeContactsKeyword(searchContractsContent) {
      setSearchContractsContent(searchContractsContent);
    },
    // 联系人添加成功回调
    updateContacts(val) {
      if (!val) return;
      form.setFieldValue('creatorId', val?.id || null);
      form.validateFields(['creatorId']);
      // 品牌联想输入框回填
      formContactsRef.current.setOptions([val]);
    },
    changeCity(val) {
      if (type !== 'add') {
        const brandId = form.getFieldValue('brandId');
        const brand = brandId ? formBrandRef.current.getItem(brandId) : {};
        console.log('changecitybrand', brand);
        methods.updateDemandName(val, brand);
      }
      if (Array.isArray(val) && val.length && val.length === allCityNumber) {
        methods.selectAllCities(false);
        return;
      } else {
        setSelectAll(false);
      }
    },
    updateDemandName(cities, brand) {
      console.log(brand, 'brands');
      if (!Array.isArray(cities) || !cities.length) {
        form.setFieldValue('name', `${brand ? brand?.name : ''}开店`);
      } else if (cities.length === 1) {
        const tempCity = cities[0];
        let tempData = treeFind(province, (item) => item.id === tempCity[0]);
        tempData = tempData && Array.isArray(tempData.children) && tempData.children.length ? tempData.children : [];
        const city = treeFind(tempData, (item) => item.id === tempCity[tempCity.length - 1]);
        form.setFieldValue('name', `${brand ? brand?.name : ''}${city.name || ''}开店`);
      } else {
        form.setFieldValue('name', `${brand ? brand?.name : ''}${cities.length || ''}城开店`);
      }
    },
    // val：true 取消全选，false 全选
    selectAllCities(val) {
      form.setFieldValue('pcIds', val ? [] : allCityIds);
      setSelectAll(!val);
      const brandId = form.getFieldValue('brandId');
      const brand = brandId ? formBrandRef.current.getItem(brandId) : {};
      methods.updateDemandName(val ? [] : allCityIds, brand);
    },
    // 树形结构数据扁平化
    flattenNestedObject(obj, result = [] as Array<any>, parentIds = [] as Array<any>) {
      if (Array.isArray(obj)) {
        for (let i = 0; i < obj.length; i++) {
          methods.flattenNestedObject(obj[i], result, parentIds);
        }
      } else if (typeof obj === 'object' && obj !== null) {
        const currentIds = [...parentIds, obj.id];
        if (obj.children === null) {
          result.push(currentIds);
        } else {
          methods.flattenNestedObject(obj.children, result, currentIds);
        }
      }
      return result;
    },
    validateCreatorId() {
      // https://yapi.lanhanba.com/project/307/interface/api/67556
      post('/locxx/requirement/repeatCheck', {
        creatorId,
        brandId,
        purposeType: formDataPurposeType
      }, { proxyApi: '/lcn-api', needCancel: true }).then((res) => {
        setRepeatCheck(res);
      });
    },
    openDemandManagementDetail(id:string|number) {
      window.open(`${window.location.origin}/locxx/demandManagementDetail?id=${id}`);
    }
  });

  useEffect(() => {

    if (brandId && creatorId) {
      methods.validateCreatorId();
    }

  }, [brandId, creatorId, formDataPurposeType]);

  return (
    <V2Drawer
      open={visible}
      destroyOnClose
      maskClosable={false}
      keyboard={true}
      onClose={methods.onCancel}
      className={cs('demandFormDrawer', styles.drawerNeedFooter)}
      contentWrapperStyle={{
        width: '1008px'
      }}
    >
      <Spin spinning={loading}>
        <V2Title type='H1' text={type === 'approve' ? '需求审核' : id ? '编辑需求' : '创建需求'} style={{ marginBottom: '16px' }}/>
        <V2Form form={form} scrollToFirstError>
          { type === 'approve' && <>
            <div className={styles.demandBasicInfo}>
              <div>
                <span className='bold'>{approveOriginDetail?.brandSource === 1 ? approveOriginDetail?.brandName : approveOriginDetail?.spaceBrandName }</span>的
                <span className='bold'>{approveOriginDetail?.contactName}</span>在{approveOriginDetail?.gmtCreate}发布了需求：
              </div>
              <div className='mt-12' dangerouslySetInnerHTML={{ __html: approveOriginDetail?.remark }}></div>
            </div>
            <Row gutter={24}>
              <Col span={12}>
                <V2FormRadio
                  form={form}
                  label='审核结果'
                  name='approveType'
                  options={selection.approveTypes}
                  rules={[{ required: true, message: '请选择审核结果' }]}
                />
              </Col>
            </Row>
            {approveType === 3 &&
            <Row gutter={24}>
              <Col span={12}>
                <V2FormTextArea
                  label='拒绝原因'
                  placeholder='请输入拒绝原因'
                  name='reason'
                  maxLength={200}
                  rules={[{ required: true, whitespace: true, message: '请输入拒绝原因' }]}
                  config={{ showCount: true }}
                />
              </Col>
            </Row>}
            {approveType === 2 && <Row gutter={24}>
              <Col span={12}>
                <FormDemandList
                  form={form}
                  label='重复需求'
                  name='rejectRequirementId'
                  rules={[{ required: true, message: '请选择重复需求' }]}
                  allowClear={true}
                  placeholder='请搜索并选择需求'
                  enableNotFoundNode={false}
                  config={{
                    getPopupContainer: (node) => node.parentNode,
                  }}
                />
              </Col>
            </Row>}
          </>}
          {!!(type !== 'approve' || (approveType === 1 || approveType === 2)) && <div>
            {/* 新增/编辑表单内容 */}
            <Row gutter={24}>
              <Col span={8}>
                <V2FormRadio
                  form={form}
                  label='选址类型'
                  name='purposeType'
                  options={selection.types}
                  formItemConfig={{ initialValue: 2 }}
                  rules={[{ required: true, message: '请选择选址类型' }]}
                />
              </Col>
            </Row>
            <V2Title type='H2' text='客户信息' divider style={{ marginBottom: '16px' }}/>
            <Row gutter={24}>
              <Col span={8}>
                <FormBrandCenterBrand
                  formRef={formBrandRef}
                  label='品牌'
                  name='brandId'
                  allowClear={true}
                  rules={[{ required: true, message: '输入品牌，获得品牌历史选址建议' }]}
                  placeholder='输入品牌，获得品牌历史选址建议'
                  config={{ getPopupContainer: (node) => node.parentNode }}
                  renderEmptyReactNode={methods.searchEmpty('品牌', methods.handleAddBrand)}
                  onChangeKeyword={methods.onChangeBrandKeyword}
                  changeHandle={methods.changeBrandHandle}
                />
              </Col>
              { isPopularize && (
                <Col span={8}>
                  <V2FormInput
                    label='企业名称'
                    name='enterpriseName'
                    placeholder='选择联系人后自动带入'
                    disabled
                    config={{
                      readOnly: true,
                    }}
                  />
                </Col>
              ) }
              <Col span={8}>
                <FormContacts
                  formRef={formContactsRef}
                  form={form}
                  editable={true}
                  label='联系人'
                  name='creatorId'
                  allowClear={true}
                  rules={[{ required: true, message: '请输入手机号搜索并选择联系人' }]}
                  placeholder='请输入手机号搜索并选择联系人'
                  config={{ getPopupContainer: (node) => node.parentNode }}
                  renderEmptyReactNode={methods.searchEmpty('联系人', methods.handleAddContacts)}
                  onChangeKeyword={methods.onChangeContactsKeyword}
                  changeHandle={(val, option, origin) => { form.setFieldValue('enterpriseName', origin?.enterpriseName || ''); }}
                />
              </Col>
              <Col span={8}>
                <V2FormCascader
                  label='业态'
                  name='commercialFormIds'
                  options={selection.commercials}
                  config={{ showSearch: true }}
                  required
                  placeholder='选择业态，获得业态通用选址建议'
                />
              </Col>
              { isPopularize && (
                <Col span={8}>
                  <V2FormInput
                    label='产品'
                    name='product'
                    maxLength={50}
                    placeholder='输入产品，或得更准确的场地推荐'
                  />
                </Col>
              ) }
              <Col span={8}>
                <CustomFormUpload
                  label='品牌介绍'
                  name='schemes'
                  config={{
                    fileType: ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'pdf', 'ppt', 'pptx', 'mp4', 'avi', 'wmv', 'mov', 'mpg', 'mpeg'],
                    maxCount: 10,
                    size: 200,
                  }}
                />
              </Col>
              <Col span={8}>
                <CustomFormUpload
                  label='品牌文件'
                  name='brandFiles'
                  config={{
                    fileType: ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'pdf', 'ppt', 'pptx', 'mp4', 'avi', 'wmv', 'mov', 'mpg', 'mpeg'],
                    maxCount: 10,
                    size: 200,
                  }}
                />
              </Col>
              { isOpenStore && (
                <>
                  <Col span={8}>
                    <V2FormUpload
                      label='门店图片'
                      name='storePic'
                      uploadType='image'
                      config={{
                        maxCount: 10,
                      }}
                      formItemConfig={{ className: styles.myUpload }}
                    />
                  </Col>
                  <Col span={8}>
                    {/* 经营方式，原开店方式 */}
                    <V2FormCheckbox
                      label='经营方式'
                      name='openingModes'
                      options={selection.openMethods}
                    />
                  </Col>
                  <Col span={8}>
                    <V2FormCheckbox
                      label='合作方式'
                      name='rentModeIds'
                      options={selection.rentMode || []}
                      required={demandStageName && demandStageName === '有需求'}
                      rules={[{ required: demandStageName === '有需求', message: '请选择合作方式' }]}
                    />
                  </Col>
                  <Col span={8}>
                    <V2FormTextArea
                      label='合作方式说明'
                      name='rentModeRemark'
                      maxLength={200}
                      config={{ allowClear: true, showCount: true }}
                      placeholder='如“项目人气好的可以设保底租金，必须签定卡丁车、中庭户外儿童独家”'
                    />
                  </Col>
                  <Col span={8}>
                    <V2FormSelect
                      label='标签'
                      name='labelIds'
                      options={selection.locxxLabels}
                      config={{ mode: 'multiple' }}
                      placeholder='请选择标签'
                    />
                  </Col>
                </>
              ) }
            </Row>
            <V2Title type='H2' text='需求信息' divider style={{ margin: '16px 0' }}/>
            <Row gutter={24}>
              <Col span={8}>
                <V2FormProvinceList
                  label={<div>{cityLabel}城市
                    <span onClick={() => methods.selectAllCities(selectAll)} className='ml-4 pointer' style={{ color: '#006AFF' }}>[{selectAll ? '取消全选' : '全选'}]</span>
                  </div>}
                  name='pcIds'
                  type={provinceListType}
                  config={{ allowClear: true, changeOnSelect: true, multiple: true, onChange: methods.changeCity }}
                  rules={[{ required: demandStageName === '有需求', message: '请选择省市区' }]}
                  placeholder='请选择省市区'
                />
              </Col>
              <Col span={8}>
                <V2FormSelect
                  label='目标场景'
                  name='categoryIds'
                  required
                  options={selection.categories}
                  config={{ mode: 'multiple', optionFilterProp: 'label' }}
                  placeholder='输入场景筛选场地，推荐更准确'
                />
              </Col>
              { isPopularize && (
                <Col span={8}>
                  <V2FormSelect
                    label='目标位置'
                    name='spotPositionIdList'
                    options={selection.spotPosition}
                    config={{ mode: 'multiple', optionFilterProp: 'label' }}
                    required
                    placeholder='输入位置筛选场地，推荐更准确'
                  />
                </Col>
              ) }
              {isOpenStore && <Col span={8}>
                <V2FormSelect
                  label='开店周期'
                  name='tenancyIds'
                  options={selection.tenancy}
                  config={{ mode: 'multiple' }}
                  rules={[{ required: demandStageName === '有需求', message: '请选择开店周期' }]}
                  placeholder='请选择能接受的租期'
                />
              </Col>}
              { !isPopularize && (
                <Col span={8}>
                  {/* 原理想位置，理想位置在 PC 非必填 */}
                  <V2FormTextArea
                    label='位置要求'
                    name='position'
                    maxLength={200}
                    config={{ allowClear: true, showCount: true }}
                    placeholder={placeholderMap[String(formDataPurposeType)]}
                  />
                </Col>
              ) }
              <Col span={8}>
                <V2FormRangeInput
                  name={['minArea', 'maxArea']}
                  label='面积要求'
                  min={1}
                  max={999999}
                  precision={0}
                  minPlaceholder='最小面积'
                  maxPlaceholder='最大面积'
                  extra='m²'
                  useBaseRules
                  required={demandStageName && demandStageName === '有需求'}
                />
                {isOpenStore && <V2FormMultipleInput
                  name={['faceWidth', 'depth', 'floorHeight']}
                  type='number'
                  extra='m'
                  precision={2}
                  placeholder={['请输入长', '请输入宽', '请输入高']}
                />}
              </Col>
              { isPopularize && (
                <Col span={8}>
                  <V2FormRadio
                    name={'promotionPeriod'}
                    label='活动档期'
                    required
                    formItemConfig={{
                      style: {
                        marginBottom: '6px'
                      }
                    }}
                    config={{ style: { width: '100%' } } }
                    options={[
                      { label: '确定', value: PROMOTION_TIME.PROMOTION_TIME_DEFINE },
                      { label: '不确定', value: PROMOTION_TIME.PROMOTION_TIME_UNDEFINE }
                    ]}
                  />
                  { promotionPeriod === PROMOTION_TIME.PROMOTION_TIME_DEFINE && <V2FormRangePicker
                    name={'promotionTime'}
                    noStyle
                    config={{
                      disabledDate: current => {
                        return current && current < dayjs().startOf('day');
                      },
                      style: { marginBottom: '16px', marginRight: '12px' },
                    }}
                    rules={[{ required: true, message: '请选择时间范围' }]}
                  />}
                  { promotionPeriod === PROMOTION_TIME.PROMOTION_TIME_UNDEFINE && <V2FormRangePicker
                    name={'promotionTime'}
                    noStyle
                    config={{
                      disabledDate: current => {
                        return current && current < dayjs().startOf('month');
                      },
                      style: { marginBottom: '16px', marginRight: '12px' },
                      picker: 'month',
                      format: 'YYYY-MM',
                    }}
                    rules={[{ required: true, message: '请选择时间范围' }]}
                  />}
                </Col>
              ) }
              {isPopularize && <Col span={8}>
                {/* 和正谱选址中的位置不同 */}
                <V2FormCheckbox
                  label='合作方式'
                  name='rentModeIds'
                  options={selection.rentMode || []}
                  required={demandStageName && demandStageName === '有需求'}
                  rules={[{ required: demandStageName === '有需求', message: '请选择合作方式' }]}
                />
              </Col>}
              {isPopularize && <Col span={8}>
                <V2FormInputNumber label='单场天数' name='singleActiveDays' min={0} max={99999} precision={0} placeholder='输入天数，获得更准确的场地报价' />
              </Col>}
              {isPopularize && <Col span={8}>
                <V2FormInputNumber label='单城活动数' name='popUpNum' min={0} max={99999} precision={0} placeholder='每个城市推荐响应数量的场地' />
              </Col>}
              { isPopularize && rentModeIds?.includes(FIXED_RENT) && (
                <Col span={8}>
                  <div data-field='dayActiveBudget' className='scroll-field' >
                    <V2FormRadio
                      name={'budgetType'}
                      label='预算'
                      formItemConfig={{ initialValue: 0, style: { marginBottom: 6 } }}
                      options={selection.budgetTypes}
                    />
                    <V2FormInputNumber
                      name={'dayActiveBudget'}
                      precision={0}
                      min={1}
                      max={999999999}
                      placeholder='输入预算筛选场地，推荐更准确'
                      config={{ addonAfter: '元' }}
                    />
                  </div>
                </Col>
              )
              }
              {isOpenStore && <Col span={8}>
                <V2FormCheckbox
                  label='工程条件'
                  name='engineeringConditionIds'
                  options={selection.engineeringConditions}
                />
              </Col>}
              { isPopularize && (
                <Col span={8}>
                  <CustomFormUpload
                    label='活动方案'
                    name='activities'
                    config={{
                      fileType: ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'pdf', 'ppt', 'pptx', 'mp4', 'avi', 'wmv', 'mov', 'mpg', 'mpeg'],
                      maxCount: 10,
                      size: 200,
                    }}
                  />
                </Col>
              ) }
              <Col span={8}>
                <V2FormTextArea
                  label='其他说明'
                  name='remark'
                  maxLength={1000}
                  config={{ allowClear: true, showCount: true }}
                  placeholder='请输入说明，最多1000字'
                />
              </Col>
              <Col span={8}>
                <V2FormTextArea
                  label='期望商圈'
                  name='expectedBusinessCircle'
                  maxLength={500}
                  config={{ allowClear: true, showCount: true }}
                  placeholder='请填写期望商圈'
                />
              </Col>
            </Row>
            <V2Title type='H2' text='内部信息' divider style={{ margin: '16px 0' }}/>
            <Row gutter={24}>
              {id && <Col span={8}>
                <V2FormInput
                  label='需求名称'
                  name='name'
                  maxLength={20}
                  rules={[
                  // { required: true, whitespace: true, message: '请输入需求名称' },
                    { min: 4, message: '请输入4-20个字' }
                  ]}
                />
              </Col>}
              <Col span={8}>
                <V2FormSelect
                  label='来源渠道'
                  name='sourceChannelId'
                  options={selection.locxxRequirementSourceChannels}
                  required
                  config={{ optionFilterProp: 'label' }}
                  placeholder='请选择来源渠道'
                />
              </Col>
              <Col span={8}>
                <V2FormSelect
                  label='跟进阶段'
                  name='requirementStageId'
                  options={selection.locxxRequirementStages}
                  required
                  config={{ optionFilterProp: 'label' }}
                  placeholder='请选择跟进阶段'
                />
              </Col>
              <Col span={8}>
                <FormUserList
                  formRef={formFollowRef}
                  label='跟进人'
                  name='followerId'
                  form={form}
                  allowClear={true}
                  placeholder='请选择跟进人'
                  // immediateOnce={false}
                />
              </Col>
              { !isPopularize && (
                <Col span={8}>
                  <V2FormSelect
                    label='内部标签'
                    name='internalLabelIds'
                    placeholder='请选择标签'
                    options={selection.locxxInternalLabels}
                    allowClear
                    config={{ mode: 'multiple' }}
                  />
                </Col>
              ) }
              { isPopularize && (
                <>
                  <Col span={8}>
                    <V2FormSelect
                      name='successRateOption'
                      label='预期成单率'
                      placeholder='统计需求落地可能性'
                      allowClear={false}
                      options={successRateOptions}
                    />
                  </Col>
                  <Col span={8}>
                    <V2FormDatePicker
                      name='expectSignDate'
                      label='预计签约时间'
                      placeholder='预计需求签约时间'
                      config={{
                        picker: 'month',
                        format: 'YYYY-MM',
                      }}
                    />
                  </Col>
                  <Col span={8}>
                    <V2FormInputNumber
                      name='estimatedSales'
                      label='预估销售额'
                      min={1}
                      max={9999999999}
                      config={{ addonAfter: '元' }}
                      placeholder='统计整体需求预估销售额'
                    />
                  </Col>
                  <Col span={8}>
                    <V2FormInputNumber
                      name='estimatedGrossProfit'
                      label='预估毛利'
                      min={-9999999999}
                      max={9999999999}
                      config={{ addonAfter: '元' }}
                      formItemConfig={{ dependencies: ['estimatedSales'] }}
                      placeholder='统计整体需求预估毛利'
                    />
                  </Col>
                  <Col span={8}>
                    <V2FormDatePicker
                      name='deadline'
                      label='反馈截止时间'
                      placeholder='提醒供应商在截止时间前推荐场地'
                      config={{
                        format: 'YYYY-MM-DD',
                        disabledDate: current => (current && current < dayjs().startOf('day')),
                        showNow: false,
                      }}
                    />
                  </Col>
                </>
              ) }
              { (isPopularize || isOpenStore) && (
                <Col span={8}>
                  <V2FormTextArea
                    label='需求公告'
                    name='notice'
                    maxLength={500}
                    config={{ allowClear: true, showCount: true }}
                    placeholder='填写需求重点关注信息，防止遗漏'
                  />
                </Col>
              ) }
              {isPopularize && <Col span={8}>
                {/* 开店方案说明，暂时只在 pc 隐藏开店方案说明 */}
                <V2FormTextArea
                  label={isPopularize ? '落地方案说明' : '开店方案说明'}
                  name='scheme'
                  maxLength={200}
                  config={{ allowClear: true, showCount: true }}
                  placeholder={`请输入您的${isPopularize ? '落地' : '开店'}时间\n例如：希望2022暑期档${isPopularize ? '落地' : '开店'}，先开3城测试，3城结束复盘后决定是否进行。`}
                />
              </Col>}
            </Row>
          </div>}


        </V2Form>
      </Spin>
      <div className={styles.drawerFooter}>
        <Space size={12}>
          <Button onClick={() => setVisible(false)}>取消</Button>
          <Button
            type='primary'
            loading={requesting}
            onClick={methods.onSubmit}>确定</Button>
        </Space>
      </div>
      {/* 添加其他品牌 */}
      <AddBrand
        addBrandsData={addBrandsData}
        setAddBrandsData={setAddBrandsData}
        searchContent={searchBrandContent}
        addSuccessComplete={methods.updateBrand}
      />
      {/* 添加联系人 */}
      <AddContacts
        addContractsData={addContractsData}
        setAddContactsData={setAddContactsData}
        searchContent={searchContractsContent}
        addSuccessComplete={methods.updateContacts}
      />
    </V2Drawer>);
});

export default EditDrawer;
