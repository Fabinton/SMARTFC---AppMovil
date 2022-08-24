import React from "react";
import { SafeAreaView } from "react-native";
import { View, StyleSheet, StatusBar } from "react-native";
function Header(props) {
  return (
    <View>
      <StatusBar backgroundColor="#F5F5F5" barStyle="light-content" />
      <SafeAreaView style={style.statusBar}></SafeAreaView>
    </View>
  );
}
const style = StyleSheet.create({
  menu: {
    width: 30,
    height: 30,
    marginTop: 10,
  },
  statusBar: {
    marginTop: 0,
    height: 0,
    backgroundColor: "#F5F5F5",
  },
  container: {
    backgroundColor: "#272D34",
    padding: 10,
    flexDirection: "row",
  },
  center: {
    flex: 1,
    padding: 5,
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  texto: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
    marginLeft: 20,
    marginTop: 10,
  },
});
export default Header;
