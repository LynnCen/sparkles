/**
 * @Description 新增商圈 form表单
 */
import { FC, useEffect, useRef, useState } from 'react';
import styles from './index.module.less';
import V2Form from '@/common/components/Form/V2Form';
import { Button, Form } from 'antd';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import { refactorSelection } from '@lhb/func';
import { createPlanCluster, getTreeSelection } from '@/common/api/networkplan';
import V2FormCascader from '@/common/components/Form/V2FormCascader/V2FormCascader';
import V2FormTextArea from '@/common/components/Form/V2FormTextArea/V2FormTextArea';
// import V2PopConfirm from '@/common/components/Others/V2PopConfirm';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import { V2Confirm } from '@/common/components/Others/V2Confirm';
const AddForm:FC<any> = ({
  planId,
  branchCompanyId,
  marker,
  addressInfo,
  onClose,
  onRefresh
}) => {
  const [selection, setSelection] = useState<any>([]); // 下拉框选项
  const isLockRef = useRef<boolean>(false);

  const [form] = Form.useForm();

  const getSelection = async() => {
    const data = await getTreeSelection({ planId, type: 2, module: 1 });
    setSelection(data);
  };
  const handleDelete = () => {
    V2Confirm({
      content: `删除后，已绘制新增商圈新增将被清除，请确认是否清除`,
      onSure() {
        marker.current.setContent(` `);
        onClose();
      }
    });
  };
  const handleAdd = () => {
    if (isLockRef.current) return;
    form.validateFields()
      .then((values) => {
        isLockRef.current = true;
        const params = {
          recommendStores: 1, // 产品青山说此处推荐商圈数默认都为1，不需要用户输入
          planId: planId,
          branchCompanyId: branchCompanyId,
          firstLevelCategory: values.businessDistrict?.[0],
          secondLevelCategory: values.businessDistrict?.[1],
          ...values,
          ...addressInfo.current,
          isChildCompanyAddPlanned: true, // 是否是生效后添加商圈 默认：否
        };
        // 此接口内部已根据isChildCompanyAddPlanned做添加规划商圈处理
        createPlanCluster(params).then(() => {
          V2Message.success('新增商圈成功');
          marker.current.setContent(` `);
          onClose();
          onRefresh();
        });
      })
      .catch(() => {
        V2Message.warning('请输入所有必填项');
      }).finally(() => {
        isLockRef.current = false;
      });
  };
  useEffect(() => {
    const { provinceName, cityName, districtName } = addressInfo.current;
    getSelection();
    form.setFieldValue('address', `${provinceName || '-'}/${cityName || provinceName || '-'}/${districtName || '-'}`);
    // form.setFieldsValue()
  }, []);
  return <div className={styles.addFormContainer}>
    <div className={styles.title}>新增商圈</div>
    <V2Form form={form} className={styles.from}>
      <V2FormInput
        label='规划城市'
        name='address'
        required
        disabled={true}
      />
      <V2FormCascader
        label='商圈业态'
        name='businessDistrict'
        // required
        rules={[{ required: true, message: '请输入商圈业态' }]}
        options={refactorSelection(selection, { children: 'child' })}
      />
      <V2FormInput
        label='商圈名称'
        name='centerName'
        maxLength={32}
        rules={[{ required: true, message: '请输入商圈名称' }]}
      />
      <V2FormTextArea
        label='新增原因'
        name='reason'
        rules={[{ required: true, message: '请输入新增原因' }]}
        maxLength={200}
        config={{
          showCount: true,
        }} />
    </V2Form>
    <div className={styles.bottom}>
      {/* <V2PopConfirm
        // overlayClassName={styles.popBox}
        content='删除后，已绘制新增商圈新增将被清除，请确认是否清除'
        onOk={handleDelete}
      > */}
      <Button onClick={() => handleDelete()}>删除</Button>
      {/* </V2PopConfirm> */}
      <Button
        type='primary'
        className='ml-12'
        onClick={handleAdd}
      >确定</Button>
    </div>
  </div>;
};
export default AddForm;
