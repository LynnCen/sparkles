/**
 * @Description
 */
import { FC } from 'react';
import { Modal } from 'antd';
// import cs from 'classnames';
// import styles from './entry.module.less';

const HintDialog: FC<any> = ({
  show,
  setShow,
}) => {

  return (
    <Modal
      title='视频无法播放的处理方式'
      open={show}
      onCancel={() => setShow(false)}
    >
      <div>
        <div className='fs-14 bold'>
          在谷歌(chrome)浏览器或者chrome内核(360等国产浏览器)的浏览器下，因为浏览器对视频源的解码兼容性不高，故需要一些特殊方式来处理
        </div>
        <div className='fs-12 c-666 mt-5'>
          1. 关闭浏览器系统下的硬件加速。
        </div>
        <div className='fs-12 c-666'>
          关闭步骤：打开设置 - 系统 - 使用图形加速功能（部分版本叫关闭硬件加速）- 关闭<br/>
          关闭后，尝试刷新页面后重新播放
        </div>
        <div className='fs-12 c-666'>
          2. Mac下可使用自带的Safari浏览器播放
        </div>
        <div className='fs-14 bold mt-20'>
          如果以上方案都无法奏效，请联系location相关人员，我们会尽快处理。
        </div>
      </div>
    </Modal>
  );
};

export default HintDialog;
