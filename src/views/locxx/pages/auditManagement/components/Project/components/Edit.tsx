import { Cascader, Form, Modal } from 'antd';
import { FC, useEffect, useState } from 'react';
import V2Form from '@/common/components/Form/V2Form';
import V2FormTextArea from '@/common/components/Form/V2FormTextArea/V2FormTextArea';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormInputNumber from '@/common/components/Form/V2FormInputNumber/V2FormInputNumber';
import V2FormCascader from '@/common/components/Form/V2FormCascader/V2FormCascader';
// import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import { MOBILE_REG } from '@lhb/regexp';
import { post } from '@/common/request';
// import { getUserTenantAuthorizeStatus } from '@/common/api/locxx';
import { useMethods } from '@lhb/hook';
import { contrast } from '@lhb/func';
import { refactorSelectionNew } from '@/common/utils/ways';
import { getRequirementSelection } from '@/common/api/demand-management';

/** 表单编辑类型 */
export enum EditType {
  /** 通过 */
  PASS = 1,
  /** 拒绝 */
  REFUSE = 2,
  /** 编辑 */
  EDIT = 3,
}

const { SHOW_CHILD } = Cascader;

// 交易平台-审核管理-编辑弹窗
const Refuse:FC<{
  editData: {
    id: number | null,
    visible: boolean,
    type?: number, // 类型：1 拒绝，0 通过，2 编辑
    contactMobile?: string,
    tenantName?: string,
    contactName?: string,
    position?: string,
    commercials?: Array<any>
    // openStatus?: string | number
    categoryName?:string
    categoryId?:number
  },
  setEditData: any,
  onRefresh: Function,
  openStatusOptions: Array<any>
}> = ({ editData, setEditData, onRefresh
  // , openStatusOptions
}) => {

  const [form] = Form.useForm();
  const [requesting, setRequesting] = useState(false);
  // 用户租户授权信息
  // const [userTenantAuthorizeInfo, setUserTenantAuthorizeInfo] = useState({
  //   editable: false, // 公司字段是否可编辑，初始化不可编辑，防止修改
  //   message: '', // 不可编辑原因
  // });
  const [selection, setSelection] = useState({
    commercials: []
  });
  const commercialsIds = Form.useWatch('commercialsIds', form);
  const maxCommercialsLength = 3;

  const methods = useMethods({
    submit() {
      // const apiUrl = editData?.type === EditType.REFUSE ? '/admin/place/deny' : '/admin/place/approve';
      form.validateFields().then(result => {
        if (requesting) return;
        setRequesting(true);

        result.placeId = editData.id;
        result.commercialsIds = Array.isArray(result?.commercialsIds) && result?.commercialsIds?.length ? result.commercialsIds.map(item => item[1]) : [];

        const apiUrlObj = {
          // 通过 https://yapi.lanhanba.com/project/560/interface/api/61417
          [EditType.PASS]: '/admin/place/approve',
          // 拒绝 https://yapi.lanhanba.com/project/560/interface/api/61424
          [EditType.REFUSE]: '/admin/place/deny',
          // 编辑 https://yapi.lanhanba.com/project/560/interface/api/61599
          [EditType.EDIT]: '/admin/place/edit'
        };

        const api = apiUrlObj[editData?.type || EditType.PASS];
        api && post(api, result, { proxyApi: '/zhizu-api' }).then(() => {
          onRefresh?.();
          methods.cancel();
        }).finally(() => {
          setRequesting(false);
        });
      }).catch((err) => { console.log(err); });
    },
    cancel() {
      setEditData(state => ({ ...state, visible: false }));
    },
    getOriFromData() {
      return {
        reason: null, // 拒绝原因
        name: null, // 姓名
        mobile: null, // 手机号
        position: null, // 岗位
        brandId: null, // 品牌
        company: null, // 公司
        commercialsIds: [], // 业态
      };
    },
    // 租户授权状态
    // getUserTenantAuthorizeStatus() {
    //   getUserTenantAuthorizeStatus({ id: editData.id, examineType: 1 }).then((res: any) => {
    //     setUserTenantAuthorizeInfo({
    //       editable: !!res?.editable,
    //       message: res?.message,
    //     });
    //   });
    // },
    getSelection() {
      getRequirementSelection({ modules: 'commercial' }).then((response) => {
        setSelection(val => ({ ...val,
          commercials: refactorSelectionNew({ selection: contrast(response, 'commercials', []) }),
        }));
      });
    },
    changeCommercials(values) {
      form.setFieldValue('commercialsIds', Array.isArray(values) && values.length ? values.slice(0, 3) : []);
    }
  });

  useEffect(() => {
    if (editData.visible) {
      form.setFieldsValue(Object.assign({}, methods.getOriFromData(), {
        mobile: editData?.contactMobile || null,
        company: editData?.tenantName || null,
        name: editData?.contactName || null,
        position: editData?.position || null,
        commercialsIds: Array.isArray(editData?.commercials) && editData?.commercials.length ? editData?.commercials.map(item => ([item.parentId, item.id])) : [],
        // openStatus: editData?.openStatus || null
      }));
      methods.getSelection();
      // methods.getUserTenantAuthorizeStatus();
    }
  }, [editData.visible]);

  return <Modal
    title={editData?.type === EditType.REFUSE ? '提示' : '联系人信息'}
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
        <V2FormInput
          label='姓名'
          name='name'
          maxLength={5}
          rules={[
            { required: true, message: '请输入姓名', },
            { max: 5, message: '姓名不能超过5个字', },
          ]}
        />
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
        <V2FormInput label='岗位' name='position' maxLength={15}/>
        <V2FormInput
          label='公司'
          name='company'
          maxLength={15}
          required
          // disabled={!userTenantAuthorizeInfo.editable}
        />
        {/* {!!userTenantAuthorizeInfo.message && <div className='color-danger'>{userTenantAuthorizeInfo.message}</div>} */}
      </> : ''}
      {editData.type !== EditType.REFUSE ? <V2FormCascader
        label='业态'
        name='commercialsIds'
        options={selection.commercials}
        config={{
          showSearch: true,
          showArrow: true,
          allowClear: true,
          changeOnSelect: true,
          multiple: true,
          maxTagCount: 3,
          showCheckedStrategy: SHOW_CHILD,
        }}
        placeholder='请选择业态'
        rules={[{ required: editData?.categoryName !== '街铺', message: '请选择业态' }]}
        onChange={(values) => methods.changeCommercials(values) }
      /> : ''}
      {Array.isArray(commercialsIds) && commercialsIds.length >= maxCommercialsLength ? <span className='color-warning'>业态最多选择{maxCommercialsLength}个</span> : ''}
      {/* {
        editData.type !== EditType.REFUSE ? (
          <V2FormSelect
            name='openStatus'
            label='项目状态'
            required
            allowClear={false}
            options={openStatusOptions}
          />
        ) : undefined
      } */}
    </V2Form>
  </Modal>;
};

export default Refuse;
