import React, { Component, useState } from "react";
import { FlatList, Text, StyleSheet, TextInput, View } from "react-native";
import Layout from "../components/suggestion-list-layout";
import Empty from "../components/empty";
import Separator from "../components/separator";
import Suggestion from "../components/suggestion";
import { connect } from "react-redux";
import { NavigationActions } from "react-navigation";
import SearchBar from "../components/search";
function mapStateToProps(state) {
  return {
    list: state.videos.contenido,
  };
}
class SuggestionList extends Component {
  state = {
    stateData: this.props.list,
  };

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
        data[i].nombre_CREA
          .toUpperCase()
          .includes(text.toUpperCase().trim().replace(/\s/g, ""))
      ) {
        newData.push(data[i]);
        this.setState({ stateData: newData });
      } else {
        newData.length == 0 && this.setState({ stateData: [] });
      }
    }
  };

  render() {
    return (
      <View>
        <SearchBar filterSearch={this.filterSearch} />
        <FlatList
          keyExtractor={this.keyExtractor}
          data={this.state.stateData}
          ListEmptyComponent={this.renderEmpty}
          ItemSeparatorComponent={this.itemSeparatos}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    marginTop: 2,
    marginLeft: 4,
    padding: 15,
    fontSize: 15,
    borderWidth: 1,
    height: 50,
    width: 300,
    borderRadius: 5,
    borderColor: "#eaeaea",
  },
});

export default connect(mapStateToProps)(SuggestionList);
