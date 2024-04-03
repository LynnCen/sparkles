/**
 * @Author Pull
 * @Date 2021-06-10 14:19
 * @project M_AudioMessage
 */
import React, { Component } from "react";
import styles from "./styles.less";
import propType from "prop-types";
import classNames from "classnames";
import { inject, observer } from "mobx-react";
import { renderMessageStatus } from "../../../../../index";
import playingIcon from "images/mutiThemeIcon/audioTrack_primary.png";
import ImageIcon, { supportEnumType } from "components/_N_ImageIcon/ImageIcon";

@inject((store) => ({
    downloadOrigin: store.DownloadCenter.downloadOrigin,
}))
class AudioMessage extends Component {
    static propTypes = {
        objectId: propType.string,
        duration: propType.number,
        fileType: propType.string,
        regPlayer: propType.func,
    };

    state = {
        isPlay: false,
        duration: 0,
        src: "",
        $audio: null,
        playingTimer: null,
        loading: false,
        invalidSource: false,
    };

    componentDidMount() {
        const { content } = this.props;
        const { duration } = content;
        this.setState({ duration });
        this.init();
    }

    componentWillUnmount() {
        const { $audio, playingTimer, isPlay } = this.state;

        if (!$audio) return false;

        if (isPlay) {
            // to pause
            $audio.pause();
            $audio.currentTime = 0;
            if (playingTimer) clearInterval(playingTimer);
            this.setState({
                isPlay: false,
                playingTimer: null,
                duration: this.props.duration,
            });
        }
    }

    init() {
        const { content, downloadOrigin } = this.props;

        this.setState({ loading: true });
        downloadOrigin(content)
            .then((path) => {
                if (!path) return this.setState({ loading: false, invalidSource: true });

                const $audio = document.createElement("audio");
                $audio.preload = "true";
                $audio.src = path;
                $audio.reset = this.resetPlayer.bind(this);

                this.setState({
                    src: path,
                    $audio,
                    loading: false,
                });
            })
            .catch(() => {
                this.setState({
                    loading: false,
                });
            });
    }

    handleToggleAudio = () => {
        const { $audio, playingTimer, isPlay, invalidSource, loading } = this.state;

        if (!$audio || invalidSource || loading) return false;

        if (isPlay) {
            // to pause
            $audio.pause();
            $audio.currentTime = 0;
            if (playingTimer) clearInterval(playingTimer);
            this.setState({
                isPlay: false,
                playingTimer: null,
                duration: this.props.content.duration,
            });
        } else {
            const { regPlayer } = this.props;
            if (regPlayer) regPlayer(this.state.$audio);
            // to play
            $audio.play().then(() => {
                this.countDownDuration();
            });
        }
    };

    countDownDuration = () => {
        const { playingTimer, isPlay } = this.state;
        const {
            content: { duration: nativeDuration },
        } = this.props;
        if (playingTimer) clearInterval(playingTimer);

        let cur = this.state.duration - 1;
        let timer = setInterval(() => {
            cur = this.state.duration - 1;
            if (cur >= 0) this.setState({ duration: cur - 1 >= 0 ? this.state.duration - 1 : 0 });
            else {
                clearInterval(timer);
                timer = null;
                this.setState({
                    isPlay: false,
                    duration: nativeDuration,
                    playingTimer: null,
                });
            }
        }, 1000);

        this.setState({
            isPlay: true,
            playingTimer: timer,
            duration: cur >= 0 ? cur : 0,
        });
    };

    resetPlayer = () => {
        const { playingTimer, $audio } = this.state;
        if (playingTimer) clearInterval(playingTimer);
        const {
            content: { duration: nativeDuration },
        } = this.props;
        $audio.pause();
        $audio.currentTime = 0;
        this.setState({
            isPlay: false,
            duration: nativeDuration,
            playingTimer: null,
        });
    };

    renderAudioBtn = (isMe, isPlay) => {
        const strMe = isMe ? "me" : "other";
        const strStu = isPlay ? "stop" : "play";

        const matchStr = `${strMe}_${strStu}`;

        const pattern = {
            me_play: <ImageIcon enumType={supportEnumType.AudioBtn_My_Play} />,
            me_stop: <ImageIcon enumType={supportEnumType.AudioBtn_My_Stop} />,
            other_play: <ImageIcon enumType={supportEnumType.AudioBtn_Other_Play} />,
            other_stop: <ImageIcon enumType={supportEnumType.AudioBtn_Other_Stop} />,
        };

        return pattern[matchStr] || null;
    };

    render() {
        const { isPlay, duration, loading, invalidSource } = this.state;
        const {
            isMe,
            content: { duration: nativeDur },
            timeToShow,
            message,
            status,
            intl,
        } = this.props;
        return (
            <section
                className={classNames(styles.audioBox, {
                    [styles.me]: isMe,
                })}
            >
                <article className={styles.audioContainer}>
                    <div onClick={this.handleToggleAudio}>
                        {loading || invalidSource ? (
                            <i
                                className={classNames(styles.circle, {
                                    [styles.loading]: loading || invalidSource,
                                    [styles.error]: invalidSource,
                                })}
                            />
                        ) : (
                            <i className={styles.circle}>{this.renderAudioBtn(isMe, isPlay)}</i>
                        )}
                    </div>

                    <div className={styles.progressAudioContainer}>
                        <div className={styles.progressAudio}>
                            <ImageIcon
                                enumType={
                                    isMe
                                        ? supportEnumType.AudioTrack_My_Bg
                                        : supportEnumType.AudioTrack_Other_Bg
                                }
                                overlayStyle={{
                                    width: 146,
                                }}
                            />
                        </div>
                        {duration >= 0 && (
                            <div
                                className={styles.progressPlaying}
                                style={{
                                    width: `${(((nativeDur - duration) / nativeDur) * 100) | 0}%`,
                                    transition: `${
                                        nativeDur !== duration ? "width 1s linear" : "unset"
                                    }`,
                                }}
                            >
                                {isMe ? (
                                    <ImageIcon enumType={supportEnumType.AudioTrack_My_Play} />
                                ) : (
                                    <img src={playingIcon} />
                                )}
                            </div>
                        )}
                    </div>

                    <span
                        className={classNames(styles.duration, {
                            [styles.mySendDur]: isMe,
                        })}
                    >
                        {duration >= 0 ? `${duration}''` : ""}
                    </span>
                </article>

                <div className={styles.msgInfo}>
                    <div className={styles.msgContent}>
                        <span
                            className={classNames(styles.msgTime, {
                                [styles.mySend]: isMe,
                            })}
                        >
                            {timeToShow}
                        </span>
                        {isMe && (
                            <span className={styles.msgStatus} data-status={status}>
                                {renderMessageStatus(message, intl.formatMessage)}
                            </span>
                        )}
                    </div>
                </div>
            </section>
        );
    }
}

export default AudioMessage;
