import React from 'react'
import { View, TextInput, StyleSheet,Image, TouchableOpacity ,Text,SafeAreaView ,Dimensions,Keyboard, ScrollView} from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { updateEmail,updatePassword ,updateKey,updateUuid} from '../../actions/user'
import theme from '../../theme/theme'
import DpLogo from '../../components/dpLogo'
import Divider from '../../components/divider'
import CheckBox from '@react-native-community/checkbox';



class PaymentSettings extends React.Component {
  constructor(props) { 
    super(props);
    this.state={chosenPayment:'',
    giftCardNumber:'',giftCardPin:'',creditCardNumber:'',creditCardDueDate:'',cvc:'',blikCode:''}

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
renderGiftCard(){
    return(
        <View style={{width:'100%'}}>
            {this.renderCheckText('Karta podarunkowa','giftCard')}
            {this.state.chosenPayment==='giftCard'?
            <>
            {this.renderInputField('Numer karty','giftCardNumber')}
            {this.renderInputField('Kod PIN','giftCardPin')} 
            </>:null}
        </View>
    )
}
renderCreditCard(){
    return(
        <View style={{width:'100%'}}>
            {this.renderCheckText('Karta kredytowa','creditCard')}
            {this.state.chosenPayment==='creditCard'?
            <>
            <View style={{marginTop:'5%',justifyContent:'space-between',alignItems:'center',flexDirection:'row'}}>
                <View style={styles.subButtonContainter}>
                    <Text style={{fontSize:20}}>Numer karty</Text>
                </View>
                {this.renderInputField('Numer karty','creditCardNumber',{width:'45%',marginTop:'0%'})}
            </View>
            <View style={{marginTop:'5%',justifyContent:'space-between',alignItems:'center',flexDirection:'row'}}>
                <View style={styles.subButtonContainter}>
                    <Text style={{fontSize:20}}>Ważna do</Text>
                </View>
                {this.renderInputField('MM/RR','creditCardDueDate',{width:'45%',marginTop:'0%'})}
            </View>
            <View style={{marginTop:'5%',justifyContent:'space-between',alignItems:'center',flexDirection:'row'}}>
                <View style={{...styles.subButtonContainter,width:'60%'}}>
                    <Text style={{fontSize:20}} numberOfLines={1} adjustsFontSizeToFit={true}>Kod zabezpieczający</Text>
                </View>
                {this.renderInputField('CVC','cvc',{width:'30%',marginTop:'0%'})}
            </View>
            

            </>:null}
        </View>
    )
}
renderBlik(){
    return(
        <View style={{width:'100%'}}>
            {this.renderCheckText('Blik/szybki przelew','blik')}
            {this.state.chosenPayment==='blik'?
            <>

            <View style={{...styles.subButtonContainter,width:'100%',marginTop:'5%'}}>
                <Text style={{fontSize:20,fontWeight:'bold'}} numberOfLines={1} adjustsFontSizeToFit={true}>Wprowadź 6-cyfrowy kod BLIK</Text>
            </View>


            <View style={{marginTop:'5%',justifyContent:'space-between',alignItems:'center',flexDirection:'row'}}>
                <Image source={require('../../resources/images/blikLogo.png')} style={{width:Dimensions.get('window').width*0.75*0.35,height:this.inputHeightPointer}} resizeMode='cover' />
                {this.renderInputField('Kod blik','blikCode',{width:'55%',marginTop:'0%'})}
            </View>

            </>:null}
        </View>
    )
}
renderDotpay(){
    return(
        <View style={{width:'100%'}}>
            {this.renderCheckText('Dotpay','dotpay')}
        </View>
    )
}
renderWireTransfer(){
    return(
        <View style={{width:'100%'}}>
            {this.renderCheckText('Przelew tradycyjny','wireTransfer')}
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
            {this.renderGiftCard()}
            {this.renderCreditCard()}
            {this.renderBlik()}
            {this.renderDotpay()}
            {this.renderWireTransfer()}
            
        </View>
    )
}
renderSaveButton(){
    return(
        <TouchableOpacity style={styles.saveButton} onPress={()=>{this.props.navigation.goBack()}}>
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
                        <Divider name='PŁATNOŚCI' withMargin={true}/>
                        {this.renderPaymentComponent()}

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
)(PaymentSettings)