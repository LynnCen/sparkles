import { CSSProperties, useState, useEffect } from "react";
import { Spin, Modal, Select, Radio, Table } from "antd";
import CardLayout from "../../Components/CardLayout";
import moment from "moment";
const scss = require("../../../../styles/scss/sharepage.scss");

let vh = px => (px / 1080) * 100 + "vh";

interface Props {
  title: string;
  enTitle: string;
  datePicker?: boolean;
  data: Array<any>;
  columns: object;
  style?: CSSProperties;
  className?: string;
}

const pageSize = 10;
const dateFormat = "YYYY-MM-DD";
export default function Attendance({ title, enTitle, data, columns }: Props) {
  const [_data, setData] = useState(data);
  const [loadings, setLoadings] = useState([false, false, false]);
  const [modalProps, setModalProps] = useState({
    title: "",
    visible: false,
    url: ""
  });
  const [dormList, setDormList] = useState([]);
  const [dormId, setDormId] = useState("");
  const [dataSource, setDataSource] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, current: 1 });
  const [loading, setLoading] = useState(true);

  const getStuSignProfile = () => {
    const hour = new Date().getHours();
    let time1 = moment()
      .hours(20)
      .minutes(0)
      .seconds(0);
    let time2 = moment()
      .hours(23)
      .minutes(0)
      .seconds(0);
    if (hour < 23) {
      time1.subtract(1, "day");
      time2.subtract(1, "day");
    }
    // let url = "http://192.168.0.52/dcms/ui/record/stuSignProfile";
    setLoadings(loadings.map((e, i) => (i != 2 ? e : true)));
    fetch(`${process.env.lizhongProxy}/dcms/ui/record/stuSignProfile`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        startDate: moment()
          .subtract(1, "day")
          .format(dateFormat),
        endDate: moment().format(dateFormat)
      })
    })
      // fetch(
      //   `${process.env.lizhongAPI}/Student/getCheckWorkTimes?time1=${time1.format(
      //     format
      //   )}&time2=${time2.format(format)}&type=1`
      // )
      .then(res => res.json())
      .then(res => {
        if (res.data) {
          const abnormalNum = res.data.data.dormStudentAbnormalBos.reduce(
            (r, c) => (r += c.studentAbnormalNum),
            0
          );
          setData(data.map((item, i) => (i != 2 ? item : { ...item, value: abnormalNum })));
          setLoadings(loadings.map((e, i) => (i != 4 ? e : false)));
        }
      })
      .catch(e => console.error(e));
  };

  useEffect(() => {
    getStuSignProfile();
  }, []);

  const showModal = (item, i) => {
    console.log(item);
    switch (i) {
      case 0:
        break;
      case 1:
        break;
      case 2:
        setModalProps({
          ...modalProps,
          visible: true,
          title: item.name
        });
        getDormList();
        break;
    }
  };
  const onRadioChange = e => {
    console.log(`radio checked:${e.target.value}`);
    setDormId(e.target.value);
    setPagination({ total: 0, current: 1 });
    getAttendancePage(e.target.value);
  };

  const getDormList = () => {
    fetch(`${process.env.lizhongProxy}/dcms/ui/dorm/list?dormId=area000000`)
      .then(res => res.json())
      .then(res => {
        setDormList(res.data.data);
        getAttendancePage(res.data.data[0].dormId);
        setDormId(res.data.data[0].dormId);
      })
      .catch(err => {
        console.table(err);
      });
  };

  const getAttendancePage = (dormId, pageNum = 1) => {
    setLoading(true);
    const lastDate = moment()
      .subtract(1, "day")
      .format("YYYY-MM-DD");
    const data = {
      attendStatus: -1,
      dormId,
      endDate: lastDate,
      pageNum,
      pageSize,
      startDate: lastDate
    };
    fetch(`${process.env.lizhongProxy}/dcms/ui/record/attendancePage`, {
      method: "post",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(res => {
        setLoading(false);
        setDataSource(res.data.data.records);
        setPagination({ total: res.data.data.total });
      })
      .catch(err => {
        console.table(err);
      });
  };
  const onTableChange = (pager, filters, sorter) => {
    pagination.current = pager.current;
    setPagination(pagination);
    getAttendancePage(dormId, pager.current);
  };

  return (
    <>
      <CardLayout
        title={title}
        enTitle={enTitle}
        style={{ marginBottom: vh(25) }}
        className={scss["pe-auto"] + " "}
      >
        <div className={scss["flex-center-around"]} style={{ flexWrap: "wrap" }}>
          {_data.map((item, i) => (
            <div
              className={scss["item"] + " " + scss["center"]}
              style={{ cursor: i < 2 ? "" : "pointer" }}
              key={i}
              onClick={e => showModal(item, i)}
            >
              <img src={item.icon} />
              <h4>{item.name}</h4>
              <Spin spinning={loadings[i]}>
                <h2 style={{ color: "white" }}>{item.value}</h2>
              </Spin>
            </div>
          ))}
        </div>
      </CardLayout>
      <Modal
        {...modalProps}
        footer={null}
        centered
        destroyOnClose={true}
        // forceRender={true}
        onCancel={e => {
          setModalProps({ ...modalProps, visible: false });
        }}
        className={scss["campus-modal"]}
      >
        <div
        // style={{
        //   height: "400px"
        // }}
        >
          <div className={scss["flex-center"]} style={{ marginTop: "12px" }}>
            {dormList.length ? (
              <Radio.Group
                defaultValue={dormList[0].dormId}
                buttonStyle="solid"
                dormId={dormId}
                onChange={onRadioChange}
              >
                {dormList.map((item, i) => (
                  <Radio.Button value={item.dormId}>{item.dormName}</Radio.Button>
                ))}
              </Radio.Group>
            ) : null}
          </div>
          <div style={{ margin: "12px" }}>
            <Table
              pagination={pagination}
              onChange={onTableChange}
              columns={Object.keys(columns).map(key => ({
                title: columns[key],
                dataIndex: key,
                key,
                render: text => (key == "dormPath" ? text.substr(text.indexOf("/") + 1) : text)
              }))}
              align="center"
              dataSource={dataSource}
              loading={loading}
            />
          </div>
        </div>
      </Modal>
    </>
  );
}
