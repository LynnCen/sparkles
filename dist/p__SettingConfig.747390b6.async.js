(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[32],{KXoX:function(e,t,a){"use strict";var n,r=a("k1fw"),i=a("jrin");(function(e){e[e["view"]=1]="view",e[e["insert"]=2]="insert",e[e["edit"]=4]="edit",e[e["delete"]=8]="delete",e[e["export"]=32]="export",e[e["forbidden"]=16]="forbidden",e[e["import"]=64]="import"})(n||(n={}));var l=[{label:"view",value:n.view},{label:"insert",value:n.insert},{label:"edit",value:n.edit},{label:"delete",value:n.delete},{label:"forbidden",value:n.forbidden},{label:"export",value:n.export},{label:"import",value:n.import}],c=function(e,t){if(0===t.length)return[];if(1===t.length){var a=e.find((function(e){return e.key===t[0]}));return null===a||void 0===a?void 0:a.permission}var n=e.find((function(e){return e.key===t[0]}));if(n&&n.children){var r=n.children.find((function(e){return e.key===t[1]}));return null===r||void 0===r?void 0:r.permission}return[]},m=function(e,t){var a=c(e,t);return null!==a&&void 0!==a&&a.length?l.map((function(e){return null!==a&&void 0!==a&&a.find((function(t){return t.label===e.label&&t.value===e.value}))?Object(i["a"])({},e.label,!0):Object(i["a"])({},e.label,!1)})).reduce((function(e,t){return Object(r["a"])(Object(r["a"])({},e),t)})):{}};t["a"]=m},jtEN:function(e,t,a){"use strict";a.r(t);var n=a("0Owb"),r=(a("+L6B"),a("2/Rp")),i=(a("5NDa"),a("5rEg")),l=(a("giR+"),a("fyUT")),c=(a("miYZ"),a("tsqr")),m=(a("y8nQ"),a("Vl3Y")),o=a("tJVT"),s=a("q1tI"),u=a.n(s),d=a("Hx5s"),f=a("9kvl"),b=a("k1fw"),p=a("9og8"),v=a("WmNS"),_=a.n(v),w=a("fWQN"),E=a("yKVA"),g=a("879j"),h=function(e){Object(E["a"])(a,e);var t=Object(g["a"])(a);function a(){return Object(w["a"])(this,a),t.apply(this,arguments)}return a}(ConfigureType),y=a("HH/G"),x=a("3GU9");function j(){return I.apply(this,arguments)}function I(){return I=Object(p["a"])(_.a.mark((function e(){var t,a;return _.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(a=null===(t=x["a"].current)||void 0===t?void 0:t.nf.get("main"),!a){e.next=3;break}return e.abrupt("return",Object(y["b"])("/setting/config",{},h,a));case 3:return e.abrupt("return",null);case 4:case"end":return e.stop()}}),e)}))),I.apply(this,arguments)}function O(e,t){return k.apply(this,arguments)}function k(){return k=Object(p["a"])(_.a.mark((function e(t,a){var n,r;return _.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(r=null===(n=x["a"].current)||void 0===n?void 0:n.nf.get("main"),!r){e.next=3;break}return e.abrupt("return",Object(y["b"])("/setting/config",Object(b["a"])(Object(b["a"])({},t),{},{id:a}),h,r));case 3:return e.abrupt("return",null);case 4:case"end":return e.stop()}}),e)}))),k.apply(this,arguments)}var T=a("KXoX"),q=500,F=function(e){var t=m["a"].useForm(),a=Object(o["a"])(t,1),b=a[0],p=Object(f["useIntl"])(),v=p.formatMessage,_=Object(s["useState"])({}),w=Object(o["a"])(_,2),E=w[0],g=w[1];Object(s["useEffect"])((function(){g(Object(T["a"])(e.user.currentUser.access,["setting","config"]))}),[e.user]),Object(s["useEffect"])((function(){j().then(b.setFieldsValue,console.log)}),[b]);var h={labelCol:{xs:{span:8},sm:{span:8}},wrapperCol:{xs:{span:12},sm:{span:16}}},y={wrapperCol:{offset:3,span:16}},x=function(e){O(e,e._id).then((function(){b.setFieldsValue(e),c["default"].success(v({id:"table-setting-finished"}))}),(function(e){return console.log(e)}))};return u.a.createElement(d["b"],null,u.a.createElement(m["a"],Object(n["a"])({},h,{layout:"vertical",form:b,name:"config",onFinish:x,scrollToFirstError:!0}),u.a.createElement(m["a"].Item,{name:"_id",style:{display:"none"}},u.a.createElement(l["a"],{style:{width:q}})),u.a.createElement(m["a"].Item,{name:"sms_interval",label:v({id:"config.interval"}),rules:[{required:!0,message:"".concat(v({id:"table-form-placeholder"})," ").concat(v({id:"config.interval"}),"!")}]},u.a.createElement(l["a"],{style:{width:q}})),u.a.createElement(m["a"].Item,{name:"captcha_timeout",label:v({id:"config.code.expire"}),rules:[{required:!0,message:"".concat(v({id:"table-form-placeholder"})," ").concat(v({id:"config.code.expire"}),"!")}]},u.a.createElement(l["a"],{style:{width:q}})),u.a.createElement(m["a"].Item,{name:"rec_money_max_amount",label:v({id:"config.receipt.count"})},u.a.createElement(l["a"],{style:{width:q}})),u.a.createElement(m["a"].Item,{name:"rec_env_remark",label:v({id:"config.bonus.remark"})},u.a.createElement(i["a"].TextArea,{style:{width:q}})),u.a.createElement(m["a"].Item,{name:"red_env_timeout",label:v({id:"config.bonus.expire"})},u.a.createElement(l["a"],{style:{width:q}})),u.a.createElement(m["a"].Item,{name:"oto_red_env_max_sum",label:v({id:"config.bonus.one2one"})},u.a.createElement(l["a"],{style:{width:q}})),u.a.createElement(m["a"].Item,{name:"rand_red_env_max_amount",label:v({id:"config.bonus.random.count"})},u.a.createElement(l["a"],{style:{width:q}})),u.a.createElement(m["a"].Item,{name:"rand_red_env_max_sum",label:v({id:"config.bonus.random.amount"})},u.a.createElement(l["a"],{style:{width:q}})),u.a.createElement(m["a"].Item,{name:"rand_red_env_up_rate",label:v({id:"config.bonus.random.rate"}),extra:v({id:"config.bonus.random.desc"})},u.a.createElement(l["a"],{style:{width:q}})),u.a.createElement(m["a"].Item,{name:"transfer_max_sum",label:v({id:"config.transfer.amount"})},u.a.createElement(l["a"],{style:{width:q}})),u.a.createElement(m["a"].Item,{name:"transfer_timeout",label:v({id:"config.transfer.expire"})},u.a.createElement(l["a"],{style:{width:q}})),u.a.createElement(m["a"].Item,{name:"scan_transfer_max_sum",label:v({id:"config.transfer.amount.qr"})},u.a.createElement(l["a"],{style:{width:q}})),u.a.createElement(m["a"].Item,{name:"trans_bank_service_rate",label:v({id:"config.transfer.rate"})},u.a.createElement(l["a"],{style:{width:q}})),u.a.createElement(m["a"].Item,{name:"trans_bank_service_min",label:v({id:"config.transfer.rate.amount"})},u.a.createElement(l["a"],{style:{width:q}})),u.a.createElement(m["a"].Item,{name:"trans_bank_max_sum",label:v({id:"config.transfer.max.amount"})},u.a.createElement(l["a"],{style:{width:q}})),u.a.createElement(m["a"].Item,{name:"trans_bank_min_sum",label:v({id:"config.transfer.min.amount"})},u.a.createElement(l["a"],{style:{width:q}})),u.a.createElement(m["a"].Item,{name:"withdraw_service_rate",label:v({id:"config.get.rate"})},u.a.createElement(l["a"],{style:{width:q}})),u.a.createElement(m["a"].Item,{name:"withdraw_service_min",label:v({id:"config.get.rate.min"})},u.a.createElement(l["a"],{style:{width:q}})),u.a.createElement(m["a"].Item,{name:"withdraw_max_sum",label:v({id:"config.get.max.amount"})},u.a.createElement(l["a"],{style:{width:q}})),u.a.createElement(m["a"].Item,{name:"withdraw_min_sum",label:v({id:"config.get.min.amount"})},u.a.createElement(l["a"],{style:{width:q}})),u.a.createElement(m["a"].Item,{name:"sensitive_words",label:v({id:"config.sensitive.word"})},u.a.createElement(i["a"].TextArea,{style:{width:q}})),u.a.createElement(m["a"].Item,y,u.a.createElement(r["a"],{type:"primary",htmlType:"submit",disabled:!E.edit},v({id:"config.submit"})))))};t["default"]=Object(f["connect"])((function(e){var t=e.user;return{user:t}}))(F)}}]);