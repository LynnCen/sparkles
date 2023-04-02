

interface data {
  id: number;
  title: string;
  type: string;
  coordinate: string;
}

interface file {
  id: number;
  fileName: string;
  type: string;
  jsonUrl: string;
  coordinate: string;
}
/**
 * @description 冲淤线数据
 * @author bubble
 */
export class SectionLine {
  id: number;
  title: string;
  type: string;
  coordinate: string;
  files: any = {};
  constructor(data: data) {
    this.id = data.id;
    this.title = data.title;
    this.type = data.type;
    this.coordinate = data.coordinate;
  }

  /**
   * @description 添加子文件对象
   * @param CadFile file对象
   * @author Daryl
   */
  addFile(CadFile: ExcelFile) {
    this.files[CadFile.id] = CadFile;
  }
}

/**
 * @description 冲淤数据子文件
 * @author Daryl
 */
export class ExcelFile {
  id: number;
  fileName: string;
  type: string;
  jsonUrl: string;
  coordinate: string;
  constructor(file: file) {
    this.id = file.id;
    this.fileName = file.fileName;
    this.type = file.type;
    this.jsonUrl = file.jsonUrl;
    this.coordinate = file.coordinate;
  }
}
