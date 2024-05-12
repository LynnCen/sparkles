/**
 * @Description 机会点详情-参考转化率、参考租金等查看文件的类型

 纯展示，不使用textValue

读取回显时的格式 templateRestriction
{
	"urlName": "客流转化系数维护模版-zhouda_副本6.xlsx",
	"url": "https://middle-file.linhuiba.com/FgtlpLyOcFw9dAu__zdCpRauCqjw"
}
 */
import { FC, useMemo } from 'react';
import V2DetailItem from '@/common/components/Feedback/V2DetailItem';
import { isNotEmptyAny } from '@lhb/func';
import { parseValueCatch } from '@/common/components/business/DynamicComponent/config';

const RefConversionDetail: FC<any> = ({
  label,
  propertyItem = {},
}) => {

  /**
   * @description 当前配置的模板
   */
  const templateFiles = useMemo(() => {
    const { templateRestriction } = propertyItem;
    if (!templateRestriction) return [];

    const restriction = parseValueCatch(propertyItem, 'templateRestriction');
    if (!isNotEmptyAny(restriction)) return [];

    const { url, urlName } = restriction;
    if (!url || !urlName) return [];

    return [{
      url,
      name: urlName,
    }];
  }, [propertyItem]);

  /* method */
  return (
    <V2DetailItem label={label} type='files' assets={templateFiles}/>
  );
};

export default RefConversionDetail;
