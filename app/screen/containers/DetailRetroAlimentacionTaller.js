import React, { Component } from "react";
import ContenidoLayout from "../components/detailActivity";
import { Button } from "react-native";
import { Animated } from "react-native";
import { connect } from "react-redux";
import Reader from "../../containers/reader-retrotaller";
import HeaderReturn from "../../components/headerReturn";
import QuestionActivity from "../../components/QuestionActivity";

class DetailRetroAlimentacionTaller extends Component {
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
      useNativeDriver: true,
    }).start();
  }
  render() {
    if (this.props.activity.retroalimentacion == "1") {
      return (
        <Animated.View style={{ flex: 1, opacity: this.state.opacity }}>
          <ContenidoLayout>
            <Reader {...this.props.activity} />
            <QuestionActivity
              style={{ position: "absolute", top: "70%", left: "-17%" }}
            />
          </ContenidoLayout>
        </Animated.View>
      );
    } else {
      return (
        <Button title="Regresa" onPress={() => this.continuarContenido()} />
      );
    }
  }
}
function mapStateToProps(state) {
  return {
    activity: state.videos.selectedActivity,
  };
}
export default connect(mapStateToProps)(DetailRetroAlimentacionTaller);
