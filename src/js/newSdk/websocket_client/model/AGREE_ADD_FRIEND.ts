interface ContentProps {
    operator: string;
    target: string;
    temId: string;
}

interface IProps<T = ContentProps> {
    content: T;
    id: string;
}

export default class {
    static cmd = "agree_add_friend";
    data = {
        content: {
            operator: "",
            target: "",
            temId: "",
        },
        id: "",
    };

    constructor(data: IProps<string>) {
        try {
            const content: ContentProps = JSON.parse(data.content);
            this.data = { ...data, content };
        } catch (e) {}
    }
}
