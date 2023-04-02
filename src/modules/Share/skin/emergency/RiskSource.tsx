import {
  CSSProperties,
  ReactNode,
  useState,
  createRef,
  Component
} from "react";
import { Drawer, Button, Modal, Cascader } from "antd";
import CardLayout from "../../Components/CardLayout";
import Play from "../../../../components/tools/Play";

const scss = require("../../../../styles/scss/sharepage.scss");
let vh = px => (px / 1080) * 100 + "vh";

interface Props {
  title?: string;
  enTitle?: string;
  suffixIcon?: ReactNode;
  data: Array<any>;
  flex?: boolean;
  colWidth?: Array<number>;
  rowHeight?: number;
  style?: CSSProperties;
  className?: string;
}
export default function RiskSource({
  title,
  enTitle,
  suffixIcon = null,
  data,
  colWidth = [200, 190],
  rowHeight = 90,
  flex = false,
  style = undefined,
  className = ""
}: Props) {
  const [modalProps, setModalProps] = useState({
    title: "",
    visible: false,
    content: null
  });
  const showModal = item => {
    if (
      window.template &&
      window.template.indexOf("emergency") > -1 &&
      window.currentMenu
    ) {
      const s =
        window.currentMenu.sub.find(s => item.name == s.title) ||
        window.currentMenu.sub.find(
          s => item.name.includes(s.title) || s.title.includes(item.name)
        );
      // console.log(item, s);
      s && Play.play(s.feature!);
    }
    // setModalProps({ title: item.name, visible: true });
  };
  return (
    <CardLayout
      title={title}
      enTitle={enTitle}
      suffixIcon={suffixIcon}
      style={style}
      className={className}
    >
      <div className={className} style={{}}>
        {data.map((item, i) => (
          <div
            className={scss["item"] + " " + scss["grid"]}
            key={i}
            style={{
              gridTemplateColumns: "138px auto",
              gap: "15px"
            }}
          >
            <div
              className={scss["icon"] + " " + scss["flex"]}
              style={{
                height: vh(90),
                width: "138px",
                backgroundColor: item.color,
                margin: `0 15px 15px 0`
              }}
            >
              <img
                src={item.icon}
                className={scss["pointer"]}
                style={{
                  margin: "auto",
                  borderRadius: "unset"
                }}
                onClick={e => showModal(item)}
              />
            </div>
            <div>
              <h4
                className={scss["pointer"]}
                style={{ fontWeight: "bold", lineHeight: "30px" }}
                onClick={e => showModal(item)}
              >
                {item.name}
              </h4>
              <h4 style={{ lineHeight: "26px" }}>
                <span style={{ opacity: 0.6 }}>类型：</span>
                <span style={{ opacity: 0.8 }}>{item.type}</span>
              </h4>
              <h4 className={scss["flex-between"]}>
                <div>
                  <span style={{ opacity: 0.6 }}>危险源级别：</span>
                  <span
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: item.color
                    }}
                  >
                    {item.level}
                  </span>
                </div>
                <Button
                  style={{
                    width: "80px",
                    height: "24px",
                    borderRadius: "unset",
                    border: "unset",
                    color: "white",
                    padding: 0,
                    backgroundColor: "rgba(255,255,255,.35)"
                  }}
                  onClick={e =>
                    setModalProps({
                      title: item.name,
                      visible: true,
                      content: item
                    })
                  }
                >
                  查看详细
                </Button>
              </h4>
            </div>
          </div>
        ))}
      </div>
      {modalProps.title ? (
        <Modal
          title={modalProps.title}
          visible={modalProps.visible}
          footer={null}
          mask={false}
          centered
          destroyOnClose={true}
          // forceRender={true}
          onCancel={e => setModalProps({ ...modalProps, visible: false })}
          className={scss["header-modal"]}
        >
          <div>{modalProps.content.name}</div>
          <div>{modalProps.content.unit}</div>
        </Modal>
      ) : null}
    </CardLayout>
  );
}
