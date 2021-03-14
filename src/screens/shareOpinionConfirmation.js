import React from 'react'
import { View, TextInput, StyleSheet,Image, TouchableOpacity ,Text,SafeAreaView ,Dimensions,Keyboard, ScrollView} from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { updateEmail,updatePassword ,updateKey,updateUuid} from '../actions/user'
import theme from '../theme/theme'
import DpLogo from '../components/dpLogo'
import Divider from '../components/divider'
import CheckBox from '@react-native-community/checkbox';



class ShareOpinionConfirmation extends React.Component {
  constructor(props) { 
    super(props);
    this.state={}

  }

renderSaveButton(){
    return(
        <TouchableOpacity style={styles.saveButton} onPress={()=>{this.props.navigation.navigate('Main')}}>
            <Text style={{...styles.buttonText,color:'white'}}>ZAMKNIJ</Text>
        </TouchableOpacity>
    )
}
renderThanks(){
    return(
        <View style={styles.textContainter}>
            <Text style={styles.thanksStyle}>Dziękujemy za poświęcony czas na podzielenie się Twoimi sugestiami na temat aplikacji!Twoja opinia jest dla nas bardzo ważna:) </Text>


        </View>
    )
}

    render() {
        return (

                <SafeAreaView style={styles.container}>
                    <View style={{padding:'5%'}}>
                        <DpLogo logoWidth={parseInt(Dimensions.get('window').width*0.3)} 
                        style={{alignSelf:'flex-start'}} nav={this.props.navigation} />
                    </View>
                    <ScrollView contentContainerStyle={styles.innerContainterStyle} >
                        <Divider name='POTWIERDZENIE' withMargin={true}/>
                        {this.renderThanks()}

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
    textContainter:{
        width:'100%',
        alignSelf:'center',
        alignItems:'center',
        padding:'4%',
        backgroundColor:theme.SUBCATEGORY_COLOR,
        marginTop:'5%'
    },
    thanksStyle:{
        textAlign:'justify',
        fontSize:20,
        color:'black'
    },    
    saveButton:{
        backgroundColor:theme.D_BLUE,
        marginTop:'10%',
        width:'100%',
        borderRadius:10,
        padding:'4%',
        alignSelf:'center'
    },
    buttonText:{
        fontSize:20,
        color:'black',
        fontWeight:'bold',
        textAlign:'center'
    },

    


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
)(ShareOpinionConfirmation)