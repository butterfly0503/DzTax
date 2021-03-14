import React from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    SafeAreaView,
    Dimensions,
    TouchableWithoutFeedback,
    ScrollView,
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {setCategory, setQuestion, setQuestionNumber, updateProgress} from '../actions/user';
import theme from '../theme/theme';
import Header from '../components/header';
import VideoPlayer from 'react-native-video-controls';
import {Icon} from 'react-native-elements';
import {Overlay} from 'react-native-elements';
import {useFocusEffect} from '@react-navigation/native';
import Spinner from 'react-native-spinkit';

function OnFocus({onUpdate}) {
    useFocusEffect(
        React.useCallback(() => {
            onUpdate();
        }, [onUpdate]),
    );

    return null;
}

class PlayFishki extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playlistActive: true, questionNumber: 0, loading: false,
            numberOfQuestions: 10, timerRepeats: 0, overlayVis: false, chosenButton: 0,
        };
        this.myTimer = null;
        this.addTime = this.addTime.bind(this);
        this.checkStatus = this.checkStatus.bind(this);
    }

    showSpinner() {
        return (
            <Overlay isVisible={this.state.loading}>
                <Spinner isVisible={true} size={100} type='Pulse' color={theme.D_BLUE}/>
            </Overlay>
        );
    }

    renderButtons() {
        let {playlistActive} = this.state;
        return (
            <View style={styles.playListButtonContainter}>
                <TouchableOpacity style={{
                    ...styles.buttonStyle,
                    backgroundColor: playlistActive ? theme.LIGHT_BLUE : theme.SUBCATEGORY_COLOR,
                }}
                                  onPress={() => {
                                      this.setState({playlistActive: true});
                                  }}>
                    <Text style={{...styles.buttonText, color: playlistActive ? 'white' : 'black'}}>PLAYLISTA</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{
                    ...styles.buttonStyle,
                    backgroundColor: !playlistActive ? theme.LIGHT_BLUE : theme.SUBCATEGORY_COLOR,
                }}
                                  onPress={() => {
                                      this.setState({playlistActive: false});
                                  }}>
                    <Text style={{...styles.buttonText, color: !playlistActive ? 'white' : 'black'}}>FISZKI</Text>
                </TouchableOpacity>
            </View>
        );
    }

    renderCategoryQuestion() {
        let {chosenQuestion, chosenQuestionNumber, chosenCategory} = this.props.user;
        let categoryText = chosenCategory ? chosenCategory.name : 'Kategoria';
        let questionText = chosenQuestion ? (chosenQuestionNumber + 1 + '. ' + chosenQuestion.question) : 'Numer i treść pytania';

        return (
            <View style={{paddingTop: 50}}>
                <TouchableOpacity style={styles.categoriesButton} onPress={() => {
                    this.props.navigation.goBack();
                }}>
                    <Text style={{...styles.buttonText}}>{categoryText}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.categoriesButton} onPress={() => {
                    this.props.navigation.goBack();
                }}>
                    <Text style={{...styles.buttonText}}>{questionText}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    addTime() {
        let {timerRepeats} = this.state;
        if (timerRepeats < 3) {
            this.setState({timerRepeats: timerRepeats + 1});
        } else {
            if (this.canShowBackForw(true)) {
                this.handlePressBackFor(true);
                this.setState({timerRepeats: 0, overlayVis: false});
                clearInterval(this.myTimer);
            } else {
                this.setState({timerRepeats: 0, overlayVis: false});
                clearInterval(this.myTimer);
                this.props.navigation.goBack();
            }

        }
    }

    handleVideoEnd() {

        let {lastPressed, maxQuestionNumber, chosenQuestionNumber} = this.props.user;
        if (lastPressed == 'picker' && chosenQuestionNumber == maxQuestionNumber) {
            console.log('tutaj nie przesuwamy');
            //this.setState({overlayVis:true})
        } else {
            this.myTimer = setInterval(this.addTime, 500);
            this.setState({overlayVis: true});
        }


    }

    renderPlaylist() {
        return (
            <View style={styles.videoStyle}>
                <VideoPlayer
                    source={{uri: this.props.user.chosenQuestion.sound}}
                    disableBack={true}
                    disableFullscreen={true}
                    audioOnly={true}
                    paused={true}
                    poster='https://image.shutterstock.com/image-photo/white-transparent-leaf-on-mirror-260nw-1029171697.jpg'
                    style={{width: Dimensions.get('window').width * 0.5, height: '100%'}}
                    seekColor='white'
                    resizeMode="cover"
                    onEnd={() => {
                        this.handleVideoEnd();
                    }}
                />
            </View>
        );
    }

    async handlePressBackFor(forward) {
        let {chosenCategory, chosenQuestionNumber, categoryList, chosenQuestion, categoriesQuestionPicked, maxQuestionNumber} = this.props.user;
        if (!categoriesQuestionPicked) {
            categoryList = [chosenCategory];
        }
        this.setState({loading: true});
        let sta = this.convertButtonToStatus();
        let resp = await this.props.updateProgress(chosenCategory.id, chosenQuestion.id, sta);
        if (resp) {
            if (forward) {
                if (!categoriesQuestionPicked) {


                    if (chosenCategory.questions.length > chosenQuestionNumber + 1) {
                        chosenQuestionNumber += 1;
                        this.props.setQuestionNumber(chosenQuestionNumber);
                        this.props.setQuestion(chosenCategory.questions[chosenQuestionNumber]);
                    } else {
                        console.log('we are out of questions,end');
                    }
                } else {
                    if (chosenCategory.questions.length > chosenQuestionNumber + 1) {
                        chosenQuestionNumber += 1;

                        this.props.setQuestionNumber(chosenQuestionNumber);
                        this.props.setQuestion(chosenCategory.questions[chosenQuestionNumber]);
                    } else {
                        let catIdx = categoryList.map(function (e) {
                            return e.id;
                        }).indexOf(chosenCategory.id);
                        if (catIdx + 1 < categoryList.length) {
                            this.props.setCategory(categoryList[catIdx + 1]);
                            this.props.setQuestion(categoryList[catIdx + 1].questions[0]);


                            this.props.setQuestionNumber(0);
                        } else {
                            console.log('we are at the end of all categories');
                        }
                    }
                }

            } else {
                if (!categoriesQuestionPicked) {
                    if (chosenQuestionNumber > 0) {
                        chosenQuestionNumber -= 1;
                        this.props.setQuestionNumber(chosenQuestionNumber);
                        this.props.setQuestion(chosenCategory.questions[chosenQuestionNumber]);
                    } else {
                        console.log('we are out of questions,beggining');
                    }
                } else {
                    if (chosenQuestionNumber > 0) {
                        chosenQuestionNumber -= 1;

                        this.props.setQuestionNumber(chosenQuestionNumber);
                        this.props.setQuestion(chosenCategory.questions[chosenQuestionNumber]);
                    } else {

                        let catIdx = categoryList.map(function (e) {
                            return e.id;
                        }).indexOf(chosenCategory.id);
                        if (catIdx > 0) {
                            chosenQuestionNumber = categoryList[catIdx - 1].questions.length - 1;
                            this.props.setCategory(categoryList[catIdx - 1]);
                            this.props.setQuestion(categoryList[catIdx - 1].questions[categoryList[catIdx - 1].questions.length - 1]);


                            this.props.setQuestionNumber(chosenQuestionNumber);
                        } else {
                            console.log('we are at the beggining of all categories');
                        }
                    }
                }

            }
        } else {
            console.log('updating status went wrong');
        }

        this.checkStatus();
        this.setState({playlistActive: true, loading: false});
    }

    canShowBackForw(forward) {
        let {chosenQuestionNumber, categoryList, chosenCategory, categoriesQuestionPicked, chosenCategoryLimits, maxQuestionNumber} = this.props.user;
        let catIdx = categoryList.map(function (e) {
            return e.id;
        }).indexOf(chosenCategory.id);

        if (!categoriesQuestionPicked) {
            if (forward) {
                if (maxQuestionNumber != null) {
                    if (maxQuestionNumber > chosenQuestionNumber) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    if (chosenCategory.questions.length > chosenQuestionNumber + 1) {
                        return true;
                    } else {
                        return false;
                    }
                }

            } else {

                if (0 < chosenQuestionNumber) {
                    return true;
                } else {
                    return false;
                }

            }
        } else {
            if (forward) {
                if (categoryList[catIdx].questions[chosenQuestionNumber + 1] == undefined && catIdx == categoryList.length - 1) {
                    return false;
                } else {
                    return true;
                }
            } else {
                if (catIdx == 0 && categoryList[catIdx].questions[chosenQuestionNumber - 1] == undefined) {
                    return false;
                } else {
                    return true;
                }

            }
        }


    }

    renderBackForward() {

        let canShowBack = this.canShowBackForw(false);
        let canShowForward = this.canShowBackForw(true);


        return (
            <View
                style={{justifyContent: canShowBack ? 'space-between' : 'center', width: '100%', flexDirection: 'row'}}>
                {canShowBack ?
                    <TouchableOpacity style={{...styles.saveButton, width: '45%'}} numberOfLines={1}
                                      adjustsFontSizeToFit={true}
                                      onPress={() => {
                                          this.handlePressBackFor(false);
                                      }}>
                        <Text style={{...styles.buttonText, color: 'white'}} numberOfLines={1}
                              adjustsFontSizeToFit={true}>
                            POPRZEDNIE
                        </Text>
                    </TouchableOpacity> : null}
                {canShowForward ?
                    <TouchableOpacity style={{...styles.saveButton, width: '45%'}} numberOfLines={1}
                                      adjustsFontSizeToFit={true}
                                      onPress={() => {
                                          this.handlePressBackFor(true);
                                      }}>
                        <Text style={{...styles.buttonText, color: 'white'}} numberOfLines={1}
                              adjustsFontSizeToFit={true}>
                            NASTĘPNE
                        </Text>
                    </TouchableOpacity> : null}
            </View>
        );
    }

    renderFishka() {
        return (
            <View style={styles.questionContainerStyle}>
                <Text style={styles.questionTextStyle}>{this.props.user.chosenQuestion.soundText}</Text>
            </View>
        );
    }

    handleIconPress(key) {

        if (this.state.overlayVis) {
            if (this.canShowBackForw(true)) {
                this.handlePressBackFor(true);
                this.setState({timerRepeats: 0, overlayVis: false});
                clearInterval(this.myTimer);
            } else {
                this.setState({timerRepeats: 0, overlayVis: false});
                clearInterval(this.myTimer);
                this.props.navigation.goBack();
            }

        } else {
            this.setState({chosenButton: key});
        }

    }

    renderScoreColumn(maxLen, score, color, word, key) {
        return (
            <View style={{justifyContent: 'space-between'}} key={key}>

                <Icon name={this.state.chosenButton === key ? 'check-circle' : 'circle'} type='font-awesome' size={50}
                      color={color} onPress={() => {
                    this.handleIconPress(key);
                }}/>

                <View style={{alignItems: 'center'}}>
                    <Text style={{fontSize: 15, color: color}}>{score}/{maxLen}</Text>
                    <Text style={{fontSize: 15}}>{word}</Text>
                </View>
            </View>
        );

    }

    checkIfProgressSaved() {
        let {categoryProgress, chosenCategory, chosenQuestion} = this.props.user;
        let status = null;

        for (let i = 0; i < categoryProgress.length; i++) {
            if (categoryProgress[i].categoryID == chosenCategory.id) {
                for (let p = 0; p < categoryProgress[i].questions.length; p++) {
                    if (categoryProgress[i].questions[p].questionID == chosenQuestion.id) {
                        status = categoryProgress[i].questions[p].status;
                    }
                }
            }
        }
        return status ? status : 'Umiem';
    }

    convertStatusToButton(status) {
        let button = 0;
        switch (status) {
            case 'Umiem':
                button = 0;
                break;
            case 'Powtarzam':
                button = 1;
                break;
            case 'Uczę się':
                button = 2;
                break;
            default:
                break;
        }
        return button;
    }

    convertButtonToStatus() {
        let {chosenButton} = this.state;
        let status = null;
        switch (chosenButton) {
            case 0:
                status = 'Umiem';
                break;
            case 1:
                status = 'Powtarzam';
                break;
            case 2:
                status = 'Uczę się';
                break;
            default:
                break;
        }
        return status;

    }

    transformProgress() {
        let {categoryProgress, chosenCategory} = this.props.user;
        let catCopy = categoryProgress;
        let umiem = 0;
        let powtarzam = 0;
        let uczesie = chosenCategory.questions.length;
        let progressFromCurrCategory = catCopy.filter((item, idx) => {
            return item.categoryID == chosenCategory.id;
        });
        if (progressFromCurrCategory.length > 0) {
            for (let i = 0; i < progressFromCurrCategory[0].questions.length; i++) {
                switch (progressFromCurrCategory[0].questions[i].status) {
                    case 'Umiem':
                        umiem += 1;
                        uczesie -= 1;
                        break;
                    case 'Powtarzam':
                        powtarzam += 1;
                        uczesie -= 1;
                        break;
                    default :
                        break;
                }
            }
        }
        return {umiem: umiem, powtarzam: powtarzam, uczesie: uczesie};
    }

    renderProgressIndicators() {
        let {chosenCategory} = this.props.user;
        let questionStatus = this.checkIfProgressSaved();
        let numberOfQuestions = chosenCategory.questions.length;
        let resp = this.transformProgress();
        let umiem = resp.umiem;
        let powtarzam = resp.powtarzam;
        let uczesie = resp.uczesie;
        let scoreArray = [umiem, powtarzam, uczesie];
        let colorArray = ['green', 'orange', 'red'];
        let wordArray = ['Umiem', 'Powtarzam', 'Uczę się'];
        return (
            <View style={styles.scoreContainerStyle}>
                {scoreArray.map((item, idx) => {
                    return (
                        this.renderScoreColumn(numberOfQuestions, item, colorArray[idx], wordArray[idx], idx)
                    );
                })}
            </View>


        );
    }

    showOverlay() {
        return (
            <Overlay overlayStyle={{width: '80%'}} isVisible={this.state.overlayVis} onBackdropPress={() => {
                this.setState({overlayVis: false});
            }}>
                <>
                    <Text style={{textAlign: 'center', fontSize: 20}}>Pozostało czasu na
                        odpowiedź {3 - this.state.timerRepeats}s</Text>
                    {this.renderProgressIndicators()}
                </>
            </Overlay>
        );
    }

    checkStatus() {
        let questionStatus = this.checkIfProgressSaved();
        let convertedButton = this.convertStatusToButton(questionStatus);
        this.setState({chosenButton: convertedButton});
    }

    render() {
        return (
            <>
                <OnFocus
                    onUpdate={this.checkStatus}/>
                <SafeAreaView style={styles.container}>
                    <Header nav={this.props.navigation}/>
                    {this.showSpinner()}
                    <ScrollView contentContainerStyle={styles.innerContainterStyle}>
                        {this.showOverlay()}
                        {this.renderButtons()}
                        {this.state.playlistActive ? this.renderPlaylist() : this.renderFishka()}
                        {this.renderBackForward()}
                        {this.state.playlistActive ? this.renderProgressIndicators() : null}
                        {this.renderCategoryQuestion()}

                    </ScrollView>
                </SafeAreaView>
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
        width: '90%',
        paddingBottom: 50,
    },
    buttonText: {
        fontSize: 20,
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    buttonStyle: {
        padding: '4%',
        borderRadius: 10,
        borderColor: theme.L_BLUE,
        borderWidth: 1,
        width: '40%',
    },
    playListButtonContainter: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    categoriesButton: {
        borderColor: theme.L_BLUE,
        borderWidth: 1,
        borderRadius: 10,
        padding: '4%',
        marginTop: '6%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    questionTextStyle: {
        fontSize: 20,
        color: 'black',
        fontWeight: '500',
        textAlign: 'justify',
    },
    questionContainerStyle: {
        marginTop: '5%',
        padding: '4%',
        alignSelf: 'center',
        width: '80%',
        backgroundColor: theme.SUBCATEGORY_COLOR,
    },
    scoreContainerStyle: {
        width: '90%',
        height: Dimensions.get('window').height * 0.17,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: '10%',
        alignSelf: 'center',
    },
    videoStyle: {
        width: '100%',
        height: Dimensions.get('window').height * 0.2,
        alignSelf: 'center',
        marginTop: '5%',
        flexDirection: 'row',
        alignItems: 'center',
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
    return bindActionCreators({setCategory, setQuestion, setQuestionNumber, updateProgress}, dispatch);
};

const mapStateToProps = state => {
    return {
        user: state.user,
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(PlayFishki);
