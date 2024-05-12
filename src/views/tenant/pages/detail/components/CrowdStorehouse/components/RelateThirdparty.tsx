import { FC } from 'react';
import { Modal, Form } from 'antd';
import { relevancyThirdparty } from '@/common/api/flow';
import FormRelateThirdparty from '@/common/components/FormBusiness/FormRelateThirdparty';


const RelateThirdparty: FC<any> = ({
  visible,
  modalHandle,
  storeId,
  loadData,
  thirdpartyStore
}) => {
  const [form] = Form.useForm();

  const submitHandle = () => {
    form.validateFields().then(async (values: { thirdPartyId: number }) => {
      const { thirdPartyId } = values;
      const params = {
        id: storeId, // 门店id
        storeId: thirdPartyId// 云盯门店id
      };

      await relevancyThirdparty(params);
      loadData();
      modalHandle(false);
    });
  };

  return (
    <>
      <Modal
        title='关联云盯'
        open={visible}
        width={400}
        destroyOnClose={true}
        onOk={submitHandle}
        onCancel={() => modalHandle(false)}>
        <Form
          form={form}
          preserve={false}
          name='form'>
          <FormRelateThirdparty
            form={form}
            label='选择云盯门店'
            name='thirdPartyId'
            placeholder='请选择云盯门店'
            allowClear={true}
            formItemConfig={{
              initialValue: thirdpartyStore?.storeId || '',
            }}
            config={{
              immediateOnce: !thirdpartyStore,
              setListData: thirdpartyStore ? [thirdpartyStore] : []
            }}/>
        </Form>
      </Modal>
    </>
  );
};

export default RelateThirdparty;
