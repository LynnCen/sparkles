/**
 * @Description
 */
import { companyList } from '@/common/api/company';
import { setCompanyBrand } from '@/common/api/system';
import V2Form from '@/common/components/Form/V2Form';
import V2FormCheckbox from '@/common/components/Form/V2FormCheckbox/V2FormCheckbox';
import { Form, Modal } from 'antd';
import { FC, useEffect, useState } from 'react';
import styles from './index.module.less';
import { isArray } from '@lhb/func';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
const SetAreaModal:FC<any> = ({
  areaModal,
  setAreaModal,
  // onSuccess
}) => {
  const [form] = Form.useForm();

  const { visible, id, branchCompanyIds } = areaModal;
  const [dataList, setDataList] = useState<any>([]);
  const [isLock, setIsLock] = useState<boolean>(false);

  const handleGetCompany = async() => {
    const { data } = await companyList({ page: 1, size: 200 });
    setDataList(data);
  };

  const handleOk = () => {
    form.validateFields().then(async (res) => {
      if (isLock) return;
      setIsLock(true);

      const params: any = {
        ...res,
        industryBrandId: id
      };

      try {
        const res = await setCompanyBrand({ ...params });
        if (res) {
          setAreaModal({ visible: false, id: '', branchCompanyIds: [] });
          form.resetFields();
          // onSuccess(); // 不刷新当前页面
          V2Message.success('配置成功');
          setIsLock(false);
          return;
        }

        V2Message.error('配置失败');
        setIsLock(false);

      } catch (error) {
        V2Message.error('配置失败');
        setIsLock(false);
      }
    });
  };
  const handleCancel = () => {
    form.resetFields();
    setAreaModal({ visible: false, id: '', branchCompanyIds: [] });
  };
  useEffect(() => {
    if (visible) {
      handleGetCompany();
      form.setFieldValue('branchCompanyIds', branchCompanyIds);
    }
  }, [visible]);

  return <div>
    <Modal
      title='配置该品牌生效区域'
      open={visible}
      width={640}
      onOk={handleOk}
      onCancel={() => handleCancel()}>
      <V2Form layout='vertical' form={form}>
        {isArray(branchCompanyIds) && <V2FormCheckbox
          config={{
            className: styles.checkBox,
            value: branchCompanyIds,
          }}
          name='branchCompanyIds'
          fieldNames={{
            label: 'name',
            value: 'id'
          }}
          options={dataList} />}
      </V2Form>
    </Modal>
  </div>;
};
export default SetAreaModal;
