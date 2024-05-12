import { Form, Button, Cascader, TreeSelect } from 'antd';
import { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { EIGHT_SIXTEEN_PASSWORD_REG, TWO_DECIMAL_NUMBER_REG } from '@lhb/regexp';
import { getCookie } from '@lhb/cache';
import { Bucket, bucketMappingDomain } from '@/common/enums/qiniu';
import { Sources } from '@/views/locxx/pages/simulatedResponse/index';
import { useSelector } from 'react-redux';

import cs from 'classnames';
import styles from './index.module.less';
import FormInput from '@/common/components/Form/FormInput';
import FormInputNumber from '@/common/components/Form/FormInputNumber';
import FormInputPassword from '@/common/components/Form/FormInputPassword';
import FormTextArea from '@/common/components/Form/FormTextArea';
import FormSelect from '@/common/components/Form/FormSelect';
import FormCheckbox from '@/common/components/Form/FormCheckbox';
import FormSelectOptGroup from '@/common/components/Form/FormSelectOptGroup';
import FormRadio from '@/common/components/Form/FormRadio';
import FormSwitch from '@/common/components/Form/FormSwitch';
import FormDatePicker from '@/common/components/Form/FormDatePicker';
import FormTimePicker from '@/common/components/Form/FormTimePicker';
import FormTimeRangePicker from '@/common/components/Form/FormTimeRangePicker';
import FormRangePicker from '@/common/components/Form/FormRangePicker';
import FormCascader from '@/common/components/Form/FormCascader';
import FormTreeSelect from '@/common/components/Form/FormTreeSelect';
import FormProvinceBussinessArea from '@/common/components/Form/FormProvinceBussinessArea';
import FormPlaceCategoryTreeSelect from '@/common/components/Form/FormPlaceCategoryTreeSelect';
import FormUpload from '@/common/components/Form/FormUpload';
import TemplateUpload from '@/common/components/Business/Templete/Upload';
import FormSizeInput from 'src/common/components/Form/FormSizeInput';

import FormCascaderIndustry from 'src/common/components/FormBusiness/FormCascaderIndustry';
import FormDictionarySelect from 'src/common/components/Form/FormDictionarySelect';

import Group from 'src/common/components/Group/index';
import FormBooth from 'src/common/components/FormBusiness/FormBooth';
import FormSpot from 'src/common/components/FormBusiness/FormSpot';
import FormResourceBrand from 'src/common/components/FormBusiness/FormResourceBrand';
import FormBrand from 'src/common/components/FormBusiness/FormBrand';
import FormSupplier from 'src/common/components/FormBusiness/FormSupplier';
import FormSupplierContact from 'src/common/components/FormBusiness/FormSupplierContact';
// import BrandSelect from 'src/common/business/BrandSelect';
import IM from 'src/common/components/Business/IM/index';
import V2FormProvinceList from '../../Form/V2FormProvinceList';

const layout = {
  labelCol: { span: 4 }, // label 布局
  wrapperCol: { span: 20 }, // 需要为输入控件设置布局样式时
};

const data = {
  show: 1,
  industryIds: [
    [1, 197],
    [1, 266],
    [1, 267],
    [1, 335],
    [5, 99],
  ],
  size: [1, 2, 3],
  graph: [
    { 'name': '4.jpg', 'url': 'https://cert.linhuiba.com/FqMtK-JRKMff8BHrss9447F-pAMG' },
    { 'name': '5.jpg', 'url': 'https://cert.linhuiba.com/FtE4cGsYEIq3rHaMWksLdWO77GKg' },
    { 'name': '6.jpg', 'url': 'https://cert.linhuiba.com/FiPvLX7MqkUdf7G0MYa5H4BKmuHy' }
  ],

  // placeCategoryIds: [
  //   {
  //     'label': 'Node1',
  //     'value': '0-0'
  //   },
  //   {
  //     'label': 'Child Node1',
  //     'value': '0-0-1'
  //   }
  // ],
  placeCategoryIds: [1, 2],
};

export default function Index() {

  const [form] = Form.useForm();

  const [gender, setGender] = useState<any>(null);
  // 当前是否全选了城市
  const [selectAll, setSelectAll] = useState<any>(false);

  // 表单数据回显
  useEffect(() => {
    console.log(1);
    form.setFieldsValue({
      ...data
    });
  }, [data]);

  // // 获取初始化表单数据
  // const getOriForm = () => {
  //   return {
  //     name: '', // 名称
  //     user_id: null, // 用户
  //     selectOrInput2: null, // 是否
  //     switch: null, // 是否
  // 多选项
  //   };
  // };
  // form.setFieldsValue(getOriForm());
  // useEffect(() => {

  // }, []);

  const options = {
    users: [
      { value: 1, label: '张三' },
      { value: 2, label: '李四' },
      { value: 3, label: '王五' },
      { value: 4, label: '田七', disabled: true },
    ],
    true_or_false: [
      { value: 1, label: '是' },
      { value: 0, label: '否' },
    ],

    user_group: [
      { value: 1, label: '张三', children: [{ value: 1, label: 'xxx' }] },
      { value: 2, label: '李四' },
      { value: 3, label: '王五' },
      { value: 4, label: '田七', disabled: true },
    ],

    cities: [
      {
        value: 'zhejiang',
        label: 'Zhejiang',
        children: [
          {
            value: 'hangzhou',
            label: 'Hangzhou',
            children: [
              {
                value: 'xihu',
                label: 'West Lake',
              },
            ],
          },
        ],
      },
      {
        value: 'jiangsu',
        label: 'Jiangsu',
        children: [
          {
            value: 'nanjing',
            label: 'Nanjing',
            children: [
              {
                value: 'zhonghuamen',
                label: 'Zhong Hua Men',
              },
            ],
          },
        ],
      },
    ],

    placeCategory: [
      {
        name: 'Node1',
        id: 1,
        childList: [
          {
            name: 'Child Node1',
            id: 2,
          },
          {
            name: 'Child Node2',
            id: 3,
          },
        ],
      },
      {
        name: 'Node2',
        id: 4,
      },
    ]
  };

  const name = Form.useWatch('name', form);
  console.log('name', name);
  const user_id = Form.useWatch('user_id', form);
  // let formData = form.getFieldsValue();
  const [formData, setFormData] = useState<any>({});

  // type：1 省市区，2省市
  const type:number = 2;
  const province = useSelector((state: any) =>
    type === 1 ? state.common.provinceCityDistrict.filter(item => !item.disabled) : state.common.provincesCities.filter(item => !item.disabled)
  );
  // 将树形结构扁平化
  // [{
  //   id:1,
  //   children:[{
  //     id:2,
  //     children:null,
  //   },{
  //     id:3,
  //     children:null,
  //   }]
  // }]
  // 输出 [[1,2],[1,3]]
  const flattenNestedObject = (obj, result = [] as Array<any>, parentIds = [] as Array<any>) => {
    if (Array.isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        flattenNestedObject(obj[i], result, parentIds);
      }
    } else if (typeof obj === 'object' && obj !== null) {
      const currentIds = [...parentIds, obj.id];
      if (obj.children === null) {
        result.push(currentIds);
      } else {
        flattenNestedObject(obj.children, result, currentIds);
      }
    }

    return result;
  };
  // 所有可选城市id组集合
  const allCityIds = flattenNestedObject(province);
  // 所有可选城市的数量
  const allCityNumber = allCityIds.length;

  // 获取初始化表单
  const getOriPlan = () => {
    return {
      time: null, // 回款时间
      amount: null, // 回款金额
      pcIds: [], // 开店城市 id
    };
  };

  // 取值
  const plans = Form.useWatch('plans', form);
  // 赋值
  const setPlans = (data) => {
    form.setFieldValue('plans', data);
  };

  // 设置 plans 数据
  const setPlansData = () => {
    setPlans([
      { time: dayjs('2022-11-28'), amount: 100 },
      { time: null, amount: 200 },
      { time: null, amount: 300 },
      { time: null, amount: 10000000 },
    ]);
  };



  // 设置 plans 数据
  const setPlans2Data = () => {
    form.setFieldValue('plans2', [
      { time: dayjs('2022-11-28'), amount: 1100 },
      { time: null, amount: 2200 },
      { time: null, amount: 3300 },
      { time: null, amount: 10000000 },
    ]);
  };


  // 资源品牌-监听数据
  const resource_brand_ids = Form.useWatch('resource_brand_ids', form);
  const formResourceBrand: any = useRef();
  // const formBrand: any = useRef();
  const formSupplier: any = useRef();
  const formSupplierContact: any = useRef();
  // 回显数据
  const setResourceBrand = () => {
    form.setFieldValue('resource_brand_ids', [1093, 12]);
    formResourceBrand.current.setOptions([{ id: 1093, name: 'A21湾区少年' }, { id: 12, name: '阿里巴巴' }]);
    // form.setFieldValue('brand_ids', [1093, 12]);
    // formBrand.current.setOptions([{ id: 1093, name: 'A21湾区少年' }, { id: 12, name: '阿里巴巴' }]);

    console.log('formSupplier', formSupplier);
    console.log('formSupplierContact', formSupplierContact);
  };

  // 选择供应商，更新联系人列表
  const supplier_id = Form.useWatch('supplier_id', form);
  const changeSupplier = () => {

    const supplier_id = form.getFieldValue('supplier_id');
    console.log('supplier_id', supplier_id);

  };

  const onChange = (values, a) => {
    console.log('onChange values', values, a);
    setFormData(values);
  };

  // 提交
  const onFinish = () => {
    console.log('提交');
    console.log('onFinish form', form, form.getFieldsValue());
  };

  // val：true 取消全选，false 全选
  const selectAllCities = (val) => {
    form.setFieldValue('pcIds', val ? [] : allCityIds);
    setSelectAll(!val);
  };
  // 开店城市改变
  const changeCity = (val) => {
    if (Array.isArray(val) && val.length && val.length === allCityNumber) {
      selectAllCities(false);
      return;
    } else {
      setSelectAll(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>组件示例页面-表单</h2>
      <a href='https://ant.design/components/form-cn' target='_blank' className='db'>antd 文档地址</a>
      <a href='https://reactpc.lanhanba.net/components/docs/changelog' target='_blank' className='db'>reactpc 文档地址</a>

      <Button type='primary' className='mr-20' htmlType='submit'>确定</Button>
      <IM style={{ width: '375px', height: '667px' }} source={Sources.LOCXX} token={getCookie('kunlun_token')}/>
      {/* <IM style={{ width: '375px', height: '667px' }} source={Sources.LOCXX} token={getStorage('kunlun_token')} contactId={208263} resourceId={1000187} /> */}

      <div>
        <Form form={form} className={styles.form} {...layout} onFinish={onFinish} onValuesChange={onChange as any}>

          <h3>输入框</h3>
          <FormInput label='名称' name='name' maxLength={20} rules={[{ required: true, message: '请输入名称' }]} />

          <Form.Item label='名称 name 值'>
            <div>form.getFieldValue：{form.getFieldValue('name')}</div>
            <div>form.getFieldsValue：{form.getFieldsValue().name}</div>
            <div>formData.name：{formData.name}</div>
            <div>name：{name}</div>
          </Form.Item>

          <FormInputNumber
            label='工作日底价'
            placeholder='最小值'
            name='weekdayDeepPriceMin'
            min={0}
            max={9999999999.99}
            config={{
              addonAfter: '元',
              precision: 0,
            }}
          />
          <FormInputPassword
            label='新密码'
            name='newPassword'
            rules={[{ required: true, message: '请输入新密码' }, { pattern: EIGHT_SIXTEEN_PASSWORD_REG, message: '密码格式错误' }]}
          />
          <FormTextArea
            label='说明'
            name='desc'
            placeholder='请输入菜单说明'
          />
          <FormSizeInput
            label='面积'
            name='size'
            formItemConfig={{ className: 'size' }}
            config={{ addonAfter: 'm' }}
            firstConfig={{ placeholder: '长' }}
            middleConfig={{ placeholder: '宽' }}
            lastConfig={{ placeholder: '高' }}
          />

          <FormCascaderIndustry
            label='所属行业'
            name='industryIds'
            allowClear={true}
            config={{
              multiple: true,
              showCheckedStrategy: Cascader.SHOW_CHILD,
              showSearch: true,
              maxTagCount: 'responsive'
            }}
            rules={[{ required: true, message: '请选择所属行业' }]}
            placeholder='选择所属行业'
          />
          <FormDictionarySelect
            name='promotionWayIds'
            label='推广形式'
            config={{ type: 'promotionWay' }}
            rules={[{ required: true, message: '请选择推广形式' }]}
            placeholder='请选择推广形式'
          />

          <h3>选项</h3>
          <FormSelect name='user_id' label='用户' allowClear options={options.users} />
          <Form.Item label='用户 user_id 值'>
            <div>form.getFieldValue：{form.getFieldValue('user_id')}</div>
            <div>form.getFieldsValue：{form.getFieldsValue().user_id}</div>
            <div>formData.user_id：{formData.user_id}</div>
            <div>user_id：{user_id}</div>
          </Form.Item>

          <FormRadio
            name='show'
            label='是否可见'
            options={options.true_or_false}
            rules={[{ required: true }]}
          />

          {/* 第一种选择否的时候会显示 0，其他都可以 */}
          {formData.show && <div>你看到我了~</div>}
          {!!formData.show && <div>你看到我了~</div>}
          {formData.show ? <div>你看到我了~</div> : null}
          {formData.show ? <div>你看到我了~</div> : <></>}


          <FormSwitch
            name='gender'
            label='性别'
            valuePropName='checked'
            config={{
              checkedChildren: '男',
              unCheckedChildren: '女',
              onClick: () => setGender(gender === 1 ? 2 : 1)
              // onClick: (value) => form.setFieldsValue({ 'gender': value ? 1 : 2 })
            }}
          />

          <FormCheckbox name='mergeItems' label='多选项' config={{ options: options.users }} rules={[{ required: true, message: '请选择' }]} />


          <Form.Item label='xx'><div>FormSelectOptGroup 有问题，选择后页面会出错</div></Form.Item>
          <div>FormSelectOptGroup 有问题，选择后页面会出错</div>
          <FormSelectOptGroup
            name='mergeItems'
            label='多选项'
            options={options.user_group}
            rules={[{ required: true, message: '请选择' }]}
          />


          <h3>日期</h3>
          <div>需要通过 dayjs(formData.entryTime).format('YYYY-MM-DD') 处理时间：{dayjs(formData.entryTime).format('YYYY-MM-DD')}</div>
          <FormDatePicker label='入职时间' name='entryTime' config={{ format: 'YYYY-MM-DD' }} />
          {/* <div>需要通过 dayjs(formData.businessTime).format('YYYY-MM-DD') 处理时间：{dayjs(formData.businessTime).format('YYYY-MM-DD')}</div> */}
          <FormTimePicker
            label='营业时间'
            name='businessTime'
            rules={[{ required: true, message: '请选择营业时间' }]}
            config={{
              // className: 'businesstime',
              style: {
                // width: '100%',
              },
            }}
            formItemConfig={{ className: cs('businesstime') }}
          />
          <FormTimeRangePicker
            label='营业时间范围'
            name='businessTimeRange'
            rules={[{ required: true, message: '请选择营业时间' }]}
            config={{
              // className: 'businesstime',
              style: {
                // width: '100%',
              },
            }}
            formItemConfig={{ className: cs('businesstime') }}
          />
          <FormRangePicker
            label='时间范围'
            name='ranges'
            config={{
              ranges: {
                '最近一周': [dayjs().subtract(7, 'day'), dayjs()],
                '最近一个月': [dayjs().subtract(30, 'day'), dayjs()],
                '最近三个月': [dayjs().subtract(30 * 3, 'day'), dayjs()]
              }
            }}
          />


          <h3>树选择</h3>
          <FormTreeSelect
            name='placeCategoryIds'
            label='场地类目'
            placeholder='请选择类目进行搜索'
            treeData={options.placeCategory}
            config={{
              fieldNames: { label: 'name', value: 'id', children: 'childList' },
              multiple: true,
              allowClear: true,
              treeCheckable: true,
              treeCheckStrictly: true,
              showCheckedStrategy: TreeSelect.SHOW_ALL,
            }}
          />
          <FormPlaceCategoryTreeSelect
            name='placeCategoryIdList'
            label='场地类目'
            placeholder='请选择类目进行搜索'
            type={0}
            config={{
              multiple: true,
              fieldNames: { label: 'name', value: 'id', children: 'childList' },
              allowClear: true,
            }}
          />

          <h3>城市</h3>
          <FormCascader
            label='所属城市'
            name='addressCodeList'
            placeholder='选择所属城市'
            options={options.cities}
            rules={[{ required: true, message: '请选择所属城市' }]}
            config={{ multiple: true, showCheckedStrategy: 'SHOW_CHILD' }}
          />
          <FormProvinceBussinessArea
            channelCode={'KA'}
            name='city'
            label='城市'
            placeholder='请选择城市'
            config={{
              multiple: true,
              fieldNames: { label: 'title', value: 'key', children: 'children' },
              treeNodeFilterProp: 'title',
              allowClear: true,
            }}
          />
          <V2FormProvinceList
            label={<div>开店城市
              <span onClick={() => selectAllCities(selectAll)} className='ml-4' style={{ color: '#999999' }}>[{selectAll ? '取消全选' : '全选'}]</span>
            </div>}
            name='pcIds'
            type={2}
            required
            config={{ allowClear: true, changeOnSelect: true, multiple: true, onChange: changeCity }}
            rules={[{ required: true, message: '请选择省市区' }]}
            placeholder='请选择省市区'
          />

          <h3>附件</h3>
          <FormUpload
            name='url'
            valuePropName='fileList'
            label='交付文件'
            rules={[{ required: true, message: '请导入交付文件' }]}
            config={{
              multiple: true,
              listType: 'text',
              maxCount: 1,
              size: 3,
              accept: '.xlsx, .xls, .ppt, .pptx, .pdf',
              qiniuParams: {
                domain: bucketMappingDomain['linhuiba-file'],
                bucket: Bucket.File,
              },
              showSuccessMessage: false,
              fileType: ['xls', 'xlsx', 'pdf', 'pptx', 'ppt'],
            }}
          >
            <TemplateUpload text='选择文件' />
            <div className='color-bbc mt-5 fs-12'>只能上传excel、pdf、ppt文件  最多上传 1 个文件</div>
          </FormUpload>

          <FormUpload
            formItemConfig={{
              // wrapperCol: { span: 21 },
              // labelCol: { span: 3 },
              help: '仅可上传 .png/.jpg/.jpeg/.bmp/.gif 文件， 不超过 50 MB， 最多上传 10 个文件'
            }}
            label='效果图'
            name='graph'
            config={{
              multiple: true,
              size: 50,
              maxCount: 10
            }}
          />


          <h3>模糊搜索</h3>
          <FormBooth name='booth' label='点位' placeholder='请选择点位'/>
          <FormSpot name='spot' label='点位 spot' placeholder='请选择点位'/>
          <FormBrand form={form} name='brand_ids' label='品牌' allowClear={true} config={{ mode: 'multiple' }} />

          <div>资源品牌 {Array.isArray(resource_brand_ids) ? resource_brand_ids.join('、') : resource_brand_ids}</div>
          <Button onClick={setResourceBrand}>回显数据</Button>
          <FormResourceBrand formRef={formResourceBrand} name='resource_brand_ids' label='资源-品牌' config={{ mode: 'multiple' }} />
          <FormSupplier formRef={formSupplier} name='supplier_id' label='供应商' changeHandle={changeSupplier} />
          <FormSupplierContact
            formRef={formSupplierContact}
            name='supplier_contact_id'
            label='供应商联系人'
            extraParams={{ supplier_id: supplier_id }}
          />
          {/* <Form.Item name='brand_ids' label='资源-品牌 BrandSelect'>
            <BrandSelect/>
          </Form.Item> */}

          <hr />
          <h3>动态表单</h3>
          <Button onClick={setPlans2Data}>设置 plans2 值</Button>
          <Form.List name='plans2'>
            {(fields) => (
              <>
                {Array.isArray(fields) && fields.map((item: any, index) => (
                  <div key={index} className={styles.flex}>
                    <FormDatePicker
                      name={[item.name, 'time']}
                      rules={[{ required: true, message: '请选择付款日期' }]}
                      formItemConfig={{ className: 'mr-20' }}
                      placeholder='请选择收款日期'
                    />
                    <FormInputNumber
                      name={[item.name, 'amount']}
                      min={0}
                      max={9999999999.99}
                      config={{ addonAfter: '元' }}
                      rules={[{ pattern: TWO_DECIMAL_NUMBER_REG, message: '请输入两位小数点小数', }]}
                      placeholder='请输入收款金额'
                    />
                  </div>
                ))}
              </>
            )}
          </Form.List>

          <h3>Group 组件</h3>

          <Button onClick={setPlansData}>设置 plans 值</Button>

          <div>plans {JSON.stringify(plans, null, 2)}</div>

          <Form.Item name='plans'>
            <Group value={plans} setValue={setPlans} getOriData={getOriPlan} dittoCoverData={{ amount: null }}>
              {(item, index) => <>
                <FormDatePicker
                  name={['plans', index, 'time']}
                  rules={[{ required: true, message: '请选择付款日期' }]}
                  formItemConfig={{ className: 'mr-20' }}
                  placeholder='请选择收款日期'
                />
                <FormInputNumber
                  name={['plans', index, 'amount']}
                  min={0}
                  max={9999999999.99}
                  config={{ addonAfter: '元' }}
                  rules={[{ pattern: TWO_DECIMAL_NUMBER_REG, message: '请输入两位小数点小数', }]}
                  formItemConfig={{ className: 'mr-20' }}
                  placeholder='请输入收款金额'
                />
              </>}
            </Group>
          </Form.Item>


          <div>
            <Button type='primary' className='mr-20' htmlType='submit'>确定</Button>
            <Button >取消</Button>
          </div>
        </Form>



        <h3>循环</h3>
        <div>
          {
            Array.isArray(options.users) && options.users.map((item, index) =>
              <span key={index}>{item.label || '-'}{index < options.users.length - 1 ? '、' : ''}</span>
            )
          }
        </div>
      </div>
    </div>
  );
}
