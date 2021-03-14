import React from 'react'
import { View, TextInput, StyleSheet,Image, TouchableOpacity ,Text,SafeAreaView ,Dimensions,Keyboard, ScrollView,Linking} from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { updateEmail,updatePassword ,updateKey,updateUuid} from '../actions/user'
import theme from '../theme/theme'
import DpLogo from '../components/dpLogo'
import Divider from '../components/divider'
import CheckBox from '@react-native-community/checkbox';
import {sendEmail} from '../func/utils'
import {handleGiftCardPayment} from '../func/userSettings'
import FlashMessage from "react-native-flash-message";

class GiftcardPayment extends React.Component {
  constructor(props) { 
    super(props);
    this.state={chosenPayment:'',creditCardNumber:'',creditCardDueDate:'',cvc:'',blikCode:''}
    this.messageRef=null
  }

renderInputField(placeholder,field,styleProps){
    return(
        <TextInput placeholder={placeholder} value={this.state[field]} 
        onChangeText={value => this.setState({[field]:value}) }
        style={{...styles.inputStyle,marginTop:'5%',...styleProps}}
        placeholderTextColor='gray'
        multiline={false}
        onSubmitEditing={()=>{Keyboard.dismiss()}}
        onLayout={(e)=>{this.inputHeightPointer=e.nativeEvent.layout.height}}
        />
    )
}
makePayment(link){
    Linking.canOpenURL(link).then(supported => {
        if (supported) {
          Linking.openURL(link);
        } 
      });
}

renderDotpay(){
    return(
        <View style={{width:'100%'}}>
            {this.renderCheckText('Dotpay','dotpay')}
        </View>
    )
}

renderCheckText(descriptiom,field){
    return(
        <TouchableOpacity style={styles.acceptTermsStyle}
        onPress={()=>{this.setState({chosenPayment:field})}}>
        <CheckBox
        value={this.state.chosenPayment===field}
        size={40}
        onValueChange={(newValue) => {this.setState({chosenPayment:newValue?field:''})}}
        tintColors={{true: theme.LIGHT_BLUE, false: 'gray'}}
        tintColor='gray'
        onFillColor={theme.LIGHT_BLUE}
        />
        <Text style={{fontSize:20}}>{descriptiom}</Text>
    </TouchableOpacity>
    )
}
renderPaymentComponent(){
    return(
        <View style={{width:'100%'}}>
            {this.renderDotpay()}

            
        </View>
    )
}
async handlePayment(){
    if(this.state.chosenPayment!=''){
        let {price,amount,image,title,firstName,lastName,email}=this.props.user.giftCard
        console.log(this.props.user.giftCard)
        let resp=await handleGiftCardPayment(this.props.user.credentials.login,this.props.user.credentials.password,amount,firstName,lastName,title,image,email)
        if(resp.success){
            this.makePayment(resp.link)
            this.props.navigation.navigate('GiftcardConfirmation')
        }
    }
    else{
        this.messageRef.showMessage({message: "WYBIERZ SPOSÓB PŁATNOŚCI",type: "warning",duration:500});

    }
    
}
renderSaveButton(){
    
    return(
        <TouchableOpacity style={styles.saveButton} onPress={()=>{this.handlePayment()}}>
            <Text style={{...styles.buttonText,color:'white'}}>WYKONAJ</Text>
        </TouchableOpacity>

    )
}
renderPrice(){
    return(
        <View style={styles.pickingContainerStyle}>
            <View style={{...styles.textContainerStyle,width:'45%',backgroundColor:theme.SUBCATEGORY_COLOR}}>
                <Text style={{fontSize:20}} numberOfLines={1} adjustsFontSizeToFit={true} >DO ZAPŁATY</Text>
            </View>
            <View style={{...styles.textContainerStyle,width:'45%',borderRadius:10}}>
                <Text style={{fontSize:20}} numberOfLines={1} adjustsFontSizeToFit={true}>{this.props.user.giftCard.price} zł</Text>
            </View>
        </View> 
    )
}
    render() {
        return (

                <SafeAreaView style={styles.container}>
                    <View style={{padding:'5%'}}>
                        <DpLogo logoWidth={parseInt(Dimensions.get('window').width*0.3)}
                         style={{alignSelf:'flex-start'}} nav={this.props.navigation}/>
                    </View>
                    <FlashMessage  ref={(ref) => { this.messageRef = ref }}/>
                    <ScrollView contentContainerStyle={styles.innerContainterStyle} >
                        <Divider name='PŁATNOŚCI' withMargin={true}/>
                        {this.renderPaymentComponent()}
                        {this.renderPrice()}
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
    subButtonContainter:{
        borderRadius:10,
        borderWidth:1,
        padding:'4%',
        alignItems:'center',
        justifyContent:'center',
        borderColor:theme.L_BLUE,
        width:'45%'
    },
    inputStyle:{
        color:'black',
        fontWeight:'bold',
        fontSize:17,
        borderWidth:1,
        borderRadius:10,
        padding:'4%',
        borderColor:theme.L_BLUE,
        width:'100%',
        textAlign:'center',
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
    pickingContainerStyle:{
        flexDirection:'row',
        width:'100%',
        alignItems:'center',
        justifyContent:'space-between',
        marginTop:'5%'
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
)(GiftcardPayment)