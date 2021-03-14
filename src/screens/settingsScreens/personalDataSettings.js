import React from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Text,
    SafeAreaView,
    Dimensions,
    Keyboard,
    ScrollView,
    ImageBackground,
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {updateEmail, updatePassword, updateKey, updateUuid} from '../../actions/user';
import theme from '../../theme/theme';
import DpLogo from '../../components/dpLogo';
import Divider from '../../components/divider';
import {fetchMyDataInfo, updateMyDataInfo} from '../../func/userSettings';
import Spinner from 'react-native-spinkit';
import {Overlay} from 'react-native-elements';
import Header from '../../components/header';


class PersonalDataSettings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            privatePersonChosen: true,
            loading: false,
            firstName: '',
            lastName: '',
            nip: '',
            companyName: '',
            myData: null,
        };

    }

    async componentDidMount() {
        let {login, password} = this.props.user.credentials;
        this.setState({loading: true});
        let resp = await fetchMyDataInfo(login, password);
        if (resp.success) {
            let obj = resp.data[0];
            this.setState({
                myData: obj,
                firstName: obj.firstName,
                lastName: obj.lastName,
                nip: obj.nip,
                companyName: obj.companyName,
            });
        }
        this.setState({loading: false});

    }

    showSpinner() {
        return (
            <Overlay isVisible={this.state.loading}>
                <Spinner isVisible={true} size={100} type='Pulse' color={theme.D_BLUE}/>
            </Overlay>
        );
    }

    async updateMyInfo() {
        let {login, password} = this.props.user.credentials;
        let myNewObj = this.state.myData;
        myNewObj.firstName = this.state.firstName;
        myNewObj.lastName = this.state.lastName;
        myNewObj.nip = this.state.nip;
        myNewObj.companyName = this.state.companyName;
        let resp = await updateMyDataInfo(login, password, myNewObj);
        this.props.navigation.goBack();
    }

    renderInputField(placeholder, field, styleProps) {
        return (
            <TextInput placeholder={placeholder} value={this.state[field]}
                       onChangeText={value => this.setState({[field]: value})}
                       style={{...styles.inputStyle, marginTop: '5%', ...styleProps}}
                       placeholderTextColor='gray'
                       multiline={false}
                       onSubmitEditing={() => {
                           Keyboard.dismiss();
                       }}
                       onLayout={(e) => {
                           this.inputHeightPointer = e.nativeEvent.layout.height;
                       }}
            />
        );
    }

    renderHeader() {
        return (

            <ImageBackground resizeMode="cover" source={require('../../resources/images/header.png')}
                             style={styles.backgroundContainterStyle}>
                <View style={styles.headerStyle}>
                    <DpLogo logoWidth={parseInt(Dimensions.get('window').width * 0.3)} nav={this.props.nav}/>

                    <TouchableOpacity style={{
                        ...styles.buttonContainterStyle,
                        backgroundColor: this.state.privatePersonChosen ? theme.D_BLUE : theme.L_BLUE,
                    }}
                                      onPress={() => {
                                          this.setState({privatePersonChosen: true});
                                      }}>
                        <Text style={{
                            ...styles.buttonTextStyle,
                            color: this.state.privatePersonChosen ? 'white' : 'white',
                        }}>OSOBA FIZYCZNA</Text>
                        {/* <Text style={{...styles.buttonTextStyle,color:this.state.privatePersonChosen?'white':'white'}}></Text> */}
                    </TouchableOpacity>
                    <TouchableOpacity style={{
                        ...styles.buttonContainterStyle,
                        backgroundColor: !this.state.privatePersonChosen ? theme.D_BLUE : theme.L_BLUE,
                    }}
                                      onPress={() => {
                                          this.setState({privatePersonChosen: false});
                                      }}>
                        <Text style={{
                            ...styles.buttonTextStyle,
                            color: !this.state.privatePersonChosen ? 'white' : 'white',
                        }}>FIRMA</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        );
    }

    renderPrivatePersonInput() {
        return (
            <>
                {this.renderInputField('Imie', 'firstName')}
                {this.renderInputField('Nazwisko', 'lastName')}
            </>
        );
    }

    renderCompanyInput() {
        return (
            <>
                {this.renderInputField('Nazwa firmy', 'companyName')}
                {this.renderInputField('NIP', 'nip')}
                {this.renderInputField('Imie', 'firstName')}
                {this.renderInputField('Nazwisko', 'lastName')}
            </>
        );
    }

    renderSaveButton() {
        return (
            <TouchableOpacity style={styles.saveButton} onPress={() => {
                this.updateMyInfo();
            }}>
                <Text style={{...styles.buttonText, color: 'white'}}>ZAPISZ</Text>
            </TouchableOpacity>
        );
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <Header nav={this.props.navigation} withSettingsButton={false}/>
                {this.showSpinner()}
                <ScrollView contentContainerStyle={styles.innerContainterStyle}>
                    <Divider name='TWOJE DANE' color={'#8ABCE6'}/>
                    {this.state.privatePersonChosen ? this.renderPrivatePersonInput() : this.renderCompanyInput()}
                    {this.renderSaveButton()}
                </ScrollView>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.BACKGROUND_COLOR,
        flex: 1,
    },
    innerContainterStyle: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignSelf: 'center',
        width: '85%',
        paddingBottom: '10%',
        marginTop: 30
    },
    buttonTextStyle: {
        color: 'white',
        fontSize: 13,
        fontWeight: 'bold',
        textAlign: 'left',
        alignSelf: 'flex-start',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    inputStyle: {
        color: '#76828C',
        fontSize: 17,
        borderWidth: 1,
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderColor: theme.L_BLUE,
        width: '100%',
    },
    buttonText: {
        fontSize: 20,
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    buttonContainterStyle: {
        height: '40%',
        // width:'20%',
        padding: '4%',
        justifyContent: 'center',
        // borderWidth:1,
        // borderColor:theme.L_BLUE,
        borderRadius: 8,
        marginLeft: '2%',
    },
    headerStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'center',
        width: '90%',
        paddingVertical: '5%',
        height: 150,
    },
    backgroundContainterStyle: {
        height: 110,
        width: '100%',
        marginBottom: 20,
    },
    saveButton: {
        backgroundColor: theme.D_BLUE,
        marginTop: '10%',
        width: '100%',
        borderRadius: 10,
        padding: '4%',
        alignSelf: 'center',
    },


});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({updateEmail, updatePassword, updateKey, updateUuid}, dispatch);
};

const mapStateToProps = state => {
    return {
        user: state.user,
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(PersonalDataSettings);
