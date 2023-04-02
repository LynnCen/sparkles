import React, { Component } from 'react';

const scss = require('../../../styles/scss/sharepage.scss')

interface Props {
    promptName: string,
    changePrompt: (value, _name) => void
}

interface State {

}

class SyPrompt extends Component<Props, State> {
    componentDidMount() {
        setTimeout(() => {
            this.props.changePrompt(true, '')
        }, 1000)
    }
    render() {
        const { promptName } = this.props
        return (
            <div className={scss['SyPrompt-box']}>
                <div>
                    <div className={scss['SyPrompt-title']}>
                        {promptName}
                    </div>
                    <div className={scss['SyPrompt-content']}>
                        本区域不存在{promptName}
                    </div>
                </div>
            </div>
        );
    }
}

export default SyPrompt;