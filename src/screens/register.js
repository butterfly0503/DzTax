import React from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Text,
    Image,
    Alert,
    Linking,
    SafeAreaView,
    Dimensions,
    TouchableWithoutFeedback,
    Keyboard,
    ImageBackground,
    ScrollView,
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import theme from '../theme/theme';
import DpLogo from '../components/dpLogo';
import CheckBox from '@react-native-community/checkbox';
import moment from 'moment';
import {Icon} from 'react-native-elements';
import Divider from '../components/divider';
import FlashMessage from 'react-native-flash-message';
import {showMessage, hideMessage} from 'react-native-flash-message';
import Clipboard from '@react-native-community/clipboard';
import {FormatExpiry} from '../func/utils';
import {registerUser, getPaymentLink, checkGiftCard} from '../func/userSettings';

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            accNumber: '0000 8888 7777 6666 5555',
            login: '',
            password: '',
            reEnterPassword: '',
            privatePersonChosen: true,
            firstName: '',
            lastName: '',
            companyName: '',
            nip: '',
            streetName: '',
            houseNr: '',
            flatNr: '',
            zipCode: '',
            miejscowosc: '',
            city: '',
            termsAccepted: false,
            subscriptionMonths: 1,
            chosenPayment: '',
            giftCardNumber: '',
            giftCardPin: '',
            creditCardNumber: '',
            creditCardDueDate: '',
            cvc: '',
            blikCode: '',
        };
        this.inputHeightPointer = null;
        this.messageRef = null;
    }

    async handleRegister() {

        let {
            login, password, reEnterPassword, privatePersonChosen, firstName, lastName, //flat number can be emtpy
            companyName, nip, streetName, houseNr, flatNr, zipCode, miejscowosc, city, termsAccepted,
            subscriptionMonths, chosenPayment, giftCardNumber, giftCardPin, creditCardNumber, creditCardDueDate, cvc, blikCode,
        } = this.state;
        if (login != '' && password != '' && reEnterPassword != '' && firstName != '' &&
            lastName != '' && streetName != '' && houseNr != '' && zipCode != '' && miejscowosc != '' && city != '' && termsAccepted && city != '' && chosenPayment != '') {
            if (!privatePersonChosen && (companyName == '' || nip == '')) {
                this.messageRef.showMessage({message: 'UZUPEŁNIJ POLA', type: 'warning', duration: 500});
            } else {
                let registerObj = {
                    firstName: firstName,
                    lastName: lastName,
                    login: login,
                    password: password,
                    privatePersonChosen: privatePersonChosen,
                    streetName: streetName,
                    houseNr: houseNr,
                    flatNr: flatNr,
                    zipCode: zipCode,
                    miejscowosc: miejscowosc,
                    city: city,
                    months: subscriptionMonths,
                    chosenPayment: chosenPayment,
                };
                if (!privatePersonChosen) {
                    registerObj = {...registerObj, nip: nip, companyName: companyName};
                }
                switch (chosenPayment) {
                    case 'dotpay': ///still need fields for this
                        console.log('dotpay');
                        registerObj = {...registerObj, ecardPIN: null};    //test222 test222
                        break;
                    case 'giftCard':
                        if (giftCardPin != '') {
                            registerObj = {...registerObj, ecardPIN: giftCardPin};
                        } else {
                            this.messageRef.showMessage({message: 'UZUPEŁNIJ POLA', type: 'warning', duration: 500});
                        }
                        break;
                    default:
                        break;
                }
                let suc = true;
                if (chosenPayment == 'giftCard') {
                    let resp3 = await checkGiftCard(giftCardPin);
                    if (!resp3) {
                        suc = false;
                    }
                }
                if (suc) {
                    let resp = await registerUser(registerObj);
                    if (resp.success) {
                        if (chosenPayment == 'dotpay') {
                            let resppayment = await getPaymentLink(this.state.login, this.state.password, this.state.subscriptionMonths);
                            if (resppayment.success == true) {
                                this.makePayment(resppayment.link);
                                this.props.navigation.goBack();
                            } else {
                                this.messageRef.showMessage({
                                    message: 'PROBLEM Z PŁATNOŚCIĄ',
                                    type: 'warning',
                                    duration: 500,
                                });
                            }
                        } else {
                            this.props.navigation.goBack();
                        }

                    } else {
                        if (resp.reason == 0) {
                            this.messageRef.showMessage({
                                message: 'DANY LOGIN ISTNIEJE',
                                type: 'warning',
                                duration: 500,
                            });
                        }
                        if (resp.reason == 1 || resp.reason == 2) {
                            this.messageRef.showMessage({
                                message: 'COŚ POSZŁO NIE TAK',
                                type: 'warning',
                                duration: 500,
                            });
                        }
                    }
                } else {
                    this.messageRef.showMessage({message: 'COŚ POSZŁO NIE TAK', type: 'warning', duration: 500});
                }
            }


        } else {
            this.messageRef.showMessage({message: 'UZUPEŁNIJ POLA', type: 'warning', duration: 500});
        }


    }

    makePayment(link) {
        Linking.canOpenURL(link).then(supported => {
            if (supported) {
                Linking.openURL(link);
            }
        });
    }

    showDataTerms(type) {
        let links = ['https://thenewstack.io/why-every-company-needs-a-data-policy/', 'https://en.wikipedia.org/wiki/Terms_of_service'];
        Linking.canOpenURL(links[type]).then(supported => {
            if (supported) {
                Linking.openURL(links[type]);
            }
        });
    }

    renderHeader() {
        return (

            <ImageBackground resizeMode="cover" source={require('../resources/images/header.png')}
                             style={styles.backgroundContainterStyle}>
                <View style={styles.headerStyle}>
                    <DpLogo logoWidth={parseInt(Dimensions.get('window').width * 0.3)} nav={this.props.nav}/>
                    <View style={{flex: 3}} />
                    <TouchableOpacity style={{
                        ...styles.buttonContainterStyle,
                        backgroundColor: this.state.privatePersonChosen ? 'rgba(52,99,150,0.4)' : '#346396',
                    }}
                                      onPress={() => {
                                          this.setState({privatePersonChosen: true});
                                      }}>
                        <Text style={{
                            ...styles.buttonTextStyle,
                            color: this.state.privatePersonChosen ? 'white' : '#91ABC0',
                        }}>OSOBA FIZYCZNA</Text>
                        {/* <Text style={{...styles.buttonTextStyle,color:this.state.privatePersonChosen?'white':'white'}}></Text> */}
                    </TouchableOpacity>
                    <TouchableOpacity style={{
                        ...styles.buttonContainterStyle,
                        backgroundColor: !this.state.privatePersonChosen ? '#346396' : 'rgba(52,99,150,0.4)',
                    }}
                                      onPress={() => {
                                          this.setState({privatePersonChosen: false});
                                      }}>
                        <Text style={{
                            ...styles.buttonTextStyle,
                            color: !this.state.privatePersonChosen ? 'white' : '#91ABC0',
                        }}>FIRMA</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>

            // <View style={styles.headerStyle}>
            //     <DpLogo logoWidth={parseInt(Dimensions.get('window').width*0.30)} />
            //     <TouchableOpacity style={{...styles.buttonContainterStyle,backgroundColor:this.state.privatePersonChosen?theme.D_BLUE:theme.L_BLUE}}
            //     onPress={()=>{this.setState({privatePersonChosen:true})}}>
            //         <Text style={{...styles.buttonTextStyle,color:this.state.privatePersonChosen?'white':'white'}}>OSOBA</Text>
            //         <Text style={{...styles.buttonTextStyle,color:this.state.privatePersonChosen?'white':'white'}}>FIZYCZNA</Text>
            //     </TouchableOpacity>
            //     <TouchableOpacity style={{...styles.buttonContainterStyle,backgroundColor:!this.state.privatePersonChosen?theme.D_BLUE:theme.L_BLUE}}
            //     onPress={()=>{this.setState({privatePersonChosen:false})}}>
            //         <Text style={{...styles.buttonTextStyle,color:!this.state.privatePersonChosen?'white':'white'}}>FIRMA</Text>
            //     </TouchableOpacity>

            // </View>
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

    renderAdressInput() {
        return (
            <>
                {this.renderInputField('Ulica', 'streetName')}
                <View style={{
                    width: '100%',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    alignItems: 'center',
                }}>
                    {this.renderInputField('Nr domu', 'houseNr', {width: '45%'})}
                    {this.renderInputField('Nr mieszkania', 'flatNr', {width: '45%'})}
                </View>
                {this.renderInputField('Kod pocztowy', 'zipCode')}
                {this.renderInputField('Miejscowość', 'miejscowosc')}
                {this.renderInputField('Miasto', 'city')}
            </>
        );
    }

    renderLoginInput() {
        return (
            <>
                {this.renderInputField('Login', 'login')}
                {this.renderInputField('Hasło', 'password', {marginTop: '5%'}, true)}
                {this.renderInputField('Powtórz hasło', 'reEnterPassword', {marginTop: '5%'}, true)}
            </>
        );
    }

    renderAcceptTerms() {
        return (


            <TouchableOpacity style={styles.acceptTermsStyle}
                              onPress={() => {
                                  this.setState({termsAccepted: !this.state.termsAccepted});
                              }}>

                <CheckBox
                    value={this.state.termsAccepted}
                    disabled={true}
                    size={40}
                    onValueChange={(newValue) => {
                        this.setState({termsAccepted: newValue});
                    }}
                    tintColors={{true: theme.D_BLUE, false: 'gray'}}
                    tintColor='gray'
                    onFillColor={theme.D_BLUE}
                />
                <Text style={{fontSize: 17}}>Akceptuję regulamin</Text>
            </TouchableOpacity>

        );
    }

    addDate(value) {
        let dummy = this.state.subscriptionMonths;
        if (value > 0) {
            dummy += 1;
        } else {
            if (dummy > 1) {
                dummy -= 1;
            }
        }
        this.setState({subscriptionMonths: dummy});
    }

    renderSubscription() {
        let dueDate = moment().add(this.state.subscriptionMonths, 'month').format('DD/MM/YYYY');
        let totalAmount = 100 * this.state.subscriptionMonths;
        return (
            <View style={{width: '100%'}}>
                <View style={styles.subscriptionLineContainter}>
                    <View style={styles.subButtonContainter}>
                        <Text style={styles.labelTextStyle}>Miesiąc</Text>
                    </View>
                    <View style={styles.plusMinusMonthContainter}>
                        <Icon name='minus' type='entypo' size={20} color='gray' onPress={() => {
                            this.addDate(-1);
                        }}/>
                        <Text style={{fontSize: 24}, {fontWeight: 'bold'}}>|</Text>
                        <Text style={{fontSize: 20}}>{this.state.subscriptionMonths}</Text>
                        <Text style={{fontSize: 24}, {fontWeight: 'bold'}}>|</Text>
                        <Icon name='plus' type='entypo' size={20} color='gray' onPress={() => {
                            this.addDate(1);
                        }}/>
                    </View>
                </View>
                <View style={{
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    marginTop: '3%',
                }}>
                    <View style={styles.subButtonContainter}>
                        <Text style={styles.labelTextStyle} numberOfLines={1} adjustsFontSizeToFit={true}>Termin
                            ważności</Text>
                    </View>
                    <View style={styles.plusMinusMonthContainter}>
                        <Text style={{fontSize: 20}} numberOfLines={1} adjustsFontSizeToFit={true}>{dueDate}</Text>
                    </View>
                </View>
                <View style={{
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    marginTop: '3%',
                }}>
                    <View style={styles.subButtonContainter}>
                        <Text style={styles.labelTextStyle} numberOfLines={1} adjustsFontSizeToFit={true}>Suma</Text>
                    </View>
                    <View style={styles.plusMinusMonthContainter}>
                        <Text style={{fontSize: 20}} numberOfLines={1}
                              adjustsFontSizeToFit={true}>{totalAmount} zł</Text>
                    </View>
                </View>
            </View>
        );
    }

    renderInputField(placeholder, field, styleProps, private1) {
        if (private1) {
            return (


                <TextInput placeholder={placeholder} value={this.state[field]}
                           onChangeText={value => this.setState({[field]: value})}
                           style={{...styles.inputStyle, marginTop: '5%', ...styleProps}}
                           placeholderTextColor='gray'
                           multiline={false}
                           secureTextEntry={true}
                           contextMenuHidden={true}
                           onSubmitEditing={() => {
                               Keyboard.dismiss();
                           }}
                           onLayout={(e) => {
                               this.inputHeightPointer = e.nativeEvent.layout.height;
                           }}
                />

            );
        } else {
            return (


                <TextInput placeholder={placeholder} value={this.state[field]}
                           onChangeText={value => this.setState({[field]: value})}
                           style={{...styles.inputStyle, marginTop: '5%', ...styleProps}}
                           placeholderTextColor='gray'
                           multiline={false}
                           contextMenuHidden={true}
                           onSubmitEditing={() => {
                               Keyboard.dismiss();
                           }}
                           onLayout={(e) => {
                               this.inputHeightPointer = e.nativeEvent.layout.height;
                           }}
                />

            );
        }

    }

    renderGiftCard() {
        return (
            <View style={{width: '100%'}}>
                {this.renderCheckText('Karta podarunkowa', 'giftCard')}
                {this.state.chosenPayment === 'giftCard' ?
                    <>
                        {this.renderInputField('Kod PIN', 'giftCardPin')}
                    </> : null}
            </View>
        );
    }

    handleCardInput(value) {
        let formated = FormatExpiry(value);
        this.setState({creditCardDueDate: formated});
    }

    renderDueDateInput() {
        return (
            <View removeClippedSubviews={true} style={{width: '45%'}}>
                <TextInput placeholder='MM/RR' value={this.state.creditCardDueDate}
                           onChangeText={value => this.handleCardInput(value)}
                           style={{...styles.inputStyle, marginTop: '0%'}}
                           placeholderTextColor='gray'
                           multiline={false}
                           maxLength={5}
                           keyboardType='numeric'
                           contextMenuHidden={true}
                           onSubmitEditing={() => {
                               Keyboard.dismiss();
                           }}
                           onLayout={(e) => {
                               this.inputHeightPointer = e.nativeEvent.layout.height;
                           }}
                />
            </View>
        );
    }

    _onCardChange(props) {
        console.log(props);
    }

    renderDotpay() {
        return (
            <View style={{width: '100%'}}>
                {this.renderCheckText('Dotpay', 'dotpay')}
            </View>
        );
    }

    copyToClip() {
        Clipboard.setString(this.state.accNumber);
        showMessage({message: 'SKOPIOWANO DO SCHOWKA', type: 'info', duration: 500});

    }


    renderCheckText(descriptiom, field) {
        return (
            <TouchableOpacity style={styles.acceptTermsStyle}
                              onPress={() => {
                                  this.setState({
                                      chosenPayment: field,
                                      giftCardNumber: '',
                                      giftCardPin: '',
                                      creditCardNumber: '',
                                      creditCardDueDate: '',
                                      cvc: '',
                                      blikCode: '',
                                  });
                              }}>
                <CheckBox
                    value={this.state.chosenPayment === field}
                    size={40}
                    onValueChange={(newValue) => {
                        this.setState({
                            chosenPayment: newValue ? field : '',
                            giftCardNumber: '',
                            giftCardPin: '',
                            creditCardNumber: '',
                            creditCardDueDate: '',
                            cvc: '',
                            blikCode: '',
                        });
                    }}
                    tintColors={{true: theme.D_BLUE, false: 'gray'}}
                    tintColor='gray'
                    onFillColor={theme.D_BLUE}
                />
                <Text style={{fontSize: 17}}>{descriptiom}</Text>
            </TouchableOpacity>
        );
    }

    renderPaymentComponent() {
        return (
            <View style={{width: '100%'}}>
                {this.renderGiftCard()}
                {this.renderDotpay()}
            </View>
        );
    }

    renderRegisterButton() {
        return (
            <TouchableOpacity style={{
                ...styles.buttonContainterStyle,
                backgroundColor: theme.D_BLUE,
                width: '100%',
                height: null,
                marginTop: '5%',
            }}
                              onPress={() => {
                                  this.handleRegister();
                              }}>
                <Text style={{
                    ...styles.buttonTextStyle,
                    color: 'white',
                    alignSelf: 'center',
                    fontSize: 20,
                }}>ZAREJESTRUJ</Text>
            </TouchableOpacity>
        );
    }

    render() {
        return (

            <SafeAreaView style={styles.container}>
                {this.renderHeader()}
                <FlashMessage ref="myLocalFlashMessage" ref={(ref) => {
                    this.messageRef = ref;
                }}/>
                <ScrollView contentContainerStyle={styles.innerContainterStyle}>

                    <Divider name='DANE LOGOWANIA'/>
                    {this.renderLoginInput()}
                    <Divider name='TWOJE DANE' withMargin={true}/>
                    {this.state.privatePersonChosen ? this.renderPrivatePersonInput() : this.renderCompanyInput()}
                    <Divider name='ADRES' withMargin={true}/>
                    {this.renderAdressInput()}

                    <Divider name='PRZETWARZANIE DANYCH' withMargin={true}/>
                    <View style={styles.outerLinkContainer}>
                        <Text style={{fontSize: 15}} onPress={() => {
                            this.showDataTerms(0);
                        }}>TREŚĆ INFO O PRZETWARZANIE DANYCH</Text>
                    </View>

                    <Divider name='REGULAMIN' withMargin={true}/>
                    <View style={styles.outerLinkContainer}>
                        <Text style={{fontSize: 15, fontWeight: 'bold'}} onPress={() => {
                            this.showDataTerms(1);
                        }}>TREŚĆ REGULAMINU</Text>
                        {this.renderAcceptTerms()}
                    </View>

                    <Divider name='TWOJA SUBSKRYPCJA' withMargin={true}/>
                    {this.renderSubscription()}
                    <Divider name='PŁATNOŚCI' withMargin={true}/>
                    {this.renderPaymentComponent()}
                    {this.renderRegisterButton()}
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
    },
    subButtonContainter: {
        borderRadius: 10,
        // borderWidth:1,
        padding: '4%',
        // alignItems:'left',
        // justifyContent:'left',
        // borderColor:theme.L_BLUE,
        width: '45%',
    },
    plusMinusMonthContainter: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.D_BLUE,
        borderRadius: 10,
        width: '45%',
        justifyContent: 'space-between',
        padding: '3%',
    },
    subscriptionLineContainter: {
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginTop: '3%',
    },

    buttonTextStyle: {
        color: 'white',
        fontSize: 13,
        textAlign: 'left',
        alignSelf: 'flex-start',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    inputStyle: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 17,
        borderWidth: 2,
        borderRadius: 10,
        padding: '4%',
        borderColor: theme.L_BLUE,
        width: '100%',
        textAlign: 'center',
    },
    acceptTermsStyle: {
        // borderWidth:1,
        // borderColor:theme.L_BLUE,
        // padding:'4%',
        // borderRadius:10,
        flexDirection: 'row',
        // justifyContent:'space-between',
        alignItems: 'center',
        width: '100%',
        marginTop: '5%',
    },
    buttonContainterStyle: {
        height: '40%',
        // width:'30%',
        padding: '4%',
        justifyContent: 'center',
        // borderWidth:1,
        // borderColor:theme.L_BLUE,
        borderRadius: 10,
        marginLeft: '2%',
    },
    headerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: '5%',
        height: 150,
        paddingHorizontal: 10
    },
    backgroundContainterStyle: {
        height: 110,
        width: '100%',
        marginBottom: 20,
    },
    outerLinkContainer: {
        borderWidth: 1,
        borderColor: theme.L_BLUE,
        padding: '5%',
        width: '100%',
        borderRadius: 10,
    },
    labelTextStyle: {
        fontSize: 17,
        color: theme.L_BLUE,
        fontWeight: 'bold',
    },

});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({}, dispatch);
};

const mapStateToProps = state => {
    return {
        user: state.user,
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Register);
