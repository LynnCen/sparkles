import { Component } from "react";
import { Button, Input, Slider, InputNumber, message, Collapse } from "antd";
import VrpModal from "../../components/VrpModal";
import CustomFun from "../../config/CustomFun";

const css = require("../../styles/custom.css");
const scss = require("../../styles/scss/sharepage.scss");
const Panel = Collapse.Panel;
interface SelectModalProps {
  data: any;
  closeModal: () => void;
}
interface SelectModalStates {
  modalData?: Array<{ name; value; unit }>;
}
class SelectModal extends Component<SelectModalProps, SelectModalStates> {
  lsgyAuth: { access_token; time; expires_in };
  modalProps = {
    title: "所选标签信息",
    defaultPosition: { x: 30, y: 95 }
  };
  isLsgy = false;
  constructor(props: SelectModalProps) {
    super(props);
    this.state = {};
    this.isLsgy = window.template == "industrial" && window["lsgy"];
    if (this.isLsgy) {
      this.state = { modalData: window["lsgy"].overview.data };
      Object.assign(this.modalProps, {
        title: "选区内企业数据",
        defaultPosition: { x: 40, y: 150 },
        className: scss["industrialSkin"]
      });
    }
  }
  handleKeyDown = e => {
    CustomFun.onKeyDown(e, 27, this.props.closeModal);
  };
  async componentWillMount() {
    const { data } = this.props;
    if (this.isLsgy) {
      const { modalData } = this.state;
      const keywords = data.filter(e => e.title.includes("公司")).map(e => e.title);
      if (keywords.length) {
        this.setState({
          modalData: window["lsgy"].companys
            .filter(e => keywords.includes(e.company_name))
            .reduce(
              (r, c) => {
                r[0].value += Number(c.area);
                r[1].value += Number(c.income);
                return r;
              },
              [{ value: 0 }, { value: 0 }]
            )
            .map((e, i) => ({ ...modalData[i], ...e }))
        });
      }
    }
  }
  componentDidMount() {
    window.addEventListener("keydown", this.handleKeyDown);
  }
  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleKeyDown);
  }

  render() {
    const btnGroup = (
      <div className={css["text-center"]}>
        <Button className={css["m-l-md"]} onClick={this.props.closeModal}>
          关闭
        </Button>
      </div>
    );
    console.log(this.state.modalData);
    return (
      <VrpModal
        {...this.modalProps}
        style={{ width: 300 }}
        // footer={btnGroup}
        fixed={true}
        onClose={this.props.closeModal}
      >
        {this.isLsgy ? (
          <main>
            <ul>
              {this.state.modalData.map((item, i) => (
                <li>
                  {item.name}：{item.value.toFixed(2) + item.unit}
                </li>
              ))}
            </ul>
          </main>
        ) : (
          <Collapse accordion>
            {this.props.data.map((item, index) => {
              return (
                <Panel header={item.title} key={index}>
                  <p dangerouslySetInnerHTML={{ __html: item.content }} />
                </Panel>
              );
            })}
          </Collapse>
        )}
      </VrpModal>
    );
  }
}
export default SelectModal;
