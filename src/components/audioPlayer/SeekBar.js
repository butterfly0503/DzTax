import React, { Component } from 'react';

import {
    View,
    Text,
    StyleSheet,
} from 'react-native';
import Slider from '@react-native-community/slider';

function pad(n, width, z = 0) {
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

const minutesAndSeconds = (position) => ([
    pad(Math.floor(position / 60), 2),
    pad(position % 60, 2),
]);

const SeekBar = ({
                     trackLength,
                     currentPosition,
                     onSeek,
                     onSlidingStart,
                 }) => {
    const elapsed = minutesAndSeconds(currentPosition);
    const remaining = minutesAndSeconds(trackLength);
    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                {elapsed[0] + ":" + elapsed[1]}
            </Text>
            <Slider
                maximumValue={Math.max(trackLength, 1, currentPosition + 1)}
                onSlidingStart={onSlidingStart}
                onSlidingComplete={onSeek}
                value={currentPosition}
                thumbTintColor='#8ABCE6'
                minimumTrackTintColor='#8ABCE6'
                maximumTrackTintColor='#C8DDF3'
                thumbStyle={styles.thumb}
                trackStyle={styles.track}
                style={{flex: 1}}
            />
            <Text style={styles.text}>
                {trackLength > 1 && remaining[0] + ":" + remaining[1]}
            </Text>
        </View>
    );
};

export default SeekBar;

const styles = StyleSheet.create({
    slider: {
        marginTop: -12,
    },
    container: {
        width: '80%',
        flexDirection: 'row'
    },
    track: {
        height: 4,
        borderRadius: 1,
    },
    thumb: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#8ABCE6',
    },
    text: {
        fontSize: 14,
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#8ABCE6'
    }
});
