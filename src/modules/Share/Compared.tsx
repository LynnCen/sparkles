import { Component } from "react";
import Config from "../../config/Config";

interface ComparedProps { }

interface ComparedStates { }
class Compared extends Component<ComparedProps, ComparedStates> {
  constructor(props: ComparedProps) {
    super(props);
    this.state = {};
  }
  handleClick = () => {
    // const container: any = document.getElementById("map_container");
    // const canvas = container.children[1];
    // const balloon_container: any = document.getElementById("balloon-container");
    // canvas.style.display = "none";
    // if (balloon_container) balloon_container.style.display = "none";
    // const iframe = document.createElement("iframe");
    // iframe.src = "/test.html";
    // iframe.frameBorder = "no";
    // iframe.style.position = "absolute";
    // iframe.style.top = "0px";
    // iframe.style.zIndex = "-1";
    // container.appendChild(iframe)

    const maps = new Config.vrPlanner("maps");
  };
  render() {
    return (
      <div
        style={{
          position: "absolute",
          width: "50px",
          height: "50px",
          left: "600px",
          top: "300px",
          backgroundColor: "rgba(0,0,0,0.8)",
          zIndex: 123123,
          pointerEvents: "all"
        }}
        onClick={this.handleClick}
      ></div>
    );
  }
}
export default Compared;
