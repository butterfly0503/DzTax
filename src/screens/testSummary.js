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
import {updateEmail, updatePassword, updateKey, updateUuid} from '../actions/user';
import theme from '../theme/theme';
import DpLogo from '../components/dpLogo';
import Divider from '../components/divider';
import moment from 'moment';
import {Icon} from 'react-native-elements';
import {PieChart} from 'react-native-chart-kit';
import Header from '../components/header';
import Pie from 'react-native-pie'


class TestSummary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

    }

    componentDidMount() {

    }

    renderFinishButton() {
        return (
            <TouchableOpacity style={{...styles.saveButton, backgroundColor: '#004176', width: '90%'}}
                              onPress={() => {
                                  this.props.navigation.navigate('Main');
                              }}>
                <Text style={{...styles.buttonText, color: 'white'}}>ZAKOŃCZ</Text>
            </TouchableOpacity>
        );
    }

    renderRepeatButton() {
        return (
            <TouchableOpacity style={{...styles.saveButton, backgroundColor: '#8ABCE6', width: '90%', marginTop: '30%'}}
                              onPress={() => {
                                  this.props.navigation.goBack();
                              }}>
                <Text style={{...styles.buttonText, color: 'white'}}>POWTÓRZ TEST</Text>
            </TouchableOpacity>
        );
    }

    renderSummary() {
        let score = this.props.route.params.score;
        let correct = score.filter((item) => {
            return (item);
        });
        let correctPercent = Math.floor(correct.length * 100 / score.length);
        let incorrectPercent = 100 - correctPercent;
        let data = [
            {
                percentage: correctPercent,
                color: '#4EA056',
            },
            {
                percentage: incorrectPercent,
                color: '#C63838',
            },
        ];
        return (
            <View style={{marginTop: 40, justifyContent: 'center', alignItems: 'center', width: '100%'}}>
                <Text style={{color: '#8ABCE6', fontSize: 20, fontWeight: 'bold', marginBottom: 30}}>Zdobyto punkty</Text>
                <Pie
                    style={{alignSelf: 'center'}}
                    radius={80}
                    innerRadius={40}
                    sections={data}
                    strokeCap={'butt'}
                />
            </View>
        );
    }


    render() {

        return (

            <SafeAreaView style={styles.container}>
                <Header nav={this.props.navigation} withSettingsButton={false}/>
                <ScrollView contentContainerStyle={styles.innerContainterStyle}>
                    {this.renderSummary()}
                    {this.renderRepeatButton()}
                    {this.renderFinishButton()}
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
        paddingBottom: '10%',
    },
    saveButton: {
        backgroundColor: theme.D_BLUE,
        marginTop: '10%',
        width: '100%',
        borderRadius: 8,
        padding: '4%',
        alignSelf: 'center',
    },
    buttonText: {
        fontSize: 16,
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center',
    },

    buttonContainterStyle: {
        flexDirection: 'row',
        alignSelf: 'center',
        width: '100%',
        marginTop: '5%',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: theme.L_BLUE,
        padding: '4%',
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
)(TestSummary);
