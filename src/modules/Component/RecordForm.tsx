import {Component} from "react";
import {Button, DatePicker, Radio, Form, message} from "antd";
import {FormComponentProps} from 'antd/es/form';
import moment from "moment";
import StrConfig from "../../config/StrConfig";
import MonitorService from "../../services/MonitorService";
import RecordsModal from "../Modal/RecordsModal";
import {records} from "../../models/MonitorModel";

const css = require("../../styles/custom.css");
const RadioGroup = Radio.Group;
const FormItem = Form.Item;

/**
 * @name RecordForm
 * @create: 2019/3/20
 * @description: 录像查询及获取视频回放uri
 */

interface RecordFormProps extends FormComponentProps {
  closeModal: () => void;
  channelCode: string;
  channelId: string;
}

interface RecordFormStates {
  startValue: any;
  endValue: any;
  location: string;
  isShowList: boolean;
  records: records[];
}

class RecordForm extends Component<RecordFormProps, RecordFormStates> {
  constructor(props: RecordFormProps) {
    super(props);
    this.state = {
      startValue: null,
      endValue: null,
      location: "cloud",
      isShowList: false,
      records: []
    };
  }

  disabledStartDate = (startValue) => {
    const endValue = this.props.form.getFieldValue('endTime');
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();

  };

  disabledEndDate = (endValue) => {
    const startValue = this.props.form.getFieldValue('beginTime');
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };

  getUTCTime = (m) => {
    const time = moment(m).utc().format().replace(/\-/g, "");
    return time.replace(/\:/g, "");
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values['channelId'] = this.props.channelCode;
        values['beginTime'] = this.getUTCTime(values['beginTime']);
        values['endTime'] = this.getUTCTime(values['endTime']);
        MonitorService.getRecordFile(values, (bool, res) => {
          if (bool) {
            // todo 录像列表
          } else {
            message.error(res.message)
          }
          this.setState({
            isShowList: true
          })
        });
      }
    })
  };

  showHideList = () => {
    this.setState({
      isShowList: !this.state.isShowList
    })
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    const {channelCode} = this.props;
    const {records} = this.state;
    const formItemLayout = {labelCol: {span: 5}, wrapperCol: {span: 19}};
    return (
      <div>
        <Form onSubmit={this.handleSubmit} layout="horizontal">
          <FormItem label={"开始时间"} {...formItemLayout}>
            {getFieldDecorator('beginTime', {
              rules: [{
                required: true,
                message: "开始时间不能为空"
              }]
            })
            (<DatePicker className={css['m-t-sm']}
                         disabledDate={this.disabledStartDate}
                         showTime format="YYYY-MM-DD HH:mm:ss"
                         placeholder="请选择日期时间"/>
            )}
          </FormItem>
          <FormItem label={"结束时间"} {...formItemLayout}>
            {getFieldDecorator('endTime', {
              rules: [{
                required: true,
                message: "结束时间不能为空"
              }]
            })
            (<DatePicker disabledDate={this.disabledEndDate}
                         showTime format="YYYY-MM-DD HH:mm:ss"
                         placeholder="请选择日期时间"/>
            )}
          </FormItem>
          <FormItem label={"录像位置"} {...formItemLayout}>
            {getFieldDecorator('location', {
              rules: [{
                required: true
              }], initialValue: "cloud"
            })(
              <RadioGroup size={'small'}>
                {StrConfig.location.map((item, i) => {
                  return <Radio key={i} value={item.value}>{item.text}</Radio>
                })}
              </RadioGroup>)
            }
          </FormItem>
          {/*<FormItem label={"录像类型"} {...formItemLayout}>*/}
          {/*{getFieldDecorator('recordType',)(*/}
          {/*<RadioGroup size={'small'}>*/}
          {/*{StrConfig.recordType.map((item, i) => {*/}
          {/*return <Radio key={i} value={item.value}>{item.text}</Radio>*/}
          {/*})}*/}
          {/*</RadioGroup>)*/}
          {/*}*/}
          {/*</FormItem>*/}
          <FormItem className={css['text-center']} wrapperCol={{span: 12, offset: 6}}>
            <Button htmlType="button" onClick={this.props.closeModal}
                    className={css['m-r-md']}>取消</Button>
            <Button type="primary" htmlType="submit">确定</Button>
          </FormItem>
        </Form>
        {this.state.isShowList ?
          <RecordsModal closeModal={this.showHideList} list={records}
                        channelCode={channelCode}/> : null}
      </div>

    );
  }
}

export default Form.create()(RecordForm);

