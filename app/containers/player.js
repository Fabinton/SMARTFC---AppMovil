import React, { Component } from "react";
import { Video } from "expo-av";
import { StyleSheet, View } from "react-native";
import shorthash from "shorthash";
import * as FileSystem from "expo-file-system";
import { connect } from "react-redux";
import { Dimensions } from "react-native";
import { ScreenOrientation } from "expo";

class Player extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    mute: false,
    shouldPlay: false,
  };
  handlePlayAndPause = async () => {
    this.setState((prevState) => ({
      shouldPlay: !prevState.shouldPlay,
    }));
  };
  handleVolume = async () => {
    this.setState((prevState) => ({
      mute: !prevState.mute,
    }));
  };

  setOrientation() {
    if (Dimensions.get("window").height > Dimensions.get("window").width) {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    } else {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    }
  }
  componentWillUnmount() {
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state, callback) => {
      return { ...state };
    };
  }
  componentDidMount = async () => {
    var uristring = this.props.urlrepositorio;
    var ip = this.props.ipconfig;
    var uri = "http://" + ip + ":3000" + uristring.substr(28);

    const name = shorthash.unique(uri);
    const path = `${FileSystem.cacheDirectory}${name}`;
    const video = await FileSystem.getInfoAsync(path);
    if (video.exists) {
      this.setState({
        source: {
          uri: video.uri,
        },
      });
      return;
    }
    const newVideo = await FileSystem.downloadAsync(uri, path);
    this.setState({
      source: {
        uri: newVideo.uri,
      },
    });
  };
  render() {
    return (
      <View>
        <Video
          source={this.state.source}
          shouldPlay={this.state.shouldPlay}
          resizeMode="contain"
          style={styles.video}
          isMuted={this.state.mute}
          useNativeControls
          onFullscreenUpdate={this.setOrientation}
          posterSource={this.state.source}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  video: {
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    width: 400,
    height: 200,
  },
  container: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#272D34",
  },
});
function mapStateToProps(state) {
  return {
    contenido: state.selectedContenido,
    ipconfig: state.videos.selectedIPConfig,
  };
}
export default connect(mapStateToProps)(Player);
