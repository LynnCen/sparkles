/**
 * @Description 日均客流预测组件
 *
 控件 提交、回显的textValue参数格式
 {
    optionName: '10点至11点',
    optionValue: 23.01,
    optionId: 1,
    // url: 'https://middle-file.linhuiba.com/FgtlpLyOcFw9dAu__zdCpRauCqjw',
    // urlName: '客流转化系数维护模版-zhouda_副本6.xlsx',
    collection: 1000,
    dailyPredict: 23010,
 }

回显时的格式 templateRestriction
{
	"urlName": "客流转化系数维护模版-zhouda_副本6.xlsx",
	"options": [{
		"label": "10点至11点",
		"value": "23.01"
	}, {
		"label": "11点至12点",
		"value": "17.5"
	}, {
		"label": "12点至13点",
		"value": "13"
	}, {
		"label": "13点至14点",
		"value": "12.5"
	}, {
		"label": "14点至15点",
		"value": "11.8"
	}, {
		"label": "15点至16点",
		"value": "11.5"
	}, {
		"label": "16点至17点",
		"value": "11"
	}, {
		"label": "17点至18点",
		"value": "10.8"
	}, {
		"label": "18点至19点",
		"value": "10.2"
	}, {
		"label": "19点至20点",
		"value": "9.5"
	}, {
		"label": "20点至21点",
		"value": "10.2"
	}, {
		"label": "21点至22点",
		"value": "17.5"
	}],
	"url": "https://middle-file.linhuiba.com/FgtlpLyOcFw9dAu__zdCpRauCqjw"
}
 */
import { FC, useEffect, useMemo, useState } from 'react';
import { Col, Tooltip } from 'antd';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import V2FormInputNumber from '@/common/components/Form/V2FormInputNumber/V2FormInputNumber';
import IconFont from '@/common/components/IconFont';
import { isArray, isNotEmptyAny } from '@lhb/func';
import { parseValueCatch } from '../config';

const LOCATION_FLOW_PREDICT = '根据location大数据自动预测';

const DailyFlow: FC<any> = ({
  form,
  propertyItem,
  disabled,
  // required,
  updateCompValue,
}) => {
  const identification = propertyItem.identification; // 字段
  const [curCompValue, setCurCompValue] = useState<any>({}); // 自定义组件的值

  /**
   * @description 时间段选项
   */
  const timeOptions = useMemo(() => {
    const restriction = propertyItem.restriction ? JSON.parse(propertyItem.restriction) : {};

    if (!isNotEmptyAny(restriction)) {
      return [];
    }

    const { options } = restriction;
    if (!isArray(options) || !options.length) {
      return [];
    }
    return options.map((itm: any, idx: number) => ({
      label: itm.label,
      value: idx + 1,
      optionId: idx + 1,
      optionName: itm.label,
      optionValue: itm.value,
    }));
  }, [propertyItem]);

  /**
   * @description 初次渲染formItem信息
   */
  useEffect(() => {
    // console.log('useEffect propertyItem.textValue', propertyItem.textValue);

    const curVal = parseValueCatch(propertyItem);
    updateCurCompValue(curVal || {}, false);

  }, [propertyItem.textValue]);

  /**
   * @description 更新comp 数值
   * @param curVal 组件内部使用的当前值
   * @param isCallback 是否回调更新维护component的textValue
   * @return
   */
  const updateCurCompValue = (curVal: any, isCallback = false) => {
    // console.log('updateCurCompValue', curVal, isCallback);
    form.setFieldsValue({
      [`${identification}-optionId`]: curVal?.optionId,
      [`${identification}-collection`]: curVal?.collection,
      [`${identification}-dailyPredict`]: curVal?.dailyPredict,
    });
    setCurCompValue(curVal);

    // 维护组件textValue
    isCallback && updateCompValue && updateCompValue(identification, curVal);
  };

  /**
   * @description 时间段选择变动时
   *   时间段已选、且采集客流已输入时，自动得出日均客流
   * @param optId 选项id
   * @param option 选项对象
   * @return
   */
  const optionChangeHandle = (optId: string, option: any) => {
    if (!option) { // 清除选中时
      const newVal = {
        ...curCompValue,
        optionId: null,
        optionValue: null,
        optionName: null,
        dailyPredict: null,
      };
      updateCurCompValue(newVal, true);
      return;
    }

    const { optionId, optionValue, optionName } = option;
    const newVal = {
      ...curCompValue,
      optionId,
      optionValue,
      optionName,
      dailyPredict: (+optionValue && +curCompValue.collection) ? parseInt(`${+optionValue * (+curCompValue.collection)}`) : null,
    };
    updateCurCompValue(newVal, true);
  };

  /**
   * @description 采集客流变动
   *   时间段已选、且采集客流已输入时，自动得出日均客流
   * @param val 输入值
   * @return
   */
  const collectionChangeHandle = (val: any) => {
    const newVal = {
      ...curCompValue,
      collection: val,
      dailyPredict: (+val && +curCompValue.optionValue) ? parseInt(`${+val * (+curCompValue.optionValue)}`) : null,
    };
    updateCurCompValue(newVal, true);
  };

  return (
    timeOptions.length ? <>
      <Col span={12}>
        <V2FormSelect
          name={`${identification}-optionId`}
          label={'客流采集时间段'}
          required={!disabled}
          disabled={disabled}
          options={timeOptions}
          config={{
            showSearch: false,
            filterOption: false,
            onChange: optionChangeHandle
          }}
        />
      </Col>
      <Col span={12}>
        <V2FormInputNumber
          label='采集客流量'
          name={`${identification}-collection`}
          min={1}
          max={999999}
          precision={0}
          required={!disabled}
          disabled={disabled}
          onChange={collectionChangeHandle}
        />
      </Col>
      <Col span={12}>
        <V2FormInputNumber
          label={<span>预测日均客流
            <Tooltip title={curCompValue.dailyPredict ? `${LOCATION_FLOW_PREDICT}，该时段客流转换系数为${curCompValue.optionValue}` : LOCATION_FLOW_PREDICT}>
              <>
                <IconFont iconHref='pc-common-icon-ic_info' className='ml-6' style={{ color: '#cccccc' }}/>
              </>
            </Tooltip>
          </span>}
          name={`${identification}-dailyPredict`}
          placeholder={LOCATION_FLOW_PREDICT}
          precision={0}
          config={{ addonAfter: '人/天' }}
          disabled={true}
        />
      </Col>
    </> : <></>
  );
};

export default DailyFlow;
