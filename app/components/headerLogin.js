import React from "react";
import { SafeAreaView } from "react-native";
import { View, StyleSheet, StatusBar, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import LoadingModal from "./LoadingModal";
import CheckConnection from "./CheckConnection";
import { Ionicons } from "@expo/vector-icons";
function Header(props) {
  const { loading } = useSelector((state) => state.connection);
  return (
    <>
      <View>
        {props.showGoBack && (
          <TouchableOpacity onPress={() => props.goBack()}>
            <Ionicons
              name="md-arrow-back"
              size={32}
              color="black"
              style={style.menu}
            />
          </TouchableOpacity>
        )}
        <StatusBar backgroundColor="#F5F5F5" barStyle="light-content" />
        <SafeAreaView style={style.statusBar}></SafeAreaView>
        <CheckConnection />
      </View>
      {loading && <LoadingModal />}
    </>
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
