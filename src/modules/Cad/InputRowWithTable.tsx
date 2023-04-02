import { Component, useState, forwardRef, RefObject, createRef } from "react";
import { Input, Icon, Empty, Spin } from "antd";
import VrpIcon from "../../components/VrpIcon";
const css = require("../../styles/custom.css");
const scss = require("../../styles/scss/cad.scss");

export const InputAddOnRow = ({
  label = "",
  size = "small",
  placeholder,
  onClick,
  labelClassName = css["flex-none-label"],
  labelStyle = {}
}) => {
  return (
    <div className={css["flex-center-left"]} style={{}}>
      <label className={labelClassName} style={labelStyle}>
        {label}
      </label>
      <Input
        disabled={true}
        addonAfter={
          <Icon
            type="more"
            style={{ transform: "rotate(90deg)" }}
            onClick={onClick}
          />
        }
        placeholder={placeholder}
        size={size}
      />
    </div>
  );
};

export default withSelectedTable(InputAddOnRow);

export function withSelectedTable(WrappedComponent) {
  class WithSelectedTable extends Component<
    { [key: string]: any },
    { [key: string]: any }
  > {
    static defaultProps = {
      label: "",
      placeholder: "",
      title: "",
      selections: [],
      dataSource: [],
      onClick: () => undefined,
      onSelect: (row, record, selected) => undefined,
      onChange: selections => undefined,
      mode: "multiple"
    };
    tableRef = createRef();
    constructor(props) {
      super(props);
      this.state = { visible: false, selections: props.selections };
    }
    showBox = e => {
      this.setState({ visible: !this.state.visible });
      const { tableRef, onClick } = this.props;
      onClick(!this.state.visible);
      tableRef &&
        !tableRef.current &&
        !this.state.visible &&
        tableRef(this.tableRef.current);
    };
    onSelect = (...rest) => {
      const { selections, onSelect, onChange, mode } = this.props;
      onSelect(...rest);
      const len = rest.length;
      const row = rest[0];
      const selected = rest[len - 1];
      const ri = selections.findIndex(r => r.id == row.id);
      if (len == 3) {
        const record = rest[1];
        if (selected) {
          const c = row.children.find(c => c.id == record.id);
          if (ri === -1) selections.push({ ...row, children: [c] });
          else {
            selections[ri].children.push(c);
            selections[ri].children.sort((a, b) => a.id - b.id);
          }
          selections.sort((a, b) => a.id - b.id);
        } else if (!selected && ri > -1) {
          const sc = selections[ri].children;
          const ci = sc.findIndex(c => c.id == record.id);
          ci > -1 && sc.splice(ci, 1);
          !sc.length && selections.splice(ri, 1);
        }
        onChange([...selections]);
      } else if (len == 2) {
        if (selected) {
          selections.push(row);
          selections.sort((a, b) => a.id - b.id);
        } else selections.splice(ri, 1);
        onChange([...selections]);
      } else if (len == 1 && mode == "single") {
        onChange(rest);
      }
    };
    render() {
      const { visible } = this.state;
      const { placeholder, selections, dataSource } = this.props;
      console.assert(
        Array.isArray(selections),
        "selections is required for type Array"
      );
      const props = {
        ...this.props,
        onClick: this.showBox,
        placeholder: placeholder
          ? placeholder
          : (selections || [])
              .map(s => {
                let d = dataSource.find(d => d.id == s.id);
                return d
                  ? s.children
                    ? s.children
                        .map(c => {
                          let e = d.children.find(e => e.id == c.id);
                          return (e.type || "") + " " + e.title;
                        })
                        .join(",")
                    : d.title
                  : s.children
                  ? s.children.map(c => c.id).join(" ")
                  : "";
              })
              .join(",") || "请选择"
      };
      return (
        <div style={{ position: "relative" }}>
          <WrappedComponent {...props} />
          {/* {visible && ( */}
          <div
            className={scss["withSelectedTable"]}
            style={{ display: visible ? "block" : "none" }}
          >
            <div className={css["flex-center-between"]} style={{}}>
              <div>{props.label}</div>
              <VrpIcon
                iconName={"icon-quit "}
                title={"关闭"}
                style={{}}
                className={css["pointer"]}
                onClick={this.showBox}
              />
            </div>
            {this.props.title === "gps数据源" ? (
              <div className={scss["selectedTableWrapper"]}>
                {props.dataSource.length ? (
                  props.dataSource.map((item, i) => (
                    <GPSRow
                      key={i}
                      rowSource={item}
                      selection={props.selections}
                      onSelect={props.onSelect}
                    />
                  ))
                ) : (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}
              </div>
            ) : (
              <div className={scss["selectedTableWrapper"]} ref={this.tableRef}>
                {props.dataSource.length ? (
                  props.dataSource.map((item, i) => (
                    <>
                      <CollapsedRow
                        key={item.id}
                        rowSource={item}
                        selection={props.selections.find(
                          s => (typeof s == "object" ? s.id : s) == item.id
                        )}
                        onSelect={this.onSelect}
                        // onChange={value => console.log(value)}
                        mode={props.mode}
                      />
                    </>
                  ))
                ) : (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}
              </div>
            )}
          </div>
          {/* )} */}
        </div>
      );
    }
  }
  // return WithSelectedTable;
  return forwardRef((props, ref: RefObject<WithSelectedTable>) => (
    <WithSelectedTable {...props} ref={ref} />
  ));
}
interface GPSProps {
  rowSource: any;
  selection: any;
  onSelect: (item) => void;
}

function GPSRow({ rowSource, selection, onSelect }: GPSProps) {
  const [unfold, setUnfold] = useState(false);

  if (rowSource.data == "loading") {
    return (
      <div className={css["selectedItemLoading"]}>
        {" "}
        <Spin />
      </div>
    );
  } else {
    return (
      <div
        style={{ cursor: "pointer" }}
        // onClick={e => onSelect(rowSource)}
        //  onClick={e => setUnfold(!unfold)}
      >
        <div
          className={scss["selectedItemHeader"]}
          style={{}}
          onClick={e => setUnfold(!unfold)}
        >
          <span>
            <Icon
              type={`caret-right`}
              style={{
                transition: "all 0.25s",
                transform: unfold ? "rotate(90deg)" : "none"
              }}
            />
          </span>
          <span style={{ marginLeft: "15px" }}>{rowSource.title}</span>

          <span>
            {rowSource.data.length}/
            <span className={scss["green"]}>
              {(selection || 0) && selection.length}
            </span>
          </span>
        </div>
        <div
          className={"ant-collapse-content"}
          style={{
            transition: "all 0.25s",
            height: unfold ? "auto" : 0
          }}
        >
          {rowSource.data &&
            rowSource.data.map((item, i) => {
              let s = selection && selection.find(f => f.code == item.code);

              return (
                <div
                  key={item.id || i}
                  className={scss["selectedTableItem"]}
                  onClick={e => onSelect(item)}
                >
                  <VrpIcon
                    iconName={"icon-point"}
                    title={"已选"}
                    style={{
                      color: item.lon ? "#6fc643" : "#999",
                      fontSize: "10px"
                    }}
                  />

                  {item.code}
                  <span className={scss["selectedTableIcon"]}>
                    {!!s && (
                      <VrpIcon
                        iconName={"icon-ok"}
                        title={"已选"}
                        style={{ color: "#6fc643", fontSize: "14px" }}
                      />
                    )}
                  </span>
                </div>
              );
            })}
        </div>
      </div>
    );
  }
}

type Record = {
  id: number;
  type?: string;
  title?: string;
};
interface Row extends Record {
  children?: Record[];
}
interface CollapsedRowProps {
  rowSource: Row;
  selection?: Row | null | undefined;
  onChange?: (value: number[]) => void;
  onSelect:
    | ((row: Row, record: Record, selected?: boolean) => void)
    | ((row: Row, selected?: boolean) => void)
    | ((row: Row) => void);
  mode?: "single" | "multiple";
}
function CollapsedRow({
  rowSource,
  selection,
  onSelect,
  mode = "multiple"
}: CollapsedRowProps) {
  const [unfold, setUnfold] = useState(false);
  return (
    <div className={"ant-collapse"}>
      <div className={"ant-collapse-item " + scss["tabpanel"]}>
        <div
          className={
            css["flex"] +
            " ant-collapse-header " +
            `${unfold ? scss["border-bottom"] : ""}`
          }
          onClick={e => {
            if (rowSource.children) setUnfold(!unfold);
            else {
              mode == "multiple"
                ? onSelect(rowSource, !selection)
                : onSelect(rowSource);
            }
          }}
        >
          {rowSource.children && (
            <>
              <span>
                <Icon
                  type={`caret-right`}
                  style={{
                    transition: "all 0.25s",
                    transform: unfold ? "rotate(90deg)" : "none"
                  }}
                />
              </span>
              <span>{rowSource.type}</span>
            </>
          )}
          <span
            className={"ellipsis"}
            style={{ flexBasis: rowSource.children ? "60%" : "auto" }}
          >
            {rowSource.title}
          </span>
          {rowSource.children ? (
            <span>
              <span className={scss["green"]}>
                {(selection || 0) && selection.children.length}
              </span>
              /{rowSource.children.length}
            </span>
          ) : (
            <span>
              {selection && rowSource.id == selection.id && (
                <VrpIcon iconName={"icon-ok"} title={"已选"} />
              )}
            </span>
          )}
        </div>
        <ul
          className={"ant-collapse-content"}
          style={{
            transition: "all 0.25s",
            height: unfold ? "auto" : 0
          }}
          onClick={e => {
            let target = e.target;
            while (target.nodeName != "LI") {
              target = e.target.parentNode;
            }
          }}
        >
          {rowSource.children &&
            rowSource.children.map((item, i) => {
              const s =
                selection && selection.children.find(f => f.id == item.id);
              return (
                <li
                  key={item.id || i}
                  className={css["flex-center-between"]}
                  onClick={e => onSelect(rowSource, item, !s)}
                >
                  <span>{item.type || ""}</span>
                  <span>{item.title}</span>
                  <span>
                    {!!s && <VrpIcon iconName={"icon-ok"} title={"已选"} />}
                  </span>
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
}
