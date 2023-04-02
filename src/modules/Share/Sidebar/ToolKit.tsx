import { memo } from "react";
import { Popover, Empty } from "antd";
const css = require("../../../styles/custom.css");
const scss = require("../../../styles/scss/sharepage.scss");

export default memo(ToolKit, (prevProps, { components, active, className }) => {
  if (
    active != prevProps.active ||
    className != prevProps.className ||
    components.length != prevProps.components.length
  )
    return false;
  return true;
});
function ToolKit({ components, children, active, ...rest }) {
  return (
    <Popover
      content={
        <div>
          {components.length ? (
            <ul className={scss["sidebar-menu"]}>
              {components.map((e, i) => (
                <li key={i} className={css["flex-center"]}>
                  {e}
                </li>
              ))}
            </ul>
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </div>
      }
      getPopupContainer={triggerNode => triggerNode}
      placement="top"
      trigger={"click"}
      visible={active}
      overlayClassName={scss["sidebar-menu-wrapper"]}
    >
      {{
        ...children,
        props: {
          ...rest,
          ...children.props
        }
      }}
    </Popover>
  );
}
