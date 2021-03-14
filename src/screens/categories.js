import React from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    ScrollView,
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
import {
    setCategory,
    setQuestion,
    setQuestionNumber,
    setCategoryLimits,
    updateCategories,
    setQuestionFlag,
    setMaxQuestionNumber,
} from '../actions/user';
import theme from '../theme/theme';
import Header from '../components/header';
import {Icon} from 'react-native-elements';
import {romanize} from '../func/utils';


class Categories extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

    }

    handleCategoryPress(primary, subcategoryIdx, categoryIdx) {
        let {onlyCategory} = this.props.route.params;
        let {categoryList} = this.props.user;
        let dummy = categoryList;
        if (!onlyCategory) {
            if (primary) {
                let dummy = categoryList;
                dummy[categoryIdx].pressed = !dummy[categoryIdx].pressed;
                this.props.updateCategories(dummy);
            } else {
                this.props.setCategory(categoryList[categoryIdx]);
                this.props.setQuestion(categoryList[categoryIdx].questions[subcategoryIdx]);
                this.props.setCategoryLimits(0, categoryList[categoryIdx].questions.length - 1); //changed here
                this.props.setQuestionNumber(subcategoryIdx);
                this.props.setQuestionFlag(true);
                this.props.setMaxQuestionNumber(null);
                dummy[categoryIdx].pressed = !dummy[categoryIdx].pressed;
                this.props.updateCategories(dummy);
                this.props.navigation.goBack();
                //this.props.navigation.navigate('PlayFishki')
            }
        } else {

            this.props.setCategory(categoryList[categoryIdx]);
            this.props.setCategoryLimits(0, categoryList[categoryIdx].questions.length - 1);
            this.props.setQuestionNumber(0);
            this.props.setMaxQuestionNumber(null);
            this.props.setQuestionFlag(false);
            this.props.setQuestion(categoryList[categoryIdx].questions[0]);

            this.props.navigation.goBack();
        }
    }

    renderCategoryButton(value, categoryIdx, subCategoryIdx, primary) {
        return (
            <TouchableOpacity key={'category_button_' + categoryIdx} style={{
                ...styles.categoryButtonStyle,
                backgroundColor: theme.L_BLUE,
                borderColor: theme.D_BLUE,
            }}
                              onPress={() => {
                                  this.handleCategoryPress(primary, subCategoryIdx, categoryIdx);
                              }}>
                <Text style={{
                    color: primary ? 'white' : '#76828C',
                    fontSize: primary ? 14 : 12,
                    fontWeight: 'bold',
                    width: '80%',
                }}>{romanize(categoryIdx + 1)}. {value}</Text>
                <Image source={require('../resources/images/ic_go.png')} style={{width: 14, height: 14}}
                       tintColor="#004176"/>
            </TouchableOpacity>
        );
    }

    renderQuestions(questions, catIndex) {
        return (
            <View style={{
                backgroundColor: '#C8DDF3',
                borderColor: '#8ABCE6',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 8,
                borderWidth: 1,
                marginTop: '5%',
                paddingVertical: '5%',
            }}>
                {questions.map((item, index) => {
                    let key = catIndex * 100 + index;
                    return (
                        <View key={'subcategory_button_wrapper_' + key}>
                            <TouchableOpacity key={'subcategory_button_' + key} style={{
                                ...styles.subCategory,
                                borderBottomWidth: index < questions.length - 1 ? 1 : 0,
                                paddingBottom: index < questions.length - 1 ? 10 : 0,
                                marginTop: index > 0 ? 10 : 0,
                            }} onPress={() => {
                                this.handleCategoryPress(false, index, catIndex);
                            }}>
                                <Text style={{
                                    color: '#76828C',
                                    fontSize: 12,
                                    width: '85%',
                                }}>{index + 1}. {item.question}</Text>
                                <Image source={require('../resources/images/ic_go.png')} style={{width: 14, height: 14}}
                                       tintColor="#004176"/>
                            </TouchableOpacity>
                        </View>
                    );
                })}
            </View>
        );
    }

    renderCategoryRow(item, idx) {
        return (
            <View key={'category_row_view_' + idx} style={{width: '90%', alignSelf: 'center'}}>
                {this.renderCategoryButton(item.name, idx, null, true)}
                {item.pressed ? this.renderQuestions(item.questions, idx) : null}
            </View>
        );
    }

    renderCategories() {
        if (this.props.user.categoryList) {
            return (
                this.props.user.categoryList.map((item, idx) => {
                    return (this.renderCategoryRow(item, idx));
                })
            );
        } else {
            return (null);
        }
    }


    render() {
        return (
            <SafeAreaView style={styles.container}>
                <Header nav={this.props.navigation}/>
                <View style={styles.innerContainterStyle}>
                    <ScrollView contentContainerStyle={styles.scrollViewStyle}>
                        {this.renderCategories()}
                    </ScrollView>
                </View>
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
        alignItems: 'center',
        height: '100%',
        width: '100%',
    },
    categoryButtonStyle: {
        width: Dimensions.get('window').width * 0.9,
        padding: '5%',
        alignItems: 'center',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: theme.D_BLUE,
        marginTop: Dimensions.get('window').height * 0.03,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    subCategory: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomColor: '#8ABCE6',
    },
    scrollViewStyle: {
        alignSelf: 'center',
        width: '100%',
        paddingHorizontal: '5%',
        paddingBottom: Dimensions.get('window').height * 0.3,
    },


});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        setCategory,
        setQuestion,
        setQuestionNumber,
        setCategoryLimits,
        updateCategories,
        setQuestionFlag,
        setMaxQuestionNumber,
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
)(Categories);
