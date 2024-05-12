
import React from 'react';
import TreeCheckbox from './TreeCheckbox';
import { TreeCheckboxGroupProps } from './ts-config';

const TreeCheckboxGroup: React.FC<TreeCheckboxGroupProps> = ({ data, checkedList, setCheckedList }) => {
  return (
    <>
      {data.map((content, index) => {
        return (
          <TreeCheckbox
            style={{ marginTop: '12px', width: '100%' }}
            key={content.label + '-' + index + content.value}
            content={content}
            checkedList={checkedList}
            setCheckedList={setCheckedList}/>
        );
      })}
    </>
  );
};

export default TreeCheckboxGroup;
