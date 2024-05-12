/**
 * @Description 拓店标准版 form中的加盟商列表（模糊查询）
 */

import { FC, useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { Form } from 'antd';
import V2Fuzzy from '@/common/components/Form/V2Fuzzy';
import V2Empty from '@/common/components/Data/V2Empty';
import IconFont from '@/common/components/IconFont';
import FranchiseeSelectTemplate from '@/common/components/business/ExpandStore/FranchiseeSelectTemplate';
import FranchiseeCreateDrawer from '@/common/components/business/ExpandStore/FranchiseeCreateDrawer';
import { franchiseePage, getFranchiseeTemplateList } from '@/common/api/expandStore/franchisee';
import { isArray, refactorSelection } from '@lhb/func';
import styles from './index.module.less';
import cs from 'classnames';

const FormFranchisee: FC<any> = forwardRef(({
  name,
  label,
  extraParams = { // 接口入参
    page: 1,
    size: 50,
  },
  formItemConfig,
  onCreated,
  ...props
}, ref) => {
  const fuzzyRef: any = useRef(null);
  const [data, setData] = useState();
  const [selectTemplateData, setSelectTemplateData] = useState<any>({
    open: false,
    options: [],
  });
  const [formDrawerData, setFormDrawerData] = useState<any>({
    open: false,
    templateId: '', // 模板id
    id: '', // 编辑时的id
  });

  const loadData = async (keyword?: string) => {
    const params = {
      keyword,
      ...extraParams
    };
    // 该接口目前不分页
    const { objectList } = await franchiseePage(params);
    setData(objectList);
    return Promise.resolve(objectList);
  };

  useImperativeHandle(ref, () => ({
    // 用来对外抛出完整的原始数据，当外部需要的不仅是id，而是更多item内的数据时使用
    // 场景示例：外部包了一层FormCom 组件，在onCHange时，通过getData拿到数据，然后包装好后，可以传出 {id: 1, name: xx, mobile: yy, ...} 等完整item数据。
    getData() {
      return data;
    },
    // 用来插入额外的option
    // 场景示例：点位弹窗，点击新增点位后，为了不让fuzzy重新loadData数据，可以直接 add一条新添加的数据进去即可。下次查询操作后就会被重置。
    addOption: fuzzyRef.current?.addOption,
    // 用来插入默认的options，此时需要设置props.immediateOnce 为 false
    // 场景示例：在编辑弹窗反向填充
    setOptions: fuzzyRef.current?.setOptions,
    selectRef: fuzzyRef.current?.selectRef,
    getItem: (data) => fuzzyRef.current?.getItem(data)
  }));

  const notFoundNode = () => {
    return (
      <V2Empty
        customTip={<div className={cs(styles.createEntrance, 'fs-12')}>
          <div style={{ color: '#cccccc' }}>暂无数据，</div>
          <div style={{ color: '#006AFF', cursor: 'pointer' }} onClick={createHandle}>去创建加盟商</div>
          <IconFont iconHref='iconic_next_black_seven' className='fs-10 c-006' />
        </div>}
      />
    );
  };

  /**
   * @description 创建加盟商
   */
  const createHandle = async() => {
    // 多条模板时需要选择，只有一条时直接使用
    const result: any = await getFranchiseeTemplateList();
    if (isArray(result) && result.length === 1) {
      setFormDrawerData({
        open: true,
        templateId: result[0].id,
        id: '',
      });
    } else if (isArray(result) && result.length > 1) {
      setSelectTemplateData({
        open: true,
        options: refactorSelection(result, { name: 'templateName' }),
      });
    }
  };

  const customerProps = {
    customOptionItem: (item: Record<string, any>) => {
      const { name, uniqueId } = item;
      return (
        <>
          {<span>{name || ''}</span>}
          <span> {uniqueId ? ` | ${uniqueId}` : ''}</span>
        </>
      );
    },
    optionLabelProp: 'label', // ant select的参数，请参考 https://ant.design/components/select-cn#select-props
  };

  return (
    <>
      <Form.Item
        name={name}
        label={label}
        {...formItemConfig}
      >
        <V2Fuzzy
          ref={fuzzyRef}
          loadData={loadData}
          fieldNames={{
            label: 'name',
            value: 'id',
          }}
          notFoundNode={notFoundNode()}
          {...customerProps}
          {...props}
        />
      </Form.Item>
      {/* 模版选择框  */}
      <FranchiseeSelectTemplate
        templateData={selectTemplateData}
        setTemplateData={setSelectTemplateData}
        setFormDrawerData={setFormDrawerData}
      />
      <FranchiseeCreateDrawer
        drawerData={formDrawerData}
        setDrawerData={setFormDrawerData}
        onCreated={onCreated}
      />
    </>
  );
});

export default FormFranchisee;
