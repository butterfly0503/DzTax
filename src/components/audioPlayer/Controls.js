import React, {Component} from 'react';

import {
    View,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import {Icon} from 'react-native-elements';

export default class Controls extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let backwardDisabled = this.props.selectedTrack <= 0;
        let forwardDisabled = this.props.selectedTrack + 1 >= this.props.totalTracks;
        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={this.props.onBackward} disabled={backwardDisabled}>
                    <Icon name='stepbackward' type='antdesign' size={20} color={backwardDisabled ? 'grey' : '#004176'}/>
                </TouchableOpacity>
                <View style={{width: 20}}/>
                <TouchableOpacity
                    style={styles.playButton}
                    onPress={this.props.paused ? this.props.onPressPlay : this.props.onPressPause}>
                    <Icon name={this.props.paused ? 'play-arrow' : 'pause'} type='material' size={20} color='#fff'/>
                </TouchableOpacity>
                <View style={{width: 20}}/>
                <TouchableOpacity onPress={this.props.onForward}
                                  disabled={forwardDisabled}>
                    <Icon name='stepforward' type='antdesign' size={20} color={forwardDisabled ? 'grey' : '#004176'}/>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
    },
    playButton: {
        shadowColor: 'rgba(0,0,0, .4)', // IOS
        shadowOffset: {height: 2, width: 2}, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS
        backgroundColor: '#004176',
        elevation: 4, // Android
        height: 40,
        width: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
});
