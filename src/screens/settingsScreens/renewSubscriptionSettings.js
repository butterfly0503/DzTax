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
import Header from '../../components/header'


class RenewSubscriptionSettings extends React.Component {
  constructor(props) { 
    super(props);
    this.state={subscriptionMonths:1}

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
addDate(value){
    let dummy=this.state.subscriptionMonths
    if(value>0){
        dummy+=1
    }
    else{
        if(dummy>1){
            dummy-=1
        }
    }
    this.setState({subscriptionMonths:dummy})
}
renderSubscription(){
    let dueDate=moment(this.props.route.params.endDate).add(this.state.subscriptionMonths,'month').format('DD/MM/YYYY')
    let totalAmount=100*this.state.subscriptionMonths
    return(
        <View style={{width:'100%'}}>
            <View style={styles.subscriptionLineContainter}>
                <View style={styles.subButtonContainter}>
                    <Text style={styles.labelTextStyle}>Miesiąc</Text>
                </View>
                <View style={styles.plusMinusMonthContainter}>
                    <Icon name='minus' type='entypo' size={20} color='black' onPress={()=>{this.addDate(-1)}} />
                    <Text style={{fontSize:20}}>{this.state.subscriptionMonths}</Text>
                    <Icon name='plus' type='entypo' size={20} color='black' onPress={()=>{this.addDate(1)}}/>
                </View>
            </View>
            <View style={{alignItems:'center',justifyContent:'space-between',flexDirection:'row',marginTop:'3%'}}>
                <View style={styles.subButtonContainter}>
                    <Text style={styles.labelTextStyle} numberOfLines={1} adjustsFontSizeToFit={true}>Termin ważności</Text>
                </View>
                <View style={styles.plusMinusMonthContainter}>
                    <Text style={{fontSize:20}} numberOfLines={1} adjustsFontSizeToFit={true}>{dueDate}</Text>
                </View>
            </View>
            <View style={{alignItems:'center',justifyContent:'space-between',flexDirection:'row',marginTop:'3%'}}>
                <View style={styles.subButtonContainter}>
                    <Text style={styles.labelTextStyle} numberOfLines={1} adjustsFontSizeToFit={true}>Suma</Text>
                </View>
                <View style={styles.plusMinusMonthContainter}>
                    <Text style={{fontSize:20}} numberOfLines={1} adjustsFontSizeToFit={true}>{totalAmount} zł</Text>
                </View>
            </View>
        </View>
    )
}
renderSaveButton(){
    return(
        <TouchableOpacity style={styles.saveButton} onPress={()=>{this.props.navigation.navigate('RenewSubscriptionPayment',{months:this.state.subscriptionMonths})}}>
            <Text style={{...styles.buttonText,color:'white'}}>ZAPŁAĆ</Text>
        </TouchableOpacity>
    )
}

    render() {
        return (

                <SafeAreaView style={styles.container}>
                    <Header nav={this.props.navigation} withSettingsButton={false}/>
                    <ScrollView contentContainerStyle={styles.innerContainterStyle} >
                        <Divider name='TWOJA SUBSKRYPCJA' withMargin={true}/>
                        {this.renderSubscription()}

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
    },
    subButtonContainter:{
        borderRadius:10,
        // borderWidth:1,
        padding:'4%',
        // alignItems:'left',
        // justifyContent:'left',
        // borderColor:theme.L_BLUE,
        width:'45%'
    },
    plusMinusMonthContainter:{
        flexDirection:'row',
        alignItems:'center',
        borderWidth:1,
        borderColor: theme.D_BLUE,
        borderRadius: 10,
        width:'45%',
        justifyContent:'space-between',
        padding:'3%'
    },
    subscriptionLineContainter:{
        alignItems:'center',
        justifyContent:'space-between',
        flexDirection:'row',
        marginTop:'3%'
    },
    labelTextStyle: {
        fontSize: 17,
        color: theme.L_BLUE,
        fontWeight: 'bold'
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
)(RenewSubscriptionSettings)