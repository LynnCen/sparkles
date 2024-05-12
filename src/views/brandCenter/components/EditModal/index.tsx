import { FC, useState, useEffect } from 'react';
import { useMethods } from '@lhb/hook';
import { Modal, Form, Row, Col, Cascader, message } from 'antd';
import V2Form from '@/common/components/Form/V2Form';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import V2FormDatePicker from '@/common/components/Form/V2FormDatePicker/V2FormDatePicker';
import V2FormProvinceList from '@/common/components/Form/V2FormProvinceList';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormUpload from '@/common/components/Form/V2FormUpload/V2FormUpload';
import V2FormTextArea from '@/common/components/Form/V2FormTextArea/V2FormTextArea';
import NameInput from './NameInput';
import FormThreeLevelIndustry from '@/common/components/FormBusiness/FormThreeLevelIndustry';
import { contrast, deepCopy, isNotEmptyAny } from '@lhb/func';
import { brandSelection, brandCreate, brandUpdate, brandApproveDetail, brandCheck } from '@/common/api/brand-center';
import dayjs from 'dayjs';
import { unstable_batchedUpdates } from 'react-dom';
import styles from './index.module.less';

interface BrandIndustry {
  oneIndustryId?: number | null;
  oneIndustryName?: string;
  twoIndustryId?: number | null;
  twoIndustryName?: string;
  threeIndustryId?: number | null;
  threeIndustryName?: string;
}

interface BrandCity {
  cityId?: number | null;
  cityName?: string;
  provinceId?: number | null;
  provinceName?: string;
}

/*
  品牌新增/编辑弹框
*/
interface EditModalProps {
  isEdit?: boolean; // 是否编辑模式
  brandId?: number; // 编辑模式时id
  localShouldPost?: boolean; // 是否需要交临时编辑的保存也进行提交（一般用于保存编辑操作）
  localDetail?: any; // isLocalEdit时，使用临时数据回显
  visible: boolean;
  setVisible: Function;
  onOK?: Function; // 提交成功后回调
  onLocalEdit?: Function; // 临时编辑完成
}

const EditModal: FC<EditModalProps> = ({
  isEdit = false,
  brandId,
  localShouldPost = false,
  localDetail,
  visible,
  setVisible,
  onOK,
  onLocalEdit,
}) => {
  const [form] = Form.useForm();
  const [brandIndustry, setBrandIndustry] = useState<BrandIndustry[]>();
  const [typeName, setTypeName] = useState();
  const [brandCity, setBrandCity] = useState<BrandCity>();
  const [brandTypes, setBrandTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (visible) {
      methods.getSelection();
      if (isEdit) {
        if (isNotEmptyAny(localDetail)) {
          methods.parseDetail(localDetail);
        } else {
          methods.getBrandDetail();
        }
      }
    }
  }, [visible]);

  const methods = useMethods({
    async getSelection() {
      const res = await brandSelection();
      if (Array.isArray(res.types)) {
        setBrandTypes(res.types.map(itm => ({
          value: itm.id,
          label: itm.name,
        })));
      }
    },
    async getBrandDetail() {
      const detail = await brandApproveDetail({ id: brandId });
      this.parseDetail(detail);
    },

    parseDetail(detail: any) {
      if (detail) {
        // 解析详情数据
        const industryIds: number[][] = [];
        if (detail.industryList?.length > 0) {
          detail.industryList.forEach((item) => {
            const industryId:number[] = [];
            if (item.oneIndustryId) {
              industryId.push(item.oneIndustryId);
            }
            if (item.twoIndustryId) {
              industryId.push(item.twoIndustryId);
            }
            if (item.threeIndustryId) {
              industryId.push(item.threeIndustryId);
            }
            industryIds.push(industryId);
          });
        }
        const tmpBrandCity = detail.provinceId && detail.cityId ? [detail.provinceId, detail.cityId] : [];

        const logo = detail.logo ? [{
          url: detail.logo,
        }] : [];

        const icon = detail.icon ? [{
          url: detail.icon,
        }] : [];
        let _brandEstablishTime;
        if (detail.brandEstablishTime) {
          _brandEstablishTime = parseInt(detail.brandEstablishTime + '') + '';
          if (_brandEstablishTime === 'NaN') {
            _brandEstablishTime = undefined;
          } else {
            _brandEstablishTime = dayjs(_brandEstablishTime);
          }
        }
        const vals = {
          name: contrast(detail, 'name', ''),
          industryIds,
          type: contrast(detail, 'type'),
          brandEstablishTime: _brandEstablishTime,
          brandCity: tmpBrandCity,
          companyName: contrast(detail, 'companyName', ''),
          logo,
          icon,
          brandIntroduce: contrast(detail, 'brandIntroduce', ''),
          mdBrandAnnexDtos: contrast(detail, 'mdBrandAnnexDtos'),
          mdBrandPictureDtos: contrast(detail, 'mdBrandPictureDtos'),
        };
        form.setFieldsValue(vals);
        if (tmpBrandCity) { // 如果本来就有发源地，要反填进去
          setBrandCity({
            provinceId: detail.provinceId,
            provinceName: detail.provinceName,
            cityId: detail.cityId,
            cityName: detail.cityName,
          });
        }

        // 与表单无关的展示数据，与品牌审核需要industryList与type属性有关，此为初始化。
        setBrandIndustry(contrast(detail, 'industryList'));
        setTypeName(contrast(detail, 'typeName'));
      }
    },

    onCancel() {
      form.resetFields();
      setBrandIndustry(undefined);
      setBrandCity(undefined);
      setVisible?.(false);
    },

    onSubmit() {
      form.validateFields().then((values) => {
        if (!loading) {
          const params = this.prepareSubmitParams(values);
          const additionInfo = this.prepareAdditionInfo();
          if (isNotEmptyAny(localDetail) && !localShouldPost) {
            form.resetFields();
            unstable_batchedUpdates(() => {
              setBrandIndustry(undefined);
              setBrandCity(undefined);
              setVisible(false);
              onLocalEdit?.(params, additionInfo);
            });
          } else {
            setLoading(true);
            const fnc = isEdit ? brandUpdate : brandCreate;
            fnc(params).then(() => {
              message.success(isEdit ? '编辑成功' : '已发起新增品牌审核流程，审核通过后会在品牌库显示');
              form.resetFields();
              unstable_batchedUpdates(() => {
                setBrandIndustry(undefined);
                setBrandCity(undefined);
                setVisible(false);
                onOK?.(params, additionInfo);
              });
            }).finally(() => {
              setLoading(false);
            });
          }
        }
      });
    },

    prepareSubmitParams(values) {
      let params = deepCopy(values);
      // console.log('checked params', deepCopy(params));
      // 解析表单的值，生成接口对象
      // 依据产业数组的大小来将最后一位数组成接口所需要的数组
      if (params.industryIds?.length > 0) {
        const industryIds:number[] = [];
        params.industryIds.forEach((item) => {
          switch (item.length) {
            case 2:
              industryIds.push(item[1]);
              break;
            case 3:
              industryIds.push(item[2]);
              break;
          };
        });
        params.industryIds = industryIds;
      }
      if (params.brandEstablishTime) {
        params.brandEstablishTime = dayjs(params.brandEstablishTime).format('YYYY');
      } else {
        params.brandEstablishTime = '';
      }
      if (Array.isArray(params.logo) && params.logo.length) {
        const obj = params.logo[0];
        // const { uid, url, type, name, status, size } = obj;
        // params.logo = JSON.stringify({
        //   uid, url, type, name, status, size
        // });
        params.logo = obj.url;
      } else {
        params.logo = '';
      }
      if (Array.isArray(params.icon) && params.icon.length) {
        const obj = params.icon[0];
        // const { uid, url, type, name, status, size } = obj;
        // params.icon = JSON.stringify({
        //   uid, url, type, name, status, size
        // });
        params.icon = obj.url;
      } else {
        params.icon = '';
      }

      if (brandCity) {
        params.provinceId = brandCity.provinceId;
        params.provinceName = brandCity.provinceName;
        params.cityId = brandCity.cityId;
        params.cityName = brandCity.cityName;
      } else {
        // 兼容后端做的离谱操作，不清空的话，编辑后详情依旧会返回
        params.provinceName = '';
        params.cityName = '';
      }
      delete params.brandCity;

      if (isEdit && !!brandId) {
        params = Object.assign(params, {
          id: brandId,
        });
      }
      return params;
    },
    // 影响到审核品牌时数据的回填
    prepareAdditionInfo() {
      const additionInfo = {
        industryList: brandIndustry,
        typeName: typeName
      };
      return additionInfo;
    },
  });

  const onChangeIndustry = (val, options) => {
    const newBrandIndustry: BrandIndustry[] = [];
    if (Array.isArray(options)) {
      // options的多条数据分别为多个行业
      options.forEach((item) => {
        // item的多条数据分别为各级行业option
        if (Array.isArray(item)) {
          let Industry = {};
          item.forEach((item, index) => {
            switch (index) {
              case 0:
                Industry = {
                  ...Industry,
                  oneIndustryId: item.id,
                  oneIndustryName: item.name,
                };
                break;
              case 1:
                Industry = {
                  ...Industry,
                  twoIndustryId: item.id,
                  twoIndustryName: item.name,
                };
                break;
              case 2:
                Industry = {
                  ...Industry,
                  threeIndustryId: item.id,
                  threeIndustryName: item.name,
                };
                break;
            }
          });
          newBrandIndustry.push(Industry);
        }
      });
      setBrandIndustry(newBrandIndustry);
    } else {
      setBrandIndustry([]);
    }
  };

  const onChangeType = (_, option) => {
    setTypeName(option?.label);
  };

  const onChangeCity = (_, options) => {
    if (Array.isArray(options) && options.length === 2) {
      // options的两条数据分别为省、市数据
      setBrandCity({
        provinceId: options[0].id,
        provinceName: options[0].name,
        cityId: options[1].id,
        cityName: options[1].name,
      });
    } else {
      setBrandCity(undefined);
    }
  };

  return (
    <Modal
      width={648}
      title={isEdit ? '编辑品牌' : '新增品牌'}
      open={visible}
      maskClosable={true}
      onCancel={methods.onCancel}
      onOk={methods.onSubmit}
    >
      <V2Form form={form}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label='品牌名称'
              name='name'
              rules={[{ required: true, message: '品牌名称必填' },
                () => ({
                  validator(_, value) {
                    if (!isEdit && value) {
                      return brandCheck({ name: value }).then(({ exists }) => {
                        if (value && !exists) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('已存在此品牌，请勿重复添加！'));
                      });
                    } else {
                      return Promise.resolve();
                    }
                  },
                })]}>
              <NameInput maxLength={20} allowClear />
            </Form.Item>
          </Col>
          <Col span={12}>
            <FormThreeLevelIndustry
              label='所属行业'
              name='industryIds'
              allowClear={true}
              config={{
                showCheckedStrategy: Cascader.SHOW_CHILD,
                multiple: true,
                showSearch: true,
                maxTagCount: 'responsive'
              }}
              placeholder='请选择行业'
              onChange={onChangeIndustry}
            />
          </Col>
          <Col span={12}>
            <V2FormSelect
              label='品牌类型'
              name='type'
              options={brandTypes}
              required
              onChange={onChangeType}
            />
          </Col>
          <Col span={12}>
            <V2FormDatePicker
              label='成立时间'
              name='brandEstablishTime'
              config={{ picker: 'year' }}
            />
          </Col>
          <Col span={12}>
            <V2FormProvinceList
              label='发源地'
              name='brandCity'
              placeholder='请选择省市'
              type={2}
              config={{
                onChange: onChangeCity
              }}
            />
          </Col>
          <Col span={12}>
            <V2FormInput
              label='所属公司'
              name='companyName'
              placeholder='请输入公司名称'
              maxLength={20}
              required />
          </Col>
          <Col span={12}>
            <V2FormUpload label='品牌logo' name='logo' uploadType='image' config={{ maxCount: 1, size: 10 }} />
          </Col>
          <Col span={12}>
            <V2FormUpload
              label='品牌icon'
              name='icon'
              uploadType='image'
              config={{
                accept: '.icon, .ico',
                fileType: ['icon', 'ico'],
                maxCount: 1,
                size: 10
              }} />
          </Col>
          <Col span={12} className={styles.brandModalUploadCol}>
            <V2FormUpload
              label='门店照片'
              name='mdBrandPictureDtos'
              uploadType='image'
              config={{
                maxCount: 30,
              }} />
          </Col>
          <Col span={12}>
            <V2FormTextArea
              label='品牌简介'
              name='brandIntroduce'
              placeholder='请输入品牌简介内容，不超过1000字'
              maxLength={1000}
              config={{ showCount: true }}
            />
          </Col>
          <Col span={12}>
            <V2FormUpload
              label='附件'
              name='mdBrandAnnexDtos'
              config={{
                maxCount: 10,
                size: 50
              }} />
          </Col>
        </Row>
      </V2Form>
    </Modal>
  );
};

export default EditModal;
