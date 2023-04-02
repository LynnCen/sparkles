import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import SyShutDown from '../../../assets/syShutDown.svg'
import SyContentPopUp from './SyContentPopUp'
import Config from '../../../config/Config';

const scss = require("../../../styles/scss/sharepage.scss");

interface Props {
    data: any;
    changeContentPopupVisible: (key, value) => void;
    changePopupVisible: (key) => void
}

interface States {

}

class SyPopup extends Component<Props, States> {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {

    }

    render() {
        const { data } = this.props;
        const ContentList = {
            "村办公楼": <Module1Style1 data={data} />,
            "居家养老服务中心": <Module1Style2 data={data} />,
            "居民住宅": <Module1Style3 data={data} changeContentPopupVisible={this.props.changeContentPopupVisible} />,
            "农产品加工商": <Module2Style1 data={data} />,
            "合作社": <Module2Style2 data={data} />,
            "民宿": <Module2Style3 data={data} />,
            "乡贤": <Module3Style1 data={data} changeContentPopupVisible={this.props.changeContentPopupVisible} />,
            "村监会主任": <Module3Style1 data={data} changeContentPopupVisible={this.props.changeContentPopupVisible} />,
            "妇联主席": <Module3Style1 data={data} changeContentPopupVisible={this.props.changeContentPopupVisible} />,
            "村调主任": <Module3Style1 data={data} changeContentPopupVisible={this.props.changeContentPopupVisible} />,
            "团委书记": <Module3Style1 data={data} changeContentPopupVisible={this.props.changeContentPopupVisible} />,
            "护林员": <Module3Style1 data={data} changeContentPopupVisible={this.props.changeContentPopupVisible} />,
            "网格员": <Module3Style1 data={data} changeContentPopupVisible={this.props.changeContentPopupVisible} />,
            "书记": <Module3Style1 data={data} changeContentPopupVisible={this.props.changeContentPopupVisible} />,
            "党员": <Module3Style2 data={data} changeContentPopupVisible={this.props.changeContentPopupVisible} />,
            "低保户": <Module4Style1 data={data} changeContentPopupVisible={this.props.changeContentPopupVisible} />,
            "低收入边缘户": <Module4Style2 data={data} changeContentPopupVisible={this.props.changeContentPopupVisible} />,
            "残疾人员": <Module4Style3 data={data} changeContentPopupVisible={this.props.changeContentPopupVisible} />,
            "精神障碍人员": <Module5Style1 data={data} changeContentPopupVisible={this.props.changeContentPopupVisible} />,
        }
        return (
            <div className={scss['sy-popup']}>
                <div className={scss['sy-popup-title']}>
                    <div>{data.name + "信息"}</div>
                    <img onClick={() => {
                        this.props.changePopupVisible(false)
                        // data.showBalloonData()
                        // let layer = Config.maps.getLayerById("helpLayer");
                        // if (layer)
                        //     layer.clearFeatures();
                        // ReactDOM.render(<></>, document.getElementById('syContentDom'))
                    }} src={SyShutDown} alt="" />
                </div>
                {
                    ContentList[data.name]
                }
            </div>
        );
    }
}

export default SyPopup;

export const Module1Style1 = ({ data }) => {
    return <div className={scss['sy-popup-content']}>
        <div className={scss['sy-popup-content-text']}>
            <div>详细地址:</div>
            <span>{data.data.address || ""}</span>
        </div>
    </div>
}

export const Module1Style2 = ({ data }) => {
    return <div className={scss['sy-popup-content']}>
        <div className={scss['sy-popup-content-text']}>
            <div>详细地址:</div>
            <span>{data.data.address || ""}</span>
        </div>
        <div className={scss['sy-popup-content-text']}>
            <div>服务项目:</div>
            <span>{data.data.introduction || ""}</span>
        </div>
    </div>
}

export const Module1Style3 = ({ data, changeContentPopupVisible }) => {
    return <>
        <div className={scss['sy-popup-content']}>
            <div className={scss['sy-popup-content-text']}>
                <div>所属网格:</div>
                <span>{data.data.grid || ""}</span>
            </div>
            <div className={scss['sy-popup-content-text-box']}>
                <div className={scss['sy-popup-content-text']}>
                    <div>户主姓名:</div>
                    <span>{data.data.name}</span>
                </div>
                <div className={scss['sy-popup-content-text']}>
                    <div>户号:</div>
                    <span>{data.data.residenceNum || ""}</span>
                </div>
            </div>
            <div className={scss['sy-popup-content-text-box']}>
                <div className={scss['sy-popup-content-text']}>
                    <div>联系电话:</div>
                    <span>{data.data.homePhone || ""}</span>
                </div>
                <div className={scss['sy-popup-content-text']}>
                    <div>家庭人数:</div>
                    <span>{data.data.familyCount || ""}</span>
                </div>
            </div>
            <div className={scss['sy-popup-content-text']}>
                <div>身份证号:</div>
                <span>{data.data.idCard || ""}</span>
            </div>
            <div className={scss['sy-popup-content-text']}>
                <div>户籍详址:</div>
                <span>{data.data.address || ""}</span>
            </div>
        </div>
        <div className={scss['sy-popup-button']}
            onClick={() => changeContentPopupVisible(true, '1')}
        >
            查看详情
        </div>
    </>
}

export const Module2Style1 = ({ data }) => {
    return <div></div>
}
export const Module2Style2 = ({ data }) => {
    return <div className={scss['sy-popup-content']}>
        <div className={scss['sy-popup-content-text-box'] + " " + scss['text-box-style2']}>
            <div className={scss['sy-popup-content-text']}>
                <div>合作社名称:</div>
                <span></span>
            </div>
            <div className={scss['sy-popup-content-text']}>
                <div>合作社生产类型:</div>
                <span>{data.data.name || ""}</span>
            </div>
        </div>
        <div className={scss['sy-popup-content-text-box'] + " " + scss['text-box-style2']}>
            <div className={scss['sy-popup-content-text']}>
                <div>法人类型:</div>
                <span>农民</span>
            </div>
            <div className={scss['sy-popup-content-text']}>
                <div>法人:</div>
                <span>{data.data.legalPerson || ""}</span>
            </div>
        </div>
        <div className={scss['sy-popup-content-text-box'] + " " + scss['text-box-style2']}>
            <div className={scss['sy-popup-content-text']}>
                <div>经营服务内容:</div>
                <span>{data.data.content || ""}</span>
            </div>
            <div className={scss['sy-popup-content-text']}>
                <div>营业执照编号:</div>
                <span></span>
            </div>
        </div>
        <div className={scss['sy-popup-content-text-box'] + " " + scss['text-box-style2']}>
            <div className={scss['sy-popup-content-text']}>
                <div>是否年审:</div>
                <span>{data.data.isExamined || ""}</span>
            </div>
            <div className={scss['sy-popup-content-text']}>
                <div>联系电话:</div>
                <span>{data.data.phone || ""}</span>
            </div>
        </div>
        <div className={scss['sy-popup-content-text']}>
            <div>地址:</div>
            <span></span>
        </div>
        <div className={scss['sy-popup-content-text-box'] + " " + scss['text-box-style2']}>
            <div className={scss['sy-popup-content-text']}>
                <div>总收入:</div>
                <span>{data.data.totalIncome || ""}</span>
            </div>
            <div className={scss['sy-popup-content-text']}>
                <div>总支出:</div>
                <span>{data.data.totalOut || ""}</span>
            </div>
        </div>
    </div>
}
export const Module2Style3 = ({ data }) => {
    return <>
        <div className={scss['sy-popup-content']}>
            <div className={scss['sy-popup-content-text']}>
                <div>民宿名称:</div>
                <span>{data.data.name || ""}</span>
            </div>
            <div className={scss['sy-popup-content-text']}>
                <div>具体地址:</div>
                <span>{data.data.location || ""}</span>
            </div>
            <div className={scss['sy-popup-content-text']}>
                <div>营业执照:</div>
                <span>{data.data.planDataId || ""}</span>
            </div>
            <div className={scss['sy-popup-content-text']}>
                <div>获取时间:</div>
                <span>{data.data.licenseDate || ""}</span>
            </div>
            <div className={scss['sy-popup-content-text-box'] + " " + scss['text-box-style2']}>
                <div className={scss['sy-popup-content-text']}>
                    <div>联系人:</div>
                    <span>{data.data.contactsName || ""}</span>
                </div>
                <div className={scss['sy-popup-content-text']}>
                    <div>联系电话:</div>
                    <span>{data.data.contactsPhone || ""}</span>
                </div>
            </div>
            <div className={scss['sy-popup-content-text-box'] + " " + scss['text-box-style2']}>
                <div className={scss['sy-popup-content-text']}>
                    <div>餐位(个):</div>
                    <span>{data.data.tableCount || ""}</span>
                </div>
                <div className={scss['sy-popup-content-text']}>
                    <div>床位(个):</div>
                    <span>{data.data.bedCount || ""}</span>
                </div>
            </div>
        </div>
    </>
}

export const Module3Style1 = ({ data, changeContentPopupVisible }) => {
    return <>
        <div className={scss['sy-popup-content']}>
            <div className={scss['sy-popup-content-text-box'] + " " + scss['text-box-style3']}>
                <div className={scss['sy-popup-content-text']}>
                    <div>姓名:</div>
                    <span>{data.data.name}</span>
                </div>
                <div className={scss['sy-popup-content-text']}>
                    <div>年龄:</div>
                    <span>{data.data.age || ""}</span>
                </div>
            </div>
            <div className={scss['sy-popup-content-text-box'] + " " + scss['text-box-style3']}>
                <div className={scss['sy-popup-content-text']}>
                    <div>民族:</div>
                    <span>{data.data.nation || ""}</span>
                </div>
                <div className={scss['sy-popup-content-text']}>
                    <div>性别:</div>
                    <span>{data.data.sex || ""}</span>
                </div>
            </div>
            <div className={scss['sy-popup-content-text']}>
                <div>身份证号:</div>
                <span>{data.data.idCard || ""}</span>
            </div>
            <div className={scss['sy-popup-content-text']}>
                <div>联系电话:</div>
                <span>{data.data.phone || ""}</span>
            </div>
        </div>
        <div className={scss['sy-popup-button']}
            onClick={() => changeContentPopupVisible(true, '1')}
        >
            查看详情
        </div>
    </>
}

export const Module3Style2 = ({ data, changeContentPopupVisible }) => {
    return <>
        <div className={scss['sy-popup-content']}>
            <div className={scss['sy-popup-content-text-box'] + " " + scss['text-box-style3']}>
                <div className={scss['sy-popup-content-text']}>
                    <div>姓名:</div>
                    <span>{data.data.name}</span>
                </div>
                <div className={scss['sy-popup-content-text']}>
                    <div>年龄:</div>
                    <span>{data.data.age || ""}</span>
                </div>
            </div>
            <div className={scss['sy-popup-content-text-box'] + " " + scss['text-box-style3']}>
                <div className={scss['sy-popup-content-text']}>
                    <div>入党时间:</div>
                    <span>{data.data.joinPartyDate || ""}</span>
                </div>
                <div className={scss['sy-popup-content-text']}>
                    <div>现任职务:</div>
                    <span>{data.data.duties || ""}</span>
                </div>
            </div>
            <div className={scss['sy-popup-content-text-box'] + " " + scss['text-box-style3']}>
                <div className={scss['sy-popup-content-text']}>
                    <div>联系电话:</div>
                    <span>{data.data.phone || ""}</span>
                </div>
                <div className={scss['sy-popup-content-text']}>
                    <div>所属支部:</div>
                    <span>{data.data.belongTo || ""}</span>
                </div>
            </div>
            <div className={scss['sy-popup-content-text']}>
                <div>身份证号:</div>
                <span>{data.data.idCard || ""}</span>
            </div>
            <div className={scss['sy-popup-content-text']}>
                <div>户籍详址:</div>
                <span></span>
            </div>
        </div>
        <div className={scss['sy-popup-button-box']}>
            <div className={scss['sy-popup-button']}
                onClick={() => changeContentPopupVisible(true, '3')}
            >
                查看党员信息
             </div>
            <div className={scss['sy-popup-button']}
                onClick={() => changeContentPopupVisible(true, '1')}
            >
                查看个人详情
             </div>
        </div>
    </>
}

export const Module4Style1 = ({ data, changeContentPopupVisible }) => {
    return <>
        <div className={scss['sy-popup-content']}>
            <div className={scss['sy-popup-content-text-box'] + " " + scss['text-box-style3']}>
                <div className={scss['sy-popup-content-text']}>
                    <div>户主:</div>
                    <span>{data.data.name}</span>
                </div>
                <div className={scss['sy-popup-content-text']}>
                    <div>致贫原因:</div>
                    <span>{data.data.poorReason || ""}</span>
                </div>
            </div>
            <div className={scss['sy-popup-content-text']}>
                <div>身份证号:</div>
                <span>{data.data.idCard || ""}</span>
            </div>
            <div className={scss['sy-popup-content-text-box'] + " " + scss['text-box-style3']}>
                <div className={scss['sy-popup-content-text']}>
                    <div>家庭人口数:</div>
                    <span>{data.data.familyCount || ""}</span>
                </div>
                <div className={scss['sy-popup-content-text']}>
                    <div>2020年低保金:</div>
                    <span></span>
                </div>
            </div>

            <div className={scss['sy-popup-content-text']}>
                <div>居住地地址:</div>
                <span>{data.data.address || ""}</span>
            </div>
        </div>
        <div className={scss['sy-popup-button']}
            onClick={() => changeContentPopupVisible(true, '1')}
        >
            查看详情
        </div>
    </>
}
export const Module4Style2 = ({ data, changeContentPopupVisible }) => {
    return <>
        <div className={scss['sy-popup-content']}>
            <div className={scss['sy-popup-content-text-box'] + " " + scss['text-box-style3']}>
                <div className={scss['sy-popup-content-text']}>
                    <div>户主:</div>
                    <span>{data.data.name}</span>
                </div>
                <div className={scss['sy-popup-content-text']}>
                    <div>家庭人口数:</div>
                    <span>{data.data.familyCount || ""}</span>
                </div>
            </div>
            <div className={scss['sy-popup-content-text']}>
                <div>致贫原因:</div>
                <span>{data.data.poorReason || ""}</span>
            </div>
            <div className={scss['sy-popup-content-text']}>
                <div>身份证号:</div>
                <span>{data.data.idCard || ""}</span>
            </div>
            <div className={scss['sy-popup-content-text']}>
                <div>2020总收入(元):</div>
                <span></span>
            </div>
            <div className={scss['sy-popup-content-text']}>
                <div>2020总支出(元):</div>
                <span></span>
            </div>
        </div>
        <div className={scss['sy-popup-button']}
            onClick={() => changeContentPopupVisible(true, '1')}
        >
            查看详情
        </div>
    </>
}
export const Module4Style3 = ({ data, changeContentPopupVisible }) => {
    return <>
        <div className={scss['sy-popup-content']}>
            <div className={scss['sy-popup-content-text-box'] + " " + scss['text-box-style3']}>
                <div className={scss['sy-popup-content-text']}>
                    <div>姓名:</div>
                    <span>{data.data.name}</span>
                </div>
                <div className={scss['sy-popup-content-text']}>
                    <div>残疾等级:</div>
                    <span>{data.data.disabilityLevel || ""}</span>
                </div>
            </div>
            <div className={scss['sy-popup-content-text']}>
                <div>残疾类别:</div>
                <span>{data.data.disabilityType || ""}</span>
            </div>
            <div className={scss['sy-popup-content-text']}>
                <div>残疾证号:</div>
                <span>{data.data.disabilityCardnum || ""}</span>
            </div>
            <div className={scss['sy-popup-content-text']}>
                <div>身份证号:</div>
                <span>{data.data.idCard || ""}</span>
            </div>
            <div className={scss['sy-popup-content-text']}>
                <div>现住址:</div>
                <span>{data.data.addressNow || ""}</span>
            </div>
        </div>
        <div className={scss['sy-popup-button']}
            onClick={() => changeContentPopupVisible(true, '1')}
        >
            查看详情
        </div>
    </>
}

export const Module5Style1 = ({ data, changeContentPopupVisible }) => {
    return <>
        <div className={scss['sy-popup-content']}>
            <div className={scss['sy-popup-content-text-box'] + " " + scss['text-box-style3']}>
                <div className={scss['sy-popup-content-text']}>
                    <div>姓名:</div>
                    <span>{data.data.name}</span>
                </div>
                <div className={scss['sy-popup-content-text']}>
                    <div>确诊日期:</div>
                    <span>{data.data.diagnosisYear || ""}</span>
                </div>
            </div>
            <div className={scss['sy-popup-content-text']}>
                <div>患者身份证号:</div>
                <span>{data.data.idCard || ""}</span>
            </div>
            <div className={scss['sy-popup-content-text-box'] + " " + scss['text-box-style3']}>
                <div className={scss['sy-popup-content-text']}>
                    <div>服药依从性:</div>
                    <span>{data.data.medicineCompliance ? "是" : "否"}</span>
                </div>
                <div className={scss['sy-popup-content-text']}>
                    <div>是否享受大病救助:</div>
                    <span>{data.data.seriousIllness ? "是" : "否"}</span>
                </div>
            </div>
            <div className={scss['sy-popup-content-text-box'] + " " + scss['text-box-style3']}>
                <div className={scss['sy-popup-content-text']}>
                    <div>监护人:</div>
                    <span>{data.data.guardian || ""}</span>
                </div>
                <div className={scss['sy-popup-content-text']}>
                    <div>联系人电话:</div>
                    <span>{data.data.guardianPhone || ""}</span>
                </div>
            </div>
            <div className={scss['sy-popup-content-text']}>
                <div>监护人地址:</div>
                <span>{data.data.guardianAddr || ""}</span>
            </div>
        </div>
        <div className={scss['sy-popup-button']}
            onClick={() => changeContentPopupVisible(true, '1')}
        >
            查看详情
        </div>
    </>
}