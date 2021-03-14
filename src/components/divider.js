import React, {Component} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import theme from '../theme/theme';


export default class Divider extends Component {
    constructor(props) {
        super(props);
        this.state = {};

    }

    render() {
        return (
            <View style={{...styles.dividerContainterStyle, marginTop: this.props.withMargin ? '5%' : null}}>
                <Text style={{...styles.dividerTextStyle, color: this.props.color ? this.props.color : theme.D_BLUE}} numberOfLines={1}
                      adjustsFontSizeToFit={true}>{this.props.name}</Text>
            </View>
        );

    }
}
const styles = StyleSheet.create({
    dividerContainterStyle: {
        // backgroundColor:'#fff',
        // borderWidth:1,
        // borderColor:theme.L_BLUE,
        width: '100%',
        padding: '4%',
        marginTop: '5%',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    dividerTextStyle: {
        alignSelf: 'flex-start',
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: '3%',
        color: theme.D_BLUE,
    },


});
