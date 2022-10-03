import React from "react";
import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Video } from "expo-av";
import { connect } from "react-redux";
function Suggestion(props) {
  console.log("Imprimiendo URLs");

  var uristring = props.urlrepositorio;
  var ip = props.ipconfig;
  var uri = "http://" + ip + ":3000" + uristring.substr(28);
  console.log(uri);

  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={styles.container}>
        <View style={styles.right}>
          <Text style={styles.title}>{props.nombre_CREA}</Text>
          <Text style={styles.curso}>Grado: {props.id_grado}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#70C2E5",
    borderRadius: 20,
    height: 100,
    overflow: "hidden",
  },
  cover: {
    marginTop: 10,
    height: 100,
    width: 100,
    resizeMode: "cover",
    borderRadius: 5,
    overflow: "hidden",
  },
  left: {
    paddingLeft: 10,
  },
  right: {
    paddingLeft: 10,
    justifyContent: "center",
  },
  title: {
    color: "#424B5B",
    textAlign: "left",
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Roboto",
  },
  curso: {
    fontSize: 15,
    color: "#6D6E6E",
    fontWeight: "bold",
  },
  teacher: {
    fontSize: 14,
    color: "#6b6b6b",
    fontWeight: "bold",
  },
});
function mapStateToProps(state) {
  return {
    ipconfig: state.videos.selectedIPConfig,
  };
}
export default connect(mapStateToProps)(Suggestion);
