import {Component} from 'react';

/**
 * @name FileReaderTool
 * @author: bubble
 * @create: 2018/10/28
 */

interface IFileReaderToolProps {
  accept: string;
  multiple: boolean;
  clickDom: React.ReactNode;
  fileData: (data) => void;
}


interface IFileReaderToolStates {

}

class FileReaderTool extends Component<IFileReaderToolProps, IFileReaderToolStates> {
  inputDom?: HTMLElement;

  constructor(props) {
    super(props);
  }


  render() {
    return (
      <div onClick={() => {
        if (this.inputDom) {
          this.inputDom.click();
        }
      }} style={{display: "inline-block"}}>
        <input type="file" style={{display: "none"}}
               accept={this.props.accept}
               multiple={this.props.multiple}
               onChange={this.props.fileData}
               ref={(inputDom) => {
                 if (inputDom) {
                   this.inputDom = inputDom
                 }
               }}/>
        {this.props.clickDom}
      </div>
    )
  }
}

export default FileReaderTool
