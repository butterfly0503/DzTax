import { Icon } from 'react-native-elements';
import React, { Component } from 'react';
import { View, StyleSheet,Dimensions,Text, ImageBackground} from 'react-native'
import DpLogo from './dpLogo'




export default class Header extends Component {
constructor(props) {
    super(props)
    this.state = {  }

}

render() {
    return(
        <View>
            <ImageBackground resizeMode="cover" source={require('../resources/images/header.png')} style={styles.backgroundContainterStyle}>
                <View style={styles.headerStyle}>
                    <DpLogo logoWidth={parseInt(Dimensions.get('window').width*0.3)} nav={this.props.nav} />
                    <Text style={styles.headerTextStyle}>{this.props.title}</Text>
                    {this.renderSettings()}
                </View>
            </ImageBackground>
            <View style={styles.bar} />
        </View>

    )

}

renderSettings(){

    return(
        this.props.withSettingsButton !== false ? <Icon name='cog-outline' type='material-community' size={30} color='white' onPress={()=>{this.props.nav.navigate('Settings')}} /> : null
    )
}
}
const styles = StyleSheet.create({
    headerStyle:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        alignSelf:'center',
        width:'90%',
        paddingVertical:'5%',
        height: 150
      },
    headerTextStyle:{
        fontSize:20,
        fontWeight:'bold',
        color: 'white'
    },
    backgroundContainterStyle:{
        height: 110,
        width: '100%',
    },
    bar: {
        width: '100%',
        height: 10,
        backgroundColor: '#E9F1FA'
    }

})
