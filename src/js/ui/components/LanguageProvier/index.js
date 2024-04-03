import React, { Component } from "react";
import { IntlProvider } from "react-intl";
import { inject, observer } from "mobx-react";
import { IntlConfig, defaultLangPackage } from "../../../config";
@inject((stores) => ({
    locale: stores && stores.settings && stores.settings.locale,
}))
@observer
export default class LanguageProvider extends Component {
    initialize = (key) => {
        let settings = localStorage.getItem("settings");
        settings = settings ? JSON.parse(settings) : {};
        return settings[key];
    };

    render() {
        let locale = "tr";
        let message = defaultLangPackage;
        let { locale: language = "tr" } = this.props;

        if (!this.props.locale) {
            language = this.initialize("locale") || this.props.autoLocal; //temp operation for missing store.setting.locale  TODO
        }
        // console.log('LanguageProvider props ---', this.props)

        for (let i = 0, len = IntlConfig.length; i < len; i += 1) {
            const { name, packages } = IntlConfig[i];
            if (language === name) {
                locale = name;
                message = packages;
                break;
            }
        }
        return (
            <IntlProvider locale={locale} messages={message} key={locale}>
                {this.props.children}
            </IntlProvider>
        );
    }
}
