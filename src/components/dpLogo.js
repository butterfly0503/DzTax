import React, {Component} from 'react';
import {View, StyleSheet, Image, Text, TouchableOpacity} from 'react-native';
import theme from '../theme/theme';


class DpLogo extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }


    render() {

        return (
            <TouchableOpacity style={[styles.containterStyle, {flexDirection: 'row'}, {
                paddingHorizontal: parseInt(this.props.logoWidth * 0.1),
                paddingVertical: parseInt(this.props.logoWidth * 0.05), ...this.props.style,
            }]} onPress={() => {
                this.props.nav.navigate('Main');
            }}>

                <Image source={require('../resources/images/logo.png')} resizeMode="stretch" style={styles.logoImage}/>
                {/* <Text style={{fontSize:parseInt(this.props.logoWidth*0.4),color:'black',alignSelf:'center',textAlign:'center',justifyContent:'center'}}>DPDZ</Text> */}
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    containterStyle: {
        backgroundColor: theme.LOGO_COLOR,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoImage: {
        width: 110,
        height: 30,
        marginBottom: 15,
    },
});

export default DpLogo;
