import React from 'react'
import { View, TextInput, StyleSheet, TouchableOpacity ,Text,SafeAreaView ,Dimensions,Keyboard, ScrollView,Linking} from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { updateGiftCard} from '../actions/user'
import theme from '../theme/theme'
import Divider from '../components/divider'
import Header from '../components/header'
import { Icon } from 'react-native-elements';
import DropDownPicker from 'react-native-dropdown-picker';
import CheckBox from '@react-native-community/checkbox';
import FlashMessage from "react-native-flash-message";
import { showMessage, hideMessage } from "react-native-flash-message";


class EcardStyling extends React.Component {
  constructor(props) { 
    super(props);
    this.state={price:99,amount:1,chosenTitleItem:null,firstName:'',lastName:'',totalPrice:null,email:'',accepted:false}

  }

showDataTerms(type){
    let links=['https://thenewstack.io/why-every-company-needs-a-data-policy/','https://en.wikipedia.org/wiki/Terms_of_service']
    Linking.canOpenURL(links[type]).then(supported => {
        if (supported) {
          Linking.openURL(links[type]);
        } 
      });
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
renderNameSurname(){
    let items=[{label:'Pan',value:'Pan'},{label:'Pani',value:'Pani'},{label:'Inne',value:'Inne'}]
    let myStyle=styles.nameContainer
    if(Platform.OS === 'ios'){
      myStyle={...myStyle,zIndex:20}
    }
    return(
        <View style={myStyle}>
            <DropDownPicker
            items={items}
            placeholder="Tytuł"
            containerStyle={{ width:'45%',height:'50%' }}
            itemStyle={{
                justifyContent: 'flex-start'
            }}
            onChangeItem={item => this.setState({
                chosenTitleItem: item
            })}
            />
            <View style={{width:'45%',justifyContent:'space-between'}}>
                {this.renderInputField('Imię','firstName')}
                {this.renderInputField('Nazwisko','lastName')}
            </View>
        </View>


    )
}
renderPrice(){
    return(
        <View style={styles.pickingContainerStyle}>
            <View style={{...styles.textContainerStyle,width:'45%',backgroundColor:theme.SUBCATEGORY_COLOR}}
            onPress={()=>{this.props.navigation.navigate('EcardStyling')}}>
                <Text style={{fontSize:20}} numberOfLines={1} adjustsFontSizeToFit={true} >Suma</Text>
            </View>
            <TouchableOpacity style={{...styles.textContainerStyle,width:'45%'}}>
                <Text style={{fontSize:20}} numberOfLines={1} adjustsFontSizeToFit={true}>{this.props.user.giftCardTotalPrice} zł</Text>
            </TouchableOpacity>
        </View> 
    )
}
renderCheck(){
    return(
        <TouchableOpacity style={styles.acceptTermsStyle}
        onPress={()=>{this.setState({accepted:!this.state.accepted})}}>
            <Text style={{fontSize:20}}>Akceptuję regulamin</Text>
            <CheckBox
            disabled={true}
            value={this.state.accepted}
            size={40}
            onValueChange={(newValue) => {this.setState({accepted:newValue})}}
            tintColors={{true: theme.LIGHT_BLUE, false: 'gray'}}
            tintColor='gray'
            onFillColor={theme.LIGHT_BLUE}
            />
            
        </TouchableOpacity>
    )
}
renderSaveButton(){
    return(
        <TouchableOpacity style={styles.saveButton} onPress={()=>{this.handleNavigate()}}>
            <Text style={{...styles.buttonText,color:'white'}}>WYŚLIJ</Text>
        </TouchableOpacity>
    )
}
handleNavigate(){
    let {chosenTitleItem,firstName,lastName,email,accepted}=this.state
    if(chosenTitleItem &&firstName!='' && firstName!='' && email!='' && accepted){
        let cardObj={title:chosenTitleItem.value,firstName:firstName,lastName:lastName,email:email}
        this.props.updateGiftCard(cardObj)
        this.props.navigation.navigate('EcardSummary')
    }
    else{
        showMessage({message: "UZUPEŁNIJ POLA",type: "warning",duration:500});

    }

}
    render() {
        return (

                <SafeAreaView style={styles.container}>
                    <Header nav={this.props.navigation}/>
                    <FlashMessage ref="myLocalFlashMessage" />
                    <ScrollView contentContainerStyle={styles.innerContainterStyle} >
                        <Divider name='DEDYKACJA' withMargin={true}/>
                        {this.renderNameSurname()}
                        {this.renderPrice()}
                        <Divider name='DOSTAWA' withMargin={true}/>
                        <Text style={{fontSize:15,fontWeight:'bold',alignSelf:'flex-start',marginTop:'2%'}}>Wysyłka na adres e-mail</Text>
                        {this.renderInputField('Adres e-mail','email',{width:'90%',backgroundColor:'white',borderRadius:10})}
                        <Divider name='REGULAMIN' withMargin={true}/>
                        <Text style={{textAlign:'center',color:'blue',fontSize:20}} onPress={()=>{this.showDataTerms(1)}}>TREŚĆ REGULAMINU</Text>
                        {this.renderCheck()}
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
        marginTop:'10%',
        width:'100%',
        borderRadius:10,
        padding:'4%',
        alignSelf:'center'
    },
    textContainerStyle:{
        borderWidth:1,
        borderColor:theme.L_BLUE,
        width:'100%',
        paddingVertical:'3%',
        paddingHorizontal:'1%',
        alignItems:'center',
        justifyContent:'flex-start'
    },

    pickingContainerStyle:{
        flexDirection:'row',
        width:'100%',
        alignItems:'center',
        justifyContent:'space-between',
        marginTop:'5%'
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
        flexDirection:'row',
        alignItems:'center',
        alignSelf:'center',
        justifyContent:'space-between',
        marginTop:'5%',
    }   


    


})

const mapDispatchToProps = dispatch => {
    return bindActionCreators({updateGiftCard}, dispatch)
}

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EcardStyling)