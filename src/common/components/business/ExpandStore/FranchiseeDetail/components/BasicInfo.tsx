/**
 * @Description 加盟商详情-动态表单字段展示
 */

import { FC, useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import { Spin } from 'antd';
import { DynamicDetail } from '@/common/components/business/StoreDetail';
import FranchiseeForm from '@/common/components/business/ExpandStore/FranchiseeCreateDrawer/components/FranchiseeForm';
import V2Title from '@/common/components/Feedback/V2Title';
import V2Empty from '@/common/components/Data/V2Empty';
import { isArray, isNotEmptyAny } from '@lhb/func';

const BasicInfo: FC<any> = forwardRef(({
  detail,
  isUpdateMode,
  setIsUpdateMode,
  setSubmitting,
  refresh,
}, ref) => {
  // 外部调用保存加盟商
  useImperativeHandle(ref, () => ({
    confirmHandle: () => {
      (formRef.current as any).confirmHandle();
    },
  }));

  const formRef: any = useRef(null);
  const [dynamicInfo, setDynamicInfo] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false); // 加载中
  const [formDrawerData, setFormDrawerData] = useState<any>({
    open: false,
    templateId: '', // 模板id
    id: '', // 编辑时的id
  });

  useEffect(() => {
    if (!isNotEmptyAny(detail)) return;

    const { propertyGroupVOList } = detail;
    if (!isArray(propertyGroupVOList) || !propertyGroupVOList.length) return;

    setDynamicInfo({
      templateDetailResponse: {
        propertyGroupVOList,
      }
    });
  }, [detail]);


  useEffect(() => {
    if (isUpdateMode) {
      setFormDrawerData({
        open: true,
        id: detail.id,
      });
    }
  }, [isUpdateMode]);

  const onUpdateSuccess = (/* fid: number*/) => {
    refresh();
    setIsUpdateMode(false);
  };

  return (
    <>
      {/* a 编辑模式下动态表单展示，默认展示静态详情 */}
      {/* b 非编辑模式下默认展示静态详情 */}
      { /* c 非编辑模式下默认展示静态详情 */ }

      { isUpdateMode ? <Spin spinning={loading}>
        <FranchiseeForm
          ref={formRef}
          drawerData={formDrawerData}
          setLoading={setLoading}
          setSubmitting={setSubmitting}
          onSuccess={onUpdateSuccess}
          contentStyle={{
            paddingRight: '184px'
          }}
        />
      </Spin> : isNotEmptyAny(dynamicInfo) ? <DynamicDetail
        anchorCustomStyle={{
          position: 'absolute',
          top: '20px',
          bottom: '0'
        }}
        title=''
        ignoreAttach // 不需要显示【附加资料】
        isTopSticky
        data={dynamicInfo}
      /> : <>
        <V2Title type='H2' text='加盟商信息' divider className='mb-16'/>
        <V2Empty />
      </>}
    </>
  );
});

export default BasicInfo;
