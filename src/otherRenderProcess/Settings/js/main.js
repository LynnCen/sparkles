const $ul = document.querySelector("#lang-list");
const $selectContainer = document.querySelector("#select_container");
const $selectMask = document.querySelector("#select_mask");
const $select = document.querySelector("#select-value");
const $logout = document.querySelector("#logout");
const $logoutTip = document.querySelector("#logout_mask");
const $logoutCancel = document.querySelector("#logout_cancel");
const $logoutOk = document.querySelector("#logout_ok");

let settings = {};
const init = () => {
    const query = window.location.search.slice(1);

    let baseSetting = {};
    let otherSetting = {};

    try {
        baseSetting = JSON.parse(localStorage.getItem("settings"));
    } catch (e) {
        console.error("parse error base");
    }

    try {
        otherSetting = JSON.parse(decodeURI(query));
    } catch (e) {
        console.error("parse error");
    }

    Object.assign(settings, baseSetting);
    return {
        ...baseSetting,
        ...otherSetting,
    };
};

const initAlwaysOnTop = (flag) => {
    const checkBox = document.querySelector(`input[name="alwaysOnTop"]`);
    if (flag) checkBox.setAttribute("checked", true);
    else checkBox.removeAttribute("checked");
};

const initAutoStart = (isOsx, flag) => {
    if (!isOsx) return document.querySelector("#startup_container").classList.add("hide");

    const checkbox = document.querySelector('input[name="startup"]');
    if (flag) checkbox.setAttribute("checked", true);
    else checkbox.removeAttribute("checked");
};

const initLangSelect = (listData, defaultSelect) => {
    const fragment = document.createDocumentFragment();

    let defaultSelectText = defaultSelect;
    listData.forEach(({ name, text }) => {
        const li = document.createElement("li");
        li.innerHTML = text;
        li.classList.add("item");
        if (name === defaultSelect) {
            li.classList.add("active");
            defaultSelectText = text;
        }
        li.setAttribute("data-v", name);
        fragment.appendChild(li);
    });

    $ul.innerHTML = "";
    $ul.appendChild(fragment);
    $select.innerHTML = defaultSelectText;

    const map = {};
    listData.forEach((item) => {
        map[item.name] = item;
    });

    $ul.onclick = function (e) {
        const {
            target: { dataset = {} },
        } = e;
        const { v } = dataset;
        setSelectValue(v, map);
        e.stopPropagation();
    };
};

const initUserInfo = (userInfo) => {
    const $avatar = document.querySelector("#user_avatar");
    const $name = document.querySelector("#user_name");
    const $tmmId = document.querySelector("#user_tmmId");

    if (userInfo.avatarPath) {
        // $avatar.setAttribute("src", userInfo.avatarPath);
        $avatar.innerHTML = `<img src="${userInfo.avatarPath}">`;
    } else $avatar.innerHTML = "";
    $name.innerHTML = userInfo.name || " ";
    $tmmId.innerHTML = userInfo.tmm_id || " ";
};

const initThemeList = (isMac, currentTheme) => {
    const $themeList = document.querySelector("#theme-list");
    if (isMac) {
        let html = $themeList.innerHTML;
        html =
            `
            <div class="item" data-v="system">
                <div class="appearance">
                    <img src="./img/auto.png" alt="">
                </div>
                <span class="name" data-locale="FollowSys">Auto</span>
            </div>
        ` + html;
        $themeList.innerHTML = html;
    }

    const $item = $themeList.querySelector(`[data-v="${currentTheme}"]`);
    $item.classList.add("active");
};

const initWinCloseIcon = (isMac) => {
    if (!isMac) {
        const $aside = document.createElement("aside");
        $aside.classList.add("win-close");
        const $i = document.createElement("i");
        $i.classList.add("dot");
        $aside.appendChild($i);

        $aside.onclick = function () {
            ctx.closeSetting();
        };
        document.body.appendChild($aside);
    }
};

const initVersion = (v) => {
    document.querySelector("#tmm_version").innerHTML = `TMMTMM V${v}`;
};

const initWindowsBorder = (isOsx) => {
    if (!isOsx) document.body.classList.add("win32");
};

/**
 * intl
 */
const updatePageText = (intl) => {
    const $intlNeed = document.querySelectorAll("[data-locale]");
    Array.from($intlNeed).forEach((el) => {
        const {
            dataset: { locale, suffix = "" },
        } = el;
        if (locale) {
            try {
                const text = ctx.localeMap[intl][locale];
                text && (el.innerHTML = text + suffix);
            } catch (e) {
                console.error("parse error of", locale);
            }
        }
    });
};

$selectContainer.onclick = () => {
    $selectContainer.classList.add("show");
};

$selectMask.onclick = (e) => {
    $selectMask.parentElement.classList.remove("show");
    e.stopPropagation();
};

/**
 * @action
 */
const addCheckboxChange = (name) => {
    const $checkbox = document.querySelector(`input[name="${name}"]`);

    $checkbox.onchange = (e) => {
        settings[name] = e.target.checked;

        settingChange({ ...settings });
    };
};

/**
 * @action
 */

const addThemeEvent = () => {
    const $themeList = document.querySelector("#theme-list");
    const themeItemList = Array.from($themeList.children);

    themeItemList.forEach((el) => {
        el.onclick = function () {
            themeItemList.forEach((el) => el.classList.remove("active"));
            el.classList.add("active");

            const {
                dataset: { v },
            } = el;

            switch (v) {
                // case "system":
                //     return ctx.autoModal();
                case "light":
                    return ctx.lightModal();
                // case "dark":
                //     return ctx.darkModal();
            }
        };
    });
};

/**
 * @action
 */
const setSelectValue = (v, map) => {
    const res = map[v];

    if (res) {
        $select.innerHTML = res.text;
        const $li = $ul.querySelector('li[class="item active"]');
        const $targetLi = $ul.querySelector(`li[data-v="${res.name}"]`);
        if ($li) $li.classList.remove("active");
        if ($targetLi) $targetLi.classList.add("active");
        $selectContainer.classList.remove("show");

        settings.locale = res.name;

        ctx.updateLocal(res.name);
        updatePageText(res.name);
        settingChange({ ...settings });
    }
};

/**
 * @action
 */
$logout.onclick = () => {
    $logoutTip.classList.add("show");
};

$logoutCancel.onclick = () => {
    $logoutTip.classList.remove("show");
};

$logoutOk.onclick = () => {
    ctx.logout();
};

const settingChange = (settings) => {
    console.log("handle up", settings);
    localStorage.setItem("settings", JSON.stringify(settings));
    ctx.settingsApply({
        settings,
    });
};
