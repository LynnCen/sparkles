/**
 * 品牌列表
 */
import { FC, useState, ReactNode, useRef, useEffect } from 'react';
import { Button, message as msg, Divider, Form } from 'antd';
import { boothSearch } from '@/common/api/flow';
import { SelectionOptionItem } from './ts-config';
import { useMethods } from '@lhb/hook';
import { concatObjArray, deepCopy } from '@lhb/func';
import { useSelector } from 'react-redux';
import Fuzzy from './Fuzzy';
import FormInput from '../Form/FormInput';
import FormProvinceList from '@/common/components/FormBusiness/FormProvinceList';

const Booth: FC<any> = ({
  extraParams = {},
  finallyData,
  isAddable = false,
  assignmentHandle,
  mode,
  setListData,
  ...props
}) => {
  const fuzzyRef = useRef();
  const [addItems, setAddItems] = useState<{
    id: number, name: string, [p: string]: any
  }[]>([]);
  const [form] = Form.useForm();
  const addableNotFoundNode = (<span className='color-help'>搜索不到展位时可添加</span>);
  const provinceData = useSelector((state: any) => state.common.provinceCityDistrict);


  // methods
  const { loadData, dropdownRenderAddable, formFinish, getPCDStr } = useMethods({
    // 获取展位列表
    loadData: async (keyword: string) => {
      const params = {
        keyword,
        ...extraParams,
      };
      const data: SelectionOptionItem[] = await boothSearch(params);
      let options: any = data;
      if (isAddable) { // 新增展位时
        options = concatObjArray(addItems, data, 'id');
      }
      finallyData && finallyData(options);
      return Promise.resolve(options);
    },
    getPCDStr: (pcdIds: number[]) => {
    // 查找省份
      const targetProvince: any = provinceData.find((province: any) => pcdIds[0] === province.id);
      if (!targetProvince) return '';
      const { name: provinceName, children: cityData } = targetProvince;
      let str = provinceName;
      // 查找城市
      const targetCity: any = cityData.find((city: any) => pcdIds[1] === city.id);
      if (!targetCity) return str;
      const { name, children } = targetCity;
      str += (str !== name ? name : ''); // 解决直辖市省和市同名
      // 查找区域
      const targetDistricts = children.find((district: any) => pcdIds[2] === district.id);
      if (!targetDistricts) return str;
      str += targetDistricts.name;
      return str;
    },
    formFinish: (values: Record<string, any>) => {
      const { name, address, pcdIds } = values;
      if (addItems.find((item: Record<string, any>) => item.id === name)) {
        msg.warning('已添加过该展位，请勿重复添加');
        return;
      }
      const provinceCitStr = getPCDStr(pcdIds);
      const option = {
        id: name, // 新增的展位没有id，名字作为id
        name,
        address: `${provinceCitStr}${address}`,
        provinceId: pcdIds[0],
        cityId: pcdIds[1],
        districtId: pcdIds[2],
      };
      const items = deepCopy(addItems);
      items.push(option);
      setAddItems(items);
      form.resetFields();
      (fuzzyRef as any).current.addOption(option); // 添加option项
      assignmentHandle(option.id); // 帮助选中
      msg.success('新增展位成功，已帮助选择');
    },
    // https://github.com/ant-design/ant-design/issues/33282
    // https://ant.design/docs/react/faq-cn#%E5%BD%93%E6%88%91%E7%82%B9%E5%87%BB-Select-Dropdown-DatePicker-TimePicker-Popover-Popconfirm-%E5%86%85%E7%9A%84%E5%8F%A6%E4%B8%80%E4%B8%AA-popup-%E7%BB%84%E4%BB%B6%E6%97%B6%E5%AE%83%E4%BC%9A%E6%B6%88%E5%A4%B1%EF%BC%8C%E5%A6%82%E4%BD%95%E8%A7%A3%E5%86%B3%EF%BC%9F
    dropdownRenderAddable: (menu: ReactNode) => {
      if (isAddable) {
        return (
          <>
            {menu}
            <Divider/>
            <Form
              form={form}
              onFinish={formFinish}
              className='ml-12 mr-12'>
              <FormInput
                label=''
                name='name'
                maxLength={40}
                placeholder='请输入展位名称'
                rules={[{ required: true, message: '请输入展位名' }]}/>
              <FormProvinceList
                label=''
                name='pcdIds'
                placeholder='请选择省市区'
                rules={[{ required: true, message: '请选择省市区' }]}
                config={{
                  getPopupContainer: (node) => node.parentNode
                }}/>
              <FormInput
                label=''
                name='address'
                maxLength={50}
                placeholder='请输入具体地址'
                rules={[{ required: true, message: '请输入具体地址' }]}/>
              <Button type='primary' htmlType='submit'>添加</Button>
            </Form>
          </>
        );
      }
      return menu;
    },
  });

  useEffect(() => {
    if (!(Array.isArray(setListData) && setListData.length)) return;
    (fuzzyRef as any).current.setOptions(setListData); // 添加option项
    finallyData && finallyData(setListData); // 将此项抛出
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setListData]);

  return (
    <>
      <Fuzzy
        ref={fuzzyRef}
        loadData={loadData}
        mode={mode}
        fieldNames={{
          label: 'name',
          value: 'id'
        }}
        listHeight={140}
        dropdownRender={(menu) => dropdownRenderAddable(menu)}
        notFoundNode={isAddable ? addableNotFoundNode : null}
        dropdownStyle={{ overflow: 'visible ' }}
        {...props}>
      </Fuzzy>
    </>
  );
};

export default Booth;


