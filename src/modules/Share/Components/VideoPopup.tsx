import React, { Component } from 'react';
import { Modal } from 'antd'
import VideoPlayer from './VideoPlayer'

const vh = px => (px / 1344) * 100 + "vh"
interface Props {
    close: () => void
}

interface States {
}

class VideoPopup extends Component<Props, States> {

    render() {
        return (
            <Modal
                footer={null}
                visible={true}
                centered={true}
                closable={false}
                onCancel={() => this.props.close()}
                bodyStyle={{
                    padding: "0",
                    height: `${vh(500)}`
                }}
            >
                <VideoPlayer
                    sources={[{ src: 'http://183.246.197.144:7086/live/cameraid/1000032%240/substream/1.m3u8' }]}
                    style={{ height: "100%", width: "100%" }}
                />
            </Modal>
        );
    }
}

export default VideoPopup;