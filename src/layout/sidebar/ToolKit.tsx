import { useState, useEffect } from "react";
import { Popover, Empty } from "antd";
import React from "react";

export default function ToolKit({ components, children, active, ...rest }) {
  return (
    <Popover
      content={
        <div>
          {components.length ? (
            <ul className={"sidebar-menu"}>
              {components.map((e, i) => (
                <li key={i} className={"flex-center"}>
                  {e}
                </li>
              ))}
            </ul>
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </div>
      }
      getPopupContainer={(triggerNode) => triggerNode}
      placement="top"
      trigger="click"
      visible={active}
      overlayClassName={"sidebar-menu-wrapper"}
    >
      {{
        ...children,
        props: {
          ...rest,
          ...children.props,
        },
      }}
    </Popover>
  );
}
