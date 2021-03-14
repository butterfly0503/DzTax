import React from 'react'
import { connect } from 'react-redux'
import { StyleSheet,SafeAreaView ,TouchableWithoutFeedback,ImageBackground} from 'react-native'

class Splash extends React.Component {
  constructor(props) {
    super(props);

  }

  async componentDidMount(){
    setTimeout(async () => {
      this.props.navigation.navigate('Login');
    }, 2000); // <-- Set this to `5000` ms to hide it after 5 seconds
  }

  render() {
    return (
      <TouchableWithoutFeedback>
        <SafeAreaView style={styles.container}>
          <ImageBackground resizeMode="stretch" source={require('../resources/images/splash.png')} style={styles.backgroundContainterStyle}>

          </ImageBackground>
        </SafeAreaView>
      </TouchableWithoutFeedback>
      );
  }

}

const styles = StyleSheet.create({
  container: {
      backgroundColor: 'transparent',
      flex: 1,
  },

  backgroundContainterStyle:{
      height:'100%',
      width: '100%'
  }

})


export default connect(
)(Splash)
