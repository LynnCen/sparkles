import { FC, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import copy from 'copy-to-clipboard';
import { useMethods } from '@lhb/hook';

import cs from 'classnames';
import styles from './index.module.less';
import { Button, Form, Tooltip, message } from 'antd';
import V2Title from 'src/common/components/Feedback/V2Title/index';
import Demand from './Demand';
import Point from './Point';
import QuotationList from './QuotationRecord';
import V2Form from 'src/common/components/Form/V2Form/index';
import { postPropertyQuoteLinkInit } from '@/common/api/demand-management';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import { getPriceDefaultValue, getPriceField } from '@/common/api/common';

/**
 * @description 模拟回复-工作台
 * @return {*}
 * @example
 */
const Workbench: FC<{
  fromIMId: string, // 当前登录人的 IM ID
  toIMId: string, // 会话详情对话方的 IM ID
  className?: string,
  createLinkComplete?: Function, // 创建链接后回调给父级
} & { ref?: any }> = forwardRef(({ fromIMId, toIMId, className, createLinkComplete }, ref) => {

  useImperativeHandle(ref, () => ({
    init: methods.init
  }));

  /* state */
  const [form] = Form.useForm();
  const demandRef = useRef<any>();
  const pointRef = useRef<any>();
  const quotationListRef = useRef<any>();

  const [selection, setSelection] = useState<any>({});

  const [requesting, setRequesting] = useState(false);
  const [link, setLink] = useState('');
  const [showPlaceFeeSelect, setShowPlaceFeeSelect] = useState<boolean>(true); // 是否展示场地费计价方式

  /* hooks */
  useEffect(() => {
    if (fromIMId && toIMId) {
      methods.init();
    }
  }, [fromIMId, toIMId]);

  /* methods */
  const methods = useMethods({
    // 初始化
    init() {
      if (!fromIMId || !toIMId) {
        return;
      }
      // console.log('init');

      setTimeout(() => {
        // 更新会话需求
        // console.log('init 更新会话需求');
        demandRef.current?.init?.();

        // console.log('init 更新会话点位');
        pointRef.current?.init?.();

        console.log('init 更新报价记录');
        methods.updateQuotationList();
        methods.getPriceSelection();
        methods.updatePriceDefault();
      }, 0);
    },

    // 更新报价记录
    updateQuotationList(requirementId) {
      quotationListRef.current?.init?.(requirementId);
    },

    // 复制链接
    copyLink() {
      if (link) {
        copy(String(link));
        message.success('已复制链接');
      }
    },

    // 生成分享链接
    createLink() {
      form.validateFields().then((values) => {
        console.log('values', values);

        const { expenseTypeFields, placePriceFields } = values;
        const demand = demandRef.current?.getActive?.();
        const point = pointRef.current?.getActive?.();

        if (!demand) {
          message.warning('请选择需求');
          return;
        }

        if (!point) {
          message.warning('请选择点位');
          return;
        }

        const params = {
          fromAccountId: fromIMId,
          toAccountId: toIMId,
          requirementId: demand?.id,
          spotId: point?.spotId,
          expenseTypeFields,
          placePriceFields,
        };

        console.log('params', params);

        setRequesting(true);
        postPropertyQuoteLinkInit(params).then((response) => {
          setLink(response);
          setTimeout(() => {
            response && methods.copyLink();
          }, 0);

          response && createLinkComplete?.(response);
        }).finally(() => {
          setRequesting(false);
        });
      });
    },

    // 报价字段下拉项
    async getPriceSelection() {
      const res = await getPriceField();
      const { expenseTypeSelection, placePriceSelection } = res;
      const newSelections = {
        expenseTypeSelection: Object.entries(expenseTypeSelection).map(([key, value]) => ({ label: key, value })),
        placePriceSelection: Object.entries(placePriceSelection).map(([key, value]) => ({ label: key, value })),
      };
      setSelection(newSelections);
    },

    // 更新场地费计价默认值
    updatePriceDefault(requirementId?: any) {
      getPriceDefaultValue({ requirementId }).then((res: any) => {
        form.setFieldValue('placePriceFields', res.defaultPlacePriceFields);

        if (!requirementId) {
          form.setFieldValue('expenseTypeFields', res.defaultExpenseTypeFields);
        }
      });
    },

    handleExpenseChange(val) {
      setShowPlaceFeeSelect(val?.includes('placeCostPrice'));
    }
  });


  return (<div className={cs(styles.workbench, className)}>
    <V2Title type='H1' text='物业报价' className='mb-16'/>

    <div className={styles.workbenchTop}>
      <div className={styles.workbenchTopMain}>
        <Demand ref={demandRef} fromAccountId={fromIMId} toAccountId={toIMId} updateQuotationList={methods.updateQuotationList} updatePriceDefault={methods.updatePriceDefault}/>
        <Point ref={pointRef} fromAccountId={fromIMId} toAccountId={toIMId} className='mt-16'/>

        <V2Form form={form} className='mt-16'>
          {/* <V2FormSelector
            label='物业是否需要明确档期'
            name='confirmSchedule'
            required
            formItemConfig={{ initialValue: [1] }}
            options={selection.options}
            className={styles.confirmSchedule}
          /> */}
          <V2FormSelect
            label='费用类型'
            name='expenseTypeFields'
            required
            options={selection?.expenseTypeSelection || []}
            mode='multiple'
            onChange={methods.handleExpenseChange}
          />
          {showPlaceFeeSelect ? <V2FormSelect
            label='场地费计价方式'
            name='placePriceFields'
            required
            options={selection?.placePriceSelection || []}
            mode='multiple'
          /> : <></>}
        </V2Form>
      </div>
      <div className={styles.linkWrapper}>
        <Tooltip color='blue' title={link ? '点击复制' : ''}>
          <div className={cs(styles.linkText, link && styles.hasLink)} onClick={methods.copyLink}>
            {link || '此处为分享链接，点击按钮即可复制'}
          </div>
        </Tooltip>
        <Button type='primary' disabled={requesting} onClick={methods.createLink}>生成并复制链接</Button>
      </div>
    </div>

    <div className={cs(styles.workbenchBottom, 'mt-16')}>
      <QuotationList ref={quotationListRef}/>
    </div>
  </div>);
});

export default Workbench;
