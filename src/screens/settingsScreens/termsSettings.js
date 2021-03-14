import React from 'react'
import { View, TextInput, StyleSheet, TouchableOpacity ,Text,SafeAreaView ,Dimensions,Keyboard, ScrollView,Linking} from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { updateEmail,updatePassword ,updateKey,updateUuid} from '../../actions/user'
import theme from '../../theme/theme'
import DpLogo from '../../components/dpLogo'
import Divider from '../../components/divider'
import Header from '../../components/header'



class TermsSettings extends React.Component {
  constructor(props) { 
    super(props);
    this.state={email:'',phone:''}

  }

showDataTerms(type){
    let links=['https://thenewstack.io/why-every-company-needs-a-data-policy/','https://en.wikipedia.org/wiki/Terms_of_service']
    Linking.canOpenURL(links[type]).then(supported => {
        if (supported) {
          Linking.openURL(links[type]);
        } 
      });
}


renderSaveButton(){
    return(
        <TouchableOpacity style={styles.saveButton} onPress={()=>{this.props.navigation.goBack()}}>
            <Text style={{...styles.buttonText,color:'white'}}>WRÓĆ</Text>
        </TouchableOpacity>
    )
}

    render() {
        return (

                <SafeAreaView style={styles.container}>
                    <Header nav={this.props.navigation} withSettingsButton={false}/>
                    <ScrollView contentContainerStyle={styles.innerContainterStyle} >
                        <Divider name='PRZETWARZANIE DANYCH' withMargin={true}/>
                        <View style={styles.outerLinkContainer}>
                            <Text style={{fontSize:15}} onPress={()=>{this.showDataTerms(0)}}>TREŚĆ INFO O PRZETWARZANIE DANYCH</Text>
                        </View>

                        <Divider name='REGULAMIN' withMargin={true}/>
                        <View style={styles.outerLinkContainer}>
                            <Text style={{fontSize:15}} onPress={()=>{this.showDataTerms(1)}}>TREŚĆ REGULAMINU</Text>
                        </View>

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
        backgroundColor:theme.D_BLUE,
        marginTop:'10%',
        width:'100%',
        borderRadius:10,
        padding:'4%',
        alignSelf:'center'
    },
    outerLinkContainer: {
        borderWidth:1,
        borderColor:theme.L_BLUE,
        padding: '5%',
        width: '100%',
        borderRadius: 10
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
)(TermsSettings)