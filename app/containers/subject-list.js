import React, { Component } from "react";
import { FlatList, Alert } from "react-native";
import Layout from "../components/suggestion-list-layout";
import Empty from "../components/empty";
import Separator from "../components/separator";
import Suggestion from "../components/subject";
import { connect } from "react-redux";
import { NavigationActions } from "react-navigation";
import * as SQLite from "expo-sqlite";
import API from "../../utils/api";
const db = SQLite.openDatabase("db5.db");
function mapStateToProps(state) {
  return {
    list: state.videos.data,
    ipconfig: state.videos.selectedIPConfig,
    student: state.videos.selectedStudent,
  };
}
class SuggestionList extends Component {
  state = {
    storage: null,
    storageFlats: null,
    storageFilter: null,
  };
  componentDidMount() {
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
    });
  }
  updateFlat() {
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
  }
  doubleSend() {
    if (this.props.internetConnection) {
      this.props.dispatch({
        type: "SET_LOADING",
        payload: true,
      });
      this.updateFlat();
      API.getCourses(
        this.props.ipconfig,
        this.props.student.grado_estudiante,
        this.props.student.id_colegio
      )
        .then(({ data }) => {
          this.props.dispatch({
            type: "SET_ACTIVITIES_LIST",
            payload: {
              data,
            },
          });
          var data = this.state.storage;
          var Flats = this.state.storageFlats;
          console.log("storage", data);
          console.log("flats", Flats);
          Flats.map((flat) => {
            if (flat.upload === 0) {
              data.map((event, idx) => {
                if (flat.id_evento === event.id_evento) {
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
                        })
                        .catch((e) => {
                          console.log("error sync", e);
                        })
                        .finally(() => {
                          console.log("finally");
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
        })
        .catch((e) => {
          console.log("error", e);
        })
        .finally(() => {
          this.props.dispatch({
            type: "SET_LOADING",
            payload: false,
          });
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

  renderEmpty = () => (
    <Empty text="No hay materias asociadas al colegio"></Empty>
  );
  itemSeparatos = () => (
    <Separator text="No hay materias asociadas al colegio"></Separator>
  );
  viewContenido = (item) => {
    this.props.dispatch({
      type: "SET_SELECT_ACTIVITIES_LIST",
      payload: {
        subject: item,
      },
    });
    //console.log(this.props.dispatch)
    this.props.dispatch(
      NavigationActions.navigate({
        routeName: "ActivitySubj",
      })
    );
  };

  renderItem = ({ item }) => {
    return (
      <Suggestion
        {...item}
        onPress={() => {
          this.viewContenido(item);
        }}
      />
    );
  };
  keyExtractor = (item) => item.id_materiaActiva.toString();
  render() {
    var data = [];
    data = this.props.list;

    return (
      <Layout title="Materias" onPress={() => this.doubleSend()}>
        <FlatList
          keyExtractor={this.keyExtractor}
          data={data}
          ListEmptyComponent={this.renderEmpty}
          ItemSeparatorComponent={this.itemSeparatos}
          renderItem={this.renderItem}
        />
      </Layout>
    );
  }
}
export default connect(mapStateToProps)(SuggestionList);
