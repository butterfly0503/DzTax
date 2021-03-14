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
import {updateEmail, updatePassword, updateKey, updateUuid} from '../actions/user';
import theme from '../theme/theme';
import {Icon} from 'react-native-elements';
import {StackedBarChart, PieChart} from 'react-native-chart-kit';

import Header from '../components/header';
import FusionCharts from 'react-native-fusioncharts';

class Reports extends React.Component {
    constructor(props) {
        super(props);
        this.state = {login: '', password: ''};
        this.libraryPath = Platform.select({
            // Specify fusioncharts.html file location
            ios: require('./assets/fusioncharts.html'),
            android: { uri: 'file:///android_asset/fusioncharts.html' }
        });
    }


    renderPickCategory() {
        let {chosenCategory} = this.props.user;
        let catText = chosenCategory ? chosenCategory.name : 'KATEGORIA';
        return (
            <TouchableOpacity style={{...styles.buttonStyle, marginTop: 40}} onPress={() => {
                this.props.navigation.navigate('Categories', {onlyCategory: true});
            }}>
                <Text style={styles.buttonText}>{catText}</Text>
            </TouchableOpacity>
        );
    }

    getScores() {
        let {categoryProgress, chosenCategory} = this.props.user;
        let umiem = 0;
        let powtarzam = 0;
        let uczesie = chosenCategory.questions.length;
        let filteredProgress = categoryProgress.filter((item) => {
            return (item.categoryID == chosenCategory.id);
        });
        if (filteredProgress.length > 0) {
            let prog = filteredProgress[0];
            for (let p = 0; p < prog.questions.length; p++) {
                switch (prog.questions[p].status) {
                    case 'Umiem':
                        umiem += 1;
                        uczesie -= 1;
                        break;
                    case 'Powtarzam':
                        powtarzam += 1;
                        uczesie -= 1;
                        break;
                    case 'Uczę się':
                        uczesie = uczesie;
                        break;
                    default:
                        break;
                }
            }
        }


        return {umiem: umiem, powtarzam: powtarzam, uczesie: uczesie};
    }

    renderChart() {
        let scores = this.getScores();
        let myData = [scores.umiem, scores.powtarzam, scores.uczesie];
        let config = {
            backgroundColor: 'white',
            backgroundGradientFrom: 'white',
            backgroundGradientTo: 'white',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        };

        let data = [
            {
                name: 'Umiem',
                score: myData[0],
                color: 'green',
                legendFontColor: '#7F7F7F',
                legendFontSize: 15,
            },
            {
                name: 'Powtarzam',
                score: myData[1],
                color: 'orange',
                legendFontColor: '#7F7F7F',
                legendFontSize: 15,
            },
            {
                name: 'Uczę się',
                score: myData[2],
                color: 'red',
                legendFontColor: '#7F7F7F',
                legendFontSize: 15,
            },
        ];
        return (

            <PieChart
                data={data}
                width={Dimensions.get('window').width * 0.8}
                height={Dimensions.get('window').width * 0.3}
                style={{marginTop: '10%'}}
                chartConfig={config}
                accessor="score"
                backgroundColor="transparent"
                absolute
            />
        );
    }


    render() {
        return (
            <SafeAreaView style={styles.container}>
                <Header nav={this.props.navigation} title="RAPORTY"/>
                <ScrollView contentContainerStyle={styles.innerContainterStyle}>
                    {this.renderPickCategory()}
                    {this.renderChart()}
                    {/*<View style={{width: '100%', height: 200}}>
                        <FusionCharts
                            type={'column2d'}
                            width={'100%'}
                            height={'100%'}
                            dataFormat={'json'}
                            dataSource={{
                                chart: {
                                    caption: "Harry's SuperMart",
                                    subCaption: 'Top 5 stores in last month by revenue',
                                    numberprefix: '$',
                                    theme: 'fint'
                                },
                                data: [
                                    { label: 'Bakersfield Central', value: '880000' },
                                    { label: 'Garden Groove harbour', value: '730000' },
                                    { label: 'Los Angeles Topanga', value: '590000' },
                                    { label: 'Compton-Rancho Dom', value: '520000' },
                                    { label: 'Daly City Serramonte', value: '330000' }
                                ]
                            }}
                            libraryPath={'file:///android_asset/fusioncharts.html'} // set the libraryPath property
                        />
                    </View>*/}
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
        alignItems: 'center',
        width: '100%',
    },
    buttonText: {
        fontSize: 16,
        color: '#76828C',
    },
    buttonLineStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: '5%',
        justifyContent: 'space-between',
    },
    buttonStyle: {
        paddingHorizontal: 40,
        paddingVertical: 10,
        borderRadius: 8,
        borderColor: theme.L_BLUE,
        borderWidth: 1,
        width: '90%',
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
)(Reports);
