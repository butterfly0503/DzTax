import React from 'react'
import { View, TextInput, StyleSheet,Linking, TouchableOpacity ,Text,SafeAreaView ,Dimensions,Keyboard, ScrollView, Image, ImageBackground} from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { updateEmail,updatePassword ,updateKey,updateUuid,setGiftCardTotalPrice,updateGiftCard} from '../actions/user'
import theme from '../theme/theme'
import Divider from '../components/divider'
import Header from '../components/header'
import { Icon } from 'react-native-elements';
import FlashMessage from "react-native-flash-message";
import { showMessage, hideMessage } from "react-native-flash-message";
import DropDownPicker from 'react-native-dropdown-picker';
import CheckBox from '@react-native-community/checkbox';
import { Overlay } from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';


class Ecard extends React.Component {
  constructor(props) { 
    super(props);
    this.state={price:100,amount:1,chosenTitleItem:null,firstName:'',lastName:'',imagebase64:null,totalPrice:null,email:'',accepted:false,pickedMockup:0,mockupOverlayVis:false,mockupChosen:true,
    localImageUri:null,mockups:['https://cdn.pixabay.com/photo/2020/04/02/23/01/rain-4996916_960_720.jpg','https://cdn.pixabay.com/photo/2020/04/02/23/01/rain-4996916_960_720.jpg',
    'https://cdn.pixabay.com/photo/2020/04/25/18/45/robinia-5092118_960_720.jpg','https://cdn.pixabay.com/photo/2020/04/24/18/28/blue-bell-5088073_960_720.jpg']}
    this.messageRef=null

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
renderSubText(){
    return(
        <View style={{...styles.textContainerStyle,marginTop:'5%'}}>
            <Text style={{fontSize:20}} numberOfLines={1} adjustsFontSizeToFit={true}>Chcę kupić kartę o wartości (min 100 PLN)</Text>
        </View>
    )
}
add(value,field){
    let curr=this.state[field]

    if(curr+value>(field==='price'?98:0)){
        this.setState({[field]:curr+value})
    }
}
renderPrice(){
    return(
        <View style={styles.pickingContainerStyle}>
            <View style={{...styles.textContainerStyle,width:'45%'}}>
                <Text style={{fontSize:20}} numberOfLines={1} adjustsFontSizeToFit={true}>Wartość E-karty</Text>
            </View>
            <View style={{...styles.plusMinusMonthContainter,justifyContent:'center'}}>
                <Text style={{fontSize:20}}>{this.state.price} zł</Text>
            </View>
        </View>
    )
}
renderAmount(){
    return(
        <View style={styles.pickingContainerStyle}>
            <View style={{...styles.textContainerStyle,width:'45%'}}>
                <Text style={{fontSize:20}} numberOfLines={1} adjustsFontSizeToFit={true}>Ilość</Text>
            </View>
            <View style={styles.plusMinusMonthContainter}>
                <Icon name='minus' type='entypo' size={20} color='black' onPress={()=>{this.add(-1,'amount')}} />
                <Text style={{fontSize:20}}>{this.state.amount}</Text>
                <Icon name='plus' type='entypo' size={20} color='black' onPress={()=>{this.add(1,'amount')}}/>
            </View>
        </View>
    )
}

renderButtons(){
    return(
        <View style={{...styles.pickingContainerStyle,justifyContent:'center'}}>
            <TouchableOpacity style={{...styles.textContainerStyle,width:'45%',backgroundColor:theme.SUBCATEGORY_COLOR}}
            onPress={()=>{this.setState({mockupOverlayVis:true})}}>
                <Text style={{fontSize:20}} numberOfLines={1} adjustsFontSizeToFit={true} >WYBIERZ SZABLON</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity style={{...styles.textContainerStyle,width:'45%',backgroundColor:theme.SUBCATEGORY_COLOR}}
            onPress={()=>{this.pickImage()}}>
                <Text style={{fontSize:20}} numberOfLines={1} adjustsFontSizeToFit={true}>DODAJ OBRAZ</Text>
            </TouchableOpacity> */}
        </View> 
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
renderTotalPrice(){
    return(
        <View style={styles.pickingContainerStyle}>
            <View style={{...styles.textContainerStyle,width:'45%',backgroundColor:theme.SUBCATEGORY_COLOR}}>
                <Text style={{fontSize:20}} numberOfLines={1} adjustsFontSizeToFit={true} >Suma</Text>
            </View>
            <TouchableOpacity style={{...styles.textContainerStyle,width:'45%'}}>
                <Text style={{fontSize:20}} numberOfLines={1} adjustsFontSizeToFit={true}>{this.state.price*this.state.amount} zł</Text>
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
handleSend(){
    let {chosenTitleItem,firstName,lastName,email,accepted,amount,price,mockupChosen,mockups,pickedMockup,imagebase64}=this.state
    if(chosenTitleItem &&firstName!='' && firstName!='' && email!='' && accepted){
        let cardObj={title:chosenTitleItem.value,firstName:firstName,lastName:lastName,email:email,
            amount:amount,price:amount*price,image:mockupChosen?mockups[pickedMockup]:imagebase64}
        this.props.updateGiftCard(cardObj)
        this.props.navigation.navigate('EcardSummary')
    }
    else{
        this.messageRef.showMessage({message: "UZUPEŁNIJ POLA",type: "warning",duration:500});

    }

}
pickImage(){
    const options = {
        quality: 0.5
    };
    ImagePicker.showImagePicker(options,(response) => {

      
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          this.setState({
            localImageUri: response.uri,mockupChosen:false,imagebase64:'data:image/jpeg;base64,' + response.data
          });
        }
      });
}
renderSendButton(){
    return(
        <TouchableOpacity style={styles.saveButton} onPress={()=>{this.handleSend()}}>
            <Text style={{...styles.buttonText,color:'white'}}>WYŚLIJ</Text>
        </TouchableOpacity>
    )
}
renderOneMockup(item,index){
    return(
        <TouchableOpacity onPress={()=>{this.setState({mockupOverlayVis:false,pickedMockup:index,mockupChosen:true})}} key={index} style={{paddingVertical:'5%'}}>
            <Image source={{uri:item}} style={{width:Dimensions.get('window').width*0.6,height:Dimensions.get('window').height*0.2}} />
        </TouchableOpacity>
    )
}
renderPickMockup(){

    return(
        <Overlay overlayStyle={{ width: '80%',height:'80%'}} isVisible={this.state.mockupOverlayVis} onBackdropPress={() => { this.setState({ mockupOverlayVis: false }) }}>
            <ScrollView contentContainerStyle={{alignItems:'center'}}>
                {this.state.mockups.map((it,id)=>{return(
                    this.renderOneMockup(it,id)
                )})}
                
            </ScrollView>
        </Overlay>
    )
}
renderPreview(){
    let {pickedMockup,mockupChosen,localImageUri,mockups,firstName,lastName}=this.state
    let imgSource=mockupChosen?mockups[pickedMockup]:localImageUri
    let text0=this.state.chosenTitleItem?this.state.chosenTitleItem.value:'Tytuł'
    let text1=(firstName||lastName||this.state.chosenTitleItem)?(firstName+' '+lastName):'Imie i nazwisko'

    return(
        <ImageBackground style={styles.previewStyle} source={{uri:imgSource}} resizeMode='stretch'>
            <Text style={{color:'white',fontSize:20,textAlign:'center'}}>{text0}</Text>
            <Text style={{color:'white',fontSize:20,textAlign:'center'}}>{text1}</Text>
        </ImageBackground>
    )
}
    render() {
        return (

                <SafeAreaView style={styles.container}>
                    <Header nav={this.props.navigation}/>
                    <FlashMessage ref={(ref) => { this.messageRef = ref }} />

                    <ScrollView contentContainerStyle={styles.innerContainterStyle} >
                        <Divider name='KARTY PODARUNKOWE (E-karta)' withMargin={true}/>
                        {this.renderPickMockup()}
                        {this.renderSubText()}
                        {this.renderPrice()}
                        {this.renderAmount()}
                        <Divider name='WYGLĄD E-KARTY' withMargin={true}/>
                        {this.renderButtons()}
                        {this.renderPreview()}
                        <Divider name='DEDYKACJA' withMargin={true}/>
                        {this.renderNameSurname()}
                        {this.renderTotalPrice()}
                        <Divider name='DOSTAWA' withMargin={true}/>
                        <Text style={{fontSize:15,fontWeight:'bold',alignSelf:'flex-start',marginTop:'2%'}}>Wysyłka na adres e-mail</Text>
                        {this.renderInputField('Adres e-mail','email',{width:'90%',backgroundColor:'white',borderRadius:10})}
                        <Divider name='REGULAMIN' withMargin={true}/>
                        <Text style={{textAlign:'center',color:'blue',fontSize:20}} onPress={()=>{this.showDataTerms(1)}}>TREŚĆ REGULAMINU</Text>
                        {this.renderCheck()}
                        {this.renderSendButton()}


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
    plusMinusMonthContainter:{
        flexDirection:'row',
        alignItems:'center',
        borderWidth:1,
        borderColor:'gray',
        width:'45%',
        justifyContent:'space-between',
        padding:'3%'
    },
    dividerTextStyle:{
        alignSelf:'flex-start',
        fontSize:20
    },
    pickingContainerStyle:{
        flexDirection:'row',
        width:'100%',
        alignItems:'center',
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
    return bindActionCreators({ updateEmail,updatePassword ,updateKey,updateUuid,setGiftCardTotalPrice,updateGiftCard}, dispatch)
}

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Ecard)