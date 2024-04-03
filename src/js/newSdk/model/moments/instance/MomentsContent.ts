import { createMomentId } from "@newSdk/utils";

export const b_video = 0x04;
export const b_image = 0x02;
export const b_text = 0x01;
export class MomentsContent {
    id: string;
    type: number;
    content_type: number;
    auth_type: number;
    extra?: any;

    constructor(type: number, content_type = b_text, auth_type = 1) {
        this.type = type;
        this.id = createMomentId(sessionStorage.userId);
        this.content_type = content_type;
        this.auth_type = auth_type;
    }
}

export default MomentsContent;
