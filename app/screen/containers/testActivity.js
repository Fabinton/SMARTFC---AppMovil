import React, { Component } from "react";
import HeaderReturn from "../../components/headerReturn";
import { NavigationActions } from "react-navigation";
import { StyleSheet, Text, ScrollView, Alert, View } from "react-native";
import { Animated } from "react-native";
import { connect } from "react-redux";
import RadioForm from "react-native-simple-radio-button";
import * as SQLite from "expo-sqlite";
import API from "../../../utils/api";
import QuestionActivity from "../../components/QuestionActivity";
import CustomButton from "../../components/customButton";

const db = SQLite.openDatabase("db5.db");
class testActivity extends Component {
  state = {
    opacity: new Animated.Value(0),
    value1: 0,
    value2: 0,
    value3: 0,
    storage: null,
    storageFlats: null,
    storageFilter: null,
  };
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <HeaderReturn onPress={() => navigation.goBack()}>
          Realiza tu test
        </HeaderReturn>
      ),
    };
  };
  componentDidMount() {
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: 1000,
    }).start();
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
  storageTest() {
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
          count_video: 0,
          check_video: 0,
          check_inicio: 0,
          check_download: 0,
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
          check_inicio: storageFilter.find(
            (s) => s.id_actividad === id_actividad
          ).check_inicio,
          check_Ea1: storageFilter.find((s) => s.id_actividad === id_actividad)
            .check_Ea1,
          check_Ea2: storageFilter.find((s) => s.id_actividad === id_actividad)
            .check_Ea2,
          check_Ea3: storageFilter.find((s) => s.id_actividad === id_actividad)
            .check_Ea3,
          check_download: storageFilter.find(
            (s) => s.id_actividad === id_actividad
          ).check_download,
          check_answer: storageFilter.find(
            (s) => s.id_actividad === id_actividad
          ).check_answer,
        };
      });
    }
    if (resultado[0].check_answer == 0) {
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
              resultado[0].check_inicio,
              0,
              1,
              resultado[0].count_video,
              resultado[0].check_video,
              0,
              this.state.value1,
              this.state.value2,
              this.state.value3,
              0,
              resultado[0].check_Ea1,
              resultado[0].check_Ea2,
              resultado[0].check_Ea2,
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
      Alert.alert(
        "Almacenamiento Exitoso",
        "Sus respuestas han sido almacenadas recuerde sincronizar con su servidor cuando este en el colegio",
        [{ text: "OK", onPress: () => {} }],
        { cancelable: false }
      );
      //this.regresaMateria();
    } else if (resultado[0].check_answer == 1) {
      Alert.alert(
        "Información!",
        "Sus respuestas ya fueron guardadas recuerde que solo dispone de un solo intento",
        [{ text: "OK", onPress: () => {} }],
        { cancelable: false }
      );
    } else {
    }
  }
  consulta() {
    db.transaction((tx) => {
      tx.executeSql(`drop table events;`, [26]);
    });
  }
  sendServer() {
    if (this.props.internetConnection) {
      db.transaction((tx) => {
        tx.executeSql(`select * from events ;`, [], (_, { rows: { _array } }) =>
          this.setState({ storage: _array })
        );
        tx.executeSql(
          `select * from flatEvent ;`,
          [],
          (_, { rows: { _array } }) => this.setState({ storageFlats: _array })
        );
      });
      var data = this.state.storage;
      var Flats = this.state.storageFlats;
      Flats.map((flat) => {
        if (flat.upload === 0) {
          data.map((event) => {
            if (flat.id_evento === event.id_evento) {
              this.props.dispatch({
                type: "SET_LOADING",
                payload: true,
              });
              API.loadEventsLast(this.props.ipconfig)
                .then(({ data }) => {
                  let dataLength = data?.length;
                  dataLength = dataLength + 1;
                  var id_estudianteF = parseInt(
                    "" + this.props.student.id_estudiante + dataLength
                  );
                  event.id_evento = id_estudianteF;
                  var id_eventoFs = flat.id_evento;
                  API.createEvents(this.props.ipconfig, event)
                    .then(() => {
                      db.transaction((tx) => {
                        tx.executeSql(
                          `update flatEvent set upload = ? where id_evento = ? ;`,
                          [1, id_eventoFs]
                        );
                        tx.executeSql(
                          "select * from flatEvent",
                          [],
                          (_, { rows: { _array } }) => console.log(_array)
                        );
                      });
                      Alert.alert(
                        "Sincronización exitosa",
                        "La sincronización de respuestas fue exitosa",
                        [
                          {
                            text: "OK",
                            onPress: () => {},
                          },
                        ],
                        { cancelable: false }
                      );
                    })
                    .catch((e) => {
                      console.log("error sync", e);
                      Alert.alert(
                        "ERROR",
                        "Ha ocurrido un error al momento de guardar los eventos.",
                        [{ text: "OK", onPress: () => {} }],
                        { cancelable: false }
                      );
                    })
                    .finally(() => {
                      this.props.dispatch({
                        type: "SET_LOADING",
                        payload: false,
                      });
                    });
                })
                .catch((e) => {
                  console.log("fallo en load", e);
                })
                .finally(() => {});
            }
          });
        }
      });
    } else {
      Alert.alert(
        "ERROR",
        "Recuerda que debes estar conectado a internet para sincronizar.",
        [{ text: "OK", onPress: () => {} }],
        { cancelable: false }
      );
    }
  }
  regresaMateria() {
    this.props.dispatch(
      NavigationActions.navigate({
        routeName: "Activity",
      })
    );
  }
  render() {
    var Question_One = [
      { label: this.props.activity.A11, value: 1 },
      { label: this.props.activity.A12, value: 2 },
      { label: this.props.activity.A13, value: 3 },
      { label: this.props.activity.A14, value: 4 },
    ];
    var Question_Two = [
      { label: this.props.activity.A21, value: 1 },
      { label: this.props.activity.A22, value: 2 },
      { label: this.props.activity.A23, value: 3 },
      { label: this.props.activity.A24, value: 4 },
    ];
    var Question_Three = [
      { label: this.props.activity.A31, value: 1 },
      { label: this.props.activity.A32, value: 2 },
      { label: this.props.activity.A33, value: 3 },
      { label: this.props.activity.A34, value: 4 },
    ];
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.texto}>{this.props.activity.Q1}</Text>
        <RadioForm
          radio_props={Question_One}
          initial={0}
          onPress={(value) => {
            this.setState({ value1: value });
          }}
          labelColor={"#9C9C9C"}
        />
        <Text style={styles.texto}>{this.props.activity.Q2}</Text>
        <RadioForm
          radio_props={Question_Two}
          initial={0}
          onPress={(value) => {
            this.setState({ value2: value });
          }}
          labelColor={"#9C9C9C"}
        />
        <Text style={styles.texto}>{this.props.activity.Q3}</Text>
        <RadioForm
          radio_props={Question_Three}
          initial={0}
          onPress={(value) => {
            this.setState({ value3: value });
          }}
          labelColor={"#9C9C9C"}
        />
        <View style={styles.buttonContainer}>
          <CustomButton text="Guardar" onPress={() => this.storageTest()} />
          <CustomButton text="Sincronizar" onPress={() => this.sendServer()} />
          <CustomButton
            text="Regresa a Materias"
            onPress={() => this.regresaMateria()}
          />
          <QuestionActivity
            style={{ position: "absolute", top: "-50%", left: "-25%" }}
          />
        </View>
      </ScrollView>
    );
  }
}
function mapStateToProps(state) {
  return {
    activity: state.videos.selectedActivity,
    student: state.videos.selectedStudent,
    ipconfig: state.videos.selectedIPConfig,
    internetConnection: state.connection.isConnected,
  };
}
const styles = StyleSheet.create({
  container: {
    position: "relative",
    marginLeft: 15,
    marginRight: 15,
  },
  texto: {
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    alignContent: "space-around",
    marginTop: 2,
  },
  buttonstyle: {
    padding: 10,
  },
});
export default connect(mapStateToProps)(testActivity);
