import { isDef } from '@lhb/func';
import { UrlSuffix } from '@/common/enums/qiniu';

export class ControlType {
  static SINGLE_RADIO = { value: 1, name: '单选框', csName: 'cs_single_radio' };
  static CHECK_BOX = { value: 2, name: '多选框', csName: 'cs_check_box' };
  static INPUT = { value: 3, name: '输入框', csName: 'cs_input' };
  static TEXT_AREA = { value: 4, name: '文本框', csName: 'cs_text_area' };
  static UPLOAD = { value: 5, name: '文件上传', csName: 'cs_upload' };
  static RATIO = { value: 6, name: '占比', csName: 'cs_ratio' };
  static INPUT_NUMBER = { value: 7, name: '数字输入框', csName: 'cs_input_number' };
  static MAP_POLYGON = { value: 8, name: '地理围栏', csName: 'cs_map_polygon' };
  static TIME = { value: 9, name: '时间', csName: 'cs_time' };
  static ADDRESS = { value: 10, name: '详细地址', csName: 'cs_address' };
  static FLOOR_INFO = { value: 11, name: '楼层信息', csName: 'cs_floor' };
  static CHANNEL_DESC = { value: 12, name: '通道描述', csName: 'cs_channel' };
  static FLOOR_DESC = { value: 13, name: '楼层描述', csName: 'cs_floor_desc' };
  static AREA = { value: 14, name: '省市区', csName: 'cs_area' };
  static CURRENT_PRICE = { value: 15, name: '当前报价', csName: 'cs_current_price' };
  static HISTORY_PRICE = { value: 16, name: '历史报价', csName: 'cs_history_price' };
  static SPEC_L_W = { value: 17, name: '规格（长宽）', csName: 'cs_spec_l_w' };
  static BUSINESS_CIRCLE = { value: 18, name: '商圈', csName: 'cs_business_circle' };
  static RES_TYPE_PLACE = { value: 19, name: '场地类型', csName: 'cs_res_type_place' };
  static RES_TYPE_SPOT = { value: 20, name: '点位类型', csName: 'cs_res_type_spot' };
  static SPOT_POSITION = { value: 22, name: '落位区域', csName: 'cs_spot_position' };

  static getByValue(value) {
    return Object.values(ControlType).filter((item) => item.value === value)[0];
  }
}

export const getValues = (data: any[]) => {
  const values = { propertyList: {} };
  const empyts = ['', null];
  if (!Array.isArray(data)) {
    return;
  }
  data.forEach((prop = {}) => {
    if (prop) {
      const { controlType, textValue, propertyValue, propertyId } = prop;
      // 如果为空统一当作字符串来处理
      const value = textValue || propertyValue;
      if (controlType === null || controlType === void 0) {
        values.propertyList[propertyId] = value;
      } else if (isDef(value) && !empyts.includes(value as any)) {
        // 单行输入框，多行输入框, 时间选择器(内部做处理), 百分比,
        const isNotToJson = [3, 4, 7, 9].includes(prop.controlType);
        const propValue = isNotToJson ? value : JSON.parse(value as any);
        values.propertyList[prop.propertyId] = propValue;
      }
    }

  });
  return values;
};

export const QiniuImageUrl = (url: string) => {
  if (url && url.includes('img.linhuiba.com/')) {
    return url + UrlSuffix.Ori;
  } else if (url && url.includes('pmsimage.location.pub/')) {
    return url + UrlSuffix.PmsLarge;
  } else {
    return url;
  }
};
