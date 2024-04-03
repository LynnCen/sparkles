import axios from "@newSdk/service/apiCore/tmmCore";

interface ResponseItem {
    id: string;
    is_friend: number;
    from_way: number | null;
}

interface ReturnProps {
    id: string;
    isFriend: number;
    fromWay: number | null;
}
export default async (ids: string[]): Promise<false | ReturnProps[]> => {
    try {
        const {
            data: { items },
        } = await axios({
            url: "/getRelationList",
            method: "post",
            data: {
                ids,
            },
        });

        return items.map(dataTransfer);
    } catch (e) {
        return false;
    }
};

const dataTransfer = ({ id, is_friend, from_way }: ResponseItem) => ({
    id,
    isFriend: is_friend,
    fromWay: from_way,
});
