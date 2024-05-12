/**
 * @Description 点位审批抽屉
 */
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { Space, Button, Form } from 'antd';
import V2Drawer from '@/common/components/Feedback/V2Drawer';
import V2Title from '@/common/components/Feedback/V2Title';
import V2Tabs from '@/common/components/Data/V2Tabs';
import { V2Confirm } from '@/common/components/Others/V2Confirm';
import V2Container from '@/common/components/Data/V2Container';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import CreateApprovalDialog from './CreateApprovalDialog';
import SelectSpot, { SelectSpotType } from '../SelectSpot';
import SpotForm from './SpotForm';
import { useMethods } from '@lhb/hook';
import { isArray } from '@lhb/func';
import {
  formDataComsToTiled,
  formDataEcho,
  parseValueCatch,
  relevancyShow
} from '@/common/components/business/DynamicComponent/config';
import styles from './index.module.less';
import { shopEveluationFormDetail, shopEveluationSave, createApprovalShop } from '@/common/api/approveworkbench';

interface SpotApprovalProps {
  open: boolean; // 是否打开抽屉
  setOpen: Function; // 设置是否打开抽屉
  onRefresh?: Function; // 刷新回调
}

const SpotApproval: FC<SpotApprovalProps> = ({
  open,
  setOpen,
  onRefresh,
}) => {
  const tiledFormDataRef = useRef<any[]>([]); // 所有组件字段平铺后的对象数组
  const lockRef = useRef(false);
  const [form] = Form.useForm();
  const [spot, setSpot] = useState<any>({});
  const [formData, setFormData] = useState<any>({}); // 接口返回的动态表单源数据
  const [tabActive, setTabActive] = useState<string>(''); // 当前tab值
  const [approvalVisible, setApprovalVisible] = useState<boolean>(false);

  // 省市区组件的唯一标识符
  const pcdIdentification = 'area';
  const addressIdentification = 'basicAddress'; // 地址组件的唯一标识符

  useEffect(() => {
    open && setSpot({});
  }, [open]);

  useEffect(() => {
    // 编辑
    spot.id && getDetail(spot.id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spot]);

  // 一级菜单 [{key, label},{key, label}...]
  const tabs = useMemo(() => {
    if (!Object.keys(formData).length) return [];
    const { propertyGroupVOList } = formData;
    if (isArray(propertyGroupVOList) && propertyGroupVOList.length) {
      return propertyGroupVOList.map((item: any) => ({
        label: item.name,
        key: `${item.id}` // tabs组件的activeKey是string类型
      }));
    }
    return [];
  }, [formData]);

  const {
    getDetail,
    addressComWhenEdit,
    tabChange,
    confirmHandle,
    confirmApprovalDialog,
    closeDrawer,
    confirmClose
  } = useMethods({
    getDetail(id) { // 编辑时的获取详情
      shopEveluationFormDetail({ id }).then((res: any) => {
        // dynamicRelationId需要特殊赋值
        const { templateDetailResponse, dynamicRelationId } = res;
        templateDetailResponse.dynamicRelationId = dynamicRelationId;
        const { propertyGroupVOList, } = templateDetailResponse;
        // 设置tabs默认值
        if (isArray(propertyGroupVOList) && propertyGroupVOList.length) {
          setTabActive(`${propertyGroupVOList[0].id}`);
          formDataComsToTiled(propertyGroupVOList, tiledFormDataRef.current); // 将组件对象平铺到数组中
          // 表单赋值
          const allComs = tiledFormDataRef.current;
          addressComWhenEdit(allComs); // 特殊逻辑，拿到省市区组件的值后，将城市信息塞到地址组件中
          relevancyShow(allComs); // 关联显示
          const values = {};
          allComs.forEach((item: any) => {
            const { identification } = item;
            // 根据组件类型，将表单数据set到form上
            values[identification] = formDataEcho(item);
          });
          form.setFieldsValue(values);
        }
        setFormData(templateDetailResponse);
      });
    },
    addressComWhenEdit(allComs: any[]) { // 编辑时的地址组件的特殊逻辑处理
      const pcdCom = allComs.find((itemCom: any) => itemCom.identification === pcdIdentification);
      const addressCom = allComs.find((itemCom: any) => itemCom.identification === addressIdentification);
      if (!(pcdCom && addressCom)) return;
      const pcdVal = parseValueCatch(pcdCom);
      const addressVal = parseValueCatch(addressCom);
      if (!pcdVal) return;
      if (addressVal) {
        addressCom.textValue = JSON.stringify(Object.assign({}, addressVal, pcdVal));
      }
    },
    tabChange(active: string) {
      setTabActive(active);
    },

    /**
     * 表单提交，目前的写法只能校验当前表单页的必填项，因为渲染的时候只渲染对应的tab下的表单项
     */
    confirmHandle() {
      form.validateFields().then(() => {
        setApprovalVisible(true);
      }).catch((errorInfo: any) => {
        console.log(`errorInfo`, errorInfo);
      });
    },
    /**
     * @description 确认提交弹框填写后提交事件
     * @param values 确认提交弹框的表单对象
     */
    confirmApprovalDialog(values: any) {
      if (lockRef.current) return;
      lockRef.current = true;
      const propertyValues = tiledFormDataRef.current.map((item: any) => ({
        id: item.id,
        propertyId: item.propertyId,
        identification: item.identification,
        textValue: item.textValue,
      }));
      const params: any = {
        id: spot.id,
        type: formData.type,
        dynamicRelationId: formData.dynamicRelationId,
        propertyValues
      };
      shopEveluationSave(params).then(() => {
        createApprovalShop({
          evaluationId: spot.id,
          typeValue: 8, // 申请类型（8点位申请、9设计申请、10合同申请）
          reason: values.reason,
        }).then(() => {
          V2Message.success('提交成功');
          onRefresh && onRefresh(); // 刷新列表
          confirmClose(); // 关闭抽屉
        }).finally(() => {
          lockRef.current = false;
        });
      }).finally(() => {
        lockRef.current = false;
      });
    },
    closeDrawer() { // 关闭弹窗时
      V2Confirm({
        onSure: () => {
          confirmClose();
        },
        zIndex: 1010,
        title: '操作提示',
        content: '退出后将不保存当前操作，请确认是否退出。'
      });
    },
    confirmClose() {
      form.resetFields(); // 表单清空
      setOpen(false);
      tiledFormDataRef.current = [];
    },
  });

  return (
    <V2Drawer
      open={open}
      onClose={closeDrawer}
      className={styles.formDrawer}
      destroyOnClose>
      <V2Container
        // 24px上padding
        style={{ height: 'calc(100vh - 24px)' }}
        extraContent={{
          top: <>
            <V2Title text='点位评估审批'/>
            <SelectSpot open={open} selectType={SelectSpotType.SPOT} setSpotDetail={setSpot}/>
            {!!spot.id && <V2Tabs
              items={tabs}
              activeKey={tabActive}
              onChange={tabChange}/>}
          </>,
          bottom: !!spot.id && <div className={styles.footerCon}>
            <Space size={12}>
              <Button onClick={closeDrawer}>取消</Button>
              <Button type='primary' onClick={confirmHandle}>确定</Button>
            </Space>
          </div>
        }}
      >
        {spot.id ? <SpotForm
          form={form}
          formData={formData}
          pcdIdentification={pcdIdentification}
          setFormData={setFormData}
          active={tabActive}
          tiledFormDataRef={tiledFormDataRef}/> : null}
      </V2Container>
      <CreateApprovalDialog
        visible={approvalVisible}
        setVisible={setApprovalVisible}
        onSubmit={confirmApprovalDialog}/>
    </V2Drawer>
  );
};

export default SpotApproval;

