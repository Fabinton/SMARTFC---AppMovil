import React, { Component } from "react";
import { FlatList, Alert, RefreshControl } from "react-native";
import Layout from "../components/suggestion-list-layout";
import Empty from "../components/empty";
import Separator from "../components/separator";
import Suggestion from "../components/subject";
import { connect } from "react-redux";
import * as SQLite from "expo-sqlite";
import API from "../../utils/api";
import {
  getEventsLocalDB,
  selectAllFlatEventsBd,
  syncServer,
} from "../../utils/parsers";
const db = SQLite.openDatabase("db5.db");
function mapStateToProps(state) {
  return {
    list: state.videos.subject,
    ipconfig: state.videos.selectedIPConfig,
    student: state.videos.selectedStudent,
    internetConnection: state.connection.isConnected,
    loading: state.connection.loading,
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
        "create table if not exists events (id_evento integer primary key not null, data_start text, hour_start text, data_end text, hour_end text, id_actividad int, id_estudiante int, check_download int, check_inicio int, check_fin int, check_answer int, count_video int, check_video int, check_document int, check_a1 text, check_a2 text, check_a3 text, check_profile int, answers text);"
      );
      tx.executeSql(
        "create table if not exists flatEvent (id_evento integer not null, upload int);"
      );
    });
    this.updateFlat();
  }
  async updateFlat() {
    const allFlatEvents = await selectAllFlatEventsBd();
    this.setState({ storageFlats: allFlatEvents });
    const studentEvents = await getEventsLocalDB(
      this.props.student.id_estudiante
    );
    this.setState({ storage: studentEvents });
  }
  async doubleSend(onScroll = false) {
    if (this.props.internetConnection) {
      this.props.dispatch({
        type: "SET_LOADING",
        payload: true,
      });
      await this.updateFlat();
      const data = this.state.storage;
      const Flats = this.state.storageFlats;
      await API.getCourses(
        this.props.ipconfig,
        this.props.student.grado_estudiante,
        this.props.student.id_colegio
      )
        .then(({ data }) => {
          this.props.dispatch({
            type: "SET_ACTIVITIES_LIST",
            payload: {
              subject: data,
            },
          });
        })
        .catch((e) => {
          console.log("error", e);
        });
      if (!onScroll) {
        await syncServer(
          data,
          Flats,
          this.props.ipconfig,
          this.props.student.id_estudiante,
          this.props.dispatch
        );
        this.props.dispatch({
          type: "SET_LOADING",
          payload: false,
        });
      } else {
        this.props.dispatch({
          type: "SET_LOADING",
          payload: false,
        });
      }
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
    this.props.navigation.navigate({
      name: "ActivitySubj",
    });
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
          refreshControl={
            <RefreshControl
              refreshing={this.props.loading}
              onRefresh={() => this.doubleSend(true)}
            />
          }
        />
      </Layout>
    );
  }
}
export default connect(mapStateToProps)(SuggestionList);
