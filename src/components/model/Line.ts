import Config from "../../config/Config";

const { vrPlanner, maps } = Config;
export default class Line {
  color: string;
  width: number;
  depthTest: boolean;
  lineStyle: string;
  style: any;
  line: any;
  vertices: any[];
  isClose: boolean;
  type: string = "";
  whethshare: boolean;

  constructor({
    depthTest = true,
    vertices = [],
    color = "#FFFFFF",
    width = 1,
    lineStyle = "flat2d",
    isClose = false,
    whethshare = false
  }) {
    this.line = new vrPlanner.Feature.Line();
    this.setLineStyle(lineStyle);
    this.setWidth(width);
    this.setColor(color);
    this.setDepthTest(depthTest);
    this.lineStyle = lineStyle;
    this.isClose = isClose;
    this.depthTest = depthTest;
    this.vertices = vertices;
    this.color = color;
    this.width = width;
    this.whethshare = whethshare;
    // for (let i = 0; i < vertices.length; i++) {
    //   let isExist = false;
    //   const vertex: any = vertices[i];
    //   const _vertices = this.line.getVertices();
    //   _vertices.forEach(item => {
    //     if (item.x() === vertex.x() && item.y() === vertex.y()) {
    //       isExist = true;
    //     }
    //   })
    //   if (!isExist) {
    //     this.line.addVertex(vertex);
    //   }
    // }
    this.vertices.forEach(item => {
      this.line.addVertex(item);
    });
  }

  /**
   * @description 添加顶点
   * @param geo vrplanner.GeoLocation
   */

  addVertex(geo: any) {
    this.vertices.push(geo);
    this.line.addVertex(geo);
  }

  setVertex(index, geo) {
    this.vertices[index] = geo;
    this.line.setVertex(index, geo);
    // this.setVerteices();
  }

  setWidth(width: number) {
    const type = this.style.getType();
    if (type === "ProjectedFeatureStyle") this.style.setLineWidth(width);
    else this.style.setWidth(width);
  }

  setLineStyle(style: string) {
    let color,
      width,
      depthTest = false;
    if (this.line.getStyle()) {
      const type = this.line.getStyle().getType();
      if (type === "ProjectedFeatureStyle") {
        color = this.line.getStyle().getLineColor();
        width = this.line.getStyle().getLineWidth();
      } else {
        color = this.line.getStyle().getColor();
        width = this.line.getStyle().getWidth();
        depthTest = this.line.getStyle().getDepthTest();
      }
    }
    if (style === "default") {
      this.style = new vrPlanner.Style.ProjectedFeatureStyle();
      // this.style.setRendering(vrPlanner.Style.ProjectedFeatureStyle.RENDERING_STENCIL)
    } else {
      this.style = new vrPlanner.Style.LineStyle();
      this.style.setAppearance(style);
    }
    this.line.setStyle(this.style);
    if (color) this.setColor(color);
    if (width) this.setWidth(width);
    this.setDepthTest(depthTest);
  }

  setDepthTest(depthTest: boolean) {
    const type = this.style.getType();
    if (type === "ProjectedFeatureStyle") return true;
    else this.style.setDepthTest(depthTest);
  }

  setColor(color: any) {
    const type = this.style.getType();
    if (type === "ProjectedFeatureStyle")
      this.style.setLineColor(
        typeof color === "string" ? new vrPlanner.Color(color) : color
      );
    else
      this.style.setColor(
        typeof color === "string" ? new vrPlanner.Color(color) : color
      );
  }

  setVerteices() {
    this.line.clearVertices();
    this.line.addVertices(this.vertices);
  }

  getVertices() {
    return this.line.getVertices();
  }

  getNumVertices() {
    return this.line.getNumVertices();
  }

  isVisible() {
    return this.line.isVisible();
  }

  setVisible(visible: boolean) {
    this.line.setVisible(visible);
  }

  removeVertex(index) {
    this.vertices.splice(index, 1);
    this.setVerteices();
  }
}
