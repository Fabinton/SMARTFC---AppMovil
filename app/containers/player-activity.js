import React, { Component, createRef } from "react";
import { Video } from "expo-av";
import {
  StyleSheet,
  View,
  Dimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
import shorthash from "shorthash";
import * as FileSystem from "expo-file-system";
import { connect } from "react-redux";
import * as ScreenOrientation from "expo-screen-orientation";
import CustomButton from "../components/customButton";
import * as SQLite from "expo-sqlite";
import { getLocalEventsByStudent } from "../../utils/parsers";
const db = SQLite.openDatabase("db5.db");

class Player extends Component {
  constructor(props) {
    super(props);
    this.video = createRef(null);
  }
  state = {
    mute: false,
    shouldPlay: false,
    storage: null,
    storageFilter: null,
    storageFlats: null,
    controls: false,
    source: null,
    videoStatus: {},
    videoCount: 0,
    videoViewed: false,
    updatedEvent: false,
    loadingVideo: true,
  };
  setOrientation() {
    if (Dimensions.get("window").height > Dimensions.get("window").width) {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    } else {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    }
  }
  handlePlayAndPause = () => {
    if (this.state.videoStatus.shouldPlay && !this.state.updatedEvent) {
      this.setState((prevState) => ({
        updatedEvent: !prevState.updatedEvent,
      }));
      this.almacenaMetrica();
    }
  };
  handleVolume = async () => {
    this.setState((prevState) => ({
      mute: !prevState.mute,
    }));
  };
  componentWillUnmount() {
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state, callback) => {
      return { ...state };
    };
  }
  componentDidMount = async () => {
    db.transaction((tx) => {
      tx.executeSql(
        "create table if not exists events (id_evento integer primary key not null, data_start text, hour_start text, data_end text, hour_end text, id_actividad int, id_estudiante int, check_download int, check_inicio int, check_fin int, check_answer int, count_video int, check_video int, check_document int, check_a1 int, check_a2 int, check_a3 int, check_profile int, check_Ea1 int, check_Ea2 int, check_Ea3 int );"
      );
      tx.executeSql(
        "create table if not exists flatEvent (id_evento integer not null, upload int);"
      );
      tx.executeSql("select * from events", [], (_, { rows: { _array } }) =>
        this.setState({ storage: _array })
      );
      tx.executeSql(
        `select * from flatEvent ;`,
        [],
        (_, { rows: { _array } }) => this.setState({ storageFlats: _array })
      );
      tx.executeSql(
        `select * from events where id_estudiante=? and id_actividad=?;`,
        [this.props.student.id_estudiante, this.props.activity.id_actividad],
        (_, { rows: { _array } }) => this.setState({ storageFilter: _array })
      );
    });
    var uristring = this.props.urlvideo;
    var ip = this.props.ipconfig;
    var uri = "http://" + ip + ":3000" + uristring.substr(28);
    const name = shorthash.unique(uri);
    const path = `${FileSystem.cacheDirectory}${name}`;
    const video = await FileSystem.getInfoAsync(path);
    if (this.props.videoDown && this.props?.videoDown[video.uri]) {
      this.setState({
        source: {
          uri: video.uri,
        },
        videoCount: this.props?.videoDown[video.uri][1] || 0,
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

  almacenaMetrica() {
    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();
    var dataComplete = date + "/" + month + "/" + year;
    var hours = new Date().getHours();
    var min = new Date().getMinutes();
    var hoursComplete = hours + ":" + min;
    db.transaction((tx) => {
      tx.executeSql(
        `select * from events where id_estudiante=? and id_actividad=?;`,
        [this.props.student.id_estudiante, this.props.activity.id_actividad],
        (_, { rows: { _array } }) => this.setState({ storageFilter: _array })
      );
    });
    var storageFilterGood = this.state.storageFilter;
    var storageFilter = storageFilterGood.reverse();
    if (storageFilter.length == 0) {
      resultado = [
        {
          check_a1: 0,
          check_a2: 0,
          check_a3: 0,
          check_Ea1: 0,
          check_Ea2: 0,
          check_Ea3: 0,
          check_inicio: 0,
          count_video: 0,
          check_download: 0,
          check_answer: 0,
        },
      ];
    }
    if (storageFilter.length != 0) {
      resultado = Array.from(
        new Set(storageFilter.map((s) => s.id_actividad))
      ).map((id_actividad) => {
        return {
          id_actividad: id_actividad,
          data_start: storageFilter.find((s) => s.id_actividad === id_actividad)
            .data_start,
          count_video: storageFilter.find(
            (s) => s.id_actividad === id_actividad
          ).count_video,
          check_a1: storageFilter.find((s) => s.id_actividad === id_actividad)
            .check_a1,
          check_a2: storageFilter.find((s) => s.id_actividad === id_actividad)
            .check_a2,
          check_a3: storageFilter.find((s) => s.id_actividad === id_actividad)
            .check_a3,
          check_Ea1: storageFilter.find((s) => s.id_actividad === id_actividad)
            .check_Ea1,
          check_Ea2: storageFilter.find((s) => s.id_actividad === id_actividad)
            .check_Ea2,
          check_Ea3: storageFilter.find((s) => s.id_actividad === id_actividad)
            .check_Ea3,
          check_answer: storageFilter.find(
            (s) => s.id_actividad === id_actividad
          ).check_answer,
          check_download: storageFilter.find(
            (s) => s.id_actividad === id_actividad
          ).check_download,
          check_inicio: storageFilter.find(
            (s) => s.id_actividad === id_actividad
          ).check_inicio,
          id_evento: storageFilter.find((s) => s.id_actividad === id_actividad)
            .id_evento,
          check_fin: storageFilter.find((s) => s.id_actividad === id_actividad)
            .check_fin,
          check_document: storageFilter.find(
            (s) => s.id_actividad === id_actividad
          ).check_document,
        };
      });
    }

    db.transaction(
      (tx) => {
        tx.executeSql(
          "insert into events (data_start, hour_start, data_end, hour_end, id_actividad, id_estudiante, check_download, check_inicio, check_fin, check_answer, count_video, check_video, check_document, check_a1, check_a2, check_a3, check_profile, check_Ea1, check_Ea2, check_Ea3) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?)",
          [
            dataComplete,
            hoursComplete,
            dataComplete,
            hoursComplete,
            this.props.activity.id_actividad,
            this.props.student.id_estudiante,
            resultado[0].check_download,
            1,
            resultado[0].check_fin,
            resultado[0].check_answer,
            this.state.videoCount,
            1,
            resultado[0].check_document,
            resultado[0].check_a1,
            resultado[0].check_a2,
            resultado[0].check_a3,
            0,
            resultado[0].check_Ea1,
            resultado[0].check_Ea2,
            resultado[0].check_Ea3,
          ]
        );
      },
      null,
      null
    );
    db.transaction((tx) => {
      tx.executeSql(`select * from events ;`, [], (_, { rows: { _array } }) =>
        this.setState({ storage: _array })
      );
    });
    this.update();
  }
  updateFlat() {
    db.transaction((tx) => {
      tx.executeSql(
        `select * from flatEvent ;`,
        [],
        (_, { rows: { _array } }) => this.setState({ storageFlats: _array })
      );
    });
  }
  update() {
    db.transaction((tx) => {
      tx.executeSql(`select * from events ;`, [], (_, { rows: { _array } }) =>
        this.setState({ storage: _array })
      );
    });
    db.transaction(
      (tx) => {
        tx.executeSql(
          `insert into flatEvent (id_evento, upload) values (?, ?)`,
          [this.state.storage[this.state.storage.length - 1].id_evento, 0]
        );
      },
      null,
      null
    );
    db.transaction((tx) => {
      tx.executeSql(
        `select * from flatEvent ;`,
        [],
        (_, { rows: { _array } }) => this.setState({ storageFlats: _array })
      );
    });
    this.updateFlat();
  }
  async continuarContenido() {
    this.state.videoStatus?.isPlaying && this.video.current.pauseAsync();
    const localEvents = await getLocalEventsByStudent(
      this.props.student.id_estudiante,
      this.props.id_actividad
    );
    const lastEvent = localEvents?.reverse();
    if (!lastEvent[0]?.check_document)
      this.props.navigation.navigate({
        name: "EvalutionTest",
      });
    else {
      Alert.alert(
        "Test de Actividad",
        "El test de la actividad ya ha sido realizado.",
        [
          {
            text: "Cancel",
            onPress: () => {},
            style: "cancel",
          },
          { text: "OK", onPress: () => {} },
        ],
        { cancelable: false }
      );
    }
  }

  pruebaLandsCape() {}
  render() {
    return (
      <View>
        <Video
          ref={this.video}
          source={this.state.source}
          posterSource={this.state.source}
          shouldPlay={this.state.shouldPlay}
          resizeMode="contain"
          style={styles.video}
          isMuted={this.state.mute}
          useNativeControls
          onFullscreenUpdate={this.setOrientation}
          onPlaybackStatusUpdate={(state) => {
            if (state.isPlaying && !this.state.videoViewed) {
              this.setState(
                (prevState) => ({
                  videoStatus: state,
                  videoCount: prevState.videoCount + 1,
                  videoViewed: true,
                }),
                () => {
                  //callback to save in redux the counter after the component state was updated.
                  this.props.dispatch({
                    type: "SET_VIDEO_EXITS",
                    payload: {
                      video: this.state.source.uri,
                      countVideo: this.state.videoCount,
                    },
                  });
                }
              );
            } else {
              this.setState({ videoStatus: state });
            }
            this.handlePlayAndPause();
          }}
          onReadyForDisplay={async () => {
            const uristring = this.props.urlvideo;
            const ip = this.props.ipconfig;
            const uri = "http://" + ip + ":3000" + uristring.substr(28);
            const name = shorthash.unique(uri);
            const path = `${FileSystem.cacheDirectory}${name}`;
            const video = await FileSystem.getInfoAsync(path);
            if (this.props.videoDown && !this.props?.videoDown[video.uri]) {
              this.props.dispatch({
                type: "SET_VIDEO_EXITS",
                payload: {
                  video: this.state.source.uri,
                },
              });
            }
            this.setState({ loadingVideo: false });
          }}
        >
          {this.state.loadingVideo && (
            <ActivityIndicator size="small" color="#70C2E5" />
          )}
        </Video>
        <View style={{ alignSelf: "center" }}>
          <CustomButton
            text="Realiza el TEST"
            onPress={() => {
              this.continuarContenido();
            }}
          />
        </View>
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
    width: Dimensions.get("window").width,
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
    activity: state.videos.selectedActivity,
    student: state.videos.selectedStudent,
    ipconfig: state.videos.selectedIPConfig,
    videoDown: state.videos.videosDownloaded,
  };
}
export default connect(mapStateToProps)(Player);
