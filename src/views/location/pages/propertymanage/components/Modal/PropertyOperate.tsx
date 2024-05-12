/* eslint-disable react-hooks/exhaustive-deps */
/* 新增/编辑属性 */
import { FC, useEffect, useState } from 'react';
import { Modal, Form, Cascader } from 'antd';
import FormInput from '@/common/components/Form/FormInput';
import { get, post } from '@/common/request';
import { PropertyModalProps } from '../../ts-config';
import FormUpload from '@/common/components/Form/FormUpload';
import FormCascader from '@/common/components/Form/FormCascader';
import { isArray, recursionEach } from '@lhb/func';
import { DefaultOptionType } from 'antd/lib/select';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

const PropertyOperate: FC<PropertyModalProps> = ({ operateProperty, setOperateProperty, onSearch }) => {
  const [form] = Form.useForm();

  const [gaodeOptions, setGaodeOptions] = useState<any>([]);

  const loadGaodeOptions = async () => {
    const data = await get(
      '/shop/amap/code/list',
      {},
      { needCancel: false, isMock: false, needHint: true, mockId: 462, proxyApi: '/blaster' }
    );
    if (data && Array.isArray(data)) {

      recursionEach(data, 'children', (item: any) => {
        item.label = item.name + '(' + item.code + ')';
        item.nameCode = item.name + '-' + item.code;
      });
      console.log(1234, data);
      setGaodeOptions(data);
      if (operateProperty.id) {
        const photoList =
          (operateProperty?.icon && [{ url: operateProperty.icon, uid: operateProperty.icon, status: 'done' }]) || [];
        form.setFieldsValue({ ...operateProperty, icon: photoList, name: parseCode(data, operateProperty.code) });
      } else {
        form.resetFields();
      }
    }
  };

  /**
   * @description 获取多级属性列表中，所有选中项的nameCode字段
   * @param codeList 多级属性列表
   *   [
   *     {
   *       code: "010000",
   *       name: "汽车服务"
   *       label: "汽车服务(010000)",
   *       nameCode: "汽车服务-010000"
   *       children: [
   *         ...
   *       ]
   *     },
   *     ...
   *   ]
   *
   * @param code string，选中项的code，多个数据用|分隔；
   *             多级数据时只保留最后一级，比如'010000|020200|020401|020402' 中的四个选项，有一级的，二级的，三级的
   *
   * @return 数组，所有选中项的nameCode字段
   */
  const parseCode = (codeList, code) => {
    const targetCodes: string[] = code ? code.split('|') : [];
    const nameCodes: any[] = []; // 设置选择器选中项用
    getSelOptionValues(codeList, targetCodes, [], nameCodes);
    return nameCodes;
  };

  /**
   * @description 从list中获取选中项，添加到result参数中
   * @param list 选项列表
   * @param targetCodes 选中项的code数组
   * @param upperLevelNameCodes 上级的code数组，比如上级为['020000','020400']时，本选项code为'020402', 最终添加到result中的本选项nameCode为['020000','020400','020402']
   * @param result 数组，所有选中项的nameCode字段
   */
  const getSelOptionValues = (list, targetCodes, upperLevelNameCodes: string[], result: any[]) => {
    if (Array.isArray(list)) {
      for (let i = 0; i < list.length; i++) {
        const obj = list[i];
        if (targetCodes.includes(obj.code)) {
          result.push([...upperLevelNameCodes, obj.nameCode]);
        }
        getSelOptionValues(obj.children, targetCodes, [...upperLevelNameCodes, obj.nameCode], result);
      }
    }
  };

  useEffect(() => {
    if (operateProperty.visible) {
      loadGaodeOptions();
    }
  }, [operateProperty.visible]);

  const onSubmit = () => {
    form.validateFields().then((values: any) => {
      // 保存/修改-https://yapi.lanhanba.com/project/462/interface/api/45121
      const url = '/shop/attribute/save';

      const names: string[] = [];
      const codes: string[] = [];
      if (isArray(values.name)) {
        values.name.forEach(itm => {
          // 选中项非一级数据时取最里层级别
          const infos = isArray(itm) && itm.length ? itm[itm.length - 1].split('-') : [];
          if (infos.length === 2) {
            names.push(infos[0]);
            codes.push(infos[1]);
          }
        });
      }
      const params = {
        ...values,
        ...(operateProperty.id && { id: operateProperty.id }),
        categoryId: operateProperty.categoryId,
        name: names.join('|'), // 名称 多个使用|隔开
        code: codes.join('|'), // 标识 多个使用|隔开
      };
      params.icon = (values?.icon && values.icon.length && values.icon[0].url) || null;
      post(url, params, { proxyApi: '/blaster' }).then(() => {
        onCancel();
        onSearch({});
      });
    });
  };

  const onCancel = () => {
    setOperateProperty({ visible: false });
  };

  const filter = (inputValue: string, path: DefaultOptionType[]) =>
    path.some(
      (option) => (option.label as string).toLowerCase().indexOf(inputValue.toLowerCase()) > -1,
    );

  return (
    <>
      <Modal
        title={!operateProperty.id ? '新建属性' : '编辑属性'}
        open={operateProperty.visible}
        onOk={onSubmit}
        width={600}
        onCancel={onCancel}
        getContainer={false}
      >
        <Form {...layout} form={form}>
          <FormCascader
            label='选择属性'
            name='name'
            rules={[{ required: true, message: '请选择属性名称' }]}
            placeholder='选择属性名称'
            options={gaodeOptions}
            config={{
              multiple: true,
              showCheckedStrategy: Cascader.SHOW_PARENT,
              showSearch: { filter },
              fieldNames: {
                label: 'label',
                value: 'nameCode',
              },
            }}
          />
          {/* <FormInput
            label='属性名称'
            name='name'
            rules={[{ required: true, message: '请输入属性名称' }]}
            maxLength={30}
          /> */}
          <FormInput
            label='属性别名'
            name='aliaName'
            rules={[{ required: true, message: '请输入属性别名' }]}
            maxLength={30}
          />
          {/* <FormInput
            label='属性标识'
            name='code'
            rules={[{ required: true, message: '请输入属性标识' }]}
            maxLength={30}
          /> */}
          <FormUpload
            label='ICON图'
            name='icon'
            formItemConfig={{ help: '请上传大小为长15px*宽16px，且背景为透明的图片' }}
            rules={[{ required: true, message: '请上传ICON图' }]}
            config={{
              maxCount: 1,
              size: 4,
              isPreviewImage: true,
            }}
          />
        </Form>
      </Modal>
    </>
  );
};

export default PropertyOperate;
