import {Component} from "react";
import {message} from 'antd';

interface ErrorProps {
  msgContent?: string;
}

interface ErrorStates {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<ErrorProps, ErrorStates> {
  constructor(props) {
    super(props);
    this.state = {hasError: false}
  }

  componentDidCatch(error, info) {
    this.setState({hasError: true});
    const defaultMsg = "该功能出错了，请联系技术人员。";
    const {msgContent} = this.props;
    message.warning(msgContent ? msgContent : defaultMsg);
  }

  render() {
    if (this.state.hasError) {
      return null
    }
    return this.props.children
  }
}
