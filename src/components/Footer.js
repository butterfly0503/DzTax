import {Header, Icon, withBadge} from 'react-native-elements';

import React, {Component} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import theme from '../theme/theme';


class Footer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            notificationCount: null, parentName: '',
            availableRoutes: [
                /*{name: 'ShareOpinion', icon: {family: 'fontisto', name: 'comment'}},
                {name: 'PlayFishki', icon: {family: 'font-awesome-5', name: 'fish'}},
                {name: 'Test', icon: {family: 'fontisto', name: 'hourglass'}},
                {name: 'Reports', icon: {family: 'font-awesome-5', name: 'scroll'}},
                {name: 'Ecard', icon: {family: 'font-awesome-5', name: 'gift'}}*/],
        };
    }


    checkActive() {
        let {routeNames, index} = this.props.parentProps.state;
        let {availableRoutes} = this.state;
        let active = Array(availableRoutes.length).fill(false);
        let foundIndex = availableRoutes.findIndex(item => item.name === routeNames[index]);
        if (foundIndex > -1) {
            active[foundIndex] = true;
        }

        return active;

    }


    showFooter() {
        let isAcvite = this.checkActive();
        let buttonWidth = (100 / isAcvite.length) + '%';
        if (isAcvite.includes(true)) { //show footer on screen
            return (
                <View style={styles.iconContainer}>
                    {this.state.availableRoutes.map((item, idx) => {
                        return (
                            <TouchableOpacity key={idx} style={{width: buttonWidth, paddingVertical: '3%'}}
                                              onPress={() => {
                                                  this.props.parentProps.navigation.navigate(item.name);
                                              }}>
                                <Icon name={item.icon.name} type={item.icon.family} size={theme.FOOTER_ICONSIZE}
                                      color={isAcvite[idx] ? theme.FOOTER_ACTIVE_ICON : theme.FOOTER_NOTACTIVE_ICON}/>
                            </TouchableOpacity>
                        );
                    })}

                </View>
            );
        } else {
            return (null);
        }
    }

    render() {

        if (this.props.parentProps.state) {
            return (
                this.showFooter()
            );
        } else {
            return (null);
        }

    }
}

const styles = StyleSheet.create({
    icon: {
        color: 'white',
    },
    iconContainer: {
        backgroundColor: theme.FOOTER_BACKGROUND_COLOR,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        elevation: 30,
    },


});
const mapDispatchToProps = dispatch => {
    return bindActionCreators({}, dispatch);
};

const mapStateToProps = state => {
    return {
        user: state.user,
    };
};
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Footer);
