/**
 * @description 标签属性修改
 */
export interface UpdateBalloon {
    id: number;
    title: string;
    color: string;
    titleVisible: boolean;
    iconVisible: boolean;
    altitude: number;
    fontSize: number;
    imageUrl: string;
    contentId?: number[];
    whethshare: boolean;
    bottom: number;
}
/**
 * @description 本地初始标签和模型
 */
export interface initialUrl {
    modelUrl: string,
    modelImg: string,
    balloonIcon: string,
}