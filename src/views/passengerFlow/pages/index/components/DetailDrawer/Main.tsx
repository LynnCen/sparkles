/**
 * @Description 客流详情弹窗主要内容
 */

import Execute from '../../../detail/components/Execute';
import Records from '../../../detail/components/Records';
import Tenants from '../../../detail/components/Tenants';

const Main = (props) => {
  const {
    activeKey,
    detail,
    deviceParams,
    source,
    setSource,
    getDetail,
    mainHeight,
    open,
  } = props;
  return (
    <div style={{
      height: mainHeight || 'auto',
      overflowY: 'scroll',
      overflowX: 'hidden',
      marginTop: '16px',
    }}>
      { activeKey === '1' && <Execute deviceParams={deviceParams} source={source} setSource={setSource} detail={detail} onChange={getDetail}/> }
      { activeKey === '2' && <Tenants open={open} detail={detail}/>}
      { activeKey === '3' && <Records open={open} detail={detail}/>}
    </div>
  );
};

export default Main;
