import React, { Component } from "react";
import ContenidoLayout from "../components/contenido";
import Player from "../../containers/player";
import { StyleSheet } from "react-native";
import Details from "../../components/details";
import { Animated } from "react-native";
import { connect } from "react-redux";
import HeaderReturn from "../../components/headerReturn";

class contenido extends Component {
  state = {
    opacity: new Animated.Value(0),
  };
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <HeaderReturn onPress={() => navigation.goBack()}>
          CONTENIDO
        </HeaderReturn>
      ),
    };
  };
  closeVideo = () => {
    this.props.dispatch({
      type: "SET_SELECTED_CONTENT",
      payload: {
        contenido: null,
      },
    });
  };
  componentDidMount() {
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: 1000,
    }).start();
  }
  componentWillUnmount() {
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state, callback) => {
      return;
    };
  }
  render() {
    return (
      <Animated.View style={styles.container}>
        <ContenidoLayout>
          <Player {...this.props.contenido} />
          <Details {...this.props.contenido} />
        </ContenidoLayout>
      </Animated.View>
    );
  }
}
const styles = StyleSheet.create({
  texto: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
    marginLeft: 20,
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
    contenido: state.videos.selectedContenido,
  };
}
export default connect(mapStateToProps)(contenido);
