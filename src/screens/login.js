import React from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Text,
    Image,
    Alert,
    SafeAreaView,
    Dimensions,
    TouchableWithoutFeedback,
    Keyboard,
    ImageBackground,
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import theme from '../theme/theme';
import DpLogo from '../components/dpLogo';
import FlashMessage from 'react-native-flash-message';
import {showMessage, hideMessage} from 'react-native-flash-message';
import {fetchCategories, userLogin, updateCredentials, setNavigationHandler, passwordErrorVis} from '../actions/user';
import Spinner from 'react-native-spinkit';
import {Overlay} from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';


class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {login: '', password: '', loading: false, check: false};

    }

    async componentDidMount() {
        await this.checkStorage();
        this.setState({check: true});
    }

    async checkStorage() {
        this.props.setNavigationHandler(this.props.navigation);

        try {
            let value = await AsyncStorage.getItem('User');
            if (value !== null) {

                let myObj = JSON.parse(value);
                this.props.updateCredentials(myObj);
                this.props.fetchCategories(myObj.login, myObj.password);
                this.setState({loading: false});
                this.props.navigation.navigate('Main');
            }
        } catch (error) {
            console.log(error);
        }


    }

    async handleLogin() {
        let {login, password} = this.state;
        this.setState({loading: true});
        if (login != '' && password != '') {
            this.props.userLogin(login, password);

            this.props.fetchCategories(login, password);
            this.setState({loading: false});
            this.props.navigation.navigate('Main');


            // else{
            //   if(resp.reason==0){
            //     this.setState({loading:false})
            //     showMessage({message: "NIE MA TAKIEGO UŻYTKOWNIKA",type: "warning",duration:500});
            //   }
            //   if(resp.reason==1){
            //     this.setState({loading:false})
            //     showMessage({message: "NIEPOPRAWNE HASŁO",type: "warning",duration:500});
            //   }
            //   if(resp.reason==2){
            //     this.setState({loading:false})
            //     showMessage({message: "COŚ POSZŁO NIE TAK",type: "warning",duration:500});

            //   }
            // }
        } else {
            this.setState({loading: false});
            showMessage({message: 'UZUPEŁNIJ POLA', type: 'warning', duration: 500});

        }

    }

    showSpinner() {
        return (
            <Overlay isVisible={this.state.loading}>
                <Spinner isVisible={true} size={100} type='Pulse' color={theme.D_BLUE}/>
            </Overlay>
        );
    }

    handleInput(field, value) {
        this.props.passwordErrorVis(false);
        this.setState({[field]: value});
    }

    showText() {
        let mytext = 'Zły login lub hasło';
        if (this.props.user != undefined && this.props.user.passError == true) {
            return (
                <Text style={{marginTop: '10%', fontSize: 20, color: 'red'}}>{mytext}</Text>
            );
        } else {
            return (
                null
            );
        }
    }

    render() {
        if (this.state.check) {
            return (
                <TouchableWithoutFeedback onPress={() => {
                    Keyboard.dismiss();
                }}>
                    <SafeAreaView style={styles.container}>
                        {this.showSpinner()}
                        <FlashMessage ref="myLocalFlashMessage"/>
                        <ImageBackground resizeMode="stretch"
                                         source={require('../resources/images/backgroundImage.png')}
                                         style={styles.backgroundContainterStyle}>
                            <View style={styles.innerContainterStyle}>
                                <View style={styles.space}/>
                                <TouchableOpacity style={[styles.containterStyle, {flexDirection: 'row'}, {
                                    paddingHorizontal: parseInt(parseInt(Dimensions.get('window').width * 0.4) * 0.1),
                                    paddingVertical: 0, ...this.props.style,
                                }]}>

                                    <Image source={require('../resources/images/logo-old.png')}/>
                                    <Text style={{
                                        fontSize: parseInt(parseInt(Dimensions.get('window').width * 0.4) * 0.4),
                                        color: 'black',
                                        alignSelf: 'center',
                                        textAlign: 'center',
                                        justifyContent: 'center',
                                    }}>DZTAX</Text>
                                </TouchableOpacity>
                                <View style={styles.halfSpace}/>
                                {this.showText()}
                                <TextInput placeholder="Nazwa użytkownika" value={this.state.login}
                                           onChangeText={value => this.handleInput('login', value)}
                                           style={{...styles.inputStyle, marginTop: '1%'}}
                                           placeholderTextColor='gray'
                                           multiline={false}
                                />
                                <TextInput placeholder="Hasło" value={this.state.password}
                                           onChangeText={value => this.handleInput('password', value)}
                                           style={{...styles.inputStyle, marginTop: '5%'}}
                                           placeholderTextColor='gray'
                                           multiline={false}
                                           secureTextEntry={true}
                                />
                                <TouchableOpacity style={{...styles.buttonContainterStyle, marginTop: 30}}
                                                  onPress={() => {
                                                      this.handleLogin();
                                                  }}>
                                    <Text style={{...styles.buttonTextStyle, color: 'white'}}>ZALOGUJ SIĘ</Text>
                                </TouchableOpacity>
                                <Text style={styles.textStyle}>Nie posiadasz konta?</Text>
                                <View style={styles.space}/>
                                <TouchableOpacity
                                    style={{...styles.buttonContainterStyle, backgroundColor: theme.D_BLUE}}
                                    onPress={() => {
                                        this.props.navigation.navigate('Register');
                                    }}>
                                    <Text style={styles.buttonTextStyle}>REJESTRACJA</Text>
                                </TouchableOpacity>
                                <View style={styles.space}/>
                            </View>
                        </ImageBackground>
                    </SafeAreaView>
                </TouchableWithoutFeedback>
            );
        } else {
            return (null);
        }
    }


}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
        flex: 1,
    },
    innerContainterStyle: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignSelf: 'center',
        height: '100%',
        width: '85%',
    },
    buttonTextStyle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    textStyle: {
        fontSize: 17,
        color: 'gray',
        marginLeft: '8%',
        textAlign: 'left',
        alignSelf: 'flex-start',
        marginTop: 20,
    },

    inputStyle: {
        color: 'black',
        fontSize: 18,
        borderWidth: 1,
        height: '8%',
        borderRadius: 8,
        borderColor: '#004176',
        width: '100%',
        paddingHorizontal: 30
    },
    buttonContainterStyle: {
        borderWidth: 1,
        borderRadius: 10,
        borderColor: theme.L_BLUE,
        width: '100%',
        backgroundColor: theme.L_BLUE,
        height: '8%',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
    },
    backgroundContainterStyle: {
        height: '100%',
        width: '100%',
    },
    space: {
        flex: 2,
    },
    halfSpace: {
        flex: 1,
    },


});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        userLogin,
        fetchCategories,
        updateCredentials,
        setNavigationHandler,
        passwordErrorVis,
    }, dispatch);
};

const mapStateToProps = state => {
    return {
        user: state.user,
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Login);
