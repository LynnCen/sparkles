/**
 * @LastEditors lizijian lizijian@linhuiba.com
 * @Date 2024-01-10 14:01
 * @LastEditTime 2024-01-10 14:01
 * @FilePath /saas-manage/src/views/locxx/pages/demandManagement/components/Edit/components/CustomFormUpload/index.tsx
 * @Description 自定义上传后端服务器上传组件
 */
import React, { useState } from 'react';
import styles from '@/common/components/Form/V2FormUpload/upload.module.less';
import { Form, FormItemProps, Tooltip } from 'antd';
import { TipConfigProps, CombineUploadProps } from '@/common/components/Form/V2FormUpload/props';
import { imageTypes } from '@/common/components/config-v2';
import UploadFile from './UploadFile';
import IconFont from '@/common/components/Base/IconFont';

export interface DefaultFormItemProps {
  /**
   * @description 字段名，支持数组
   */
  name?: string | number | (string | number)[];
  /**
   * @description label 标签的文本
   */
  label?: React.ReactNode;
  /**
   * @description 为 true 时不带样式，作为纯字段控件使用
   * @default  false
   */
  noStyle?: boolean;
  /**
   * @description Form.Item中rule属性设置，具体请参考 https://ant.design/components/form-cn/#Rule
   */
  rules?: any[];
  /**
   * @description Form.Item的属性设置，具体请参考 https://ant.design/components/form-cn/#Form.Item
   */
  formItemConfig?: FormItemProps; // Form.Item的其他入参
  /**
   * @description 是否必填
   * @default false
   */
  required?: boolean;
}

// 上传
export interface V2FormUploadProps extends DefaultFormItemProps {
  /**
   * @description Upload的API参数，见下方文档
   */
  config?: CombineUploadProps;
  /**
   * @description 提示相关配置，见下方文档
   */
  tipConfig?: TipConfigProps;
  /**
   * @description Upload的API入参
   * @type ['image' | 'video' | 'file']
   */
  uploadType?: string;
  /**
   * @description 子节点的值的属性
   * @default fileList
   */
  valuePropName?: string;
  /**
   * @description 变化时回调函数
   */
  onChange?: Function;
  /**
   * @description 自定义上传的样式
   */
  children?: React.ReactNode;
  /**
   * @description 额外的校验，(file: any) => new Promise(res). res传入false时，代表校验通过。传入string时，代表失败，并会报错
   */
  extraVerified?: (file: any) => Promise<string | boolean>;
  /**
   * @description label和content中间的插槽
   */
  verticalMiddleHelp?: React.ReactNode | string;
  /**
   * @description 别和我谈规范，就是玩，性能问题不重要（ps：视频打算传好多）
   * @default false
   */
  breakTheNorm?: boolean;
  /**
   * @description 文件提示插槽Render, config返回参数 {size, fileType}, 仅 type=file 可用
   */
  fileTipRender?: (config: any) => React.ReactNode;
}
/**
* @description 便捷文档地址
* @see https://reactpc.lanhanba.net/components/form/v2form-upload
*/
const CustomFormUpload: React.FC<V2FormUploadProps> = ({
  label,
  name,
  rules = [],
  noStyle = false,
  valuePropName = 'fileList',
  config = {},
  formItemConfig = {},
  children,
  onChange,
  uploadType = 'file',
  tipConfig = {},
  required,
  extraVerified,
  verticalMiddleHelp,
  fileTipRender,
}) => {
  let _rules = rules;
  // 未设置rules 规则,但是有设置必填，就添加一个默认的规则
  // 只要设置了 rules，就完全托管给rules自行校验
  if (!_rules?.length) {
    if (required) {
      _rules = _rules.concat([{ required: true, message: `请上传${label || ''}` }]);
    }
  }
  const [fileListNum, setFileListNum] = useState<number>(0); // 2.0设计要在label里展示数量
  const isTypeFile = uploadType === 'file';

  /* 在源头限制 maxCount 、size、fileType */
  if (!config.maxCount) {
    config.maxCount = 1;
  }
  if (!config.size) {
    config.size = 20;
  }
  if (!config.fileType) {
    if (isTypeFile) {
      config.fileType = 'any';
    } else {
      config.fileType = imageTypes;
    }
  }
  const _onChange = (fileList, bubble = true) => {
    setFileListNum(fileList?.length || 0);
    bubble && onChange && onChange(fileList);
  };
  /* components */
  const getUpload = () => {
    return <UploadFile extraVerified={extraVerified} fileTipRender={fileTipRender} onCustomChange={_onChange} onChange={_onChange} {...config}>{children}</UploadFile>;
  };

  // ui2.0规范约定
  // tip只在 image和 video模式下生效， file模式用不到
  // 在customTip内默认就是图片和视频两种，会在Form.Item的label处判断是否为file，不用纠结
  const initTypeText = isTypeFile ? '文件' : '图片';
  const _tipConfig: TipConfigProps = Object.assign({
    show: true,
    tooltipIconShow: true,
    tooltipTitle: typeof config.fileType === 'string' ? `支持上传任意格式文件` : `只能上传 ${(config.fileType as any[]).join('/')} 格式`,
    tooltipIcon: <IconFont className={styles.V2FormUploadAnticon} iconHref='pc-common-icon-ic_info'/>,
    tooltipText: isTypeFile ? undefined : `( ${fileListNum}/${config.maxCount} 单个${initTypeText}不超过 ${config.size}M ）`,
    typeText: initTypeText,
  }, tipConfig);
  const customTip = <div className={styles.V2FormUploadCustomLabel}>
    {label}
    {
      _tipConfig.tooltipIconShow && <Tooltip title={_tipConfig.tooltipTitle}>
        <>
          {_tipConfig.tooltipIcon}
        </>
      </Tooltip>
    }
    <span className={styles.V2FormUploadTip}>
      { _tipConfig.tooltipText }
    </span>
  </div>;
  return (
    verticalMiddleHelp ? (
      <Form.Item
        noStyle={noStyle}
        label={_tipConfig.show ? customTip : (label || undefined)}
        htmlFor=''
      >
        {verticalMiddleHelp}
        <Form.Item
          noStyle
          name={name}
          rules={_rules}
          valuePropName={valuePropName}
          {...formItemConfig}
        >
          {
            getUpload()
          }
        </Form.Item>
      </Form.Item>
    ) : (
      <Form.Item
        noStyle={noStyle}
        name={name}
        htmlFor=''
        label={_tipConfig.show ? customTip : (label || undefined)}
        rules={_rules}
        valuePropName={valuePropName}
        {...formItemConfig}
      >
        {
          getUpload()
        }
      </Form.Item>
    )
  );
};
CustomFormUpload.displayName = 'CustomFormUpload';
export default CustomFormUpload;
