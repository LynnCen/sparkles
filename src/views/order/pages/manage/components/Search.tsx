import { FC, useState, useRef } from 'react';
import { Row, Col, Space, Modal, message as msg } from 'antd';
import { orderExport, orderImport, orderImportCheck } from '@/common/api/order';
import dayjs from 'dayjs';
import SearchForm from '@/common/components/Form/SearchForm';
import FormStores from '@/common/components/FormBusiness/FormStores';
import V2FormRangePicker from '@/common/components/Form/V2FormRangePicker/V2FormRangePicker';
import ModalExport from '@/common/components/business/ModalExport';
import { dispatchNavigate } from '@/common/document-event/dispatch';

import Operate from '@/common/components/Operate';
import { useMethods } from '@lhb/hook';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import ImportModal from '@/common/components/business/ImportModal';

const { confirm } = Modal;

const Search: FC<any> = ({ change, searchParams, operateList }) => {

  const [visible, setVisible] = useState(false);
  const [exportVisible, setExportVisible] = useState(false);
  const searchRef = useRef();

  const { ...methods } = useMethods({
    handleImport() {
      setVisible(true);
    },
    handleDownload() {
      setExportVisible(true);
    },
    handleToPreview() {
      dispatchNavigate('/predict');
    },
  });

  function disabledDate(current) {
    return current && current > dayjs();
  }

  const resetSearchAndLoad = () => {
    (searchRef as any).current.resetFormFields();
  };

  const onOk = async (values: any) => {
    await orderExport({ ...searchParams, ...values });
    setExportVisible(false);
  };

  const importCheck = async(urlStr, form) => {
    const { status, message } = await orderImportCheck({ url: urlStr });
    if (!status) {
      return importHandle(urlStr);
    }
    confirm({
      title: '提示',
      maskClosable: false,
      keyboard: false,
      content: message,
      cancelText: '重新导入',
      okText: '继续',
      onOk() {
        return importHandle(urlStr);
      },
      onCancel() {
        form.resetFields();
      }
    });
  };
  const importHandle = async (url: string) => {
    const { successCount, totalCount } = await orderImport({ url });
    msg.success(`共${totalCount}条数据，成功导入${successCount}条`);
    // closeHandle();
    resetSearchAndLoad();
  };
  return (
    <>
      <Row>
        <Col span={17}>
          <SearchForm onSearch={change} onRef={searchRef}>
            <FormStores
              label='选择门店'
              name='storeIds'
              allowClear={true}
              config={{
                mode: 'multiple',
                maxTagCount: 1,
              }}
              placeholder='请选择门店'
            />
            <V2FormRangePicker
              label='营业日期'
              name='ranges'
              disabledDate={disabledDate}
            />
          </SearchForm>
        </Col>
        <Col span={7} className='rt'>
          <Space>
            <Operate operateList={operateList} onClick={(btn) => methods[btn.func]()} />
          </Space>
        </Col>
      </Row>

      <ModalExport visible={exportVisible} onOk={onOk} onClose={() => setExportVisible(false)} />
      {/* <ModalImport open={visible} loadData={resetSearchAndLoad} modalHandle={() => setVisible(false)} /> */}
      <ImportModal
        visible={visible}
        closeHandle={() => setVisible(false)}
        title='导入订单数据'
        fileName='订单导入模版.xlsx'
        importCheck={importCheck}
      >
        <ExclamationCircleOutlined /> 如需预测距今至少30天的订单数据，数据越详尽预测越准确
      </ImportModal>
    </>
  );
};

export default Search;


