enum From_Type {
    FROM_TMM = 1, // tmm_id
    FROM_PHONE, // phone number
    FROM_GROUP, // session chat
    FROM_QRCODE, // from qr code
    FROM_NAME_CARD, // from business card
    FROM_CONTACTS, // from contacts
    FROM_NEARBY_PERSON, // from nearby person
    FROM_SHACK, // from shake
    FROM_NEARBY, // from nearby
    FROM_MOMENTS, // from moments
}
export const mapFromObj = {
    [From_Type.FROM_TMM]: "from_tmm_id",
    [From_Type.FROM_PHONE]: "from_phone",
    [From_Type.FROM_GROUP]: "from_group",
    [From_Type.FROM_QRCODE]: "from_qrCode",
    [From_Type.FROM_NAME_CARD]: "from_nameCard",
    [From_Type.FROM_CONTACTS]: "from_contacts",
    [From_Type.FROM_NEARBY_PERSON]: "from_nearby",
    [From_Type.FROM_SHACK]: "from_shack",
    [From_Type.FROM_NEARBY]: "from_nearby",
    [From_Type.FROM_MOMENTS]: "from_moments",
};

enum Friend_relationship {
    BOTH_STRANGER, //  stranger
    BOTH_FRIEND, // friends
    ONLY_MY_FRIEND, // only_my_friends
    ONLY_MY_STRANGER, // only_my_stranger
}

const isFriend = (data: Friend_relationship) => {
    if (data === Friend_relationship.BOTH_FRIEND) return 1;
    return 0;
};

const isMyFriend = (data: Friend_relationship = Friend_relationship.BOTH_STRANGER) => {
    return data === Friend_relationship.BOTH_FRIEND || data == Friend_relationship.ONLY_MY_FRIEND;
};

export { From_Type, isFriend, isMyFriend, Friend_relationship };
