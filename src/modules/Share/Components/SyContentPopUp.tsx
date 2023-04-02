import React, { Component } from 'react';
import { UniversalDom } from './SyMapComponent'
import SyShutDown from '../../../assets/syShutDown.svg'
import Prev from '../../../assets/prev.svg'
import Next from '../../../assets/next.svg'
import ContentImage1 from '../../../assets/content1.svg'
import ContentImage2 from '../../../assets/content2.svg'
import ContentImage3 from '../../../assets/content3.svg'
import ContentImage4 from '../../../assets/content4.svg'
import ContentImage5 from '../../../assets/content5.svg'
import ContentImage6 from '../../../assets/content6.svg'
import ContentImage7 from '../../../assets/content7.svg'
import ContentImage8 from '../../../assets/content8.svg'
import ContentImage9 from '../../../assets/content9.svg'
import ContentImage10 from '../../../assets/content10.svg'
import ContentImage11 from '../../../assets/content11.svg'
import ContentImage12 from '../../../assets/content12.svg'
import ContentImage13 from '../../../assets/content13.svg'
import ContentImage14 from '../../../assets/content14.svg'

const scss = require("../../../styles/scss/sharepage.scss");
let rem = px => px + 'rem'



interface Props {
    listKey: string;
    data: any;
    changeVisible: (key) => void
}

interface State {
    labelsKey: number
}

class SyContentPopUp extends Component<Props, State> {

    constructor(props) {
        super(props);
        this.state = {
            labelsKey: 0
        }
    }

    changeLabelKey = (value) => {
        this.setState({
            labelsKey: value
        })
    }

    paginationPrev = () => {
        const { labelsKey } = this.state
        if (labelsKey - 1 == -1) {
            this.setState({
                labelsKey: 0
            })
        }
        else {
            this.setState({
                labelsKey: labelsKey - 1
            })
        }
    }

    paginationNext = () => {
        const { labelsKey } = this.state
        if (labelsKey + 1 == 5) {
            this.setState({
                labelsKey: 4
            })
        }
        else {
            this.setState({
                labelsKey: labelsKey + 1
            })
        }

    }

    render() {
        const { listKey, data, changeVisible } = this.props
        const { labelsKey } = this.state
        const titleList = {
            "1": "人员信息",
            "3": "党员",
        }
        const paginationList = {
            "1": ["家庭信息", "成员信息", "低保信息", "上访记录", "走访记录"],
            "3": ["党员信息", "党员联系情况"]
        }
        const PersonnelList = {
            0: <Personnel1 data={data} />,
            1: <Personnel2 data={data} />,
            2: <Personnel3 data={data} />,
            3: <Personnel4 data={data} />,
            4: <Personnel5 data={data} />,
        }
        const organizationList = {
            0: <Organization1 data={data} />,
            1: <Organization2 data={data} />
        }
        return (
            <div className={scss['sy-content-popup']}>
                <div className={scss['sy-content-popup-head']}>
                    <div>{titleList[listKey]}</div>
                    <img src={SyShutDown} onClick={() => changeVisible(false)} alt="" />
                </div>
                <Pagination
                    data={paginationList[listKey]}
                    labelsKey={labelsKey}
                    changeLabelKey={this.changeLabelKey}
                    paginationPrev={this.paginationPrev}
                    paginationNext={this.paginationNext}
                    listKey={listKey}
                />
                <div>
                    {
                        listKey == "1" ? <>{PersonnelList[labelsKey]}</> : <>
                            {organizationList[labelsKey]}
                        </>
                    }
                </div>
            </div>
        );
    }
}

export default SyContentPopUp;

const Pagination = ({ data, changeLabelKey, labelsKey, paginationPrev, paginationNext, listKey }) => {
    return <div className={scss['sy-content-popup-pagination']}>
        {listKey == "1" &&
            <img src={Prev} onClick={paginationPrev} alt="" />
        }
        <div className={scss['sy-pagination-list'] + " " + (listKey == "3" && scss['sy-organization-list'])}>
            {
                data.map((r, i) => {
                    return <div onClick={() => changeLabelKey(i)} key={i} className={i == labelsKey && scss['selected']}>{r}</div>
                })
            }
        </div>
        {listKey == "1" &&
            <img src={Next} onClick={paginationNext} alt="" />
        }
    </div>
}

const Personnel1 = ({ data }) => {
    return <div>
        <UniversalDom title={"家庭基本信息"} >
            <div style={{ display: 'flex', justifyContent: "space-between" }}>
                <div>
                    <div className={scss['content-text-left']}>
                        <div>户主名称: </div>
                        <div>{data.data.name || ""}</div>
                    </div>
                    <div className={scss['content-text-left']}>
                        <div>户号: </div>
                        <div>{data.data.residenceNum || ""}</div>
                    </div>
                    <div className={scss['content-text-left']}>
                        <div>户主身份证号码: </div>
                        <div>{data.data.idCard || ""}</div>
                    </div>
                    <div className={scss['content-text-left']}>
                        <div>家庭住址: </div>
                        <div>{data.data.address || ""}</div>
                    </div>
                    <div className={scss['content-text-left']}>
                        <div>住宅电话: </div>
                        <div>{data.data.homePhone || ""}</div>
                    </div>
                    <div className={scss['content-text-left']}>
                        <div>家庭住房状况: </div>
                        <div>{data.data.houseStatus || ""}</div>
                    </div>
                    <div className={scss['content-text-left']}>
                        <div>是否隐患点: </div>
                        <div>{data.data.isDanger || ""}</div>
                    </div>
                    <div className={scss['content-text-left']}>
                        <div>住房用途: </div>
                        <div>{data.data.houseUse || ""}</div>
                    </div>
                </div>
                <div>
                    <div className={scss['content-text-right']}>
                        <div>所属网格: </div>
                        <div>{data.data.grid || ""}</div>
                    </div>
                    <div className={scss['content-text-right']}>
                        <div>户类型: </div>
                        <div>{data.data.residenceType || ""}</div>
                    </div>
                    <div className={scss['content-text-right']}>
                        <div>家庭人口数: </div>
                        <div>{data.data.familyCount || ""}</div>
                    </div>
                    <div className={scss['content-text-right']}>
                        <div>村民小组: </div>
                        <div></div>
                    </div>
                    <div className={scss['content-text-right']}>
                        <div>住房性质: </div>
                        <div>{data.data.houseProperties || ""}</div>
                    </div>
                    <div className={scss['content-text-right']}>
                        <div>机动车类型车牌号码: </div>
                        <div>{data.data.carNum || ""}</div>
                    </div>
                    <div className={scss['content-text-right']}>
                        <div>困难原因: </div>
                        <div>{data.data.lowIncome || ""}</div>
                    </div>
                    <div className={scss['content-text-right']}>
                        <div>住房来源: </div>
                        <div>{data.data.houseSource || ""}</div>
                    </div>
                </div>
            </div>
        </UniversalDom>
        <UniversalDom title={'产业发展信息'} >
            <img src={ContentImage1} style={{ width: `${rem(5.3961)}`, margin: `${rem(0.24)} 0 ${rem(0.30)} ${rem(0.18)}` }} alt="" />
        </UniversalDom>
        <UniversalDom title={"家庭类型"} >
            <img src={ContentImage2} style={{ width: `${rem(5.3284)}`, margin: `${rem(0.30)} 0 0 ${rem(0.30)}` }} alt="" />
        </UniversalDom>
    </div>
}
const Personnel2 = ({ data }) => {
    return <div>
        <UniversalDom title={"成员列表"} >
            <img src={ContentImage3} style={{ width: `${rem(7.0629)}`, margin: `${rem(0.19)} 0 ${rem(0.42)} 0` }} alt="" />
        </UniversalDom>
        <UniversalDom title={'人员信息'} >
            <img src={ContentImage4} style={{ width: `${rem(6.79)}`, margin: `0 ${rem(0.10)}` }} alt="" />
        </UniversalDom>
    </div>
}
const Personnel3 = ({ data }) => {
    return <div>
        <UniversalDom title={"申请人信息"} >
            <img src={ContentImage5} style={{ width: `${rem(7.0069)}`, margin: `${rem(0.27)} 0 ${rem(0.46)}` }} alt="" />
        </UniversalDom>
        <UniversalDom title={'家庭成员1'} >
            <img src={ContentImage6} style={{ width: `${rem(6.9682)}` }} alt="" />
        </UniversalDom>
    </div>
}
const Personnel4 = ({ data }) => {
    return <div>
        <UniversalDom title={"上访记录1"} >
            <img src={ContentImage7} style={{ width: `${rem(5.4202)}`, marginLeft: `${rem(0.20)}` }} alt="" />
        </UniversalDom>
    </div>
}
const Personnel5 = ({ data }) => {
    return <div>
        <UniversalDom title={"走访记录1"} >
            <img src={ContentImage8} style={{ width: `${rem(6.5054)}` }} alt="" />
        </UniversalDom>
    </div>
}

const Organization1 = ({ data }) => {
    return <div>
        <UniversalDom title={"个人基本信息"}>
            <div style={{ width: `${rem(6.57)}`, display: 'flex', justifyContent: "space-between" }}>
                <div>
                    <div className={scss['organization-text-left']}>
                        <div>姓名: </div>
                        <div>{data.data.name || ""}</div>
                    </div>
                    <div className={scss['organization-text-left']}>
                        <div>年龄: </div>
                        <div>{data.data.age || ""}</div>
                    </div>
                    <div className={scss['organization-text-left']}>
                        <div>出生日期: </div>
                        <div>{data.data.birthday || ""}</div>
                    </div>
                    <div className={scss['organization-text-left']}>
                        <div>学历: </div>
                        <div>{data.data.education || ""}</div>
                    </div>
                    <div className={scss['organization-text-left']}>
                        <div>是否流动: </div>
                        <div>{data.data.isFlow || ""}</div>
                    </div>
                </div>
                <div>
                    <div className={scss['organization-text-right']}>
                        <div>性别: </div>
                        <div>{data.data.sex || ""}</div>
                    </div>
                    <div className={scss['organization-text-right']}>
                        <div>身份证号: </div>
                        <div>{data.data.idCard || ""}</div>
                    </div>
                    <div className={scss['organization-text-right']}>
                        <div>民族: </div>
                        <div>{data.data.nation || ""}</div>
                    </div>
                    <div className={scss['organization-text-right']}>
                        <div>联系电话: </div>
                        <div>{data.data.phone || ""}</div>
                    </div>
                    <div className={scss['organization-text-right']}>
                        <div>家庭住址: </div>
                        <div></div>
                    </div>
                </div>
            </div>
        </UniversalDom>
        <UniversalDom title={"在党信息"}>
            <img src={ContentImage10} style={{ width: `${rem(5.5)}`, margin: `${rem(0.26)} 0 ${rem(0.24)} ${rem(0.22)}` }} alt="" />
        </UniversalDom>
        <UniversalDom title={"惩处情况"}>
            <img src={ContentImage11} style={{ width: `${rem(7)}`, margin: `${rem(0.22)} 0` }} alt="" />
        </UniversalDom>
        <UniversalDom title={"个人基本信息"}>
            <img src={ContentImage12} style={{ width: `${rem(7)}`, margin: `${rem(0.21)} 0 ` }} alt="" />
        </UniversalDom>
    </div>
}
const Organization2 = ({ data }) => {
    return <div>
        <UniversalDom title={"联系户列表"}>
            <img src={ContentImage13} style={{ width: `${rem(6.8)}`, margin: `${rem(0.27)} 0 ${rem(0.19)}` }} alt="" />
        </UniversalDom>
        <UniversalDom title={"走访分析"}>
            <img src={ContentImage14} style={{ width: `${rem(6.7)}`, marginLeft: `${rem(0.15)}` }} alt="" />
        </UniversalDom>
    </div>
}
