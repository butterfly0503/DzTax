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

import {sendEmailContactUs} from '../../func/utils';
import FlashMessage from 'react-native-flash-message';
import Header from '../../components/header';

class RateAppSettings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {message: ''};
        this.messageRef = null;
    }

    renderInputField() {
        return (
            <TextInput placeholder='Dodaj komentarz...' value={this.state.message}
                       onChangeText={value => this.setState({message: value})}
                       style={{...styles.inputStyle, marginTop: '5%'}}
                       placeholderTextColor='gray'
                       multiline={true}
                       onSubmitEditing={() => {
                           Keyboard.dismiss();
                       }}
            />
        );
    }

    handleSend() {
        if (this.state.message != '') {
            sendEmailContactUs('www@dztax.pl', 'smtp.dpoczta.pl', '587', this.state.message);
            this.setState({message: ''});
            this.props.navigation.goBack();

        } else {
            this.messageRef.showMessage({message: 'UZUPEŁNIJ WIADOMOŚĆ', type: 'warning', duration: 500});
        }
    }

    renderSaveButton() {
        return (
            <TouchableOpacity style={styles.saveButton} onPress={() => {
                this.handleSend();
            }}>
                <Text style={{...styles.buttonText, color: 'white'}}>WYŚLIJ</Text>
            </TouchableOpacity>
        );
    }

    render() {
        return (

            <SafeAreaView style={styles.container}>
                <Header nav={this.props.navigation} withSettingsButton={false}/>
                <FlashMessage ref={(ref) => {
                    this.messageRef = ref;
                }}/>
                <ScrollView contentContainerStyle={styles.innerContainterStyle}>
                    <Divider name='NAPISZ DO NAS' withMargin={true}/>
                    {this.renderInputField()}
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
        color: 'black',
        fontWeight: 'bold',
        fontSize: 17,
        borderWidth: 1,
        borderRadius: 10,
        padding: '4%',
        borderColor: theme.L_BLUE,
        width: '100%',
        height: Dimensions.get('window').height * 0.4,
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
)(RateAppSettings);
