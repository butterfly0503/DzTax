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
    ScrollView,
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {updateEmail, updatePassword, updateKey, updateUuid, updateCredentials} from '../actions/user';
import theme from '../theme/theme';
import DpLogo from '../components/dpLogo';
import {Icon} from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import {fetchMyDataInfo} from '../func/userSettings';
import Header from '../components/header';


class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {login: '', password: '', username: ''};

    }

    async componentDidMount() {
        let {login, password} = this.props.user.credentials;
        let resp = await fetchMyDataInfo(login, password);
        console.log(resp);
        if (resp.success) {
            let obj = resp.data[0];
            let user = obj.firstName + ' ' + obj.lastName;
            this.setState({username: user});
        }
    }

    renderLine(button1Name, button1Nav, button2Name, button2Nav) {
        return (
            <View style={styles.buttonLineStyle}>
                <TouchableOpacity style={styles.buttonStyle} onPress={() => {
                    this.props.navigation.navigate(button1Nav);
                }}>
                    <Text style={styles.buttonText} numberOfLines={1}>{button1Name}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonStyle} onPress={() => {
                    this.props.navigation.navigate(button2Nav);
                }}>
                    <Text style={styles.buttonText} numberOfLines={1} adjustsFontSizeToFit={true}>{button2Name}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    renderShareOpinion() {
        return (
            <TouchableOpacity style={{...styles.buttonStyle, width: '80%', marginTop: '5%'}} onPress={() => {
                this.props.navigation.navigate('ShareOpinion');
            }}>
                <Text style={styles.buttonText} numberOfLines={1} adjustsFontSizeToFit={true}>TWOJA OPINIA</Text>
            </TouchableOpacity>
        );
    }

    async handleSignout() {
        await AsyncStorage.removeItem('User');
        this.props.updateCredentials({login: '', password: '', uuID: ''});
        this.props.navigation.reset({index: 0, routes: [{name: 'Login'}]});
    }

    renderLogoutButton() {
        return (
            <TouchableOpacity style={styles.logoutButton} onPress={() => {
                this.handleSignout();
            }}>
                <Text style={{...styles.buttonText, color: 'white', fontSize: 16, fontWeight: 'bold'}}>WYLOGUJ</Text>
            </TouchableOpacity>
        );
    }

    renderUsername() {
        let name = this.state.username != '' ? this.state.username : 'NAZWA UŻYTKOWNIKA';
        return (
            <View style={{width: null, marginTop: 20, marginBottom: 40}}>
                <Text style={styles.buttonText}>{name}</Text>
            </View>
        );
    }

    render() {
        return (

            <SafeAreaView style={styles.container}>
                <Header nav={this.props.navigation} withSettingsButton={false}/>
                <ScrollView contentContainerStyle={styles.innerContainterStyle}>
                    <Image resizeMode="cover" source={require('../resources/images/smile.png')}
                           style={{width: 120, height: 120, padding: '2%', alignSelf: 'center', marginTop: 40}}></Image>
                    {/* <Icon name='smile' type='feather' size={100} color='gray'  /> */}
                    {this.renderUsername()}
                    {this.renderLine('TWOJE DANE', 'PersonalDataSettings', 'ADRES', 'AdressSettings')}
                    {this.renderLine('DANE KONTAKTOWE', 'ContactInfoSettings', 'PŁATNOŚCI', 'ShareOpinion')}
                    {this.renderLine('SUBSKRYPCJE', 'SubscriptionSettings', 'REGULAMIN', 'TermsSettings')}
                    {this.renderLine('OCEŃ APLIKACJĘ', 'RateAppSettings', 'NAPISZ DO NAS', 'MessageUsSettings')}
                    <TouchableOpacity style={{...styles.buttonStyle, width: '100%'}} onPress={() => {}}>
                        <Text style={styles.buttonText} numberOfLines={1}>DOSTĘP DO APLIKACJI</Text>
                    </TouchableOpacity>
                    {this.renderLogoutButton()}
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
        alignSelf: 'center',
        width: '90%',
        paddingBottom: Dimensions.get('window').height * 0.1,
    },
    buttonText: {
        fontSize: 12,
        color: 'gray',
        textAlign: 'center',
    },
    buttonStyle: {
        minHeight: 50,
        borderRadius: 8,
        borderColor: '#8ABCE6',
        borderWidth: 1,
        width: '48%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonLineStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: '5%',
        justifyContent: 'space-between',
    },
    logoutButton: {
        backgroundColor: theme.D_BLUE,
        marginTop: '10%',
        width: '98%',
        borderRadius: 8,
        padding: '4%',
        alignSelf: 'center',
    },


});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({updateEmail, updatePassword, updateKey, updateUuid, updateCredentials}, dispatch);
};

const mapStateToProps = state => {
    return {
        user: state.user,
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Settings);
