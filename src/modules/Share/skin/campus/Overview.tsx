import { CSSProperties, Component } from "react";
import CardLayout from "../../Components/CardLayout";
import { Modal, Form, Input, message } from "antd";
import ModalProps from "antd/es/modal";
import { FormComponentProps } from "antd/es/form";

const scss = require("../../../../styles/scss/sharepage.scss");

let vh = px => (px / 1080) * 100 + "vh";
const formItemLayout = {
  labelCol: {
    sm: { span: 4 }
  },
  wrapperCol: {
    sm: { span: 20 }
  }
};

interface Props extends FormComponentProps {
  title?: string;
  enTitle?: string;
  stuTeaUrl: string[];
  modal: { title; rows: { label; key }[] };
  data: Array<any>;
  colWidth?: Array<number>;
  rowHeight?: number;
  style?: CSSProperties;
  className?: string;
  imgHeight?: number;
  imgWidth?: number;
  placement?: "top" | "bottom";
}
interface States {
  data: Array<any>;
  modalProps: ModalProps;
}
const withCredential = { credentials: "include" as "include" };

export default Form.create({ name: "Overview" })(
  class extends Component<Props, States> {
    static defaultProps = {
      colWidth: [170, 214],
      rowHeight: 90,
      style: undefined,
      className: "",
      imgHeight: 42,
      placement: "top"
    };
    _style;
    constructor(props) {
      super(props);
      this._style = {
        gridTemplateColumns: `${props.colWidth.join("px ") + "px"}`,
        gridTemplateRows: `repeat(auto-fill, ${vh(props.rowHeight)}`,
        gridAutoRows: vh(props.rowHeight)
      };
      this.state = {
        data: props.data,
        modalProps: {
          title: props.modal.title,
          visible: false
        }
      };
    }
    componentWillMount() {
      this.getStuTeaCount();
      this.getExamInfo();
    }
    getExamInfo = () => {
      fetch(
        `${process.env.lizhongAPI}${this.props.modal.url[0]}`,
        withCredential
      )
        .then(r => r.json())
        .then(r => this.setData(r.data))
        .catch(console.error);
      // fetch(`${process.env.lizhongProxy}/zx/supervision/getExamInfo`)
      //   .then(res => res.json())
      //   .then(res => {
      //     let { data } = this.state;
      //     data[0].value.splice(1, 0, res.data.testCount).join("");
      //     data[0].name.splice(1, 0, res.data.markCount).join("");
      //     data[1].value.splice(1, 0, res.data.schCount).join("");
      //     data[1].name.splice(1, 0, res.data.quesCount).join("");
      //     this.setState({ data });
      //   })
      //   .catch(err => console.table(err));
    };
    getStuTeaCount = async () => {
      // await fetch(`${process.env.lizhongAPI}/User/login`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/x-www-form-urlencoded" },
      //   body: "account=huge&password=123456",
      //   credentials: "include"
      // });
      let i = 2;
      for (let url of this.props.stuTeaUrl) {
        await fetch(`${process.env.lizhongAPI}${url}`, withCredential)
          .then(res => res.json())
          .then(res => {
            let { data } = this.state;
            data[i].value = res.data;
            this.setState({ data });
          })
          .catch(err => console.table(err));
        i++;
      }
    };
    onSubmit = () => {
      this.props.form.validateFields((e, v) => {
        if (!e) {
          fetch(`${process.env.lizhongAPI}${this.props.modal.url[1]}`, {
            method: "post",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: require("qs").stringify(v),
            ...withCredential
          })
            .then(r => r.json())
            .then(r => {
              this.setData(v);
              this.setState({
                modalProps: { ...this.state.modalProps, visible: false }
              });
              message.success(r.message);
            })
            .catch(console.error);
        }
      });
    };
    setData = v => {
      let { data } = this.state;
      data[0].value.splice(1, data[0].value.length == 3 ? 1 : 0, v.networkRead);
      data[0].name.splice(
        1,
        data[0].value.length == 3 ? 1 : 0,
        v.markingCopies
      );
      data[1].value.splice(1, data[0].value.length == 3 ? 1 : 0, v.schoolBased);
      data[1].name.splice(1, data[0].value.length == 3 ? 1 : 0, v.testNumber);
      this.setState({ data });
    };
    render() {
      const {
        title,
        enTitle,
        style,
        className,
        flex,
        imgWidth,
        imgHeight,
        modal,
        form
      } = this.props;
      const { data, modalProps } = this.state;
      console.log(data);
      return (
        <>
          <CardLayout
            title={title}
            enTitle={enTitle}
            style={{ ...style, cursor: "pointer" }}
            className={className + " pe-auto"}
            onClick={e => {
              this.setState({ modalProps: { ...modalProps, visible: true } });
            }}
          >
            <div className={scss["avatar-grid"]} style={this._style}>
              {data.map((item, i) => (
                <div className={scss["item"]} key={i}>
                  <div className={scss["icon"]} style={{ marginRight: "12px" }}>
                    <span
                      style={{
                        display: "flex"
                      }}
                    >
                      <img
                        src={item.icon}
                        style={{
                          margin: "auto",
                          height: imgHeight + "px"
                        }}
                      />
                    </span>
                  </div>
                  <div>
                    <div>
                      <h2
                        style={{ color: "white", margin: 0, fontSize: "1.3em" }}
                      >
                        {item.value}
                      </h2>
                    </div>
                    <h4>{item.name}</h4>
                  </div>
                </div>
              ))}
            </div>
          </CardLayout>
          {modalProps.visible && (
            <Modal
              {...modalProps}
              centered
              cancelText="取消"
              okText="提交"
              onCancel={e =>
                this.setState({
                  modalProps: { ...modalProps, visible: false }
                })
              }
              onOk={this.onSubmit}
            >
              <Form {...formItemLayout}>
                {modal.rows.map((r, i) => {
                  return (
                    <Form.Item label={r.label}>
                      {form.getFieldDecorator(r.key, {
                        rules: [
                          {
                            required: true,
                            message: "请输入数字！",
                            pattern: /^\d+$/
                          }
                        ],
                        initialValue:
                          data[Math.floor(i / 2)][
                            i % 2 == 0 ? "value" : "name"
                          ][1]
                      })(<Input />)}
                    </Form.Item>
                  );
                })}
              </Form>
            </Modal>
          )}
        </>
      );
    }
  }
);
