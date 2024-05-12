/**
 * @Description 模板文件预览组件
 *
  纯展示，不使用textValue

读取回显时的格式 templateRestriction
{
	"urlName": "客流转化系数维护模版-zhouda_副本6.xlsx",
	"url": "https://middle-file.linhuiba.com/FgtlpLyOcFw9dAu__zdCpRauCqjw"
}
 */
import { FC, useMemo } from 'react';
import { Form } from 'antd';
import V2DetailItem from '@/common/components/Feedback/V2DetailItem';
import { isNotEmptyAny } from '@lhb/func';

const RefConversion: FC<any> = ({
  propertyItem,
}) => {

  /**
   * @description 当前配置的模板
   */
  const templateFiles = useMemo(() => {
    const restriction = propertyItem.restriction ? JSON.parse(propertyItem.restriction) : {};

    if (!isNotEmptyAny(restriction)) {
      return [];
    }

    const { url, urlName } = restriction;
    if (!url || !urlName) {
      return [];
    }
    return [{
      url,
      name: urlName,
    }];
  }, [propertyItem]);

  return (
    templateFiles.length ? <Form.Item
      label={propertyItem.anotherName || propertyItem.name || ''}>
      <V2DetailItem
        type='files'
        assets={templateFiles}
        noStyle
      />
    </Form.Item> : <></>
  );
};

export default RefConversion;
