import { Component } from "react";
import { Cascader, message } from "antd";
import CardLayout from "../../Components/CardLayout";
import StackedColChart from "../../Components/StackedColChart";

// const css = require("../../../../styles/custom.css");
// const scss = require("../../../../styles/scss/sharepage.scss");
// let vh = px => (px / 1080) * 100 + "vh";

interface Props {
  title: string;
  enTitle: string;
  href: string;
  defaultValue: string[];
  options: Array<any>;
  levels: object;
  theme: object;
}
interface States {
  data: Array<any>;
}
export default class Evaluation extends Component<Props, States> {
  // class = [1, 1];
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }
  componentWillMount() {
    this.fetchEvaluation();
  }
  fetchEvaluation = async (senior = "", sclass = "") => {
    // await fetch(`${process.env.lizhongAPI}/User/login`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/x-www-form-urlencoded" },
    //   body: "account=huge&password=123456",
    //   credentials: "include"
    // });
    fetch(`${process.env.lizhongAPI}/Student/getList11?senior=${senior}&sclass=${sclass}`, {
      credentials: "include"
    })
      .then(res => res.json())
      .then(res => {
        console.log(res);
        if (res.data && res.data.length) {
          let r = Object.keys(this.props.levels).reduce(
            (result, key) =>
              result.concat(
                res.data.map(item => ({
                  type: this.props.levels[key],
                  x: item.subject,
                  value: item[key]
                }))
              ),
            []
          );
          this.setState({ data: r });
        }
      })
      .catch(err => {
        console.table(err);
        message.error(err.message + " 高" + senior + " " + sclass + "班");
      });
  };
  changeClass = val => this.fetchEvaluation.apply(null, val);
  render() {
    const { title, enTitle, href, options, defaultValue, theme } = this.props;
    const { data } = this.state;
    return (
      <CardLayout
        title={title}
        enTitle={enTitle}
        href={href}
        suffixIcon={
          <>
            <Cascader
              options={options}
              expandTrigger="hover"
              defaultValue={defaultValue}
              onChange={this.changeClass}
              suffixIcon={
                <span>
                  <img src={require("../../../../assets/icon/icon_xiala.png")} alt="" />
                </span>
              }
            />
          </>
        }
      >
        <StackedColChart
          data={data}
          theme={theme}
          chartPadding={[10, 10, 60, 30]}
          chartHeight={250}
          legend={{ offsetY: -7 }}
          showPercent={false}
          geomLabel={false}
        />
      </CardLayout>
    );
  }
}
