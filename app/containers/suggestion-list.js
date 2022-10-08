import React, { Component } from "react";
import {
  FlatList,
  View,
  RefreshControl,
  Alert,
  Picker,
  StyleSheet,
} from "react-native";
import Empty from "../components/empty";
import Separator from "../components/separator";
import Suggestion from "../components/suggestion";
import { connect } from "react-redux";
import { NavigationActions } from "react-navigation";
import SearchBar from "../components/search";
import API from "../../utils/api";

function mapStateToProps(state) {
  return {
    list: state.videos.contenido,
    loading: state.connection.loading,
    internetConnection: state.connection.isConnected,
  };
}
class SuggestionList extends Component {
  state = {
    stateData: this.props.list,
  };
  fetchContent() {
    API.getContent(this.props.ipconfig)
      .then(({ data }) => {
        this.props.dispatch({
          type: "SET_CONTENTS_LIST",
          payload: {
            contenido: data,
          },
        });
      })
      .catch((e) => {});
  }
  componentDidMount() {
    this.fetchContent();
  }
  renderEmpty = () => <Empty text="No hay sugerencias"></Empty>;
  itemSeparatos = () => <Separator text="No hay sugerencias"></Separator>;
  viewContenido = (item) => {
    this.props.dispatch({
      type: "SET_SELECTED_CONTENT",
      payload: {
        contenido: item,
      },
    });
    this.props.dispatch(
      NavigationActions.navigate({
        routeName: "Contenido",
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
  keyExtractor = (item) => item.id_CREA.toString();
  filterSearch = (text) => {
    const data = this.props.list;
    var newData = [];
    var count = Object.keys(data).length;
    for (var i = 0; i < count; i++) {
      if (
        data[i].nombre_CREA.toUpperCase().includes(text.toUpperCase().trim())
      ) {
        newData.push(data[i]);
        this.setState({ stateData: newData });
      } else {
        newData.length == 0 && this.setState({ stateData: [] });
      }
    }
  };
  filterDropdown({ curso, area }) {
    const data = this.props.list;
    const byCurso = data.filter((list) => {
      const toFilter = curso ? list.id_grado : list.id_materia;
      const filter = curso ? curso : area;
      return String(toFilter) === filter;
    });
    this.setState({ stateData: byCurso });
  }
  render() {
    const firstData = this.props.list;

    return (
      <View>
        <SearchBar filterSearch={this.filterSearch} />
        <View style={styles.pickerContainer}>
          <View style={styles.pickerStyle}>
            <Picker
              style={{
                width: 110,
                height: 30,
              }}
              mode="dropdown"
              onValueChange={(value) => this.filterDropdown({ area: value })}
            >
              <Picker.Item color="gray" label="Áreas" value="" />
              <Picker.Item label="Matemáticas" value="1" />
              <Picker.Item label="Otros" value="81700346411" />
            </Picker>
          </View>
          <View style={styles.pickerStyle}>
            <Picker
              style={{
                width: 115,
                height: 30,
              }}
              mode="dropdown"
              onValueChange={(value) => this.filterDropdown({ curso: value })}
            >
              <Picker.Item color="gray" label="Curso" value="" />
              <Picker.Item label="6" value="6" />
              <Picker.Item label="7" value="7" />
              <Picker.Item label="8" value="8" />
              <Picker.Item label="9" value="9" />
              <Picker.Item label="10" value="10" />
              <Picker.Item label="11" value="11" />
            </Picker>
          </View>
        </View>
        <FlatList
          keyExtractor={this.keyExtractor}
          data={this.state.stateData || firstData}
          ListEmptyComponent={this.renderEmpty}
          ItemSeparatorComponent={this.itemSeparatos}
          renderItem={this.renderItem}
          refreshControl={
            <RefreshControl
              refreshing={this.props.loading}
              onRefresh={() => {
                if (this.props.internetConnection) {
                  this.fetchContent();
                } else {
                  Alert.alert(
                    "ERROR",
                    "Recuerda que debes estar conectado a internet para sincronizar.",
                    [{ text: "OK", onPress: () => {} }],
                    { cancelable: false }
                  );
                }
              }}
            />
          }
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  pickerContainer: {
    display: "flex",
    justifyContent: "flex-start",
    flexDirection: "row",
    marginLeft: 5,
    marginBottom: 10,
    borderTopWidth: 1,
    borderTopColor: "#919191",
    paddingTop: 10,
  },
  pickerStyle: {
    borderRadius: 4,
    borderColor: "#919191",
    borderWidth: 1,
    overflow: "hidden",
    height: 30,
    padding: 0,
    backgroundColor: "#FFF",
    width: 105,
    marginLeft: 5,
  },
});

export default connect(mapStateToProps)(SuggestionList);
