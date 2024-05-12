/**
 * @Description 代认证弹窗
 */

import V2Form from '@/common/components/Form/V2Form';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormUpload from '@/common/components/Form/V2FormUpload/V2FormUpload';
import FormResourceBrand from 'src/common/components/FormBusiness/FormResourceBrand';
import { replaceEmpty } from '@lhb/func';
import { useMethods } from '@lhb/hook';
import { Col, Form, Modal, Row } from 'antd';
import { FC, useEffect, useRef, useState } from 'react';
import { brandList } from 'src/common/api/brand-center';
import AddBrand from 'src/views/locxx/pages/demandManagement/components/AddBrand';
import FormEmployeeSearch from '@/common/components/FormBusiness/FormEmployeeSearch';
import { replaceCertified, tenantHasAuthToLocation } from '@/common/api/common';
import { unstable_batchedUpdates } from 'react-dom';

const ReplaceModal:FC<any> = ({
  visible,
  setVisible,
  onRefresh
}) => {
  const [form] = Form.useForm();
  const formBrandRef: any = useRef();
  const formEmployeeRef: any = useRef();

  const [buttonText, setButtonText] = useState<string>('确定'); // 按钮文字
  const [loading, setLoading] = useState<boolean>(false); // 是否正在提交
  const [searchBrandContent, setSearchBrandContent] = useState(null);// 品牌搜索时输入的内容
  const [addBrandsData, setAddBrandsData] = useState({ visible: false });

  const setLoadingAndButtonText = (loading: boolean, buttonText: string) => {
    unstable_batchedUpdates(() => {
      setLoading(loading);
      setButtonText(buttonText);
    });
  };

  const methods = useMethods({
    // 搜素内容为空时的展示内容
    searchEmpty(title, func) {
      return (<div style={{ textAlign: 'center' }}>
        <img style={{ width: 120, margin: 20 }} src='https://staticres.linhuiba.com/project-custom/custom-flow/img_404@2x.png' />
        <p className='mb-24'>暂无{replaceEmpty(title)}，去 <span className='pointer color-primary ' onClick={func}>添加{replaceEmpty(title)}</span></p>
      </div>);
    },
    // 打开添加品牌弹窗
    handleAddBrand(visible = true) {
      setAddBrandsData({ visible });
    },
    // 获取搜索品牌的关键词
    onChangeBrandKeyword(searchBrandContent) {
      setSearchBrandContent(searchBrandContent);
    },
    // 品牌添加成功回调
    updateBrand(val) {
      if (!val) return;
      form.setFieldValue('brandId', val?.id || null);
      // 品牌联想输入框回填
      formBrandRef.current.setOptions([val]);
    },
    onSubmit() {
      form.validateFields().then((res: any) => {
        if (loading) return;

        const { employeeId, ...restValue } = res;

        const params = {
          employeeId: employeeId.split('-')[1],
          ...restValue,
        };

        setLoadingAndButtonText(true, '正在提交中...');
        replaceCertified(params).then(() => {
          onRefresh?.();
          setVisible(false);
        }, () => {
          setLoadingAndButtonText(false, '确定');
        });
      });
    },
  });

  useEffect(() => {
    if (visible) {
      form.resetFields();
      setLoadingAndButtonText(false, '确定');
    }
  }, [visible]);

  return (
    <>
      <Modal
        title='代认证'
        open={visible}
        onOk={methods.onSubmit}
        okText={buttonText}
        // 两列弹窗要求640px
        width={640}
        onCancel={() => setVisible(false)}
        destroyOnClose
        forceRender
      >
        {visible ? <V2Form form={form}>
          <Row gutter={16}>
            <Col span={12}>
              <FormEmployeeSearch
                label='客户账号'
                name='employeeId'
                placeholder='可搜索租户、客户姓名、手机号'
                onChange={methods.handleEmployeeChange}
                rules={[
                  { required: true, message: '客户账号必填' },
                  { validator: async (rules: any, val: any) => {
                    if (!val) return;

                    // value值设置为拼接的原因在于fuzzy组件在单选时不支持记录搜索选出的选项
                    const tenantId = val.split('-')[0];

                    const res = await tenantHasAuthToLocation({ tenantId });

                    if (!res.aboolean) {
                      return Promise.reject('该账号尚未授权商业直租');
                    }

                    return Promise.resolve();
                  } }]}
                formRef={formEmployeeRef}/>
            </Col>
            <Col span={12}>
              <V2FormInput label='岗位' name='position' required maxLength={50}/>
            </Col>
            <Col span={12}>
              <FormResourceBrand
                formRef={formBrandRef}
                label='开店品牌'
                name='brandId'
                allowClear={true}
                rules={[{ required: true, message: '请搜索并选择品牌' }]}
                placeholder='请选择开店品牌'
                config={{ getPopupContainer: (node) => node.parentNode }}
                renderEmptyReactNode={methods.searchEmpty('品牌', methods.handleAddBrand)}
                onChangeKeyword={methods.onChangeBrandKeyword}
                api={brandList}
              />
            </Col>
            <Col span={12}>
              <V2FormUpload
                label='上传证明'
                name='files'
                required
                uploadType='image'
                tipConfig={{
                  tooltipTitle: '上传有效期内的名片或者工卡照片，支持jpg/jpeg/png/bmp格式，大小不超过20MB，不超过5张图片'
                }}
                config={{
                  fileType: ['png', 'jpg', 'jpeg', 'bmp']
                }} />
            </Col>
          </Row>
        </V2Form> : <></>}
      </Modal>

      {/* 添加其他品牌 */}
      <AddBrand
        addBrandsData={addBrandsData}
        setAddBrandsData={setAddBrandsData}
        searchContent={searchBrandContent}
        addSuccessComplete={methods.updateBrand}
      />
    </>
  );
};

export default ReplaceModal;
