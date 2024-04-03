import { action, observable } from "mobx";
import mediaDownloadProxy from "./mediaDownloadProxy";
import { MediaType } from "../constants/media";

class ForwardMoments {
    ActionType = {
        forwardMoment: "1",
        shareApplet: "2",
    };
    @observable visible = false;
    @observable forwardInfo = {
        actionType: "",
    };
    @observable displayInfo = {
        sendInfo: {
            name: "",
            text: "",
        },
        media: {},
    };

    shareApplet(info = {}) {
        self.forwardInfo = {
            ...self.transformAppletInfo(info),
            actionType: self.ActionType.shareApplet,
        };
        self.visible = true;
    }

    @action
    transformAppletInfo(appletInfo) {
        const { aid, type, description, name, icon, logo } = appletInfo;

        const media = {
            ...icon,
            format: icon.file_type || icon.fileType,
            objectId: icon.text || icon.objectId,
            mediaType: MediaType.Applet,
        };
        console.log({ ...media });
        self.displayInfo = {
            sendInfo: {
                name,
                text: description,
            },
            media,
        };

        mediaDownloadProxy.addDownloadList(media);
        return {
            aid,
            type,
            description,
            name,
            logo,
            icon,
        };
    }

    closeModal() {
        self.resetState();
    }

    @action
    resetState() {
        self.visible = false;
        self.forwardInfo = {};
    }
}

const self = new ForwardMoments();

export default self;
