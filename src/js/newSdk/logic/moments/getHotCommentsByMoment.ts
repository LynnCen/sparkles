import getCommentHotIds from "@newSdk/service/api/moments/getCommentHotIds";

export async function getHotIds(momentId: string) {
    try {
        const res = await getCommentHotIds([momentId]);
        return res || [];
    } catch (e) {
        //
    }
}
