import React from 'react'
import { View, TextInput, StyleSheet, TouchableOpacity ,Text,SafeAreaView ,Dimensions,Keyboard, ScrollView,Linking,ImageBackground} from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { updateEmail,updatePassword ,updateKey,updateUuid} from '../actions/user'
import theme from '../theme/theme'
import Divider from '../components/divider'
import Header from '../components/header'
import { Icon } from 'react-native-elements';
import DropDownPicker from 'react-native-dropdown-picker';
import CheckBox from '@react-native-community/checkbox';




class EcardSummary extends React.Component {
  constructor(props) { 
    super(props);
    this.state={price:99,amount:1,chosenItems:null,firstName:'',lastName:'',totalPrice:null,email:'',accepted:false}

  }

renderNameSurname(){


    return(
            
        <View style={{width:'100%',justifyContent:'space-between',flexDirection:'row'}}>
            <View style={{...styles.textContainerStyle,width:'45%'}}>
                <Text style={{fontSize:20}} numberOfLines={1} adjustsFontSizeToFit={true}>{this.props.user.giftCard.firstName}</Text>
            </View>
            <View style={{...styles.textContainerStyle,width:'45%'}}>
                <Text style={{fontSize:20}} numberOfLines={1} adjustsFontSizeToFit={true}>{this.props.user.giftCard.lastName}</Text>
            </View>
        </View>

    )
}
renderPrice(){
    return(
        <View style={styles.pickingContainerStyle}>
            <View style={{...styles.textContainerStyle,width:'45%',backgroundColor:theme.SUBCATEGORY_COLOR}}>
                <Text style={{fontSize:20}} numberOfLines={1} adjustsFontSizeToFit={true} >Suma</Text>
            </View>
            <View style={{...styles.textContainerStyle,width:'45%'}}>
                <Text style={{fontSize:20}} numberOfLines={1} adjustsFontSizeToFit={true}>{this.props.user.giftCard.price} zł</Text>
            </View>
        </View> 
    )
}

renderButtons(){
    return(
        <View style={{flexDirection:'row',width:'100%',justifyContent:'space-between'}}>
            <TouchableOpacity style={{...styles.saveButton,backgroundColor:theme.LIGHT_BLUE}} onPress={()=>{this.props.navigation.goBack()}}>
                <Text style={{...styles.buttonText,color:'white'}}>ZMIEŃ DANE</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={()=>{this.props.navigation.navigate('GiftcardPayment')}}>
                <Text style={{...styles.buttonText,color:'white'}}>AKCEPTUJ</Text>
            </TouchableOpacity>
        </View>
        
    )
}
renderPreview(){
    console.log(this.props.user.giftCard)
    return(
        null
    )
}
renderPreview(){
    let {image,title,firstName,lastName}=this.props.user.giftCard
    let fullName=firstName+' '+lastName

    return(
        <ImageBackground style={styles.previewStyle} source={{uri:image}} resizeMode='stretch'>
            <Text style={{color:'white',fontSize:20,textAlign:'center'}}>{title}</Text>
            <Text style={{color:'white',fontSize:20,textAlign:'center'}}>{fullName}</Text>
        </ImageBackground>
         
    )
}
    render() {
        return (

                <SafeAreaView style={styles.container}>
                    <Header nav={this.props.navigation}/>
                    <ScrollView contentContainerStyle={styles.innerContainterStyle} >
                        <Divider name='PODSUMOWANIE E-KARTY' withMargin={true}/>
                        {this.renderPreview()}
                        <Divider name='DANE ODBIORCY' withMargin={true}/>
                        <View style={{...styles.textContainerStyle,width:'45%',backgroundColor:theme.SUBCATEGORY_COLOR}}>
                            <Text style={{fontSize:20}} numberOfLines={1} adjustsFontSizeToFit={true} >{this.props.user.giftCard.title}</Text>
                        </View>
                        {this.renderNameSurname()}
                        {this.renderPrice()}
                        <Divider name='DOSTAWA' withMargin={true}/>
                        <Text style={{fontSize:15,fontWeight:'bold',alignSelf:'flex-start',marginTop:'2%'}}>Wysyłka na adres e-mail</Text>
                        <View style={{...styles.textContainerStyle,width:'80%',borderRadius:10,alignSelf:'center'}}>
                            <Text style={{fontSize:20}} numberOfLines={1} adjustsFontSizeToFit={true}>{this.props.user.giftCard.email}</Text>
                        </View>
                        {this.renderButtons()}



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
    acceptTermsStyle:{
        borderWidth:1,
        borderColor:theme.L_BLUE,
        padding:'4%',
        borderRadius:10,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        width:'100%',
        marginTop:'5%'
    },
    buttonText:{
        fontSize:20,
        color:'black',
        fontWeight:'bold',
        textAlign:'center'
    },
    saveButton:{
        backgroundColor:theme.D_BLUE,
        marginTop:'5%',
        width:'45%',
        borderRadius:10,
        padding:'4%',
        alignSelf:'center'
    },
    textContainerStyle:{
        borderWidth:1,
        borderColor:theme.L_BLUE,
        width:'100%',
        marginTop:'5%',
        paddingVertical:'3%',
        paddingHorizontal:'1%',
        alignSelf:'flex-start',
        alignItems:'center',
        justifyContent:'flex-start'
    },

    pickingContainerStyle:{
        flexDirection:'row',
        width:'100%',
        alignItems:'center',
        justifyContent:'space-between',
    },   
    inputStyle:{
        padding:'4%',
        width:'100%',
        fontSize:20,
        alignItems:'center',
        borderWidth:1,
        borderColor:theme.L_BLUE

    },
    nameContainer:{
        width:"100%",
        alignItems:'center',
        alignSelf:'center',
        justifyContent:'space-between',
        marginTop:'5%'
    },
    previewStyle:{
        width:Dimensions.get('window').width*0.8,
        height:Dimensions.get('window').height*0.3,
        alignSelf:'center',
        alignItems:'center',
        justifyContent:'center',
        marginTop:'5%'
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
)(EcardSummary)