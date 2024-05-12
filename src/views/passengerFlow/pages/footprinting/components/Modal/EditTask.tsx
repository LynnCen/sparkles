import { FC, useEffect, useState, useRef } from 'react';
import { Modal, Form, TimePicker, message, Button } from 'antd';
import FormProvinceList from '@/common/components/FormBusiness/FormProvinceList';
import FormSelect from '@/common/components/Form/FormSelect';
import FormInput from '@/common/components/Form/FormInput';
import FormInputNumber from '@/common/components/Form/FormInputNumber';
import FormDatePicker from '@/common/components/Form/FormDatePicker';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

import { MOBILE_REG } from '@lhb/regexp';
import { post } from '@/common/request';
import { isArray, recursionEach } from '@lhb/func';
import { footprintingManageSelection } from '@/common/api/footprinting';
import dayjs from 'dayjs';

import { EditTaskModalProps } from '../../ts-config';
import FormBrands from '@/common/components/FormBusiness/FormBrands';
import FormCascader from '@/common/components/Form/FormCascader';
import { industryList, placeCategoryList } from '@/common/api/common';
import FormUpload, { fileTypeClassify } from '@/common/components/Form/FormUpload';
import { Bucket, bucketMappingDomain } from '@/common/enums/qiniu';
import FormTextArea from '@/common/components/Form/FormTextArea';
import FormTenant from '@/common/components/FormBusiness/FormTenant';
import IconFont from '@/common/components/Base/IconFont';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import { PermissionSelectorValues } from '@/common/components/Modal/ts-config';
import PermissionSelector from '@/common/components/Modal/PermissionSelector';
import FormSetName from '@/common/components/Form/FormSetName/FormSetName';
import FormMapAddress from '@/common/components/Form/FormMapAddress';
import FormSelectSpot from '@/common/components/FormBusiness/FormSelectSpot';
import styles from './index.module.less';
import { V2Confirm } from '@/common/components/Others/V2Confirm';
import V2Message from '@/common/components/Others/V2Hint/V2Message';


interface IProps {
  editTask: EditTaskModalProps;
  onOk: (type: string) => void;
  onCloseEditModal: () => void;
}

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

// 初始化显示4个
const checkPeriodInit = [{}, {}, {}, {}];

const EditTask: FC<IProps> = ({ editTask, onCloseEditModal, onOk }) => {
  const [form] = Form.useForm();
  const [options, setOptions] = useState<{ storeType: any[]; stepByStep: any[]; stepProcess: any[] }>({
    storeType: [],
    stepByStep: [],
    stepProcess: [],
  });
  const [pics, setPics] = useState<Array<string>>([]);
  const [selectionData, setSelectionData] = useState<any>([]);
  const [placeCategoryOptions, setPlaceCategoryOptions] = useState<any>([]);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [storeAddressInfo, setStoreAddressInfo] = useState<any>({}); // 存储店铺地址信息
  const spotRef: any = useRef();
  const [updateData, setUpdateData] = useState<any>({});
  const [placeId, setPlaceId] = useState<number>(); // 由关联点位自动带入，需要手动维护所在场地的ID字段
  const watchDeviceCode = Form.useWatch('deviceCode', form);

  // 选择成员
  const [chooseUserValues, setChooseUserValues] = useState<PermissionSelectorValues>({
    visible: false,
    users: [],
    id: undefined,
    name: '',
  });

  const checkPeriod = Form.useWatch('checkPeriod', form);
  useEffect(() => {
    let totalTime = 0;
    let isSet = false;
    if (checkPeriod) {
      checkPeriod.forEach((element) => {
        if (element && element.timeRange) {
          isSet = true;
          const start = element.timeRange[0];
          const end = element.timeRange[1];
          totalTime += dayjs(end).diff(dayjs(start), 'minutes');
        }
      });
    }

    // 是否有设置过时间段
    if (isSet) {
      form.setFieldValue('checkDuration', (totalTime / 60).toFixed(1));
    } else {
      form.setFieldValue('checkDuration', undefined);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkPeriod]);

  // 行业级联选择&场地类目初始化
  useEffect(() => {
    if (editTask.visible) {
      // getIndustryList();
      getPlaceCategoryOptions();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editTask.visible]);

  // 获取当前部门下的用户
  const getIndustryList = async () => {
    const result = await industryList({});
    setSelectionData(result || []);
    return result || [];
  };

  const getPlaceCategoryOptions = async () => {
    const result = await placeCategoryList({});
    setPlaceCategoryOptions(result || []);
  };

  // 判断时间段是否存在交集
  const checkPeriodIsOk = (checkPeriod) => {
    if (checkPeriod.length === 1) {
      return true;
    }
    let isOk = true;

    for (let i = 0; i < checkPeriod.length; i++) {
      for (let j = i + 1; j < checkPeriod.length; j++) {
        if (!(checkPeriod[i].timeRange && checkPeriod[j].timeRange)) {
          continue;
        }
        if (
          !(
            (dayjs(checkPeriod[i].timeRange[0]).isBefore(dayjs(checkPeriod[j].timeRange[0])) &&
              dayjs(checkPeriod[i].timeRange[1]).isBefore(dayjs(checkPeriod[j].timeRange[0]))) ||
            (dayjs(checkPeriod[i].timeRange[0]).isAfter(dayjs(checkPeriod[j].timeRange[1])) &&
              dayjs(checkPeriod[i].timeRange[1]).isAfter(dayjs(checkPeriod[j].timeRange[1])))
          )
        ) {
          isOk = false;
        }
      }
    }
    return isOk;
  };

  const targetRef = useRef(null);

  const onSave = () => {
    form.validateFields().then(async (values) => {
      if (!checkPeriodIsOk(values.checkPeriod)) {
        message.warn('踩点时段不能有交集！');
        return;
      }
      const params = {
        ...values,
        ...(values?.pcdIds && {
          provinceId: values.pcdIds[0],
          cityId: values.pcdIds[1],
          districtId: values.pcdIds[2],
        }),
        ...(values.checkDate && {
          checkDate: dayjs(values.checkDate).format('YYYY-MM-DD'),
        }),
        ...(Array.isArray(values.checkPeriod) && {
          checkPeriod: (values.checkPeriod || [])
            .filter((item) => (item?.timeRange || []).length === 2)
            .map((item: { timeRange: any[] }) => ({
              start: dayjs(item.timeRange[0]).format('HH:mm'),
              end: dayjs(item.timeRange[1]).format('HH:mm'),
            })),
        }),
        industryId: Array.isArray(values.industryId)
          ? values.industryId[values.industryId.length - 1]
          : values.industryId,
        ...(editTask.id && {
          projectCode: editTask.projectCode,
          id: editTask.id,
          pics: pics, // app端设置的场地图片，编辑时传回给接口
        }),
        validDuration: Math.floor(values.validDuration * 60),
        placeId: placeId,
        address: storeAddressInfo.address,
        lng: storeAddressInfo.longitude,
        lat: storeAddressInfo.latitude,
      };
        // 如果选择了踩点日期，则至少选择一个踩点时间段
        // if (params.checkDate && !params.checkPeriod.length) {
        //   message.error('请至少选择一个时间段');
        //   return;
        // }
      delete params.pcdIds;
      // 更新-https://yapi.lanhanba.com/project/462/interface/api/53920
      // 创建-https://yapi.lanhanba.com/project/462/interface/api/53913
      const url = editTask?.id ? '/checkSpot/project/update' : '/checkSpot/project/create';
      setConfirmLoading(true);
      await post(url, params, {
        proxyApi: '/blaster',
        needHint: true
      }).then(() => {
        setConfirmLoading(false);
        message.success(editTask?.id ? '踩点任务修改成功' : '踩点任务添加成功');
        onCancel();
        onOk(editTask?.id ? 'edit' : 'add');
      }).catch(() => {
      });
      setConfirmLoading(false);
    })
      .catch((errorInfo) => {
        if (errorInfo.errorFields.length) {
          const specialArray = ['address', 'placeCategoryId', 'checkPeriod'];
          const divArray: HTMLInputElement[] = Array.from(document.querySelectorAll(`#${errorInfo.errorFields[0].name[0]}`));
          const div = specialArray.includes(errorInfo.errorFields[0].name[0]) ? divArray[0] : divArray[1];
          if (div) {
            div.focus();
          } else {
            form.scrollToField(errorInfo.errorFields[0].name[0]);
          }
        }
        const { errorFields } = errorInfo;
        const target = errorFields.find((item) => item.name[0] === 'checkDate');
        if (errorFields.length === 1 && target) {
          (targetRef.current as any).scrollIntoView();
        }
      });
  };

  const getSelection = async () => {
    // https://yapi.lanhanba.com/project/329/interface/api/33893
    const params = {
      keys: ['process', 'shopCategory', 'checkWay'],
    };
    const data = await footprintingManageSelection(params);
    setOptions({
      storeType: data.shopCategory.map((item) => ({ value: item.id, label: item.name })) || [],
      stepByStep: data.checkWay.map((item) => ({ value: item.id, label: item.name })) || [],
      stepProcess: data.process.map((item) => ({ value: item.id, label: item.name })) || [],
    });
  };

  const parseIndustry = (industryId, industryData) => {
    if (industryId && industryData) {
      const industryMap = new Map();
      recursionEach(industryData, 'children', (item) => {
        industryMap.set(item.id, item);
      });
      const resultArray = [];
      parseIndustryArray(resultArray, industryId, industryMap);
      form.setFieldValue('industryId', resultArray);
    }
  };

  const parseIndustryArray = (resultArray, industryId, industryMap) => {
    const item = industryMap.get(industryId);
    if (item) {
      resultArray.unshift(item.id);
    }
    if (item && item.parentId) {
      parseIndustryArray(resultArray, item.parentId, industryMap);
    }
  };

  const disabledDate = (current) => {
    // Can not select days before today
    return current && current < dayjs().startOf('day');
  };

  // 取消/关闭模态框
  const onCancel = () => {
    form.resetFields();
    onCloseEditModal();
  };


  // 选择任务跟进人
  const checkPartner = () => {
    setChooseUserValues({ ...chooseUserValues, visible: true });
  };

  // 确定选择任务跟进人
  const onOkSelector = ({ users, visible }: PermissionSelectorValues) => {
    if (!users.length) {
      message.error('请选择任务跟进人');
    } else if (users.length > 10) {
      message.warning('最多只能选择10个跟进人');
    } else {
      form.setFieldsValue({
        followNames: (users.length && users?.map(user => user.name)?.join('、')) || '',
        followIds: (users.length && users?.map(user => user.id)) || undefined,
      });
      setChooseUserValues({ users, visible });
    }
  };
  // 回填表单联想查询项
  const backfill = (updateData) => {
    // 品牌联想输入框回填
    if (updateData.spotId) {
      spotRef.current.addOption({
        categoryName: updateData.spotCategoryName,
        spotId: updateData.spotId,
        spotName: updateData.spotName,
        placeName: updateData.placeName,
      });
    }
  };

  // 关联点位选择事件
  const onSelectSpotChange = (val, option) => {
    setPlaceId(option.placeId);
    form.setFieldValue('placeName', option.placeName);
    form.setFieldValue('placeAddress', option.placeAddress);
    form.setFieldValue('placeCategoryId', option.placeCategoryId);
  };

  // 解绑Location-app设备码
  const unbindDeviceCode = () => {
    V2Confirm({
      onSure: (modal: any) => {
        post('/checkSpot/project/unbindDevice', { id: editTask.id }, {
          proxyApi: '/terra-api',
          needHint: true
        }).then(() => {
          modal.destroy();
          form.setFieldValue('deviceCode', '');
          V2Message.success('解绑成功');
        });
      },
      content: '是否确定解除当前设备码绑定？',
      okText: '确定'
    });
  };


  useEffect(() => {
    if (editTask.visible) {
      (async () => {
        await getSelection();
      })();
      // 行业在这里初始化，方便后续根据组装行业数组
      getIndustryList().then((industryData) => {
        // 编辑
        if (editTask.id) {
          (async () => {
            // https://yapi.lanhanba.com/project/462/interface/api/53801
            const result = await post('/checkSpot/project/query', { id: editTask.id }, {
              proxyApi: '/blaster',
              needHint: true,
              // isMock: true,
              // mockId: 329,
            });
            setPlaceId(result.placeId);
            setStoreAddressInfo({
              address: result.address,
              longitude: result.lng,
              latitude: result.lat,
            });
            // const result = data;
            Array.isArray(result.pics) && setPics(result.pics);
            // 处理时间段字段，用于回显
            const _checkPeriod = (isArray(result?.checkPeriod) && result.checkPeriod.length && result.checkPeriod.map((item) => {

              const start = result.checkDate ? dayjs(`${result?.checkDate} ${item.start}`) : dayjs(`${dayjs().format('YYYY-MM-DD')} ${item.start}`);
              const end = result.checkDate ? dayjs(`${result?.checkDate} ${item.end}`) : dayjs(`${dayjs().format('YYYY-MM-DD')} ${item.start}`);
              return ({
                timeRange: [start, end],
              });
            })) || checkPeriodInit;

            // 移动端上传的文件没有 type 类型
            const _attachment = result.attachment?.map(item => {
              return {
                ...item,
                type: item.type || fileTypeClassify(item.name?.split('.').pop().toLowerCase())
              };
            });

            form.setFieldsValue({
              ...result,
              attachment: _attachment,
              validDuration: result?.validDuration ? Math.round(result.validDuration / 60) : 20,
              pcdIds: result?.provinceId ? [result.provinceId, result.cityId, result.districtId] : undefined,
              checkDate: result?.checkDate && dayjs(result.checkDate),
              checkPeriod: _checkPeriod,
              followNames: (result.follows.length && result.follows?.map(user => user.name)?.join('、')) || '',
              followIds: (result.follows.length && result?.follows.map(user => user.id)) || undefined,
            });
            setUpdateData({ ...updateData, ...result });
            backfill({ ...updateData, ...result });

            // 解析行业
            parseIndustry(result.industryId, industryData);

            // 跟进人
            setChooseUserValues({ ...chooseUserValues, users: result.follows || [] });
          })();
        } else {
          (async () => {
            form.resetFields();
            // 新增
            form.setFieldsValue({ checkPeriod: checkPeriodInit });
          })();
        }
      });
    } else {
      setStoreAddressInfo({});
      setChooseUserValues({ visible: false, users: [] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editTask]);

  useEffect(() => {
    if (storeAddressInfo.longitude && storeAddressInfo.latitude) {
      spotRef.current.reload();
    }
  }, [storeAddressInfo]);

  return (
    <Modal
      title={editTask.id ? '编辑踩点任务' : '添加踩点任务'}
      open={editTask.visible}
      onOk={onSave}
      width={600}
      destroyOnClose
      maskClosable={false}
      keyboard={false}
      onCancel={() => onCancel()}
      centered
      confirmLoading={confirmLoading}
    >
      <Form {...layout} form={form} scrollToFirstError style={{ height: '500px', overflowY: 'auto' }}>
        <FormTenant
          label='租户名称'
          name='tenantId'
          form={form}
          allowClear={true}
          rules={[{ required: true, message: '请搜索并选择租户' }]}
          placeholder='请搜索并选择租户'
          enableNotFoundNode={false}
          {...(editTask.id && {
            keyword: editTask.tenantName,
          })}
          config={{
            getPopupContainer: (node) => node.parentNode,
          }}
        />
        <FormBrands
          label='需求品牌'
          name='demandBrandCode'
          form={form}
          allowClear={true}
          rules={[{ required: true, message: '请搜索并选择需要踩点的品牌' }]}
          placeholder='请搜索并选择需要踩点的品牌'
          enableNotFoundNode={true}
          {...(editTask.id && {
            keyword: editTask.demandBrandName,
          })}
          config={{
            getPopupContainer: (node) => node.parentNode,
          }}
        />
        <FormCascader
          label='所属行业'
          name='industryId'
          config={{
            getPopupContainer: (node) => node.parentNode,
            multiple: false,
            maxTagCount: 'responsive',
            fieldNames: {
              label: 'name',
              value: 'id',
              children: 'children',
            },
            changeOnSelect: true,
          }}
          options={selectionData}
          rules={[{ required: true, message: '请选择品牌所属行业' }]}
          placeholder='请选择品牌所属行业'
        />
        <FormProvinceList
          label='需求城市'
          name='pcdIds'
          placeholder='请选择省市区'
          config={{ allowClear: true, getPopupContainer: (node) => node.parentNode }}
          rules={[{ required: true, message: '请选择省市区' }]}
        />
        <FormSelect
          label='店铺类型'
          name='shopCategory'
          options={options.storeType}
          config={{ allowClear: true, getPopupContainer: (node) => node.parentNode }}
          rules={[{ required: true, message: '请选择店铺类型' }]}
        />
        <FormMapAddress
          form={form}
          label='店铺位置'
          name='address'
          rules={[{ required: true, message: '请输入店铺具体位置' }]}
          defaultAddress={storeAddressInfo}
          onChange={(val) => setStoreAddressInfo({ ...val })}
        />
        <FormSelectSpot
          label='关联点位'
          needAddableNotFoundNode
          spotRef={spotRef}
          config={{
            immediateOnce: !updateData?.spotId, // 编辑时并且有选此数据时，不再立刻触发查询
            getPopupContainer: (node) => node.parentNode
          }}
          extraParams={{
            ...storeAddressInfo,
            distance: 3000, // 周边距离：米
            examineStatusList: [1, 2, 4], // 审核状态
          }}
          form={form}
          allowClear
          channel='CDB' // 代表踩点宝
          rules={[{ required: true, message: '输入点位或场地进行查询' }]}
          name='spotId'
          changeHandle={onSelectSpotChange}
          addHandle={onSelectSpotChange}
        />
        <FormInput
          label='店铺名称'
          removeSpace
          name='shopName'
          maxLength={20}
          // rules={[{ required: true, message: '请输入店铺具体位置' }]}
        />
        <V2FormInput
          label='所属场地'
          name='placeName'
          placeholder='选择关联点位后自动带入'
          disabled
        />
        <FormSelect
          label='场地类型'
          name='placeCategoryId'
          options={placeCategoryOptions}
          config={{
            allowClear: true,
            fieldNames: { label: 'name', value: 'id' },
            getPopupContainer: (node) => node.parentNode,
          }}
          rules={[{ required: true, message: '请选择场地类型' }]}
          placeholder='请选择场地类型'
        />
        <FormInput
          label='详细地址'
          removeSpace
          name='placeAddress'
          maxLength={30}
          rules={[{ required: true, message: '请输入场地详细地址' }]}
        />
        <div ref={targetRef}>
          <FormDatePicker
            label='踩点日期'
            name='checkDate'
            config={{
              getPopupContainer: (node) => node.parentNode as HTMLDivElement,
              disabledDate,
            }}
            rules={[{ required: true, message: '请选择踩点日期' }]}
          />
        </div>
        <Form.List name='checkPeriod'>
          {(fields, { add, remove }) => {
            return (
              <>
                {fields.map(({ key, name, ...restField }, index) => (
                  <Form.Item label={`踩点时间段${index + 1}`} key={key} required={!index}>
                    <Form.Item
                      {...restField}
                      name={[name, 'timeRange']}
                      noStyle
                      rules={!index ? [{ required: true, message: `请选择踩点时间段${index + 1}` }] : []}
                    >
                      <TimePicker.RangePicker
                        placeholder={['请选择开始时间', '请选择结束时间']}
                        style={{ width: '280px' }}
                        format='HH:mm'
                        minuteStep={30}
                        getPopupContainer={(node) => node.parentNode as HTMLDivElement}
                      />
                    </Form.Item>
                    {fields.length > 1 ? <MinusCircleOutlined className='ml-5' onClick={() => remove(name)} /> : null}
                    {index === fields.length - 1 && fields.length < 4 && (
                      <PlusOutlined className='ml-5' onClick={() => add()} />
                    )}
                  </Form.Item>
                ))}
              </>
            );
          }}
        </Form.List>
        <FormInputNumber
          label='踩点总时长'
          min={0}
          max={99999}
          name='checkDuration'
          config={{ style: { width: '200px' }, precision: 1, addonAfter: 'h' }}
        />
        <FormInputNumber
          label='有效视频时长'
          rules={[{ required: true, message: '请输入有效视频时长' }]}
          min={1}
          max={30}
          name='validDuration'
          config={{ style: { width: '200px' }, precision: 0, addonAfter: 'min' }}
          formItemConfig={{
            tooltip: {
              title: '每个时间段内视频总时长大于等于设置的值才为有效视频，否则需要进行补拍',
              icon: <span><IconFont className='anticon anticon-info-circle' style={{ color: '#CCCCCD' }} iconHref='pc-common-icon-ic_info'/></span>
            },
            initialValue: 20,
          }}
        />
        <V2FormInput
          label='任务跟进人'
          name='followNames'
          maxLength={100}
          onClickInput={checkPartner}
          config={{ readOnly: true }}
          required
        />
        <V2FormInput
          label='关联设备码'
          name='deviceCode'
          placeholder='请使用Location-APP扫码关联'
          disabled
          config={{ readOnly: true }}
          className={styles.deviceCodeInput}
          formItemConfig={{ extra: !!watchDeviceCode && <Button type='link' onClick={unbindDeviceCode}>解绑</Button> }}
        />
        {/* 主管id-隐藏字段（依然会收集和校验字段）用于确定传参 */}
        <FormSetName name='followIds' />
        <FormInput
          label='场地联系人'
          removeSpace
          name='placeContact'
          maxLength={10}
          placeholder='请输入场地对接联系人姓名'
        />
        <FormInput
          label='场地联系方式'
          name='placePhone'
          maxLength={11}
          rules={[{ pattern: MOBILE_REG, message: '手机号格式错误' }]}
          placeholder='请输入场地对接联系人手机号'
        />
        <FormUpload
          label='店铺图片'
          name='attachment'
          valuePropName='fileList'
          formItemConfig={{
            help: '最多支持20个，每个不超过50M',
          }}
          config={{
            fileType: ['*'],
            listType: 'picture-card',
            maxCount: 20,
            // onChange: onChangeFile,
            size: 50,
            qiniuParams: {
              domain: bucketMappingDomain['linhuiba-file'],
              bucket: Bucket.File,
            },
          }}
        >
        </FormUpload>
        <FormTextArea label='备注' name='remark' placeholder='填写其他补充说明' maxLength={50} allowClear={true} />
      </Form>
      <PermissionSelector
        title={`选择用户`}
        type='MORE'
        values={chooseUserValues}
        onClose={setChooseUserValues}
        onOk={onOkSelector}
      />
    </Modal>
  );
};

export default EditTask;
