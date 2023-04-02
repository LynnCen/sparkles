import { Component, Fragment } from "react";
import CustomMenu from "./CustomMenu";
/**
 * @name SharePage
 * @author: bubble
 * @create: 2020/04/20
 * @description: 分享轨迹页面
 */

interface ShareAnimationProps { }

interface ShareAnimationStates {
    imgList: any;
    isShowImgTips: boolean;
    picture: string;
    title: string;
}

class ShareAnimation extends Component<ShareAnimationProps, ShareAnimationStates> {
    constructor(props: ShareAnimationProps) {
        super(props);
        this.state = {
            imgList: [],
            isShowImgTips: false,
            picture: "",
            title: ""
        };
    }
    getImgList = img => {
        const { imgList, isShowImgTips } = this.state;
        if (imgList.length === 6) {
            imgList.splice(0, 1);
        }
        imgList.push(img);
        this.setState({
            imgList,
            isShowImgTips: !isShowImgTips && this.state.imgList.length === 1
        });
        //     this.showTips();
    };

    getPicture = picture => {
        this.setState({ picture });
    };

    getTitle = title => {
        this.setState({ title });
    };
    render() {
        return (
            <Fragment>

                <CustomMenu
                    url={RegExp.$1}
                    callBack={this.getImgList}
                    imgCall={this.getPicture}
                    titleCall={this.getTitle}
                />

            </Fragment>
        )
    }

}
export default ShareAnimation;