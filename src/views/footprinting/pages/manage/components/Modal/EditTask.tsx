import { FC, useEffect, useState, useRef } from 'react';
import { Modal, Form, TimePicker, message, Row, Col } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import moment from 'moment';
import FormBrands from '@/common/components/FormBusiness/FormBrands';
import FormPlaces from '@/common/components/FormBusiness/FormPlaces';
import V2Form from '@/common/components/Form/V2Form';
import V2FormCascader from '@/common/components/Form/V2FormCascader/V2FormCascader';
import V2FormProvinceList from '@/common/components/Form/V2FormProvinceList';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormDatePicker from '@/common/components/Form/V2FormDatePicker/V2FormDatePicker';
import V2FormInputNumber from '@/common/components/Form/V2FormInputNumber/V2FormInputNumber';
import V2FormUpload from '@/common/components/Form/V2FormUpload/V2FormUpload';
import V2FormTextArea from '@/common/components/Form/V2FormTextArea/V2FormTextArea';
import { industryList, placeCategoryList } from '@/common/api/common';
import { Bucket, bucketMappingDomain } from '@/common/enums/qiniu';
import { MOBILE_REG } from '@lhb/regexp';
import { post } from '@/common/request';
import { isArray, recursionEach } from '@lhb/func';
import { footprintingManageSelection } from '@/common/api/footprinting';
import { refactorSelection } from '@/common/utils/ways';
import { EditTaskModalProps } from '../../ts-config';
interface IProps {
  editTask: EditTaskModalProps;
  onOk: (type: string) => void;
  onCloseEditModal: () => void;
}

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
  const [selectedBrandName, setSelectedBrandName] = useState<string>();
  const [selectedPlaceName, setSelectedPlaceName] = useState<string>();
  const [placeData, setPlaceData] = useState<any>();
  const [confirmLoading, setConfirmLoading] = useState(false);

  const onPlaceSelect = async (option) => {
    if (placeData && placeData.objectList) {
      placeData.objectList.forEach((item) => {
        if (item.id === option.value && item.address && item.address.address) {
          form.setFieldsValue({
            placeAddress: item.address.address,
            placeCategoryId: item.categoryId
          });
          form.validateFields(['placeAddress', 'placeCategoryId']);
          return;
        }
      });
    }
  };

  const finallyData = (data) => {
    setPlaceData(data);
  };

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

  useEffect(() => {
    if (selectedBrandName && selectedPlaceName) {
      form.setFieldValue('name', selectedBrandName + '-' + selectedPlaceName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBrandName, selectedPlaceName]);

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
    form
      .validateFields()
      .then(async (values) => {
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
        };
        // 如果选择了踩点日期，则至少选择一个踩点时间段
        // if (params.checkDate && !params.checkPeriod.length) {
        //   message.error('请至少选择一个时间段');
        //   return;
        // }
        delete params.pcdIds;
        // 更新-https://yapi.lanhanba.com/project/329/interface/api/33885
        // 创建-https://yapi.lanhanba.com/project/329/interface/api/33873
        const url = editTask?.id ? '/checkSpot/project/update' : '/checkSpot/project/create';
        setConfirmLoading(true);
        try {
          await post(url, params, true);
        } catch (err) {}
        setConfirmLoading(false);
        message.success(editTask?.id ? '踩点任务修改成功' : '踩点任务添加成功');
        onCancel();
        onOk(editTask?.id ? 'edit' : 'add');
      })
      .catch((errorInfo) => {
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
    return current && current < moment().endOf('day');
  };

  // 取消/关闭模态框
  const onCancel = () => {
    setSelectedBrandName(undefined);
    setSelectedPlaceName(undefined);
    form.resetFields();
    onCloseEditModal();
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
            // https://yapi.lanhanba.com/project/329/interface/api/33875
            const result = await post('/checkSpot/project/query', { id: editTask.id }, true);
            // const result = data;
            Array.isArray(result.pics) && setPics(result.pics);
            form.setFieldsValue({
              ...result,
              pcdIds: result?.provinceId ? [result.provinceId, result.cityId, result.districtId] : undefined,
              checkDate: result?.checkDate && dayjs(result.checkDate),
              checkPeriod:
                // 处理时间段字段，用于回显
                (isArray(result?.checkPeriod) &&
                  result.checkPeriod.length &&
                  result.checkPeriod.map((item) => ({
                    timeRange: [dayjs(`${result?.checkDate} ${item.start}`), dayjs(`${result?.checkDate} ${item.end}`)],
                  }))) ||
                checkPeriodInit,
            });

            // 品牌和场地名称处理联动
            result.demandBrandName && setSelectedBrandName(result.demandBrandName);
            result.placeName && setSelectedPlaceName(result.placeName);

            // 解析行业
            parseIndustry(result.industryId, industryData);
          })();
        } else {
          (async () => {
            form.resetFields();
            // 新增
            form.setFieldsValue({ checkPeriod: checkPeriodInit });
          })();
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editTask]);

  return (
    <Modal
      title={editTask.id ? '编辑踩点任务' : '添加踩点任务'}
      open={editTask.visible}
      onOk={onSave}
      width={660}
      destroyOnClose
      maskClosable={false}
      keyboard={false}
      onCancel={() => onCancel()}
      centered
      confirmLoading={confirmLoading}
    >
      <V2Form form={form} scrollToFirstError style={{ height: '500px', overflowY: 'auto' }}>
        <Row style={{ width: '604px' }} gutter={16}>
          <Col span={12}>
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
              changeHandle={(_, option) => {
                option && setSelectedBrandName(option.label);
              }}
              config={{
                getPopupContainer: (node) => node.parentNode,
              }}
            />
            <V2FormProvinceList
              label='需求城市'
              name='pcdIds'
              placeholder='请选择省市区'
              config={{ getPopupContainer: (node) => node.parentNode }}
              rules={[{ required: true, message: '请选择省市区' }]}
            />
            <V2FormInput
              label='店铺位置'
              removeSpace
              name='address'
              maxLength={50}
              rules={[{ required: true, message: '请输入店铺具体位置' }]}
            />
            <FormPlaces
              label='所属场地'
              name='placeId'
              form={form}
              allowClear={true}
              rules={[{ required: true, message: '请搜索并选择需要的场地' }]}
              placeholder='请选择场地，街铺可输入街道/路名'
              enableNotFoundNode={true}
              {...(editTask.id && {
                keyword: editTask.placeName,
              })}
              changeHandle={(_, option) => {
                option && setSelectedPlaceName(option.label);
              }}
              config={{
                getPopupContainer: (node) => node.parentNode,
                onSelect: (_, option) => onPlaceSelect(option),
              }}
              finallyData={finallyData}
            />
            <V2FormInput
              label='详细地址'
              removeSpace
              name='placeAddress'
              maxLength={30}
              rules={[{ required: true, message: '请输入场地详细地址' }]}
            />
          </Col>
          <Col span={12}>
            <V2FormCascader
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
              required
              placeholder='请选择品牌所属行业'
            />
            <V2FormSelect
              label='店铺类型'
              name='shopCategory'
              options={options.storeType}
              config={{ getPopupContainer: (node) => node.parentNode }}
              required
            />
            <V2FormInput
              label='店铺名称'
              removeSpace
              name='shopName'
              maxLength={20}
            />
            <V2FormSelect
              label='场地类型'
              name='placeCategoryId'
              options={refactorSelection(placeCategoryOptions)}
              config={{ getPopupContainer: (node) => node.parentNode }}
              required
            />
            <div ref={targetRef}>
              <V2FormDatePicker
                label='踩点日期'
                name='checkDate'
                config={{ getPopupContainer: (node) => node.parentNode as HTMLDivElement, disabledDate: disabledDate }}
                required
              />
            </div>
          </Col>
          <Col span={24}>
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
                            style={{ width: '286px' }}
                            format='HH:mm'
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
          </Col>
          <Col span={12}>
            <V2FormInputNumber
              label='踩点总时长'
              min={0}
              max={99999}
              name='checkDuration'
              precision={1}
              config={{ addonAfter: 'h' }}
            />
            <V2FormInput
              label='场地联系人'
              removeSpace
              name='placeContact'
              maxLength={10}
              placeholder='请输入场地对接联系人姓名'
            />
            <V2FormUpload
              label='附件'
              name='attachment'
              config={{
                maxCount: 20,
                size: 50,
                qiniuParams: {
                  domain: bucketMappingDomain['linhuiba-file'],
                  bucket: Bucket.File,
                },
              }} />
          </Col>
          <Col span={12}>
            <V2FormInput
              label='踩点项目名称'
              removeSpace
              name='name'
              maxLength={220}
              required
              placeholder='系统自动生成: [品牌名称-场地名称]'
              disabled
            />
            <V2FormInput
              label='场地联系方式'
              name='placePhone'
              maxLength={11}
              rules={[{ pattern: MOBILE_REG, message: '手机号格式错误' }]}
              placeholder='请输入场地对接联系人手机号'
            />
            <V2FormTextArea label='备注' name='remark' placeholder='填写其他补充说明' maxLength={50} />
          </Col>
        </Row>
      </V2Form>
    </Modal>
  );
};

export default EditTask;
