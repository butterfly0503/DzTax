import React from 'react'
import { View, TextInput, StyleSheet, TouchableOpacity ,Text,SafeAreaView ,Dimensions,Keyboard, ScrollView} from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { updateEmail,updatePassword ,updateKey,updateUuid} from '../../actions/user'
import theme from '../../theme/theme'
import DpLogo from '../../components/dpLogo'
import Divider from '../../components/divider'
import moment from 'moment'
import { Icon } from 'react-native-elements';


class CancelSubscriptionSettings extends React.Component {
  constructor(props) { 
    super(props);
    this.state={yesChosen:false}

  }


renderButtons(){
    return(
        <View style={styles.buttonContainterStyle}>
            <TouchableOpacity style={{...styles.subButtonContainter,backgroundColor:this.state.yesChosen?'red':'white' }}
            onPress={()=>{this.setState({yesChosen:true})}}>
                <Text style={{...styles.buttonText,color:this.state.yesChosen?'white':'black'}}>TAK</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{...styles.subButtonContainter,backgroundColor:!this.state.yesChosen?theme.LIGHT_BLUE:'white' }}
            onPress={()=>{this.setState({yesChosen:false})}}>
                <Text style={{...styles.buttonText,color:!this.state.yesChosen?'white':'black'}}>NIE</Text>
            </TouchableOpacity>
        </View>
    )
}
renderSaveButton(){
    return(
        <TouchableOpacity style={styles.saveButton} onPress={()=>{this.props.navigation.navigate('Settings')}}>
            <Text style={{...styles.buttonText,color:'white'}}>ZAPISZ</Text>
        </TouchableOpacity>
    )
}

    render() {
        return (

                <SafeAreaView style={styles.container}>
                    <View style={{padding:'5%'}}>
                        <DpLogo logoWidth={parseInt(Dimensions.get('window').width*0.3)} 
                        style={{alignSelf:'flex-start'}} nav={this.props.navigation}/>
                    </View>
                    <ScrollView contentContainerStyle={styles.innerContainterStyle} >
                        <Divider name='TWOJA SUBSKRYPCJA' withMargin={true}/>
                        <Text style={{textAlign:'left',marginTop:'5%',fontSize:17}}>Czy na pewno chcesz zrezygnować z subskrypcji?</Text>
                        {this.renderButtons()}
                        {this.renderSaveButton()}
                    </ScrollView>
                </SafeAreaView>


            
            

        )
    } 
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.BACKGROUND_COLOR,
        flex: 1,
    },
    innerContainterStyle:{
        justifyContent:'flex-start',
        alignItems:'center',
        alignSelf:'center',
        width:'85%',
        paddingBottom:'10%'
    },   
    buttonText:{
        fontSize:20,
        color:'black',
        fontWeight:'bold',
        textAlign:'center'
    },
    saveButton:{
        backgroundColor:theme.LIGHT_BLUE,
        marginTop:'10%',
        width:'100%',
        borderRadius:10,
        padding:'4%',
        alignSelf:'center'
    },
    subButtonContainter:{
        borderRadius:10,
        borderWidth:1,
        padding:'4%',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:theme.LIGHT_BLUE,
        borderColor:theme.L_BLUE,
        width:'45%'
    },
    buttonContainterStyle:{
        width:'100%',
        marginTop:'10%',
        alignItems:'center',
        justifyContent:'space-between',
        alignSelf:'center',
        flexDirection:"row"
    }
    


})

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ updateEmail,updatePassword ,updateKey,updateUuid}, dispatch)
}

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CancelSubscriptionSettings)