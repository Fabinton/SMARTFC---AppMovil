import React, { Component } from "react";
import { FlatList } from "react-native";
import Layout from "../../components/suggestion-list-layout";
import Empty from "../../components/empty";
import Separator from "../../components/separator";
import Suggestion from "../components/doubtComponents";
import { connect } from "react-redux";
import API from "../../../utils/api";

function mapStateToProps(state) {
  return {
    list: state.videos.subject,
    duda: state.videos.duda,
    ipconfig: state.videos.selectedIPConfig,
    student: state.videos.selectedStudent,
  };
}
class SuggestionList extends Component {
  renderEmpty = () => (
    <Empty text="No hay materias asociadas al colegio"></Empty>
  );
  itemSeparatos = () => (
    <Separator text="No hay materias asociadas al colegio"></Separator>
  );
  viewContenido = (item) => {};
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
  keyExtractor = (item) => item.id_duda.toString();
  getAllDoubts() {
    this.props.dispatch({
      type: "SET_LOADING",
      payload: true,
    });
    var data = {
      id_estudiante: this.props.student.id_estudiante,
    };
    API.allDoubtsStudents(this.props.ipconfig, data)
      .then(({ data }) => {
        this.props.dispatch({
          type: "SET_DOUBT_LIST",
          payload: {
            data,
          },
        });
      })
      .catch((e) => {
        Alert.alert(
          "Error",
          "Error al traer las dudas del servidor.",
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
  render() {
    var data = [];
    data = this.props.duda.data;
    return (
      <Layout
        title="Tus Dudas"
        onPress={() => {
          this.getAllDoubts();
        }}
      >
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
