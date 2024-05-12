/**
 * @Description 新增商圈 form表单
 */
import { FC, useEffect, useRef } from 'react';
import styles from './index.module.less';
import V2Form from '@/common/components/Form/V2Form';
import { Button } from 'antd';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import { refactorSelection } from '@lhb/func';
import V2FormCascader from '@/common/components/Form/V2FormCascader/V2FormCascader';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import { V2Confirm } from '@/common/components/Others/V2Confirm';
import { circleToPolygon, overlappingArea } from '@/common/utils/map';
import { createCustomModelCluster } from '@/common/api/siteselectionmap';
const AddForm:FC<any> = ({
  marker,
  addressInfo,
  onClose,
  form,
  polygonDataRef,
  firstLevelCategoryRef
}) => {
  const isLockRef = useRef<boolean>(false);

  const handleDelete = () => {
    V2Confirm({
      content: `删除后，已绘制新增商圈将被清除，请确认是否清除`,
      onSure() {
        marker.current.setContent(` `);
        onClose();
      },
      centered: true
    });
  };

  const handleAdd = async() => {
    if (isLockRef.current) return;
    const promises:any = [];
    polygonDataRef?.current?.forEach(async(data, index) => {
      let polygon1 = data?.polygon?.map((item) => [item.lng, item.lat]);
      if (data?.radius && data?.lng && data?.lat) {
        polygon1 = await circleToPolygon({ lng: data.lng, lat: data.lat }, data.radius);
      }
      let polygon2 = addressInfo.current?.polygon?.map((item) => [item.lng, item.lat]); ;
      if (addressInfo.current?.radius && addressInfo.current?.lng && addressInfo.current?.lat) {
        polygon2 = await circleToPolygon({ lng: addressInfo.current.lng, lat: addressInfo.current.lat }, addressInfo.current.radius);
      }

      promises.push(overlappingArea(polygon1, polygon2));


      if (index === polygonDataRef?.current?.length - 1) {
        hasOver(promises);
      }
    });
    if (!polygonDataRef?.current?.length) {
      hasOver(promises);
    }
  };
  // 是否有重叠
  const hasOver = async(promises) => {
    const results = await Promise.all(promises);
    const isOver = results.some(result => result > 50); // 只要有一个返回true，isOver即为true

    // 如果重叠度＞50%，出现提示弹窗
    if (isOver) {
      V2Message.info(`新增商圈与已有商圈重叠度＞50%，存在相似商圈，无法新增`);
      return;
    } else {
      handleCreate();
    }
  };
  // 创建请求
  const handleCreate = async() => {
    form.validateFields()
      .then((values) => {
        isLockRef.current = true;
        const params = {
          firstLevelCategoryId: values?.businessDistrict?.[0],
          secondLevelCategoryId: values?.businessDistrict?.[1],
          ...values,
          ...addressInfo.current,
        };
        createCustomModelCluster(params).then(() => {
          V2Message.info(`新增商圈成功，商圈相关内容在8个小时内生成，请耐心等待`);
          marker.current.setContent(` `);
          onClose();
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
    // getSelection();
    form.setFieldValue('address', `${provinceName || '-'}/${cityName || provinceName || '-'}/${districtName || '-'}`);
    // form.setFieldsValue()
  }, []);
  return <div className={styles.addFormContainer}>
    <div className={styles.title}>新增商圈</div>
    <V2Form form={form} className={styles.from}>
      <V2FormInput
        label='所在城区'
        name='address'
        required
        disabled={true}
      />
      <V2FormCascader
        label='商圈类型'
        name='businessDistrict'
        config={{
          getPopupContainer: (node) => node.childNodes[0] as HTMLDivElement
        }}
        rules={[{ required: true, message: '请输入商圈类型' }]}
        options={refactorSelection(firstLevelCategoryRef.current, { children: 'child' })}
      />
      <V2FormInput
        label='商圈名称'
        name='name'
        maxLength={32}
        rules={[{ required: true, message: '请输入商圈名称' }]}
      />
      {/* <V2FormTextArea
        label='新增原因'
        name='reason'
        rules={[{ required: true, message: '请输入新增原因' }]}
        maxLength={200}
        config={{
          showCount: true,
        }} /> */}
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
