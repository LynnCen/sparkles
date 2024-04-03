interface ContentProps {
    chat_id: string;
    sequence: number;
}

interface IProps<T = ContentProps> {
    content: T;
    tag: number;
    id: string;
}

export default class {
    static cmd = "sync_setting_hide";
    data = {
        content: {
            chatId: "",
            sequence: 0,
        },
        id: "",
    };
    constructor(data: IProps<string>) {
        try {
            const content: ContentProps = JSON.parse(data.content);
            this.data = {
                id: data.id,
                content: {
                    chatId: content.chat_id,
                    sequence: content.sequence,
                },
            };
        } catch (e) {}
    }
}
