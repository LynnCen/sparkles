/**
 * @Description
 */
import { FlowDetail } from 'flow-engine';


const FlowDetailContainer = ({
  data = {},
  mainHeight = 600
}) => {

  return (
    <div style={{ height: mainHeight - 60 }}>
      <FlowDetail
        detail={data}
      />
    </div>
  );
};


export default FlowDetailContainer;


