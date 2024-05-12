/**
 * @Description 
 */
import { FC } from 'react';
import SpecTab from './SpecTab';
import LabelConfigTab from './LabelConfigTab';
import PropertyConfigTab from './PropertyConfigTab';


const Main: FC<any> = ({
  selectedKey,
  mainHeight,
  categoryId,
  categoryTemplateId,
  parentCategoryId
}) => {

  return (
    <div style={{ height: mainHeight }}>
      {selectedKey === '1' && <PropertyConfigTab
        categoryId={categoryId}
        categoryTemplateId={categoryTemplateId}
        parentCategoryId={parentCategoryId}
      />}
      {selectedKey === '2' && <LabelConfigTab categoryId={categoryId} categoryTemplateId={categoryTemplateId} mainHeight={mainHeight} />}
      {selectedKey === '3' && <SpecTab categoryId={categoryId} categoryTemplateId={categoryTemplateId} mainHeight={mainHeight} />}
    </div>
  );
};

export default Main;
