import React from 'react'
import { View, TextInput, StyleSheet, TouchableOpacity ,Text,SafeAreaView ,Dimensions,Keyboard, ScrollView} from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { updateEmail,updatePassword ,updateKey,updateUuid} from '../../actions/user'
import theme from '../../theme/theme'
import DpLogo from '../../components/dpLogo'
import Divider from '../../components/divider'
import {fetchMyDataInfo,updateMyDataInfo} from '../../func/userSettings'
import Spinner from 'react-native-spinkit';
import { Overlay } from 'react-native-elements';
import Header from '../../components/header'


class ContactInfoSettings extends React.Component {
  constructor(props) { 
    super(props);
    this.state={email:'',loading:false,phone:'',myData:null}

  }
async componentDidMount(){
    let {login,password}=this.props.user.credentials
    this.setState({loading:true})
    let resp=await fetchMyDataInfo(login,password)

    if(resp.success){
        let obj=resp.data[0]
        this.setState({myData:obj,email:obj.email,phone:obj.phone})
    }
    this.setState({loading:false})

}
showSpinner() {
    return (
        <Overlay isVisible={this.state.loading} >
            <Spinner isVisible={true} size={100} type='Pulse'  color={theme.D_BLUE} />
        </Overlay>
    )
  }
async updateMyInfo(){
    let {login,password}=this.props.user.credentials
    let myNewObj=this.state.myData
    myNewObj.email=this.state.email
    myNewObj.phone=this.state.phone
    let resp=await updateMyDataInfo(login,password,myNewObj)
    this.props.navigation.goBack()
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


renderContactInput(){
    return(
        <>
            {this.renderInputField("Email",'email')}
            {this.renderInputField("Telefon",'phone')}
        </>
    )
}
renderSaveButton(){
    return(
        <TouchableOpacity style={styles.saveButton} onPress={()=>{this.updateMyInfo()}}>
            <Text style={{...styles.buttonText,color:'white'}}>ZAPISZ</Text>
        </TouchableOpacity>
    )
}

    render() {
        return (

                <SafeAreaView style={styles.container}>
                    <Header nav={this.props.navigation} withSettingsButton={false}/>
                    {this.showSpinner()}
                    <ScrollView contentContainerStyle={styles.innerContainterStyle} >
                        <Divider name='DANE KONTAKTOWE' withMargin={true}/>
                        {this.renderContactInput()}

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
)(ContactInfoSettings)