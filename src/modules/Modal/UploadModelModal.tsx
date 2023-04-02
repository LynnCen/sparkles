import { Component } from "react";
import { Form, Input, Button, Spin, message, Icon, Upload, Progress } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import VrpModal from "../../components/VrpModal";
import Config from "../../config/Config";
import StrConfig from "../../config/StrConfig";
import FileReaderTool from "../../components/FileReaderTool";
import reqwest from "reqwest";
import ModelService from "../../services/ModelService";
import { UploadModelImgMsg } from "../../models/UploadModel";
import DataService from "../../services/DataService";

const FormItem = Form.Item;
const css = require("../../styles/custom.css");
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
    md: { span: 6 },
    lg: { span: 6 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
    md: { span: 16 },
    lg: { span: 16 }
  },
};

/**
 * @name UploadModelModal
 * @create: 2018/12/31
 * @description: 上传模型
 */

interface UploadModelModalProps extends FormComponentProps {
  reLoadModel: () => void;
  onClose?: () => void;
  clientWidth: number;
}

interface UploadModelModalStates {
  imgUrl: string;
  imgStatus: any;
  imgLoading: boolean;
  fileStatus: any;
  modelId: number;
  uploading: boolean;
  fileList: any;
  modelPercent: number;
  changeLoading: boolean;
}

class UploadModelModal extends Component<UploadModelModalProps, UploadModelModalStates> {
  interval;
  imgFile;
  hasDae = false;
  remove = false;

  constructor(props: UploadModelModalProps) {
    super(props);
    this.state = {
      imgUrl: "",
      imgStatus: {},
      imgLoading: false,
      fileStatus: {},
      modelId: 0,
      uploading: false,
      fileList: [],
      modelPercent: 0,
      changeLoading: false
    }
  }

  /**
   * @description 设置缩略图提示
   * @param imgUrl
   * @param errorMsg
   * @returns {any}
   */
  showImgMsg = (imgUrl, errorMsg?) => {
    if (imgUrl) {
      return {
        validateStatus: 'success',
        errorMsg: null,
      };
    } else {
      return {
        validateStatus: 'error',
        errorMsg: errorMsg ? errorMsg : '缩略图不能为空',
      };
    }
  };

  /**
   * @description 设置文件夹提示
   * @param bool
   * @param errorMsg
   * @returns {any}
   */
  showFileMsg = (bool, errorMsg) => {
    if (bool) {
      return {
        validateStatus: 'success',
        errorMsg,
      };
    } else {
      return {
        validateStatus: 'error',
        errorMsg,
      };
    }
  };

  /**
   * @description 上传图片
   */
  imgFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const size = file.size * 1.0 / 1024;
      if (size < 500) {
        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = (even) => {
          this.props.form.validateFields(['title'], (errors: any, _: any) => {
            // 图片change事件 判断标题是否未填 显示提示信息 保存图片信息 显示图片
            const img = even.target.result;
            this.setState({
              imgUrl: img,
              imgStatus: {
                ...this.showImgMsg(img)
              }
            });
            this.imgFile = file;
          });
        };
      } else {
        this.setState({
          imgStatus: {
            ...this.showImgMsg(false, "图片大小不能超过500KB")
          }
        });
      }
    }
  };

  /**
   * @description 判断是否存在dae文件
   * @param name
   * @returns {boolean}
   */
  hasDaeFile = (name) => {
    return name.indexOf('.dae') >= 0 || name.indexOf('.DAE') >= 0;
  };

  /**
   * @description 上传前保存文件列表
   * @param file
   * @returns {boolean}
   */
  beforeUploadModel = (file) => {
    const { imgUrl } = this.state;
    if (this.hasDaeFile(file.name)) {
      this.hasDae = true; // 存在dae文件
      this.setState({
        fileStatus: {
          ...this.showFileMsg(true, "")
        }
      });
    }
    if (!imgUrl) {
      // 提示缩略图未上传
      this.setState({
        imgStatus: {
          ...this.showImgMsg(imgUrl)
        }
      });
    }
    if (this.remove) {
      // 非第一次选择 清空前一次选择文件
      const fileList = [];
      this.setState({
        fileList: [...fileList, file]
      });
      this.remove = false;
      this.hasDae = false
    } else {
      this.setState((state) => ({
        fileList: [...state.fileList, file],
      }));
    }
    return false;
  };

  /**
   * @description 上传模型
   */
  handleUploadModel = (id) => {
    const { fileList } = this.state;
    let index = 0;
    this.setState({
      uploading: true,
    });
    for (const item of fileList) {
      const formData = new FormData();
      formData.append('file', item);
      formData.append("id", id.toString());
      reqwest({
        url: Config.getAPI(StrConfig.UploadModel),
        method: 'post',
        processData: false,
        contentType: false,
        data: formData,
        withCredentials: true,
        success: (res) => {
          index++;
          if (res.code === 200) {
            this.setState({
              modelPercent: parseInt((index / fileList.length * 100).toFixed(0), 10)
            });
            if (index === fileList.length) {
              this.checkIsLast();
            }
          } else {
            this.setState({
              uploading: false
            });
            message.error(res.message);
          }
        },
        error: (res) => {
          message.error("文件上传失败！");
        },
      });
    }
  };

  /**
   * @description 判断是否为最后一个文件
   */
  checkIsLast = () => {
    const data = { id: this.state.modelId };
    ModelService.isLast(data, (flag, _) => {
      if (flag) {
        this.setState({
          changeLoading: true
        });
        this.interval = setInterval(() => {
          this.modelCallBack()
        }, 4000)
      }
    })
  };

  /**
   * @description 模型转换过程
   */
  modelCallBack = () => {
    const callbackData = { id: this.state.modelId, type: "client" };
    ModelService.callBack(callbackData, (flag2, res2) => {
      if (flag2 && res2.data === 1) {
        this.setState({
          changeLoading: false,
          uploading: false
        });
        clearInterval(this.interval);
        this.clearValue();
        this.props.reLoadModel();
        message.success(res2.message);
      } else if (!flag2) {
        this.setState({
          changeLoading: false,
          uploading: false
        });
        clearInterval(this.interval);
      }
    })
  };

  /**
   * @description 不存在dae文件 设置提示信息 清空文件列表
   * @returns {boolean}
   */
  checkValues = () => {
    this.setState({
      fileStatus: {
        ...this.showFileMsg(false, "请选择包含DAE文件的文件夹")
      },
      fileList: []
    });
    return false;
  };

  /**
   * @description 上传图片
   */
  uploadImg = () => {
    this.props.form.validateFields(['title'], (errors: any, values: any) => {
      if (!errors) {
        if (this.state.fileList!! && this.hasDae) {
          const formData = new FormData();
          formData.append("file", this.imgFile);
          formData.append("type", "Customize");
          formData.append("title", values['title']);
          DataService.upload(formData, StrConfig.UploadImg, (flag, res: UploadModelImgMsg) => {
            if (flag) {
              this.setState({
                modelId: res.data.id
              });
              // 成功后开始上传模型
              this.handleUploadModel(res.data.id)
            } else {
              message.error(res.message);
            }
          })
        } else {
          // 不存在dae文件显示提示信息
          this.checkValues();
        }
      }
    });
  };

  /**
   * @description 清空当前表单 进行下一次上传
   */
  clearValue = () => {
    this.setState({
      imgUrl: "",
      fileList: [],
      modelId: 0,
      modelPercent: 0
    });
    this.props.form.setFieldsValue({ title: "" })
  };

  /**
   * @description 判断非第一次选择文件的标记
   */
  removeFile = () => {
    this.remove = true;
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { uploading, fileList, imgUrl, modelPercent, changeLoading } = this.state;
    const props = {
      action: StrConfig.AcceptImg,
      directory: true,
      disabled: uploading,
      beforeUpload: this.beforeUploadModel,
      showUploadList: false
    };
    const uploadButton = (
      <div className={css['vrp-upload-btn']}>
        <span>
          <Icon type={'plus'} />
        </span>
      </div>
    );
    const btnGroup = (
      <div className={css['text-center']}>
        <Button type="primary" onClick={this.uploadImg}
          disabled={fileList.length === 0 || uploading}>
          开始上传
        </Button>
        <Button className={css['m-l-md']}
          onClick={this.props.onClose}>关闭</Button>
      </div>);
    return (
      <VrpModal defaultPosition={{  x: 30, y: 95 }} title={"上传模型"} style={{ width: 400 }}
        onClose={this.props.onClose} height={505}
        baseBoxStyle={{ top: -50, left: this.props.clientWidth }} footer={btnGroup}>
        <Form layout="horizontal">
          <FormItem {...formItemLayout} label="模型标题">
            {getFieldDecorator('title', {
              rules: [{
                whitespace: true,
                required: true,
                message: '标题不能为空',
              }]
            })(
              <Input />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="缩略图" className={css['required']}
            validateStatus={this.state.imgStatus.validateStatus}
            help={this.state.imgStatus.errorMsg} extra={"选择小于500KB的图片"}>
            <div>
              <FileReaderTool accept={StrConfig.AcceptImg} multiple={false}
                clickDom={imgUrl ?
                  <img style={{ width: 100 }} src={imgUrl}
                    alt="缩略图" /> : uploadButton}
                fileData={this.imgFileChange} />
            </div>
          </FormItem>
          <FormItem {...formItemLayout} label="模型文件夹" className={css['required']}
            validateStatus={this.state.fileStatus.validateStatus}
            help={this.state.fileStatus.errorMsg}
            extra={"选择包含DAE文件的目录"}>
            <Upload {...props}>
              {uploading ?
                <div className={css['vrp-upload-box']}>
                  {changeLoading ?
                    <Spin size="large" />
                    : <Progress type="circle" percent={modelPercent} />}
                  <p>{changeLoading ? "文件转换中" : "文件上传中"}</p>
                </div>
                :
                <div className={css['vrp-upload-box']}>
                  {
                    fileList.length === 0 ?
                      <div>
                        <p style={{ fontSize: 50, color: "#1890ff" }}>
                          <Icon type="inbox" /></p>
                        <p>点击选择文件夹上传</p>
                      </div> :
                      <div onClick={this.removeFile}>
                        <p style={{ fontSize: 50, color: "#1890ff" }}>
                          <Icon type="folder" /></p>
                        <p>已选择{fileList.length}个文件</p>
                      </div>
                  }
                </div>}
            </Upload>
          </FormItem>
        </Form>
      </VrpModal>

    );
  }
}

export default Form.create()(UploadModelModal);

