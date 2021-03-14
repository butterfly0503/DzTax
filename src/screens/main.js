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
    Platform,
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {
    setQuestionNumber,
    fetchCategories,
    updateProgress,
    setMaxQuestionNumber,
    setCategoryLimits,
    setLastPressed, setQuestion,
} from '../actions/user';
import theme from '../theme/theme';
import {Icon, withTheme} from 'react-native-elements';
import VideoPlayer from 'react-native-video-controls';
import Header from '../components/header';
import DropDownPicker from 'react-native-dropdown-picker';
import FlashMessage from 'react-native-flash-message';
import {showMessage, hideMessage} from 'react-native-flash-message';
import Spinner from 'react-native-spinkit';
import {Overlay} from 'react-native-elements';
import {ThemeProvider} from '@react-navigation/native';
import AudioPlayer from '../components/audioPlayer/AudioPlayer';

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            login: '',
            password: '',
            chosenMinLimit: {label: 0, value: 0},
            chosenMaxLimit: {label: 0, value: 0},
            lastPressed: null,
        };
        this.controller;
        this.messageRef = null;
    }

    renderNumberQuestion() {
        let {chosenQuestion, chosenQuestionNumber, categoriesQuestionPicked} = this.props.user;
        let text = chosenQuestion && categoriesQuestionPicked ? (chosenQuestion.question) : 'Numer i treść pytania';
        let number = chosenQuestion && categoriesQuestionPicked ? ('- ' + (chosenQuestionNumber + 1) + ' -') : '- 01 -';
        return (
            <View>
                <View style={{flexDirection: 'row', width: '100%', paddingHorizontal: 20, marginTop: 30, alignSelf: 'center', justifyContent: 'flex-start'}}>
                    <View style={{...styles.titleWrapper}}>
                        <Text style={styles.titleText} numberOfLines={1} ellipsizeMode='tail'>{text}</Text>
                    </View>
                    <View style={{...styles.numberWrapper, marginLeft: 20}}>
                        <Text style={styles.titleText}>{number}</Text>
                    </View>
                </View>
                {this.renderMusic()}
                {this.renderProgressIndicators()}
            </View>
        );
    }

    renderProgressIndicators() {
        let {categoryProgress, chosenCategory} = this.props.user;
        let numberOfQuestions = chosenCategory.questions.length;
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
        let scoreArray = [umiem, powtarzam, uczesie];
        let colorArray = ['#4EA056', '#DDC343', '#C63838'];
        let wordArray = ['Umiem', 'Powtarzam', 'Uczę się'];
        return (
            <View style={{width: '100%', backgroundColor: '#f9fafa', height: 130, flexDirection: 'row', paddingVertical: 20, marginTop: 20, alignSelf: 'center', justifyContent: 'center'}}>
                {scoreArray.map((item, idx) => {
                    return (
                        <View key={'score_' + idx} style={{marginHorizontal: idx === 1 ? '20%' : 0}}>
                            <Icon name={'circle'} type='font-awesome' size={40} color={colorArray[idx]} />
                            <View style={{alignItems: 'center', marginTop: 10}}>
                                <Text style={{fontSize: 12, color: colorArray[idx]}}>{item}/{numberOfQuestions}</Text>
                                <Text style={{fontSize: 12, color: colorArray[idx]}}>{wordArray[idx]}</Text>
                            </View>
                        </View>
                    );
                })}
            </View>
        );
    }

    renderMusic() {
        const {chosenQuestion, chosenCategory: {questions}} = this.props.user;
        let index = 0;
        for (let i = 0 ; i < questions.length; i++) {
            if (questions[i].id === chosenQuestion.id) index = i;
        }
        return (
            <View style={{width: '100%'}}>
                <AudioPlayer
                    audioUrl={chosenQuestion.sound}
                    selectedTrack={index}
                    totalTracks={questions.length}
                    onBackward={() => {
                        //this.props.navigation.navigate('PlayFishki');
                        this.props.setQuestion(questions[index - 1]);
                        this.props.setQuestionNumber(index - 1);
                    }}
                    onForward={() => {
                        //this.props.navigation.navigate('PlayFishki');
                        this.props.setQuestion(questions[index + 1]);
                        this.props.setQuestionNumber(index + 1);
                    }}
                />
            </View>

        );
    }

    changePickerItem(field, value) {

        this.setState({[field]: value, lastPressed: 'picker'});
    }

    renderPickers() {
        let items = [];
        if (this.props.user.chosenCategoryLimits) {
            if (this.props.user.chosenCategoryLimits.max != null) {
                for (let i = 0; i < this.props.user.chosenCategoryLimits.max + 1; i++) {
                    items.push({label: i + 1, value: i});
                }
            } else {
                items = [{label: null, value: null}];
            }
        } else {
            items = [{label: null, value: null}];
        }
        let myStyle = {flexDirection: 'row', width: '45%', justifyContent: 'space-between'};
        if (Platform.OS === 'ios') {
            myStyle = {...myStyle, zIndex: 20};
        }
        if (this.props.user.chosenCategoryLimits && this.props.user.chosenCategoryLimits.max != null) {
            return (
                <View style={myStyle}>
                    <DropDownPicker
                        items={items}
                        placeholder="od"
                        style={{borderColor: theme.L_BLUE}}
                        containerStyle={{width: '45%', height: '100%'}}
                        itemStyle={{
                            justifyContent: 'flex-start',
                        }}
                        onChangeItem={item => this.changePickerItem('chosenMinLimit', item)}
                    />
                    <DropDownPicker
                        items={items}
                        placeholder="do"
                        style={{borderColor: theme.L_BLUE}}
                        containerStyle={{width: '45%', height: '100%'}}
                        itemStyle={{
                            justifyContent: 'flex-start',
                        }}
                        onChangeItem={item => this.changePickerItem('chosenMaxLimit', item)}
                    />
                </View>

            );
        } else {
            return (null);
        }
    }

    handlePressOnQuestion() {
        this.setState({lastPressed: 'question'});
        this.props.navigation.navigate('Categories', {onlyCategory: false});

    }

    handleGoCategories() {
        this.props.setCategoryLimits(null, null);
        this.setState({lastPressed: 'categories'});
        this.props.navigation.navigate('Categories', {onlyCategory: false});
    }

    showSpinner() {
        return (
            <Overlay isVisible={this.props.user.loading}>
                <Spinner isVisible={true} size={100} type='Pulse' color={theme.D_BLUE}/>
            </Overlay>
        );
    }

    renderFullList() {
        let {categoriesQuestionPicked, chosenQuestionNumber, chosenCategory, chosenQuestion} = this.props.user;
        let kategorieText = chosenCategory ? chosenCategory.name : 'Wyszukaj';
        let nrPytaniaText = categoriesQuestionPicked ? chosenQuestionNumber + 1 : 'Wyszukaj';
        return (
            <>
                <View style={{backgroundColor: '#f9fafa', paddingHorizontal: '5%', paddingVertical: 30, justifyContent: 'center'}}>
                    <TouchableOpacity style={{
                        ...styles.categoriesButton,
                        justifyContent: kategorieText === 'Wyszukaj' ? 'space-between' : 'center',
                    }}
                                      onPress={() => {
                                          this.handleGoCategories();
                                      }}>
                        {kategorieText === 'Wyszukaj' ? <Text style={styles.buttonText}>Kategorie</Text> : null}
                        <Text style={{...styles.buttonText, color: 'white'}}>{kategorieText}</Text>
                    </TouchableOpacity>
                    <View style={styles.buttonLineStyle}>
                        <View style={{...styles.m_buttonStyle}}>
                            <Text style={styles.buttonText}>Nr pytania</Text>
                        </View>
                        <TouchableOpacity style={styles.bordered_buttonStyle} onPress={() => {
                            this.handlePressOnQuestion();
                        }}>
                            <Text style={{
                                ...styles.buttonText,
                                color: nrPytaniaText != 'wyszukaj' ? theme.L_BLUE : theme.LIGHT_BLUE,
                            }}>{nrPytaniaText}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.buttonLineStyle}>
                        <View style={styles.l_buttonStyle}>
                            <Text style={styles.buttonText}>Zakres</Text>
                        </View>
                        {this.renderPickers()}
                    </View>
                </View>
                {chosenQuestion && categoriesQuestionPicked ? this.renderNumberQuestion() : null}
                {this.renderButtons()}
            </>
        );
    }

    renderButtons() {
        let {categoriesQuestionPicked, chosenQuestion} = this.props.user;
        return (
            <View style={{width: '100%', flexDirection: 'row', justifyContent: 'center', marginVertical: 20}}>
                <TouchableOpacity onPress={() => {
                    this.props.navigation.navigate('ShareOpinion');
                }} style={{width: 50, height: 50, borderRadius: 25, borderColor: '#8ABCE6', borderWidth: 1, backgroundColor: '#E9F1FA', alignItems: 'center', justifyContent: 'center'}}>
                    <Icon name={'chat'} type='material-community' size={20} color={'#004176'} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    if (chosenQuestion && categoriesQuestionPicked) {
                        this.props.navigation.navigate('Test');
                    }
                }} style={{width: 50, height: 50, borderRadius: 25, borderColor: '#8ABCE6', borderWidth: 1, backgroundColor: '#E9F1FA', alignItems: 'center', justifyContent: 'center', marginHorizontal: '20%'}}>
                    <Icon name={'timer-sand-full'} type='material-community' size={20} color={'#004176'} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    if (chosenQuestion && categoriesQuestionPicked) {
                        this.props.navigation.navigate('Reports');
                    }
                }} style={{width: 50, height: 50, borderRadius: 25, borderColor: '#8ABCE6', borderWidth: 1, backgroundColor: '#E9F1FA', alignItems: 'center', justifyContent: 'center'}}>
                    <Icon name={'book'} type='ionicon' size={20} color={'#004176'} />
                </TouchableOpacity>
            </View>
        );
    }

    handleGoNext() {
        let {chosenCategoryLimits} = this.props.user;
        let {chosenMaxLimit, chosenMinLimit} = this.state;
        if (this.props.user.chosenQuestionNumber != null) {
            if (chosenCategoryLimits.max != null) {
                if (chosenMaxLimit.value != chosenMinLimit.value) {
                    this.props.setQuestionNumber(Math.min(parseInt(chosenMaxLimit.value), parseInt(chosenMinLimit.value)));
                    this.props.setMaxQuestionNumber(Math.max(parseInt(chosenMaxLimit.value), parseInt(chosenMinLimit.value)));
                } else {
                    if (chosenMaxLimit.value == 0) {
                        this.props.setQuestionNumber(0);
                        this.props.setMaxQuestionNumber(chosenCategoryLimits.max);
                    } else {
                        this.props.setQuestionNumber(chosenMaxLimit.value);
                        this.props.setMaxQuestionNumber(chosenMaxLimit.value);
                    }
                }


            } else {
                console.log('wchodzimy do nulla');
                this.props.setMaxQuestionNumber(null);

            }
            this.props.setLastPressed(this.state.lastPressed);
            this.props.navigation.navigate('PlayFishki');
        } else {

            this.messageRef.showMessage({message: 'WYBIERZ OPCJĘ', type: 'info', duration: 500});

        }
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <Header nav={this.props.navigation}/>
                {this.showSpinner()}
                <FlashMessage ref="myLocalFlashMessage" ref={(ref) => {
                    this.messageRef = ref;
                }}/>
                <ScrollView contentContainerStyle={styles.scrollViewStyle}>
                    {this.renderFullList()}

                </ScrollView>

            </SafeAreaView>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
    },
    innerContainterStyle: {
        alignSelf: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
    },
    categoriesButton: {
        backgroundColor: theme.D_BLUE,
        borderRadius: 8,
        paddingHorizontal: 30,
        paddingVertical: '4%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    titleWrapper: {
        borderColor: '#8ABCE6',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 20,
        paddingVertical: 10,
        flex: 1
    },
    titleText: {
        fontSize: 16,
        color: '#76828C',
    },
    numberWrapper: {
        borderColor: '#8ABCE6',
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        alignItems: 'flex-start',
        alignSelf: 'flex-start'
    },
    buttonLineStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: '5%',
        justifyContent: 'space-between',
    },
    buttonStyle: {
        backgroundColor: theme.D_BLUE,
        borderRadius: 8,
        padding: '4%',
        // borderColor:theme.L_BLUE,
        // borderWidth:1,
        width: '45%',
    },
    m_buttonStyle: {
        backgroundColor: theme.M_BLUE,
        borderRadius: 8,
        padding: '4%',
        width: '47%',
    },
    l_buttonStyle: {
        backgroundColor: theme.L_BLUE,
        borderRadius: 8,
        padding: '4%',
        width: '47%',
    },
    bordered_buttonStyle: {
        borderColor: '#8ABCE6',
        borderWidth: 1,
        borderRadius: 8,
        padding: '4%',
        width: '47%',
    },
    scrollViewStyle: {
        alignSelf: 'center',
    },
    videoStyle: {
        alignSelf: 'center',
        marginTop: '5%',
        flexDirection: 'row',
        alignItems: 'center',
    },

});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        setQuestionNumber,
        setQuestion,
        fetchCategories,
        updateProgress,
        setMaxQuestionNumber,
        setCategoryLimits,
        setLastPressed,
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
)(Main);
