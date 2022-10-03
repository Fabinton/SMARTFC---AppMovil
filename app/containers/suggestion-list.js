import React, { Component } from "react";
import { FlatList, View, RefreshControl, Alert } from "react-native";
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
    data = this.props.list;
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
  render() {
    const firstData = this.props.list;
    return (
      <View>
        <SearchBar filterSearch={this.filterSearch} />
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

export default connect(mapStateToProps)(SuggestionList);
