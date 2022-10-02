import React, { Component } from "react";
import { FlatList } from "react-native";
import Layout from "../components/suggestion-list-layout";
import Empty from "../components/empty";
import Separator from "../components/separator";
import Suggestion from "../components/activity";
import { connect } from "react-redux";
import { NavigationActions } from "react-navigation";
import { View } from "react-native";
import API from "../../utils/api";
import { Dimensions } from "react-native";

function mapStateToProps(state) {
  return {
    ipconfig: state.videos.selectedIPConfig,
    subject: state.videos.selectedSubjects,
    list: state.videos.activity,
    internetConnection: state.connection.isConnected,
    student: state.videos.selectedStudent,
  };
}
class SuggestionList extends Component {
  renderEmpty = () => (
    <Empty text="No hay actividades asociadas a la materia"></Empty>
  );
  itemSeparatos = () => (
    <Separator text="No hay actividades asociadas a la materia"></Separator>
  );
  viewContenido = (item) => {
    this.props.dispatch({
      type: "SET_SELECT_ACTIVITIES_SUBJECT_LIST",
      payload: {
        activity: item,
      },
    });
    this.props.dispatch(
      NavigationActions.navigate({
        routeName: "SelectMoment",
      })
    );
  };
  state = {
    storage: [],
    activity_List: [],
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
  componentDidMount() {
    this.filtro();
  }
  doubleSend() {
    if (this.props.internetConnection) {
      this.filtro();
    } else {
      Alert.alert(
        "ERROR",
        "Recuerda que debes estar conectado a internet para sincronizar.",
        [{ text: "OK", onPress: () => {} }],
        { cancelable: false }
      );
    }
  }
  filtro() {
    this.props.dispatch({
      type: "SET_LOADING",
      payload: true,
    });
    let allActivities = [];
    API.getActivitiesMovil(
      this.props.ipconfig,
      this.props.student.id_colegio,
      this.props.student.grado_estudiante,
      this.props.subject.id_materia
    )
      .then(({ data }) => {
        this.props.dispatch({
          type: "SET_SUBJECT_ACTIVITY_LIST",
          payload: {
            activity: data,
          },
        });
        data.filter((element) => {
          if (
            element.id_materiaActiva === this.props.subject.id_materiaActiva
          ) {
            allActivities.push(element);
          }
        });
        this.setState({ activity_List: allActivities });
      })
      .catch((e) => {
        console.log("error", e);
        Alert.alert(
          "ERROR",
          "Error al sincronizar las actividades, intenta nuevamente.",
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
  }
  keyExtractor = (item) => item.id_actividad.toString();
  render() {
    var data = [];
    data = this.state.activity_List;
    return (
      <View
        style={{
          height: Dimensions.get("window").height,
          width: Dimensions.get("window").width,
          position: "relative",
        }}
      >
        <Layout title="Tus Actividades" onPress={() => this.doubleSend()}>
          <FlatList
            keyExtractor={this.keyExtractor}
            data={data}
            ListEmptyComponent={this.renderEmpty}
            ItemSeparatorComponent={this.itemSeparatos}
            renderItem={this.renderItem}
          />
        </Layout>
      </View>
    );
  }
}
export default connect(mapStateToProps)(SuggestionList);
