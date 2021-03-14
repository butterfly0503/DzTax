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
import {useFocusEffect} from '@react-navigation/native';
import FlashMessage from 'react-native-flash-message';
import Header from '../components/header';

function OnFocus({onUpdate}) {
    useFocusEffect(
        React.useCallback(() => {
            onUpdate();
        }, [onUpdate]),
    );

    return null;
}

class Test extends React.Component {
    constructor(props) {
        super(props);
        this.state = {quotestionIndex: 0, chosenCategory: null, showGoodAns: false, scores: [], pressedQuestions: []};
        this.transformQuestions = this.transformQuestions.bind(this);
        this.messageRef = null;

    }

    componentDidMount() {

    }

    renderBackForward() {
        let {quotestionIndex, chosenCategory} = this.state;

        return (
            <View style={{
                justifyContent: quotestionIndex > 0 ? 'space-between' : 'center',
                width: '100%',
                flexDirection: 'row',
                marginTop: 20
            }}>
                {quotestionIndex > 0 ?
                    <TouchableOpacity style={{...styles.saveButton, width: '45%'}} numberOfLines={1}
                                      adjustsFontSizeToFit={true}
                                      onPress={() => {
                                          this.setState({quotestionIndex: quotestionIndex - 1, showGoodAns: false});
                                      }}>
                        <Text style={{...styles.buttonText, color: 'white', textAlign: 'center'}} numberOfLines={1}
                              adjustsFontSizeToFit={true}>
                            POPRZEDNIE
                        </Text>
                    </TouchableOpacity> : null}
                {quotestionIndex < chosenCategory.questions.length - 1 ?
                    <TouchableOpacity style={{...styles.saveButton, width: quotestionIndex === 0 ? '100%' : '45%'}} numberOfLines={1}
                                      adjustsFontSizeToFit={true}
                                      onPress={() => {
                                          this.setState({quotestionIndex: quotestionIndex + 1, showGoodAns: false});
                                      }}>
                        <Text style={{...styles.buttonText, color: 'white', textAlign: 'center'}} numberOfLines={1}
                              adjustsFontSizeToFit={true}>
                            NASTEPNE
                        </Text>
                    </TouchableOpacity> : null}
                {quotestionIndex === chosenCategory.questions.length - 1 ?
                    <TouchableOpacity style={{...styles.saveButton, width: quotestionIndex === 0 ? '100%' : '45%', backgroundColor: theme.LIGHT_BLUE}}
                                      numberOfLines={1} adjustsFontSizeToFit={true}
                                      onPress={() => {
                                          this.handleGoToSummary();
                                      }}>
                        <Text style={{...styles.buttonText, color: 'white', textAlign: 'center'}} numberOfLines={1}
                              adjustsFontSizeToFit={true}>
                            WYNIK
                        </Text>
                    </TouchableOpacity> : null}
            </View>
        );
    }

    handleGoToSummary() {
        let val = this.state.scores;
        this.setState({quotestionIndex: 0, showGoodAns: false, chosenCategory: null, scores: [], pressedQuestions: []});
        this.props.navigation.navigate('TestSummary', {score: val});
    }

    renderCheckButton() {
        return (
            <TouchableOpacity style={{...styles.saveButton, marginTop: 60, backgroundColor: '#8ABCE6', width: '100%'}}
                              onPress={() => {
                                  this.setState({showGoodAns: !this.state.showGoodAns});
                              }}>
                <Text style={{...styles.buttonText, color: 'white', textAlign: 'center'}}>SPRAWDŹ</Text>
            </TouchableOpacity>
        );
    }

    renderTitle() {
        let {chosenCategory} = this.state;
        return (
            <View style={{...styles.buttonContainterStyle, marginTop: 40, borderRadius: 6}}>
                <Text style={styles.buttonText} adjustsFontSizeToFit={true}>
                    {chosenCategory.questions[this.state.quotestionIndex].question}
                </Text>
            </View>
        );
    }

    pressQuestion(index) {
        let {chosenCategory, quotestionIndex, scores, pressedQuestions} = this.state;
        if (!pressedQuestions.includes(quotestionIndex)) {
            let dummy = chosenCategory;
            dummy.questions[quotestionIndex].answers[index].pressed = !dummy.questions[quotestionIndex].answers[index].pressed;
            let myNewScores = scores;
            myNewScores[quotestionIndex] = false;
            for (let i = 0; i < dummy.questions[quotestionIndex].answers.length; i++) {
                if (dummy.questions[quotestionIndex].answers[i].correct && dummy.questions[quotestionIndex].answers[i].pressed) {
                    myNewScores[quotestionIndex] = true;
                }
            }
            let newDummy = pressedQuestions;
            newDummy.push(quotestionIndex);
            this.setState({chosenCategory: dummy, scores: myNewScores, pressedQuestions: newDummy});
        } else {
            this.messageRef.showMessage({message: 'MASZ JEDNĄ PRÓBĘ', type: 'warning', duration: 500});

        }
    }

    checkAnswer(item) {

        let wasItCorret = false;

        if (item.correct) {
            wasItCorret = true;
        } else {
            if (item.pressed) {
                wasItCorret = false;
            } else {
                wasItCorret = null;
            }
        }

        return wasItCorret;
    }

    getButtonBackground(item) {
        let {showGoodAns} = this.state;
        if (showGoodAns) {
            // let wasItOk=this.checkAnswer(item)
            let wasItOk = item.correct;

            if (wasItOk == true) {
                return 'green';
            }
            if (wasItOk == false) {
                return 'red';
            } else {
                return 'white';
            }
        } else {
            if (item.pressed) {
                return theme.LIGHT_BLUE;
            } else {
                return 'white';
            }
        }
    }

    renderOneQuestion(item, index) {
        let whichBackground = this.getButtonBackground(item);
        let whichFont = whichBackground === theme.LIGHT_BLUE ? 'white' : 'black';
        return (
            <TouchableOpacity key={index} style={{
                ...styles.buttonContainterStyle,
                width: '100%', backgroundColor: whichBackground,
            }}
                              onPress={() => {
                                  this.pressQuestion(index);
                              }}>
                <Text style={{...styles.buttonText, color: whichFont}} numberOfLines={1} adjustsFontSizeToFit={true}>
                    {item.value}
                </Text>
            </TouchableOpacity>
        );
    }

    renderQuestions() {

        let {quotestionIndex, chosenCategory} = this.state;
        return (
            <View style={{marginTop: 20}}>
                {chosenCategory.questions[quotestionIndex].answers.map((item, ind) => {
                    return (this.renderOneQuestion(item, ind));
                })}
            </View>
        );
    }

    transformQuestions() {


        let {chosenCategory} = this.props.user;
        let dummy = [];
        for (let i = 0; i < chosenCategory.questions.length; i++) {

            for (let p = 0; p < chosenCategory.questions[i].answers.length; p++) {
                chosenCategory.questions[i].answers[p] = {...chosenCategory.questions[i].answers[p], pressed: false};
            }
        }
        dummy = chosenCategory;

        this.setState({chosenCategory: dummy, scores: Array(chosenCategory.questions.length).fill(false)});
    }

    render() {
        let {chosenCategory} = this.state;

        return (
            <>
                <OnFocus
                    onUpdate={this.transformQuestions}/>
                {chosenCategory ?
                    <SafeAreaView style={styles.container}>
                        <Header nav={this.props.navigation} withSettingsButton={false}/>
                        <FlashMessage ref={(ref) => {
                            this.messageRef = ref;
                        }}/>
                        <ScrollView contentContainerStyle={styles.innerContainterStyle}>
                            {this.renderTitle()}
                            {this.renderQuestions()}
                            {this.renderCheckButton()}
                            {this.renderBackForward()}
                        </ScrollView>
                    </SafeAreaView> : null}
            </>
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
        width: '85%',
        paddingBottom: '10%',
    },
    saveButton: {
        backgroundColor: theme.D_BLUE,
        width: '100%',
        borderRadius: 6,
        padding: '4%',
        alignSelf: 'center',
    },
    buttonText: {
        fontSize: 16,
        color: '#76828C',
    },

    buttonContainterStyle: {
        flexDirection: 'row',
        width: '100%',
        marginTop: 20,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#8ABCE6',
        paddingVertical: 10,
        paddingHorizontal: 20,
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
)(Test);
