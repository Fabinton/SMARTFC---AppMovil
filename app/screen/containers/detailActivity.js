import React, { Component } from "react";
import ContenidoLayout from "../components/detailActivity";
import { StyleSheet } from "react-native";
import Details from "../../components/detailActivity";
import { Animated } from "react-native";
import { connect } from "react-redux";
import HeaderReturn from "../../components/headerReturn";
import * as SQLite from "expo-sqlite";
import QuestionActivity from "../../components/QuestionActivity";
import CustomButton from "../../components/customButton";

const db = SQLite.openDatabase("db5.db");

class detailActivity extends Component {
  state = {
    opacity: new Animated.Value(0),
    source: { uri: "" },
    storage: null,
    storageFilter: null,
    storageFlats: null,
  };
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <HeaderReturn onPress={() => navigation.goBack()}>
          Descripción de tu actividad
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
    db.transaction((tx) => {
      tx.executeSql(
        "create table if not exists events (id_evento integer primary key not null, data_start text, hour_start text, data_end text, hour_end text, id_actividad int, id_estudiante int, check_download int, check_inicio int, check_fin int, check_answer int, count_video int, check_video int, check_document int, check_a1 text, check_a2 text, check_a3 text, check_profile int, answers text );"
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
  continuarContenido() {
    console.log('entro a almacenar metrica ');
    this.almacenaMetrica();
    this.props.navigation.navigate({
      name: "PlayContent",
    });
  }
  updateFlat() {
    console.log('entro a updateflag ');
    db.transaction((tx) => {
      tx.executeSql(
        `select * from flatEvent ;`,
        [],
        (_, { rows: { _array } }) => this.setState({ storageFlats: _array })
      );
    });
    console.log('finalizo a updateflag ');
  }
  update() {
    console.log('entro a acatualizar ');
  
    const lastEvent = this.state.storage[this.state.storage.length - 1];
    if (lastEvent) {
      db.transaction(
        (tx) => {
          tx.executeSql(
            `insert into flatEvent (id_evento, upload) values (?, ?)`,
            [lastEvent.id_evento, 0]
          );
        },
        null,
        null
      );
    } else {
      console.log('No events found in storage.');
    }
  
    console.log('this.state.storage ', this.state.storage);
  
    db.transaction((tx) => {
      tx.executeSql(
        `select * from flatEvent ;`,
        [],
        (_, { rows: { _array } }) => this.setState({ storageFlats: _array })
      );
    });
  
    console.log('updateFlat ');
    this.updateFlat();
  }
  
  async almacenaMetrica() {
    console.log('estoy en las metricas ');
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
    console.log('storage ',storageFilter);
    try {
      var storageFilterGood = this.state.storageFilter;
      console.log("storage filter good ", storageFilterGood);
      var storageFilter = storageFilterGood.reverse();
      console.log("storage filter ",storageFilter.length);
    } catch (error) {
      var storageFilterGood = [];
      var storageFilter = [];
    }
    console.log('storageFilter ss ',storageFilter);
    let resultado = 0;
    if (storageFilter.length == 0) {
      console.log("Entro a Cero");
      resultado = [
        {
          check_a1: "",
          check_a2: "",
          check_a3: "",
          answers: [],
          check_answer: 0,
          check_download: 0,
        },
      ];
    }
    console.log('datso 2 ',storageFilter);
    if (storageFilter.length != 0) {
      console.log("Entro a diferente ");
      resultado = Array.from(
        new Set(storageFilter.map((s) => s.id_actividad))
      ).map((id_actividad) => {
        return {
          id_actividad: id_actividad,
          data_start: storageFilter.find((s) => s.id_actividad === id_actividad)
            .data_start,
          check_video: storageFilter.find(
            (s) => s.id_actividad === id_actividad
          ).check_video,
          count_video: storageFilter.find(
            (s) => s.id_actividad === id_actividad
          ).count_video,
          check_a1: storageFilter.find((s) => s.id_actividad === id_actividad)
            .check_a1,
          check_a2: storageFilter.find((s) => s.id_actividad === id_actividad)
            .check_a2,
          check_a3: storageFilter.find((s) => s.id_actividad === id_actividad)
            .check_a3,
          answers: storageFilter.find((s) => s.id_actividad === id_actividad)
            .answers,
          check_download: storageFilter.find(
            (s) => s.id_actividad === id_actividad
          ).check_download,
          check_answer: storageFilter.find(
            (s) => s.id_actividad === id_actividad
          ).check_answer,
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
    //     id_actividad,
    //     id_estudiante,
    //     resultado[0].check_download,
    //     1,
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
    console.log('resultado 172 ',resultado );
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
            resultado[0].check_download,
            1,
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
    console.log('resultado 202 inserto ');
    db.transaction((tx) => {
      tx.executeSql(`select * from events ;`, [], (_, { rows: { _array } }) =>
        this.setState({ storage: _array })
      );
      console.log('actualizar ');
    });

    this.update();
    console.log('finalizo update ');
  }


  render() {
    return (
      <Animated.View style={styles.container}>
        <ContenidoLayout>
          <Details {...this.props.activity} />
        </ContenidoLayout>
        <CustomButton
          text="Visualiza el contenido.."
          onPress={() => this.continuarContenido()}
        />
        <QuestionActivity
          style={{ position: "absolute", top: "72%", left: "12%" }}
        />
      </Animated.View>
    );
  }
}
function mapStateToProps(state) {
  return {
    activity: state.videos.selectedActivity,
    student: state.videos.selectedStudent,
    ipconfig: state.videos.selectedIPConfig,
  };
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

export default connect(mapStateToProps)(detailActivity);
