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


class AdressSettings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            streetName: '',
            loading: false,
            houseNr: '',
            flatNr: '',
            zipCode: '',
            miejscowosc: '',
            city: '',
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
                streetName: obj.streetName,
                houseNr: obj.houseNr,
                flatNr: obj.flatNr,
                zipCode: obj.zipCode,
                miejscowosc: obj.miejscowosc,
                city: obj.city,
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
        myNewObj.streetName = this.state.streetName;
        myNewObj.houseNr = this.state.houseNr;
        myNewObj.flatNr = this.state.flatNr;
        myNewObj.zipCode = this.state.zipCode;
        myNewObj.miejscowosc = this.state.miejscowosc;
        myNewObj.city = this.state.city;
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
                {this.showSpinner()}
                <Header nav={this.props.navigation} withSettingsButton={false}/>

                <ScrollView contentContainerStyle={styles.innerContainterStyle}>
                    <Divider name='ADRES' withMargin={true}/>
                    {this.renderAdressInput()}

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
    },
    inputStyle: {
        color: '#76828C',
        fontSize: 17,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 30,
        paddingVertical: 10,
        borderColor: theme.L_BLUE,
        width: '100%',
    },
    buttonText: {
        fontSize: 20,
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center',
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
)(AdressSettings);
