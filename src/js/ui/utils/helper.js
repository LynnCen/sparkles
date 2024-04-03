import axios from "axios";
import MD5 from "browser-md5-file";

const CHATROOM_NOTIFY_CLOSE = 0;
const CONTACTFLAG_NOTIFYCLOSECONTACT = 512;
const MM_USERATTRVERIFYFALG_BIZ_BRAND = 8;
const CONTACTFLAG_TOPCONTACT = 2048;
const CONTACTFLAG_CONTACT = 1;

const helper = {
    isChatRoom: (userid) => {
        return userid && userid.startsWith("@@");
    },

    isChatRoomOwner: (user) => {
        return helper.isChatRoom(user.UserName) && user.IsOwner;
    },

    isChatRoomRemoved: (user) => {
        return helper.isChatRoom(user.UserName) && user.ContactFlag === 0;
    },

    isMuted: (user) => {
        return helper.isChatRoom(user.UserName)
            ? user.Statues === CHATROOM_NOTIFY_CLOSE
            : user.ContactFlag & CONTACTFLAG_NOTIFYCLOSECONTACT;
    },

    isOfficial: (user) => {
        return !(user.VerifyFlag !== 24 && user.VerifyFlag !== 8 && user.UserName.startsWith("@"));
    },

    isFileHelper: (user) => user.UserName === "filehelper",

    isTop: (user) => {
        if (user.isTop !== void 0) {
            return user.isTop;
        }

        return user.ContactFlag & CONTACTFLAG_TOPCONTACT;
    },

    isBrand: (user) => {
        return user.VerifyFlag & MM_USERATTRVERIFYFALG_BIZ_BRAND;
    },

    parseKV: (text) => {
        var string = text.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
        var matchs = string.match(/(\w+)="([^\s]+)"/g);
        let res = {};

        matchs.map((e) => {
            var kv = e.replace(/"/g, "").split("=");

            res[kv[0]] = kv[1];
        });

        return res;
    },

    parseXml: (text, tagName) => {
        var parser = new window.DOMParser();
        var xml = parser.parseFromString(
            text.replace(/&lt;/g, "<").replace(/&gt;/g, ">"),
            "text/xml"
        );
        var value = {};

        tagName = Array.isArray(tagName) ? tagName : [tagName];

        tagName.map((e) => {
            value[e] = xml.getElementsByTagName(e)[0].childNodes[0].nodeValue;
        });

        return { xml, value };
    },

    unique: (arr) => {
        var mappings = {};
        var res = [];

        arr.map((e) => {
            mappings[e] = true;
        });

        for (var key in mappings) {
            if (mappings[key] === true) {
                res.push(key);
            }
        }

        return res;
    },

    getMessageContent: (message) => {
        var isChatRoom = helper.isChatRoom(message.FromUserName);
        var content = message.Content;

        if (isChatRoom && !message.isme) {
            content = message.Content.split(":<br/>")[1];
        }

        switch (message.MsgType) {
            case 1:
                if (message.location) return "[Location]";
                // Text message
                return content.replace(/<br\/>/g, "");

            case 3:
                // Image
                return "[Picture]";

            case 34:
                // Image
                return "[Voice]";

            case 42:
                // Contact Card
                return "[Contact Card]";

            case 43:
                // Video
                return "[Video]";

            case 47:
            case 49 + 8:
                // Emoji
                return "[Emoji]";

            case 49 + 17:
                return "🚀 &nbsp; Location sharing, Please check your phone.";

            case 49 + 6:
                return `🚚 &nbsp; ${message.file.name}`;

            case 49 + 2000:
                // Transfer
                return `Money +${message.transfer.money} 💰💰💰`;
        }
    },

    getCookie: async (name) => {
        var value = {
            name,
        };
        var cookies = remote.getCurrentWindow().webContents.session.cookies;

        if (!name) {
            return new Promise((resolve, reject) => {
                cookies.get({ url: axios.defaults.baseURL }, (error, cookies) => {
                    let string = "";

                    if (error) {
                        return resolve("");
                    }

                    for (var i = cookies.length; --i >= 0; ) {
                        let item = cookies[i];
                        string += `${item.name}=${item.value} ;`;
                    }

                    resolve(string);
                });
            });
        }

        return new Promise((resolve, reject) => {
            cookies.get(value, (err, cookies) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(cookies[0].value);
                }
            });
        });
    },

    humanSize: (size) => {
        var value = (size / 1024).toFixed(1);

        if (size > 1024 << 10) {
            value = (value / 1024).toFixed(1);
            return `${value} M`;
        } else {
            return `${value} KB`;
        }
    },

    getFiletypeIcon: (extension) => {
        var filename = "unknow";

        extension = (extension || "").toLowerCase().replace(/^\./, "");

        switch (true) {
            case ["mp3", "flac", "aac", "m4a", "wma"].includes(extension):
                filename = "audio";
                break;

            case ["mp4", "mkv", "avi", "flv"].includes(extension):
                filename = "audio";
                break;

            case ["zip", "rar", "tar", "tar.gz"].includes(extension):
                filename = "archive";
                break;

            case ["doc", "docx"].includes(extension):
                filename = "word";
                break;

            case ["xls", "xlsx"].includes(extension):
                filename = "excel";
                break;

            case ["ai", "apk", "exe", "ipa", "pdf", "ppt", "psd", "dmg"].includes(extension):
                filename = extension;
                break;
        }

        return `${filename}.png`;
    },

    decodeHTML: (text = "") => {
        return text.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
    },

    isImage: (ext) => {
        return ["bmp", "gif", "jpeg", "jpg", "png"].includes(ext);
    },

    // 3 types supported: pic, video, doc
    getMediaType: (ext = "") => {
        ext = ext.toLowerCase();

        switch (true) {
            case helper.isImage(ext):
                return "pic";

            case ["mp4"].includes(ext):
                return "video";

            default:
                return "doc";
        }
    },

    getDataURL: (src) => {
        var image = new window.Image();

        return new Promise((resolve, reject) => {
            image.src = src;
            image.onload = () => {
                var canvas = document.createElement("canvas");
                var context = canvas.getContext("2d");

                canvas.width = image.width;
                canvas.height = image.height;

                context.drawImage(image, 0, 0, image.width, image.height);
                resolve(canvas.toDataURL("image/png"));
            };

            image.onerror = () => {
                resolve("");
            };
        });
    },

    isOsx: window.process && window.process.platform === "darwin",

    isSuspend: () => {
        return ipcRenderer.sendSync("is-suspend");
    },

    md5: (file) => {
        return new Promise((resolve, reject) => {
            new MD5().md5(file, (err, md5) => {
                resolve(err ? false : md5);
            });
        });
    },

    weekFormat: (num) => {
        let str;
        switch (num) {
            case 1:
                str = "星期一";
                break;
            case 2:
                str = "星期二";
                break;
            case 3:
                str = "星期三";
                break;
            case 4:
                str = "星期四";
                break;
            case 5:
                str = "星期五";
                break;
            case 6:
                str = "星期六";
                break;
            default:
                str = "星期天";
        }
        return str;
    },

    /**
     * 消息会话时间显示
     */

    // 消息按时间排序
    compare: (pro) => {
        return function (obj1, obj2) {
            var val1 = obj1[pro];
            var val2 = obj2[pro];
            if (val1 < val2) {
                return 1;
            } else if (val1 > val2) {
                return -1;
            } else {
                return 0;
            }
        };
    },

    dateFormat: (date, fmt) => {
        if (!date) return "";
        if (date.constructor !== Date) {
            date = new Date(date);
        }
        const o = {
            "M+": date.getMonth() + 1, // 月份
            "d+": date.getDate(), // 日
            "h+": date.getHours(), // 小时
            "m+": date.getMinutes(), // 分
            "s+": date.getSeconds(), // 秒
            "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
            S: date.getMilliseconds(), // 毫秒
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (let k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(
                    RegExp.$1,
                    RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
                );
            }
        }
        return fmt;
    },

    dataURLtoFile(dataurl, filename) {
        //将base64转换为文件
        var arr = dataurl.split(","),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        console.log("mime ---", mime);
        return new File([u8arr], filename, {
            type: mime,
            lastModified: new Date(),
        });
    },

    imagetoCanvas(image, type) {
        var cvs = document.createElement("canvas");
        var ctx = cvs.getContext("2d");
        cvs.width = image.width;
        cvs.height = image.height;
        console.log("cvs.width ---", cvs.width);
        console.log("cvs.height ---", cvs.height);
        ctx.drawImage(image, 0, 0, cvs.width, cvs.height);
        return cvs.toDataURL(`image/${type}`, 1);
    },

    HTMLDecode(text) {
        let temp = document.createElement("div");
        temp.innerHTML = text;
        let output = temp.innerText || temp.textContent;
        temp = null;
        return output;
    },
};

export default helper;
