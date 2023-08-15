import React, { Component } from "react";
import { StyleSheet, Text, View, Button, WebView, Linking } from "react-native";
import Constants from "expo-constants";
import { connect } from "react-redux";
import * as SQLite from "expo-sqlite";
import { TouchableOpacity } from "react-native";
const db = SQLite.openDatabase("db5.db");

//const PdfReader = ({ url: uri }) => <WebView style={{ flex: 1 }} source={{ uri }} />
class RetroTaller extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    mute: false,
    shouldPlay: false,
    storage: null,
    storageFilter: null,
    storageFlats: null,
  };
  componentDidMount() {
    db.transaction((tx) => {
      tx.executeSql(
        "create table if not exists events (id_evento integer primary key not null, data_start text, hour_start text, data_end text, hour_end text, id_actividad int, id_estudiante int, check_download int, check_inicio int, check_fin int, check_answer int, count_video int, check_video int, check_document int, check_a1 text, check_a2 text, check_a3 text, check_profile int, answers text);"
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
  }

  async almacenaMetrica() {
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
          check_a1: "",
          check_a2: "",
          check_a3: "",
          answers :[],
          check_inicio: 0,
          count_video: 0,
          check_video: 0,
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
          check_video: storageFilter.find(
            (s) => s.id_actividad === id_actividad
          ).check_video,
          check_a1: storageFilter.find((s) => s.id_actividad === id_actividad)
            .check_a1,
          check_a2: storageFilter.find((s) => s.id_actividad === id_actividad)
            .check_a2,
          check_a3: storageFilter.find((s) => s.id_actividad === id_actividad)
            .check_a3,
          answers: storageFilter.find((s) => s.id_actividad === id_actividad)
            .answers,
          check_answer: storageFilter.find(
            (s) => s.id_actividad === id_actividad
          ).check_answer,
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

    // await new Promise((resolve, reject) => {
    //   text = "insert into events (data_start, hour_start, data_end, hour_end, id_actividad, id_estudiante, check_download, check_inicio, check_fin, check_answer, count_video, check_video, check_document, check_a1, check_a2, check_a3, check_profile, answers) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)"
    //   const query = [
    //     dataComplete,
    //     hoursComplete,
    //     dataComplete,
    //     hoursComplete,
    //     this.props.activity.id_actividad,
    //     this.props.student.id_estudiante,
    //     1,
    //     resultado[0].check_inicio,
    //     resultado[0].check_fin,
    //     resultado[0].check_answer,
    //     resultado[0].count_video,
    //     resultado[0].check_video,
    //     resultado[0].check_document,
    //     resultado[0].check_a1,
    //     resultado[0].check_a2,
    //     resultado[0].check_a3,
    //     0,
    //     resultado[0].answers,
    //   ];
    //   db.transaction(
    //     (tx) => {
    //       tx.executeSql(text, query, (query, { rows: { _array } }) => {
    //         if (!query._error) {
    //           console.log('text ',text , ' query ', query);
    //           resolve(_array);
    //           console.log('array '+ _array);
    //         } else {
    //           reject(query._error);
    //         }
    //       });
    //     },
    //     null,
    //     null
    //   );
    // });

    db.transaction(
      (tx) => {
        tx.executeSql(
          "insert into events (data_start, hour_start, data_end, hour_end, id_actividad, id_estudiante, check_download, check_inicio, check_fin, check_answer, count_video, check_video, check_document, check_a1, check_a2, check_a3, check_profile, answers) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)",
          [
            dataComplete,
            hoursComplete,
            dataComplete,
            hoursComplete,
            this.props.activity.id_actividad,
            this.props.student.id_estudiante,
            1,
            resultado[0].check_inicio,
            resultado[0].check_fin,
            resultado[0].check_answer,
            resultado[0].count_video,
            resultado[0].check_video,
            resultado[0].check_document,
            resultado[0].check_a1,
            resultado[0].check_a2,
            resultado[0].check_a3,
            0,
            resultado[0].answers,
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

  _handlePress = () => {
    this.almacenaMetrica();
    var uristring = this.props.urlretrotaller;
    var ip = this.props.ipconfig;
    var uri = "http://" + ip + ":3000" + uristring.substr(28);
    Linking.openURL(uri);
    this.props.onPress && this.props.onPress();
  };
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.touchableButtonSignIn}>
          <Text
            {...this.props}
            onPress={this._handlePress}
            style={styles.buttonText}
          >
            Descarga la Retroalimentacion del Taller
          </Text>
        </TouchableOpacity>
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
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#ecf0f1",
    justifyContent: "center",
  },
  touchableButtonSignIn: {
    alignSelf: "center",
    justifyContent: "center",
    marginTop: 15,
    backgroundColor: "#70C2E5",
    height: 65,
    width: 270,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Roboto",
  },
});
function mapStateToProps(state) {
  return {
    ipconfig: state.videos.selectedIPConfig,
    activity: state.videos.selectedActivity,
    student: state.videos.selectedStudent,
  };
}
export default connect(mapStateToProps)(RetroTaller);
