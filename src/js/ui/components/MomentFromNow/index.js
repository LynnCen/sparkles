import React from "react";
import moment from "moment";
import { inject, observer } from "mobx-react";
import { injectIntl } from "react-intl";

@inject((store) => ({
    locale: store.settings.locale,
}))
@observer
class MomentFromNow extends React.Component {
    timeToShow = () => {
        const { timestamp, intl } = this.props;
        const isSameDay = moment(timestamp).isSame(moment(), "day");
        const fromNowSeconds = Math.floor(
            moment.duration(moment().diff(moment(timestamp))).asMinutes()
        );
        const fromNowHours = Math.floor(
            moment.duration(moment().diff(moment(timestamp))).asHours()
        );
        const fromNowDays = Math.floor(moment.duration(moment().diff(moment(timestamp))).asDays());
        const isYesterday = moment(timestamp).isBetween(
            moment().subtract(1, "d").startOf("d"),
            moment().subtract(1, "d").endOf("d")
        );

        const isOtherDay = moment(timestamp).isBetween(
            moment().subtract(1, "d").startOf("d"),
            moment().subtract(1, "d").endOf("d")
        );

        if (isSameDay) {
            if (fromNowSeconds < 1) return intl.formatMessage({ id: "justNow" });
            if (fromNowSeconds < 60)
                return `${fromNowSeconds}${intl.formatMessage({ id: "fromNowMinutes" })}`;
            return `${fromNowHours}${intl.formatMessage({ id: "fromNowHours" })}`;
        }

        if (isYesterday) {
            return intl.formatMessage({ id: "fromNowYesterday" });
        }

        if (isOtherDay) {
            return `${fromNowDays}${intl.formatMessage({ id: "fromNowDays" })}`;
        }

        return moment(timestamp).format("LL");
    };

    render() {
        const { locale, className } = this.props;
        moment.locale(locale);
        return <span className={className}>{this.timeToShow()}</span>;
    }
}

export default injectIntl(MomentFromNow);
