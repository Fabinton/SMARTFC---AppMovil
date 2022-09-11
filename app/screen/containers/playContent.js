import React, { Component, View } from "react";
import ContenidoLayout from "../components/detailActivity";
import { StyleSheet, Button, TouchableOpacity, Animated } from "react-native";
import Close from "../../components/close";
import Details from "../../components/detailActivity";
import { connect } from "react-redux";
import Player from "../../containers/player-activity";
import * as FileSystem from "expo-file-system";
import shorthash from "shorthash";
//import Audio from '../../containers/audio-activity';
import Audio from "../../containers/audio-activity";
import { NavigationActions } from "react-navigation";
import Reader from "../../containers/reader-activity";
import HeaderReturn from "../../components/headerReturn";
import QuestionActivity from "../../components/QuestionActivity";
import CustomButton from "../../components/customButton";
import CustomButton from "../../components/customButton";

class playContent extends Component {
  state = {
    opacity: new Animated.Value(0),
  };
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <HeaderReturn onPress={() => navigation.goBack()}>
          Visualiza tu contenido
        </HeaderReturn>
      ),
    };
  };
  componentDidMount() {
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: 1000,
    }).start();
  }
  continuarContenido() {
    this.props.dispatch({
      type: "SET_SELECT_ACTIVITIES_SUBJECT_LIST",
      payload: {
        activity: this.props.activity,
      },
    });
    this.props.dispatch(
      NavigationActions.navigate({
        routeName: "TestActivity",
      })
    );
  }
  render() {
    console.log("Abriendo PlayContents");
    console.log(this.props.activity.video);
    if (this.props.activity.video == "1") {
      return (
        <Animated.View style={styles.container}>
          <ContenidoLayout>
            <Player {...this.props.activity} />

            <CustomButton
              text="Continua Aprendiendo"
              onPress={() => this.continuarContenido()}
            />

            <QuestionActivity
              style={{ position: "absolute", top: "90%", left: "-17%" }}
            />
          </ContenidoLayout>
        </Animated.View>
      );
    } else if (this.props.activity.documento == "1") {
      return (
        <Animated.View style={styles.container}>
          <ContenidoLayout>
            <Reader {...this.props.activity} />
            <CustomButton
              text="Continua Aprendiendo"
              onPress={() => this.continuarContenido()}
            />
            <QuestionActivity
              style={{ position: "absolute", top: "90%", left: "-17%" }}
            />
          </ContenidoLayout>
        </Animated.View>
      );
    } else if (this.props.activity.audio == "1") {
      return (
        <Animated.View style={styles.container}>
          <ContenidoLayout>
            <Audio {...this.props.activity} />
            <CustomButton
              text="Continua Aprendiendo"
              onPress={() => this.continuarContenido()}
            />
            <QuestionActivity
              style={{ position: "absolute", top: "90%", left: "-17%" }}
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
