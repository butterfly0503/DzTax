import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, SafeAreaView, ImageBackground } from 'react-native'

import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import reducer from './reducers'
import Footer from './components/Footer'

import Login from './screens/login'
import Splash from './screens/splash'

import Register from './screens/register'
import Main from './screens/main'
import PlayFishki from './screens/playFiszki'
import Categories from './screens/categories'
import Settings from './screens/settings'
import Ecard from './screens/ecard'
import EcardStyling from './screens/ecardStyling'
import EcardSummary from './screens/ecardSummary'
import GiftcardPayment from './screens/giftcardPayment'
import GiftcardConfirmation from './screens/giftcardConfirmation'
import Reports from './screens/reports'
import Test from './screens/test'
import TestSummary from './screens/testSummary'
import RateUsConfirmation from './screens/rateUsConfirmation'







import PersonalDataSettings from './screens/settingsScreens/personalDataSettings'
import AdressSettings from './screens/settingsScreens/adressSettings'
import ContactInfoSettings from './screens/settingsScreens/contactInfoSettings'
import PaymentSettings from './screens/settingsScreens/paymentSettings'
import RenewSubscriptionSettings from './screens/settingsScreens/renewSubscriptionSettings'
import RenewSubscriptionPayment from './screens/settingsScreens/renewSubscriptionPayment'


import SubscriptionSettings from './screens/settingsScreens/subscriptionSettings'
import CancelSubscriptionSettings from './screens/settingsScreens/cancelSubscriptionSettings'
import TermsSettings from './screens/settingsScreens/termsSettings'
import RateAppSettings from './screens/settingsScreens/rateAppSettings'
import MessageUsSettings from './screens/settingsScreens/messageUsSettings'
import ShareOpinion from './screens/shareOpinion'
import ShareOpinionConfirmation from './screens/shareOpinionConfirmation'

// import GlobalFont from 'react-native-global-font'



const Tab = createBottomTabNavigator();

const middleware = applyMiddleware(thunkMiddleware)
const store = createStore(reducer, middleware) 

export default class App extends React.Component {

  // componentDidMount() {
  //   let fontName = 'NotoSans-Regular'
  //   GlobalFont.applyGlobal(fontName)
  // }

  render() {
      return (

        <Provider store={store}>
            <NavigationContainer>
              <SafeAreaView style={{flex:1}}>
                {/* <ImageBackground resizeMode="stretch" source={require('./resources/images/splash.png')} style={styles.backgroundContainterStyle}> */}

                  <Tab.Navigator screenOptions={{headerShown: false}} tabBar={(props) => <Footer parentProps={props}/>}>                
                    <Tab.Screen name="Splash" component={Splash}  />
                    <Tab.Screen name="Login" component={Login}  />
                    <Tab.Screen name="Register" component={Register}  />
                    <Tab.Screen name="Main" component={Main}  />
                    <Tab.Screen name="PlayFishki" component={PlayFishki}  />
                    <Tab.Screen name="Categories" component={Categories}  />
                    <Tab.Screen name="Settings" component={Settings}  />
                    <Tab.Screen name="Ecard" component={Ecard}  />
                    <Tab.Screen name="EcardStyling" component={EcardStyling}  />
                    <Tab.Screen name="EcardSummary" component={EcardSummary}  />
                    <Tab.Screen name="GiftcardPayment" component={GiftcardPayment}  />
                    <Tab.Screen name="GiftcardConfirmation" component={GiftcardConfirmation}  />
                    <Tab.Screen name="Reports" component={Reports}  />
                    <Tab.Screen name="Test" component={Test}  />
                    <Tab.Screen name="TestSummary" component={TestSummary}  />

                    
                    
                    

                    <Tab.Screen name="PersonalDataSettings" component={PersonalDataSettings}  />
                    <Tab.Screen name="AdressSettings" component={AdressSettings}  />
                    <Tab.Screen name="ContactInfoSettings" component={ContactInfoSettings}  />
                    <Tab.Screen name="PaymentSettings" component={PaymentSettings}  />
                    <Tab.Screen name="RenewSubscriptionSettings" component={RenewSubscriptionSettings}  />
                    <Tab.Screen name="SubscriptionSettings" component={SubscriptionSettings}  />
                    <Tab.Screen name="CancelSubscriptionSettings" component={CancelSubscriptionSettings}  />
                    <Tab.Screen name="MessageUsSettings" component={MessageUsSettings}  />
                    <Tab.Screen name="TermsSettings" component={TermsSettings}  />
                    <Tab.Screen name="RateAppSettings" component={RateAppSettings}  />
                    <Tab.Screen name="RateUsConfirmation" component={RateUsConfirmation}  />
                    <Tab.Screen name="ShareOpinion" component={ShareOpinion}  />
                    <Tab.Screen name="ShareOpinionConfirmation" component={ShareOpinionConfirmation}  />
                    <Tab.Screen name="RenewSubscriptionPayment" component={RenewSubscriptionPayment}  />
                    
                    
                  </Tab.Navigator>
                {/* </ImageBackground> */}
              </SafeAreaView>
            </NavigationContainer>
        </Provider>

      )
  }
}


const styles = StyleSheet.create({
backgroundContainterStyle:{
  height:'100%',
  width: '100%'
}
})