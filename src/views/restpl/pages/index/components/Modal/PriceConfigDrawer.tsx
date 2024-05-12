/**
 * @Description 价格配置弹窗
 */
import V2Drawer from '@/common/components/Feedback/V2Drawer';
import { useMethods } from '@lhb/hook';
import styles from './index.module.less';
import { Button, Form, Space, message } from 'antd';
import FormCheckbox from '@/common/components/Form/FormCheckbox';
import { useEffect, useState } from 'react';
import V2Title from '@/common/components/Feedback/V2Title';
import { post } from '@/common/request';
import cs from 'classnames';
import { deepCopy } from '@lhb/func';

const PriceConfigModal = ({ templateId, open, setOpen }) => {

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [priceSelection, setPriceSelection] = useState<any[]>([]); // 价格配置枚举
  const [categoryIndex, setCategoryIndex] = useState(0); // 当前模板配置的场地类目id
  const [priceConfigDetail, setPriceConfigDetail] = useState<any[]>([]); // 价格配置详情

  useEffect(() => {
    // 只在第一次打开时需要获取基本枚举配置信息
    if (open && !priceSelection.length) {
      methods.getPriceSelection();
    }
  }, [open, priceSelection]);

  useEffect(() => {
    if (open && templateId) {
      methods.getPriceConfigDetail();
    }
  }, [open, templateId]);

  useEffect(() => {
    if (priceConfigDetail.length) {
      methods.setPointCategoryPrice([...priceConfigDetail[categoryIndex]?.spotTemplatePriceList || []]);
    }
  }, [categoryIndex, priceConfigDetail]);

  const methods = useMethods({
    handleCancel() {
      setOpen(false);
      setLoading(false);
      form.resetFields();
    },
    /**
     * @description 获取类目价格配置详情
     * @param templateId 模板ID
     */
    getPriceConfigDetail() {
      // https://yapi.lanhanba.com/project/321/interface/api/51834
      post('/category/template/price/detail', { templateId }).then((res) => {
        setPriceConfigDetail([...res]);
        methods.setPointCategoryPrice([...res[categoryIndex]?.spotTemplatePriceList || []]);
      });
    },
    /**
     * @description 获取价格配置列表项
     */
    getPriceSelection() {
      // https://yapi.lanhanba.com/project/321/interface/api/51841
      post('/category/template/price/selection').then((res: any) => {
        setPriceSelection([...res]);
      });
    },
    /**
     * @description 设置点位模板价格
     * @param arr 场地类目对应的点位价格详情
     */
    setPointCategoryPrice(arr: any[]) {
      const formField: any = {};
      arr.forEach((item) => {
        formField[item.spotCategoryId] = item.selectionList.map((s) => s.value);
      });
      form.setFieldsValue({ ...formField });
    },
    /**
     * @description 提交价格配置表单
     */
    submitPriceForm() {
      setLoading(true);
      form.validateFields().then((values) => {
        const params: any = deepCopy(priceConfigDetail[categoryIndex]);
        params.spotTemplatePriceList.forEach((item) => {
          item.selectionList = values[item.spotCategoryId].map((value) => ({ value }));
        });
        // https://yapi.lanhanba.com/project/321/interface/api/51778
        post('/category/template/price/create', params).then(() => {
          message.success('更新价格配置成功');
          methods.getPriceConfigDetail();
        }).finally(() => {
          setLoading(false);
        });
      });
    }
  });

  return (
    <V2Drawer
      className={styles.priceConfigDrawer}
      open={open}
      onClose={methods.handleCancel}
      contentWrapperStyle={{
        minWidth: 'auto',
        width: '824px',
      }}
    >
      <V2Title type='H1' text='价格配置'/>
      <div className={styles.priceConfigContainer}>
        <div className={styles.leftContainer}>
          { priceConfigDetail.map((item, index) => (
            <div
              className={cs(styles.categoryItem, categoryIndex === index && styles.active)}
              key={item.placeCategoryId}
              onClick={() => setCategoryIndex(index)}>{ item.placeCategoryName }</div>
          )) }
        </div>
        <div className={styles.rightContainer}>
          <Form layout='vertical' form={form}>
            { priceConfigDetail[0]?.spotTemplatePriceList.map((item) => (
              <FormCheckbox
                name={item.spotCategoryId}
                label={item.spotCategoryName}
                key={item.spotCategoryId}
                config={{ options: priceSelection }}
              />
            )) }
          </Form>
        </div>
      </div>
      <div className={styles.drawerFooter}>
        <Space size={12}>
          <Button onClick={() => setOpen(false)}>取消</Button>
          <Button
            type='primary'
            loading={loading}
            onClick={methods.submitPriceForm}>确定</Button>
        </Space>
      </div>
    </V2Drawer>
  );
};

export default PriceConfigModal;
