import React, {Component} from 'react';
import {Text, View} from 'react-native';
import SeekBar from './SeekBar';
import Video from 'react-native-video';
import Controls from './Controls';

export default class AudioPlayer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            paused: true,
            totalLength: 1,
            currentPosition: 0,
        };
    }

    setDuration(data) {
        this.setState({totalLength: Math.floor(data.duration), isLoading: false});
    }

    setTime(data) {
        console.log("Set Time: ", data);
        this.setState({currentPosition: Math.floor(data.currentTime)});
    }

    seek(time) {
        time = Math.round(time);
        this.refs.audioElement && this.refs.audioElement.seek(time);
        this.setState({
            currentPosition: time,
            paused: false,
        });
    }

    loadStart() {
        this.setState({isLoading: true});
    }

    videoError() {
    }

    onEnd() {
        this.refs.audioElement && this.refs.audioElement.seek(0);
        this.setState({
            currentPosition: 0,
            paused: true,
        });
    }

    render() {
        const audioUrl = this.props.audioUrl;
        console.log("Choose audio: ", audioUrl);
        const video = this.state.isChanging ? null : (
            <Video source={{uri: audioUrl}} // Can be a URL or a local file.
                   ref="audioElement"
                   playInBackground={true}
                   playWhenInactive={true}
                   paused={this.state.paused}               // Pauses playback entirely.
                   resizeMode="cover"           // Fill the whole screen at aspect ratio.
                   repeat={false}                // Repeat forever.
                   onLoadStart={this.loadStart.bind(this)} // Callback when video starts to load
                   onLoad={this.setDuration.bind(this)}    // Callback when video loads
                   onProgress={this.setTime.bind(this)}    // Callback every ~250ms with currentTime
                   onEnd={this.onEnd.bind(this)}           // Callback when playback finishes
                   onError={this.videoError}    // Callback when video cannot be loaded
                   style={styles.audioElement}/>
        );
        return (
            <View style={styles.container}>
                {this.state.isLoading && <Text>Ładowanie dźwięku ...</Text>}
                {!this.state.isLoading &&
                <SeekBar
                    onSeek={this.seek.bind(this)}
                    trackLength={this.state.totalLength}
                    onSlidingStart={() => this.setState({paused: true})}
                    currentPosition={this.state.currentPosition}
                />}
                {!this.state.isLoading &&
                <Controls
                    selectedTrack={this.props.selectedTrack}
                    totalTracks={this.props.totalTracks}
                    onPressPlay={() => this.setState({ paused: false })}
                    onPressPause={() => this.setState({ paused: true })}
                    paused={this.state.paused}
                    onBackward={this.props.onBackward}
                    onForward={this.props.onForward}
                />}
                {video}
            </View>
        );
    }
}

const styles = {
    container: {
        marginTop: 30,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center'
    },
    audioElement: {
        height: 0,
        width: 0,
    },
};
