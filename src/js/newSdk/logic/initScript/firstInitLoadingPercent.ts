/**
 * @description 页面初始化 loading 进度
 */

//

export const initPercentChange = (() => {
    const PercentTypeEnum = {
        IntlTemplate: "intl_template",
        Contacts: "contacts",
    };

    const PercentRatioEnum = {
        Intl: 10,
        ContactIds: 10,
        Contacts: {
            Relation: 1,
            BaseInfo: 10,
            ExtensionInfo: 5,
        },
    };

    let totalPercent = PercentRatioEnum.Intl + PercentRatioEnum.ContactIds;
    let currentPercent = 0;
    let publishFlag = false;
    let listenerList: Array<Function> = [];

    const resetStatus = () => {
        totalPercent = PercentRatioEnum.Intl + PercentRatioEnum.ContactIds;
        currentPercent = 0;
        publishFlag = false;
    };

    const percentChange = (addOnPercent: number) => {
        currentPercent += addOnPercent;
        _publish();
    };

    const calcContactsPercent = (contactsCount: number) => {
        const { Relation, BaseInfo, ExtensionInfo } = PercentRatioEnum.Contacts;
        totalPercent = [Relation, BaseInfo, ExtensionInfo].reduce(
            (previousValue, currentValue) => (previousValue += currentValue * contactsCount),
            totalPercent
        );
        publishFlag = true;
    };

    const setPublishAble = () => (publishFlag = true);

    const addObserver = (handlerFn: Function) => {
        listenerList.push(handlerFn);
    };

    const removeAllListeners = () => (listenerList = []);

    const _publish = () => {
        publishFlag &&
            listenerList.forEach((fn) => fn({ total: totalPercent, ratio: currentPercent }));
    };

    return {
        percentChange,
        calcContactsPercent,
        setPublishAble,
        addObserver,
        resetStatus,
        removeAllListeners,
        PercentRatioEnum,
    };
})();
