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
import StarRating from 'react-native-star-rating';
import Header from '../../components/header';


class RateAppSettings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {email: '', phone: '', rating: 5};

    }

    renderSaveButton() {
        return (
            <TouchableOpacity style={styles.saveButton} onPress={() => {
                this.props.navigation.navigate('RateUsConfirmation');
            }}>
                <Text style={{...styles.buttonText, color: 'white'}}>ZAPISZ</Text>
            </TouchableOpacity>
        );
    }

    renderStars() {
        return (
            <View style={[{alignItems: 'flex-start'}, {marginLeft: '10%'}, {width: '90%'}]}>
                <StarRating
                    disabled={false}
                    containerStyle={[{marginTop: '15%'}, {width: '70%'}]}
                    maxStars={5}
                    fullStarColor={theme.D_GOLD}
                    rating={this.state.rating}
                    selectedStar={(rating) => this.setState({rating: rating})}
                />
            </View>
        );
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <Header nav={this.props.navigation} withSettingsButton={false}/>
                <ScrollView contentContainerStyle={styles.innerContainterStyle}>
                    <Divider name='OCEŃ APLIKACJĘ' withMargin={true}/>
                    {this.renderStars()}
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
        textAlign: 'center',
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
