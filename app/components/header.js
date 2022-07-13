import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { Ionicons, Octicons } from "@expo/vector-icons";
import { StatusBar } from "react-native";
function Header(props) {
  return (
    <View>
      <StatusBar backgroundColor="#272D34" barStyle="light-content" />
      <SafeAreaView style={style.statusBar}></SafeAreaView>
      <View style={style.bar}>
        <View style={style.container}>
          <TouchableOpacity onPress={props.onPress}>
            <Ionicons
              name="md-menu"
              size={32}
              color="white"
              style={style.menu}
            />
          </TouchableOpacity>
          <View style={style.center}>
            <Text style={style.texto}>{props.children}</Text>
          </View>
        </View>
      </View>
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
    // paddingTop: 27.5,
    backgroundColor: "#272D34",
  },
  container: {
    backgroundColor: "#272D34",
    paddingBottom: 10,
    paddingLeft: 10,
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
