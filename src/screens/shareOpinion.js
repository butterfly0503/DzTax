import React from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Platform,
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
import {updateEmail, updatePassword, updateKey, updateUuid} from '../actions/user';
import theme from '../theme/theme';
import {Icon} from 'react-native-elements';
import Header from '../components/header';
import DpLogo from '../components/dpLogo';

import DropDownPicker from 'react-native-dropdown-picker';
import {sendEmail} from '../func/utils';
import FlashMessage from 'react-native-flash-message';

class ShareOpinion extends React.Component {
    constructor(props) {
        super(props);
        this.messageRef = null;
        this.state = {chosenSubCategoryItem: null, chosenCategoryItem: null, message: '', password: '', sending: false};
    }

    setCategory(item) { //later for filtering of data
        console.log(item);
        this.setState({chosenCategoryItem: item});
    }

    setSubcategory(item) { //later for filtering of data
        console.log(item);
        this.setState({chosenSubCategoryItem: item});
    }

    transformCategories() {
        let cate = this.props.user.categoryList ? this.props.user.categoryList : [];
        let transformed = [];
        let myObj = 0;
        for (let i = 0; i < cate.length; i++) {
            myObj = {label: cate[i].name, value: cate[i]};
            transformed.push(myObj);
        }
        return transformed;
    }

    renderPickCategory() {
        let myStyle = {
            width: '100%', height: 60, marginTop: 30,
        };
        if (Platform.OS === 'ios') {
            myStyle = {...myStyle, zIndex: 20};
        }
        let categories = this.transformCategories();
        if (!this.state.sending) {
            return (
                <View style={myStyle}>
                    <DropDownPicker
                        items={categories}
                        disabled={this.state.sending}
                        placeholder="KATEGORIA"
                        containerStyle={{width: '100%', height: 60, alignSelf: 'center'}}
                        itemStyle={{
                            justifyContent: 'flex-start',
                        }}
                        onChangeItem={item => this.setCategory(item)}
                    />
                </View>
            );
        } else {
            return (null);
        }

    }

    transformSubCategories() {

        let ques = this.state.chosenCategoryItem ? this.state.chosenCategoryItem.value.questions : [];
        let transformed = [];
        let myObj = 0;
        for (let i = 0; i < ques.length; i++) {
            myObj = {label: (i + 1) + '. ' + ques[i].question, value: ques[i]};
            transformed.push(myObj);
        }
        return transformed;
    }

    renderPickSubCategory() {
        let myStyle = {width: '100%', height: 60, marginTop: 20};
        if (Platform.OS === 'ios') {
            myStyle = {...myStyle, zIndex: 10};
        }
        let subcategories = this.transformSubCategories();
        if (!this.state.sending) {
            return (
                <View style={myStyle}>
                    <DropDownPicker
                        items={subcategories}
                        placeholder="NUMER PYTANIA ORAZ TREŚĆ"
                        containerStyle={{width: '100%', height: 60, alignSelf: 'center'}}
                        itemStyle={{
                            justifyContent: 'flex-start',
                        }}
                        onChangeItem={item => this.setSubcategory(item)}
                    />
                </View>
            );
        } else {
            return (null);
        }
    }

    renderInputField() {
        return (
            <TextInput placeholder='Dodaj komentarz...' value={this.state.message}
                       onChangeText={value => this.setState({message: value})}
                       style={{...styles.inputStyle, marginTop: 20}}
                       placeholderTextColor='gray'
                       multiline={true}
                       onSubmitEditing={() => {
                           Keyboard.dismiss();
                       }}
            />
        );
    }

    handleSend() {

        if (this.state.chosenCategoryItem && this.state.chosenSubCategoryItem && this.state.message != '') {
            let categoryID = this.state.chosenCategoryItem.value.id;
            let subCategoryID = this.state.chosenSubCategoryItem.value.id;
            this.setState({sending: true});
            sendEmail('www@dztax.pl', 'smtp.dpoczta.pl', '587', categoryID, subCategoryID, this.state.message);
            this.setState({chosenCategoryItem: null, chosenSubCategoryItem: null, message: '', sending: false});
            this.props.navigation.navigate('ShareOpinionConfirmation');
        } else {
            if (this.state.message != '') {
                this.messageRef.showMessage({message: 'WYBIERZ KATEGORIĘ I PYTANIE', type: 'warning', duration: 500});
            } else {
                this.messageRef.showMessage({message: 'UZUPEŁNIJ WIADOMOŚĆ', type: 'warning', duration: 500});
            }
        }
    }

    renderSendButton() {
        return (
            <TouchableOpacity style={{...styles.saveButton, backgroundColor: theme.L_BLUE}} onPress={() => {
                this.handleSend();
            }}>
                <Text style={{...styles.buttonText, color: 'white'}}>WYŚLIJ</Text>
            </TouchableOpacity>
        );
    }

    renderCancelButton() {
        return (
            <TouchableOpacity style={styles.saveButton} onPress={() => {
                this.props.navigation.goBack();
            }}>
                <Text style={{...styles.buttonText, color: 'white'}}>ANULUJ</Text>
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
                    {this.renderPickCategory()}
                    {this.renderPickSubCategory()}
                    {this.renderInputField()}
                    {this.renderSendButton()}
                    {this.renderCancelButton()}
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
        width: '90%',
        alignItems: 'center',
        paddingBottom: 20,
        alignSelf: 'center',
    },
    buttonText: {
        fontSize: 16,
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    buttonLineStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        justifyContent: 'space-between',
    },
    buttonStyle: {
        padding: '4%',
        borderRadius: 8,
        borderColor: theme.L_BLUE,
        borderWidth: 1,
        width: '80%',
    },
    inputStyle: {
        color: 'black',
        fontSize: 14,
        borderWidth: 1,
        borderRadius: 8,
        padding: '4%',
        borderColor: theme.L_BLUE,
        width: '100%',
        textAlignVertical: 'top',
        height: Dimensions.get('window').height * 0.25,
    },
    saveButton: {
        backgroundColor: theme.D_BLUE,
        marginTop: 20,
        width: '100%',
        borderRadius: 8,
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
)(ShareOpinion);
