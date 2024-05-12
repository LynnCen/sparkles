/* 新增员工弹框 */
import React, { useState, useEffect, useMemo } from 'react';
import { Col, Form, message, Modal, Row } from 'antd';
import V2Form from '@/common/components/Form/V2Form';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormTextArea from '@/common/components/Form/V2FormTextArea/V2FormTextArea';
import V2FormRadio from '@/common/components/Form/V2FormRadio/V2FormRadio';
import StoreScope from './components/StoreScope';
import DateScope from './components/DateScope';
import DataScope from './components/DataScope';
import Options from './components/Options';
import {
  reportTempDetail,
  createReportTemp,
  updateReportTemp
} from '@/common/api/report';
import dayjs from 'dayjs';
import { deepCopy } from '@lhb/func';
import { OperateProps, dataTypeOptions } from '../../ts-config';


const EditModal: React.FC<OperateProps> = ({ record, onClose, onOk }) => {
  const [form] = Form.useForm();
  // 门店范围类型
  const [storeScope, setStoreScope] = useState<number>(0);
  // 时间范围类型
  const [dateScope, setDateScope] = useState<number>(0);
  // 符合提交接口格式要求的"数据项"字段值
  const [selOptions, setSelOptions] = useState<string[]>([]);
  const [isLock, setIsLock] = useState<boolean>(false);

  const showStores = useMemo(() => {
    return storeScope === 2;
  }, [storeScope]);

  const showRange = useMemo(() => {
    return dateScope === 2;
  }, [dateScope]);

  useEffect(() => {
    if (record.visible) {
      form.resetFields();
      // 新建时默认选中[数据格式]的[门店]选项
      form.setFieldValue('dimension', dataTypeOptions[0].value);
      setStoreScope(0);
      setDateScope(0);

      if (isUpdate) {
        reportTempDetail({ id: record.id }).then((data: any) => {
          const {
            name,
            storeScope,
            stores,
            dateScope,
            start,
            end,
            dataScope,
            optionList,
            remark,
            dimension
          } = data;

          // 初始化表单数据
          const formData: any = {
            name,
            dimension,
            storeScope,
            dateScope,
            dataScope,
            optionList: getCascaderValues(optionList)
          };
          if (storeScope === 2) { // 指定门店
            formData.storeIds = stores.map((store: any) => store.id);
          }
          if (dateScope === 2) { // 指定时间
            formData.dateRange = [dayjs(start), dayjs(end)];
          }
          if (remark) { // 备注
            formData.remark = remark;
          }
          form.setFieldsValue(formData);

          // 初始化组件状态
          setStoreScope(storeScope);
          setDateScope(dateScope);
          setSelOptions(formData.optionList.map((itm: any) =>
            Array.isArray(itm) ? itm[itm.length - 1] : ''
          ));
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record.visible]);

  const getCascaderValues = (options: any[]) => {
    const values: any[] = [];
    if (Array.isArray(options)) {
      options.forEach(itm => {
        if (itm.name && Array.isArray(itm.children)) {
          itm.children.forEach((child: any) => {
            if (child.name) {
              values.push([itm.name, child.name]);
            }
          });
        }
      });
    }
    return values;
  };

  const isUpdate = useMemo(() => {
    return !!(record.id && (+record.id));
  }, [record]);

  const handleCancel = () => {
    onClose({ ...record, visible: false });
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values: any) => {
        if (isLock) return;
        setIsLock(true);

        // 选中门店处理
        (!values.storeIds) && (values.storeIds = []);

        // 日期处理
        const range = values.dateRange;
        if (range && Array.isArray(range) && range.length === 2) {
          values.start = dayjs(range[0]).format('YYYY-MM-DD');
          values.end = dayjs(range[1]).format('YYYY-MM-DD');
        } else {
          values.start = '';
          values.end = '';
        }

        const params = deepCopy(values);
        isUpdate && (params.id = record.id);
        params.optionList = selOptions || [];
        delete params.dateRange;

        const fnc = isUpdate ? updateReportTemp : createReportTemp;
        fnc(params).then(() => {
          message.success(`${isUpdate ? '编辑' : '新增'}报表模板成功`);
          onClose({ ...record, visible: false });
          onOk();
        }).finally(() => {
          setIsLock(false);
        });
      })
      .catch((errorInfo: any) => {
        console.log('errorInfo', errorInfo);
      });
  };

  return (
    <Modal
      title={`${isUpdate ? '编辑' : '新增'}报表模板`}
      open={record.visible}
      width={660}
      onOk={handleSubmit}
      onCancel={handleCancel}
    >
      <V2Form form={form}>
        <Row gutter={16}>
          <Col span={12}>
            <V2FormRadio
              label='数据格式'
              name='dimension'
              options={dataTypeOptions}
              required
            />
          </Col>
          <Col span={12}>
            <V2FormInput
              label='模板名称'
              name='name'
              placeholder='请输入模版名称，最多10个字'
              maxLength={10}
              required
            />
          </Col>
          <Col span={12}>
            <DataScope/>
          </Col>
          <StoreScope showExtend={showStores} onChange={setStoreScope}/>
          <DateScope showExtend={showRange} onChange={setDateScope}/>
          <Col span={12}>
            <Options onChange={setSelOptions}/>
          </Col>
          <Col span={12}>
            <V2FormTextArea
              label='备注'
              name='remark'
              placeholder='请输入备注，最长输入50个字符'
              maxLength={50}
            />
          </Col>
        </Row>
      </V2Form>
    </Modal>
  );
};

export default EditModal;
