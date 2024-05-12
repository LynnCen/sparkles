import { Form, Modal, message } from 'antd';
import { FC, useEffect, useRef, useState } from 'react';
import V2Form from '@/common/components/Form/V2Form';
import V2FormTextArea from '@/common/components/Form/V2FormTextArea/V2FormTextArea';
import { useMethods } from '@lhb/hook';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormInputNumber from '@/common/components/Form/V2FormInputNumber/V2FormInputNumber';
import { MOBILE_REG } from '@lhb/regexp';
import FormResourceBrand from 'src/common/components/FormBusiness/FormResourceBrand';
import { replaceEmpty } from '@lhb/func';
import AddBrand from 'src/views/locxx/pages/demandManagement/components/AddBrand';
import { post } from '@/common/request';
import { brandList } from 'src/common/api/brand-center';
// import { getUserTenantAuthorizeStatus } from '@/common/api/locxx';

/** 表单编辑类型 */
export enum EditType {
  /** 通过 */
  PASS = 1,
  /** 拒绝 */
  REFUSE = 2,
  /** 编辑 */
  EDIT = 3,
}

// 交易平台-审核管理-编辑弹窗
const Refuse:FC<{
  editData: {
    id: number | null,
    visible: boolean,
    type?: number, // 类型：1 拒绝，2 通过，3 编辑
    employeeName?: string,
    mobile?: string,
    position?: string,
    brandId?: string,
    brandName?: string,
    tenantName?: string,
  },
  setEditData: any,
  onRefresh: Function,
}> = ({ editData, setEditData, onRefresh }) => {

  const [form] = Form.useForm();
  const [addBrandsData, setAddBrandsData] = useState({ visible: false });
  const [searchBrandContent, setSearchBrandContent] = useState(null);// 品牌搜索时输入的内容
  const formBrandRef: any = useRef();
  const [requesting, setRequesting] = useState(false);
  // 用户租户授权信息
  // const [userTenantAuthorizeInfo, setUserTenantAuthorizeInfo] = useState({
  //   editable: false, // 公司字段是否可编辑，初始化不可编辑，防止修改
  //   message: '', // 不可编辑原因
  // });

  const methods = useMethods({
    submit() {
      form.validateFields().then(result => {
        if (requesting) return;
        setRequesting(true);

        const params = { ...result, brandExamineId: editData.id };
        const apiUrlObj = {
          // 通过 https://yapi.lanhanba.com/project/560/interface/api/61312
          [EditType.PASS]: '/admin/brand/pass',
          // 拒绝 https://yapi.lanhanba.com/project/560/interface/api/61312
          [EditType.REFUSE]: '/admin/brand/reject',
          // 编辑
          [EditType.EDIT]: '/admin/brand/edit'
        };

        const api = apiUrlObj[editData?.type || EditType.PASS];
        api && post(api, params, { proxyApi: '/zhizu-api' }).then(() => {
          onRefresh?.();
          methods.cancel();
          message.success(`品牌${editData?.type === EditType.PASS ? '通过' : editData?.type === EditType.EDIT ? '编辑' : '拒绝'}成功`);
        }).finally(() => {
          setRequesting(false);
        });
      });
    },
    cancel() {
      setEditData(state => ({ ...state, visible: false }));
    },
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
    getOriFromData() {
      return {
        reason: null, // 拒绝原因
        employeeName: null, // 姓名
        mobile: null, // 手机号
        positionName: null, // 岗位
        brandId: null, // 品牌
        enterpriseName: null// 公司
      };
    },
    // 租户授权状态
    // getUserTenantAuthorizeStatus() {
    //   getUserTenantAuthorizeStatus({ id: editData.id, examineType: 2 }).then((res: any) => {
    //     setUserTenantAuthorizeInfo({
    //       editable: !!res?.editable,
    //       message: res?.message,
    //     });
    //   });
    // }
  });

  useEffect(() => {
    if (editData.visible) {
      form.resetFields(); // 先重置表单
      const { employeeName = null, mobile = null, position = null, brandId = null, brandName = null, tenantName = null } = editData;

      setTimeout(() => {
        formBrandRef.current?.setOptions([{ id: brandId, name: brandName }]);
      }, 200);

      form.setFieldsValue(Object.assign({},
        methods.getOriFromData(), {
          mobile,
          employeeName,
          positionName: position,
          brandId,
          enterpriseName: tenantName
        }));

      // methods.getUserTenantAuthorizeStatus();
    }
  }, [editData.visible]);

  return <Modal
    title={editData?.type === EditType.REFUSE ? '拒绝原因' : '联系人信息'}
    width={336}
    open={editData.visible}
    onOk={methods.submit}
    onCancel={methods.cancel}
    confirmLoading={requesting}
  >
    <V2Form form={form}>
      {editData.type === EditType.REFUSE ? <V2FormTextArea
        label=''
        placeholder='请输入拒绝原因'
        name='reason'
        maxLength={200}
        rules={[{ required: true, whitespace: true, message: '请输入拒绝原因' }]}
        config={{ showCount: true }}
      /> : ''}
      {editData.type !== EditType.REFUSE ? <>
        <V2FormInput label='姓名' name='employeeName' maxLength={5} required/>
        <V2FormInputNumber
          label='手机号'
          name='mobile'
          placeholder='请输入手机号'
          precision={0}
          config={{
            controls: false,
            maxLength: 11
          }}
          rules={[{ required: true, message: '请输入11位手机号码' }, { pattern: MOBILE_REG, message: '输入的手机号码不合法' }]}
        />
        <V2FormInput label='岗位' name='positionName' maxLength={15}/>
        <FormResourceBrand
          formRef={formBrandRef}
          label='品牌'
          name='brandId'
          allowClear={true}
          rules={[{ required: true, message: '请搜索并选择品牌' }]}
          placeholder='请搜索并选择品牌'
          config={{ getPopupContainer: (node) => node.parentNode }}
          renderEmptyReactNode={methods.searchEmpty('品牌', methods.handleAddBrand)}
          onChangeKeyword={methods.onChangeBrandKeyword}
          api={brandList}
        />
        <V2FormInput
          label='公司'
          name='enterpriseName'
          maxLength={15}
          required
          // disabled={!userTenantAuthorizeInfo.editable}
        />
        {/* {!!userTenantAuthorizeInfo.message && <div className='color-danger'>{userTenantAuthorizeInfo.message}</div>} */}
      </> : ''}
    </V2Form>
    {/* 添加其他品牌 */}
    <AddBrand
      addBrandsData={addBrandsData}
      setAddBrandsData={setAddBrandsData}
      searchContent={searchBrandContent}
      addSuccessComplete={methods.updateBrand}
    />
  </Modal>;
};

export default Refuse;
