/**
 * @Description 选址地图模型
 */
import { FC, useEffect, useState } from 'react';
import { Button, Col, Form, Row, Spin, TreeSelect } from 'antd';
import styles from './index.module.less';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import { getAreaIndustryConfig, getAreaIndustrySelection, getSiteModelList, getTenantSiteModel, saveTenantSiteModel, setAreaIndustryConfig } from '@/common/api/location';
import { getTreeListKeys, isArray, refactorSelection } from '@lhb/func';
import V2Form from '@/common/components/Form/V2Form';
import V2FormRadio from '@/common/components/Form/V2FormRadio/V2FormRadio';
import { get, post } from '@/common/request';
import V2FormTreeSelect from '@/common/components/Form/V2FormTreeSelect/V2FormTreeSelect';

const LocationMapModel: FC<any> = ({ tenantId }) => {
  const [form] = Form.useForm();
  const [spinning, setSpinning] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<number>(0);
  const [categoryOptions, setCategoryOptions] = useState<any>([]); // 所有选项
  const [searchOptions, setSearchOptions] = useState<any>([]); // 搜索结果选项
  const [industries, setIndustries] = useState<any[]>([]);
  const [modelOptions, setModelOptions] = useState<any>([]);
  const [carCodeOptions, setCarCodeOptions] = useState<any>([]);
  const [foodCodeOptions, setFoodCodeOptions] = useState<any>([]);
  const [dressCodeOptions, setDressCodeOptions] = useState<any>([]);
  const watchScreeningCode = Form.useWatch('screeningCode', form);

  useEffect(() => {
    getModelOptions();
  }, []);

  const getSelectionAndConfig = async () => {
    // 获取商圈行业列表 和配置信息
    const res = await getAreaIndustrySelection();
    if (!(isArray(res) && res.length)) {
      return;
    }
    setIndustries(res);

    const data = await getAreaIndustryConfig({ tenantId });
    data && form.setFieldValue('industryId', data.id);
  };

  // 获取筛选模型以及对应筛选模型规则选项
  const getModelOptions = () => {
    get('/site_model/screeningList', {}, { proxyApi: '/blaster' }).then((res) => {
      const options = res.map((item) => {
        const selection = refactorSelection(item.selections, { name: 'displayName', id: 'code', children: 'children' });
        if (item.code === 'CAR') {
          setCarCodeOptions(selection);
        } else if (item.code === 'FOOD') {
          setFoodCodeOptions(selection);
        } else if (item.code === 'DRESS') {
          setDressCodeOptions(selection);
        }
        return {
          label: item.name,
          value: item.code,
        };
      });
      setModelOptions(options);
    });
  };

  const loadOptions = async () => {
    const data = await getSiteModelList({});
    if (isArray(data) && data.length) {
      setCategoryOptions(data); // 已确认返回格式中含name和id
      setSearchOptions(data);
    }
  };
  // 获取当前选择模型
  const loadCurrentConfig = async () => {
    const { id } = await getTenantSiteModel({ tenantId });
    if (id) {
      form.setFieldsValue({ modelId: id });
    }
  };

  // 获取已选择的模型筛选数据
  const getScreeningCode = () => {
    // https://yapi.lanhanba.com/project/462/interface/api/70083
    post('/tenant/data/siteScreening/get', { tenantId }, { proxyApi: '/blaster' }).then((res) => {
      const selectValueMap: any = [];
      // eslint-disable-next-line guard-for-in
      for (const key in res.selectValueMap) {
        selectValueMap.push(key);
      }
      form.setFieldsValue({ screeningCode: res.screeningCode, selectValueMap });
    });
  };

  // 获取场地点位、案例订单是否展示
  const getPlaceAndCaseShow = () => {
    // https://yapi.lanhanba.com/project/462/interface/api/70111
    post('/tenant/data/siteShowPanel/get', { tenantId }, { proxyApi: '/blaster' }).then((res) => {
      form.setFieldsValue({ siteLocationFlag: res.siteLocationFlag, caseOrdersFlag: res.caseOrdersFlag });
    });
  };

  const onSearch = (keyword) => {
    setSearchOptions(categoryOptions.filter((item) => item.name.includes(keyword)));
  };

  useEffect(() => {
    form.resetFields();
    // warning: 需要注意的是当前位置设计比较炸裂，一共5个字段，需要用5个获取接口以及4个保存接口！！！你要问我为什么，请问服务端
    loadOptions();
    loadCurrentConfig();
    getSelectionAndConfig();
    getScreeningCode();
    getPlaceAndCaseShow();
  }, [refresh]);

  const onRefresh = () => {
    setRefresh(refresh + 1);
  };

  const onSubmit = () => {
    // TODO crq: 新增了三个字段待接口联调
    form.validateFields().then((values: any) => {
      const selOption = categoryOptions.find((itm: any) => itm.id === values.modelId);
      const params = {
        tenantId: tenantId,
        modelId: selOption.id,
        modelName: selOption.name,
        modelCode: selOption.code,
      };
      setSpinning(true);
      // 保存模板
      const _saveTenantSiteModel = saveTenantSiteModel(params);
      const selectValueMap = {};
      values.selectValueMap.forEach((item) => {
        selectValueMap[item] = true;
      });
      // 保存筛选模型
      // https://yapi.lanhanba.com/project/462/interface/api/70076
      const _saveModelFilter = post('/tenant/data/siteModel/screening/set', {
        tenantId,
        screeningCode: values.screeningCode,
        selectValueMap
      }, { proxyApi: '/blaster' });
      // 保存场地案例是否显示
      // https://yapi.lanhanba.com/project/462/interface/api/70118
      const _savePlaceCaseShow = post('/tenant/data/siteModel/siteShowPanel/save', {
        tenantId,
        siteLocationFlag: values.siteLocationFlag,
        caseOrdersFlag: values.caseOrdersFlag
      }, { proxyApi: '/blaster' });
      // 保存行业
      const _saveIndustry = setAreaIndustryConfig({ tenantId, id: values.industryId });
      Promise.all([_saveTenantSiteModel, _saveModelFilter, _savePlaceCaseShow, _saveIndustry]).then(() => {
        onRefresh();
        V2Message.success('保存成功');
      }).finally(() => {
        setSpinning(false);
      });
    });
  };

  const screeningCodeChange = (val) => {
    let _selectValueMap: any = [];
    if (val === 'CAR') {
      _selectValueMap = getTreeListKeys(carCodeOptions, 'value', 'children');
    } else if (val === 'FOOD') {
      _selectValueMap = getTreeListKeys(foodCodeOptions, 'value', 'children');
    } else if (val === 'DRESS') {
      _selectValueMap = getTreeListKeys(dressCodeOptions, 'value', 'children');
    }
    form.setFieldsValue({ selectValueMap: _selectValueMap });
  };

  return (
    <div>
      <Spin spinning={spinning}>
        <V2Form form={form} colon={false}>
          <Row gutter={16}>
            <Col span={12}>
              <V2FormSelect
                label='选择当前模版'
                name='modelId'
                options={searchOptions}
                config={{
                  allowClear: true,
                  fieldNames: { label: 'name', value: 'id' },
                  showSearch: true,
                  onSearch: onSearch,
                  filterOption: false,
                  style: { width: '300px' }
                }}
                rules={[{ required: true }]}
              />
              <V2FormRadio
                name='siteLocationFlag'
                label='场地点位内容'
                options={[{ label: '展示(汽车客户)', value: true }, { label: '不展示', value: false }]}
              />
              <V2FormRadio
                name='caseOrdersFlag'
                label='案例及订单'
                options={[{ label: '展示(内部用)', value: true }, { label: '不展示', value: false }]}
              />
              <V2FormSelect
                label='所属行业'
                name='industryId'
                placeholder='请选择所属行业'
                options={industries}
                config={{
                  style: { width: '300px' },
                  fieldNames: { label: 'name', value: 'id' }
                }}
                rules={[{ required: true }]}
              />
            </Col>
            <Col span={12}>
              <V2FormSelect
                label='筛选模型'
                name='screeningCode'
                options={modelOptions}
                config={{
                  allowClear: true,
                  showSearch: true,
                  onSearch: onSearch,
                  filterOption: false,
                  style: { width: '300px' }
                }}
                rules={[{ required: true }]}
                onChange={screeningCodeChange}
              />
              { watchScreeningCode === 'CAR' && <V2FormTreeSelect
                label='汽车版筛选条件'
                required
                name='selectValueMap'
                treeData={carCodeOptions}
                config={{
                  treeDefaultExpandAll: true,
                  treeCheckable: true,
                  showCheckedStrategy: TreeSelect.SHOW_ALL,
                  maxTagCount: 'responsive',
                  style: { width: '300px' }
                }}
              /> }
              { watchScreeningCode === 'FOOD' && <V2FormTreeSelect
                label='餐饮版筛选条件'
                required
                name='selectValueMap'
                treeData={foodCodeOptions}
                config={{
                  treeDefaultExpandAll: true,
                  treeCheckable: true,
                  showCheckedStrategy: TreeSelect.SHOW_ALL,
                  maxTagCount: 'responsive',
                  style: { width: '300px' }
                }}
              />}
              { watchScreeningCode === 'DRESS' && <V2FormTreeSelect
                label='服装版筛选条件'
                required
                name='selectValueMap'
                treeData={dressCodeOptions}
                config={{
                  treeDefaultExpandAll: true,
                  treeCheckable: true,
                  showCheckedStrategy: TreeSelect.SHOW_ALL,
                  maxTagCount: 'responsive',
                  style: { width: '300px' }
                }}
              />}
            </Col>
          </Row>
        </V2Form>

      </Spin>
      <div className={styles.submit}>
        <Button onClick={onRefresh} className='mr-12'>
          取消
        </Button>
        <Button type='primary' onClick={onSubmit}>
          确定
        </Button>
      </div>
    </div>
  );
};

export default LocationMapModel;
