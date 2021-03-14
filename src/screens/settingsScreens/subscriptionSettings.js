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
import {getSubscriptionMonths} from '../../func/userSettings'
import Spinner from 'react-native-spinkit';
import { Overlay } from 'react-native-elements';
import Header from '../../components/header'


class SubscriptionSettings extends React.Component {
  constructor(props) { 
    super(props);
    this.state={subscriptionMonths:1,historyVisible:false,startDate:null,endDate:null,loading:false}

  }
async componentDidMount(){
    let {login,password}=this.props.user.credentials
    this.setState({loading:true})
    let resp=await getSubscriptionMonths(login,password)
    if(resp.success){
        let dat=resp.date[0]
        let star=dat.startDate.date.split(' ')
        star=star[0]
        let end=dat.endDate.date.split(' ')
        end=end[0]
        this.setState({startDate:star,endDate:end})
    }
    this.setState({loading:false})

}

renderSubscriptionTerm(){
    let subscriptionDate=moment().add(1,'month').format('DD/MM/YYYY')
    if(this.state.endDate){
        return(
            <View style={styles.buttonStyle} >
                <Text style={styles.buttonText}  numberOfLines={1} adjustsFontSizeToFit={true}>Termin ważności {this.state.endDate}</Text>
            </View>
        )
    }
}
renderSaveButton(){
    return(
        <TouchableOpacity style={styles.saveButton} onPress={()=>{this.props.navigation.goBack()}}>
            <Text style={{...styles.buttonText,color:'white'}}>WRÓĆ</Text>
        </TouchableOpacity>
    )
}
// renderHistoryRow(item,idx){
//     return(
//         <View key={idx} style={styles.historyElementStyle}>
//             <Text style={{fontSize:17,fontWeight:'400'}}>Od {item.from} do {item.to}</Text>
//         </View>
//     )
// }
// renderHistory(){
//     let history=[{from:moment().subtract(4,'month').format('DD/MM/YYYY'),to:moment().subtract(2,'month').format('DD/MM/YYYY')},
//     {from:moment().subtract(2,'month').format('DD/MM/YYYY'),to:moment().subtract(1,'month').format('DD/MM/YYYY')},
//     {from:moment().subtract(1,'month').format('DD/MM/YYYY'),to:moment().add(2,'month').format('DD/MM/YYYY')}]
//     let {historyVisible}=this.state
//     return(
//         <View style={{width:'100%'}}>
//             <View style={styles.historyStyle} >
//                 <Text style={styles.buttonText} >Historia</Text>
//                 <Icon name='arrow-down-circle' type='material-community' size={40} color='gray' onPress={()=>{this.setState({historyVisible:!historyVisible})}} />
//             </View>
//             {historyVisible?history.map((item,idx)=>{return(this.renderHistoryRow(item,idx))}):null}
//         </View>
//     )
// }
renderCurrentSubscription(){
    let from=moment().subtract(2,'month').format('DD/MM/YYYY')
    let to=moment().add(4,'month').format('DD/MM/YYYY')
    return(
        <View style={{...styles.historyStyle,justifyContent:'center'}} >
            <Text style={styles.buttonText} numberOfLines={1} adjustsFontSizeToFit={true} >Okres od {this.state.startDate} do {this.state.endDate}</Text>
        </View>
    )
}
renderAddSubscription(){
    return(
        <TouchableOpacity style={styles.subscriptionButtons} onPress={()=>{this.props.navigation.navigate('RenewSubscriptionSettings',{endDate:this.state.endDate})}}>
            <Text style={{...styles.buttonText,color:'white'}}>PRZEDŁUŻ SUBSKRYPCJĘ</Text>
        </TouchableOpacity>
    )
}
// renderCancelSub(){
//     return(
//         <TouchableOpacity style={{...styles.subscriptionButtons,backgroundColor:'red'}} onPress={()=>{this.props.navigation.navigate('CancelSubscriptionSettings')}}>
//             <Text style={{...styles.buttonText,color:'white'}}>ZREZYGNUJ Z SUBSKRYPCJI</Text>
//         </TouchableOpacity>
//     )

// }
showSpinner() {
    return (
        <Overlay isVisible={this.state.loading} >
            <Spinner isVisible={true} size={100} type='Pulse'  color={theme.D_BLUE} />
        </Overlay>
    )
  }
    render() {
        return (

                <SafeAreaView style={styles.container}>
                    <Header nav={this.props.navigation} withSettingsButton={false}/>
                    {this.showSpinner()}
                    <ScrollView contentContainerStyle={styles.innerContainterStyle} >
                        <Divider name='TWOJA SUBSKRYPCJA' withMargin={true}/>
                        {this.renderSubscriptionTerm()}
                        {/* {this.renderHistory()} */}
                        {this.renderCurrentSubscription()}
                        {this.renderAddSubscription()}
                        {/* {this.renderCancelSub()} */}
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
    buttonStyle:{
        padding:'4%',
        borderRadius:10,
        borderColor:theme.L_BLUE,
        borderWidth:1,
        alignSelf:'center',
        marginTop:'5%',
        width:'100%'
    },
    historyStyle:{
        flexDirection:'row',
        alignSelf:'center',
        width:'100%',
        marginTop:'5%',
        alignItems:"center",
        justifyContent:'space-between',
        borderRadius:10,
        borderWidth:1,
        borderColor:theme.L_BLUE,
        padding:'4%'
    },
    historyElementStyle:{
        padding:'4%',
        width:'90%',
        alignSelf:'center',
        alignItems:'center',
        borderRadius:10,
        borderWidth:1,
        borderColor:theme.L_BLUE,
        marginTop:'2%'
    },
    subscriptionButtons:{
        backgroundColor:theme.L_BLUE,
        marginTop:'5%',
        width:'100%',
        borderRadius:10,
        padding:'4%',
        justifyContent:'center',
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
)(SubscriptionSettings)