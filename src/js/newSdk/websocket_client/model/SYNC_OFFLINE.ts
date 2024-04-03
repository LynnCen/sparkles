/**
 * @Author Pull
 * @Date 2021-08-28 17:40
 * @project SYNC_OFFLINE
 */

interface ContentProps {
    device_name: string;
}

interface IProps<T = ContentProps> {
    content: T;
    tag: number;
    id: string;
}
export default class {
    static cmd = "sync_offline";
    data = {
        content: {
            device_name: "",
        },
        tag: 0,
        id: "",
    };
    constructor(data: IProps<string>) {
        try {
            const content: ContentProps = JSON.parse(data.content);
            this.data = { ...data, content };
        } catch (e) {}
    }
}
