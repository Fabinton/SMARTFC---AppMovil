// SearchBar.js
import React, { Component, useState } from "react";
import { StyleSheet, TextInput, View, Keyboard, Button } from "react-native";
import { Feather, Entypo } from "@expo/vector-icons";
import { connect } from "react-redux";

class SearchBar extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    clicked: false,
    val: "",
  };

  handlePress = (text) => {
    // Need to check to prevent null exception.
    this.props.filterSearch?.(text);
  };

  render() {
    return (
      <View style={styles.container}>
        <View
          style={
            this.state.clicked
              ? styles.searchBar__clicked
              : styles.searchBar__unclicked
          }
        >
          <Feather
            name="search"
            size={20}
            color="black"
            style={{ marginLeft: 1, marginRight: 1 }}
          />
          <TextInput
            style={styles.input}
            placeholder="Busca contenido"
            value={this.state.val}
            onChangeText={(text) => {
              this.handlePress?.(text);
              this.setState({ val: text });
            }}
            //onChangeText={(text) => this.handlePress?.(text)}
            onFocus={() => {
              this.setState({ clicked: true });
            }}
          />
          {this.state.clicked && (
            <Entypo
              name="cross"
              size={20}
              color="black"
              style={{ padding: 2 }}
              onPress={() => {
                this.setState({ val: "" });
              }}
            />
          )}
        </View>
        {this.state.clicked && (
          <View style={styles.button}>
            <Button
              title="Cancel"
              onPress={() => {
                Keyboard.dismiss();
                this.setState({ clicked: false });
                this.setState({ val: "" });
              }}
            />
          </View>
        )}
      </View>
    );
  }
}
export default SearchBar;

// styles
const styles = StyleSheet.create({
  container: {
    margin: 15,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    width: "90%",
  },
  searchBar__unclicked: {
    padding: 10,
    flexDirection: "row",
    width: "100%",
    backgroundColor: "#d9dbda",
    borderRadius: 15,
    alignItems: "center",
  },
  searchBar__clicked: {
    padding: 10,
    flexDirection: "row",
    width: "75%",
    backgroundColor: "#d9dbda",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  input: {
    fontSize: 20,
    marginLeft: 10,
    width: "90%",
  },
  button: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginLeft: "auto",
    position: "absolute",
    right: 0,
  },
});
