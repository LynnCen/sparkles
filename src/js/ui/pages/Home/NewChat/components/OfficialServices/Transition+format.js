import tmmUserInfo from "@newSdk/model/UserInfo";
import { TransitionType } from "@newSdk/model/MessageType";
import { trimAndDropEmpty } from "@newSdk/utils";
import localeFormat from "utils/localeFormat";

export const DisplayKeyEnum = {
    TO_USER: "to_user",
    TO_ADDRESS: "to_address",
    TO: "to",

    FROM_TXTID: "from_txtId",
    FROM_USER: "from_user",
    Remark: "remark",
};
export const getTransitionFormat = (message, formatMsg = localeFormat) => {
    const {
        content: { act, amount, coin_name, to_id, from_id },
    } = message;

    const cardBasicInfo = {
        amount,
        title: "",
        plus: to_id === tmmUserInfo._id,
        unit: coin_name,
    };

    const display = {
        [DisplayKeyEnum.TO_USER]: "",
        [DisplayKeyEnum.TO_ADDRESS]: "",
        [DisplayKeyEnum.TO]: "",
        [DisplayKeyEnum.FROM_TXTID]: "",
        [DisplayKeyEnum.FROM_USER]: "",
        [DisplayKeyEnum.Remark]: "",
    };

    const refresh = ({ cardInfo, displayInfo }) => {
        Object.assign(cardBasicInfo, cardInfo);
        Object.assign(display, displayInfo);
    };

    const args = {
        enumInfo: display,
        message,
        formatMsg,
    };
    switch (act) {
        // 1. 支付成功
        case TransitionType.Transition:
        case TransitionType.SendP2PRedEnvelope:
        case TransitionType.SendGroupRedEnvelope:
        case TransitionType.ScanAndQrCode: {
            if (to_id === tmmUserInfo._id) {
                refresh(handleReceived(args));
            } else {
                refresh(handlePaySuccess(args));
            }
            break;
        }

        // 2 收款
        case TransitionType.ReceiveP2PRedEnvelope:
        case TransitionType.ReceiveGroupRedEnvelope:
        case TransitionType.Recharge: {
            refresh(handleReceived(args));
            break;
        }

        // 3. 发起提现 & 提现成功， 根据 w_type 来判断。包含手续费，（总金额不显示手续费）
        // case TransitionType.WithDrawCost: // 250
        case TransitionType.WithDrawCost: {
            refresh(handleWithDraw(args));
            break;
        }

        // 5. 提现退款 & 253 (总金额显示手续费)
        case TransitionType.WithDrawBack: {
            refresh(handleWithDrawBack(args));
            break;
        }

        // 6. 红包退款
        case TransitionType.P2PRedEnvelopeBack:
        case TransitionType.GroupRedEnvelopeBack: {
            refresh(handleRedEnvelopBack(args));
            break;
        }

        default:
            return null;
    }

    return { cardBasicInfo, display: trimAndDropEmpty(display) };
};

// 1
const handlePaySuccess = ({ enumInfo, message, formatMsg }) => {
    const {
        content: { act },
    } = message;

    const title = formatMsg({ id: "py_paySuccess" });

    const display = { ...enumInfo };
    display[DisplayKeyEnum.TO] = [TransitionType.Transition, TransitionType.ScanAndQrCode].includes(
        act
    )
        ? formatMsg({ id: "py_Transfer" })
        : [TransitionType.SendP2PRedEnvelope].includes(act)
        ? formatMsg({ id: "py_redBonus" })
        : formatMsg({ id: "py_groupRedBonus" });
    return {
        cardInfo: { title, plus: false },
        displayInfo: display,
    };
};

// 2
const handleReceived = ({ enumInfo, message, formatMsg }) => {
    const { content: { out_trade_no, from_id, act } = {} } = message;
    const title = formatMsg({ id: "py_receive" });
    const display = { ...enumInfo };
    if (act === TransitionType.Recharge) {
        // 10
        display[DisplayKeyEnum.FROM_TXTID] = out_trade_no;
    } else {
        display[DisplayKeyEnum.FROM_USER] = from_id;
    }

    return {
        cardInfo: { title, plus: true },
        displayInfo: display,
    };
};

// 3 & 4
const handleWithDraw = ({ enumInfo, message, formatMsg }) => {
    const { content: { out_trade_no, biz_type } = {} } = message;
    let title = "";
    const display = { ...enumInfo };
    if (biz_type === "apply") {
        title = formatMsg({ id: "py_withdraw" });
    } else {
        title = formatMsg({ id: "py_withdrawSuccess" });
    }
    display[DisplayKeyEnum.TO_ADDRESS] = out_trade_no;

    return {
        cardInfo: { title, plus: false },
        displayInfo: display,
    };
};

// 5
const handleWithDrawBack = ({ enumInfo, message, formatMsg }) => {
    const title = formatMsg({ id: "py_withdrawBack" });
    const { content: { associated, amount } = {} } = message;
    const display = { ...enumInfo };
    let totalAm = amount;
    if (associated) {
        associated.forEach((item) => {
            if (item.act === TransitionType.WithDrawServicesBack) totalAm += item.amount;
        });
    }

    display[DisplayKeyEnum.Remark] = formatMsg({ id: "py_withdrawFail" });
    return {
        cardInfo: { title, amount: totalAm, plus: true },
        displayInfo: display,
    };
};

// 6
const handleRedEnvelopBack = ({ formatMsg, message }) => {
    const title = formatMsg({ id: "py_redBonusBack" });
    const {
        content: { total_amount, amount, act },
    } = message;

    let tipId = "";

    // in single
    if (act === TransitionType.P2PRedEnvelopeBack) tipId = "py_redBonusBackInTimeAll";
    else {
        // int group
        if (total_amount !== amount) tipId = "py_redBonusBackInTimeSome";
        else tipId = "py_redBonusBackInTimeAll";
    }

    const remark = formatMsg({ id: tipId });
    return {
        cardInfo: { title, plus: true },
        displayInfo: { [DisplayKeyEnum.Remark]: remark },
    };
};

export const getTruthyAmount = ({ amount, decimal }) => {
    const str = (amount / 10 ** decimal).toFixed(decimal);
    // 去掉末尾的0
    return str.replace(/(\.0+|0+)$/gi, "");
};
export default getTransitionFormat;
