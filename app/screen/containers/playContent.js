import React, { Component } from "react";
import ContenidoLayout from "../components/detailActivity";
import { StyleSheet, Animated } from "react-native";
import { connect } from "react-redux";
import Player from "../../containers/player-activity";
import Audio from "../../containers/audio-activity";
import Reader from "../../containers/reader-activity";
import HeaderReturn from "../../components/headerReturn";
import QuestionActivity from "../../components/QuestionActivity";
import CustomButton from "../../components/customButton";

class playContent extends Component {
  state = {
    opacity: new Animated.Value(0),
  };
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <HeaderReturn onPress={() => navigation.goBack()}>
          Visualiza el contenido
        </HeaderReturn>
      ),
    };
  };
  componentDidMount() {
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }
  continuarContenido() {
    this.props.navigation.navigate({
      name: "EvalutionTest",
    });
  }
  render() {
    if (this.props.activity.video == "1") {
      return (
        <Animated.View style={styles.container}>
          <ContenidoLayout>
            <Player
              {...this.props.activity}
              navigation={this.props.navigation}
            />
            <QuestionActivity
              style={{ position: "absolute", top: "72%", left: "12%" }}
            />
          </ContenidoLayout>
        </Animated.View>
      );
    } else if (this.props.activity.documento == "1") {
      return (
        <Animated.View style={styles.container}>
          <ContenidoLayout>
            <Reader
              {...this.props.activity}
              navigation={this.props.navigation}
            />
            <CustomButton
              text="Realiza el TEST"
              onPress={() => this.continuarContenido()}
            />
            <QuestionActivity
              style={{ position: "absolute", top: "72%", left: "12%" }}
            />
          </ContenidoLayout>
        </Animated.View>
      );
    } else if (this.props.activity.audio == "1") {
      return (
        <Animated.View style={styles.container}>
          <ContenidoLayout>
            <Audio
              {...this.props.activity}
              navigation={this.props.navigation}
            />
            <CustomButton
              text="Realiza el TEST"
              onPress={() => this.continuarContenido()}
            />
            <QuestionActivity
              style={{ position: "absolute", top: "72%", left: "12%" }}
            />
          </ContenidoLayout>
        </Animated.View>
      );
    } else {
      return (
        <CustomButton
          text="Continua Aprendiendo"
          onPress={() => this.continuarContenido()}
        />
      );
    }
  }
}

const styles = StyleSheet.create({
  touchableButton: {
    height: 40,
    width: 185,
    backgroundColor: "#5DC5E6",
    textAlign: "center",
    marginTop: 30,
  },
  container: {
    flex: 1,
    alignItems: "center",
    paddingRight: 20,
    paddingLeft: 20,
  },
});

function mapStateToProps(state) {
  return {
    activity: state.videos.selectedActivity,
  };
}
export default connect(mapStateToProps)(playContent);
