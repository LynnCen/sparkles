import React, { Component } from "react";

const disableCopy = (WrappedComp) => {
    // class DisableCopy extends Component {
    //   render() {
    //     const { someRef, ...rest } = this.props

    //     return <WrappedComp {...rest} ref={someRef} disableCopy={true} />
    //   }
    // }

    // return React.forwardRef((props, ref) => {
    //   return <DisableCopy {...props} someRef={ref}/>
    // })

    class DisableCopy extends Component {
        render() {
            return <WrappedComp {...this.props} disableCopy={true} />;
        }
    }

    return DisableCopy;
};

export default disableCopy;
